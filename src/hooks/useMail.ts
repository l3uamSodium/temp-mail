"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";

const API_BASE = "https://api.mail.tm";
const EXPIRY_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface MailAccount {
  id: string;
  address: string;
  password: string;
}

export interface MailMessage {
  id: string;
  from: {
    address: string;
    name: string;
  };
  to: { address: string; name: string }[];
  subject: string;
  intro: string;
  text: string;
  html: string[];
  seen: boolean;
  createdAt: string;
  hasAttachments: boolean;
  size: number;
}

export interface MailMessageSummary {
  id: string;
  from: {
    address: string;
    name: string;
  };
  subject: string;
  intro: string;
  seen: boolean;
  createdAt: string;
  hasAttachments: boolean;
}

interface UseMailReturn {
  account: MailAccount | null;
  token: string | null;
  messages: MailMessageSummary[];
  selectedMessage: MailMessage | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  fetchingMessage: boolean;
  /** Seconds remaining before this email address expires */
  secondsRemaining: number;
  createNewAccount: () => Promise<void>;
  selectMessage: (id: string) => Promise<void>;
  clearSelection: () => void;
  refreshMessages: () => Promise<void>;
}

function generatePassword(length = 12): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateUsername(length = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function apiCall<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const axErr = err as AxiosError;
      if (axErr.response?.status === 429) {
        const waitTime = Math.pow(2, i + 1) * 1000;
        console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
        await sleep(waitTime);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded due to rate limiting.");
}

export function useMail(): UseMailReturn {
  const [account, setAccount] = useState<MailAccount | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<MailMessageSummary[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MailMessage | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [fetchingMessage, setFetchingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 min
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiresAtRef = useRef<number>(Date.now() + EXPIRY_DURATION_MS);

  // Fetch available domain
  const getDomain = useCallback(async (): Promise<string> => {
    const res = await apiCall(() => axios.get(`${API_BASE}/domains`));
    const domains = res.data["hydra:member"] || res.data;
    if (!domains || domains.length === 0) {
      throw new Error("No domains available");
    }
    return domains[0].domain;
  }, []);

  // Create a new account
  const createAccount = useCallback(
    async (domain: string): Promise<{ account: MailAccount; token: string }> => {
      const username = generateUsername();
      const password = generatePassword();
      const address = `${username}@${domain}`;

      await apiCall(() =>
        axios.post(`${API_BASE}/accounts`, { address, password })
      );

      const loginRes = await apiCall(() =>
        axios.post(`${API_BASE}/token`, { address, password })
      );

      const jwtToken = loginRes.data.token;
      const accountData: MailAccount = {
        id: loginRes.data.id,
        address,
        password,
      };

      return { account: accountData, token: jwtToken };
    },
    []
  );

  // Fetch messages
  const fetchMessages = useCallback(
    async (jwtToken: string) => {
      try {
        const res = await apiCall(() =>
          axios.get(`${API_BASE}/messages`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          })
        );
        const msgs = res.data["hydra:member"] || res.data || [];
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    },
    []
  );

  // Get full message content
  const getMessageContent = useCallback(
    async (id: string, jwtToken: string): Promise<MailMessage> => {
      const res = await apiCall(() =>
        axios.get(`${API_BASE}/messages/${id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        })
      );
      return res.data;
    },
    []
  );

  // Start the expiry countdown timer
  const startExpiryTimer = useCallback((expiresAt: number) => {
    expiresAtRef.current = expiresAt;

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate initial remaining
    const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    setSecondsRemaining(remaining);

    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresAtRef.current - Date.now()) / 1000));
      setSecondsRemaining(left);
    }, 1000);
  }, []);

  // Initialize: load from localStorage or create new
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);

      try {
        const saved = localStorage.getItem("tempmail_account");
        const savedToken = localStorage.getItem("tempmail_token");
        const savedExpiresAt = localStorage.getItem("tempmail_expires_at");

        if (saved && savedToken && savedExpiresAt) {
          const expiresAt = parseInt(savedExpiresAt, 10);

          // Check if it's already expired
          if (Date.now() >= expiresAt) {
            localStorage.removeItem("tempmail_account");
            localStorage.removeItem("tempmail_token");
            localStorage.removeItem("tempmail_expires_at");
          } else {
            const parsed = JSON.parse(saved) as MailAccount;
            setAccount(parsed);
            setToken(savedToken);

            // Verify the token still works
            try {
              await fetchMessages(savedToken);
              if (!cancelled) {
                startExpiryTimer(expiresAt);
                setLoading(false);
              }
              return;
            } catch {
              localStorage.removeItem("tempmail_account");
              localStorage.removeItem("tempmail_token");
              localStorage.removeItem("tempmail_expires_at");
            }
          }
        }

        // Create new account
        if (!cancelled) setCreating(true);
        const domain = await getDomain();
        const result = await createAccount(domain);
        const expiresAt = Date.now() + EXPIRY_DURATION_MS;

        if (!cancelled) {
          setAccount(result.account);
          setToken(result.token);
          localStorage.setItem("tempmail_account", JSON.stringify(result.account));
          localStorage.setItem("tempmail_token", result.token);
          localStorage.setItem("tempmail_expires_at", expiresAt.toString());
          startExpiryTimer(expiresAt);
          await fetchMessages(result.token);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Failed to initialize";
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setCreating(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [getDomain, createAccount, fetchMessages, startExpiryTimer]);

  // Real-time via Mercure SSE + fallback polling
  useEffect(() => {
    if (!token || !account) return;

    let eventSource: EventSource | null = null;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    // Try to connect via Mercure SSE for real-time updates
    try {
      const mercureUrl = new URL("https://mercure.mail.tm/.well-known/mercure");
      mercureUrl.searchParams.append("topic", `/accounts/${account.id}`);

      eventSource = new EventSource(mercureUrl.toString(), {
        withCredentials: false,
      });

      eventSource.onmessage = () => {
        // A new message arrived — fetch the updated inbox immediately
        fetchMessages(token);
      };

      eventSource.onerror = () => {
        // SSE failed or disconnected — fallback to polling
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!fallbackInterval) {
          fallbackInterval = setInterval(() => {
            fetchMessages(token);
          }, 3000);
        }
      };
    } catch {
      // SSE not supported — use polling fallback
      eventSource = null;
    }

    // Always start a fallback poll at 5s as safety net
    // (SSE may miss events, and this ensures we always catch up)
    fallbackInterval = setInterval(() => {
      fetchMessages(token);
    }, 5000);

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [token, account, fetchMessages]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Create new account (manual trigger)
  const createNewAccount = useCallback(async () => {
    setCreating(true);
    setError(null);
    setMessages([]);
    setSelectedMessage(null);

    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      localStorage.removeItem("tempmail_account");
      localStorage.removeItem("tempmail_token");
      localStorage.removeItem("tempmail_expires_at");

      const domain = await getDomain();
      const result = await createAccount(domain);
      const expiresAt = Date.now() + EXPIRY_DURATION_MS;

      setAccount(result.account);
      setToken(result.token);
      localStorage.setItem("tempmail_account", JSON.stringify(result.account));
      localStorage.setItem("tempmail_token", result.token);
      localStorage.setItem("tempmail_expires_at", expiresAt.toString());
      startExpiryTimer(expiresAt);
      await fetchMessages(result.token);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create account";
      setError(msg);
    } finally {
      setCreating(false);
    }
  }, [getDomain, createAccount, fetchMessages, startExpiryTimer]);

  // Auto-create new account when timer hits 0
  useEffect(() => {
    if (secondsRemaining === 0 && account && !creating) {
      createNewAccount();
    }
  }, [secondsRemaining, account, creating, createNewAccount]);

  // Select a message
  const selectMessage = useCallback(
    async (id: string) => {
      if (!token) return;
      setFetchingMessage(true);
      try {
        const msg = await getMessageContent(id, token);
        setSelectedMessage(msg);

        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, seen: true } : m))
        );
      } catch (err) {
        console.error("Failed to fetch message:", err);
      } finally {
        setFetchingMessage(false);
      }
    },
    [token, getMessageContent]
  );

  const clearSelection = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const refreshMessages = useCallback(async () => {
    if (token) {
      await fetchMessages(token);
    }
  }, [token, fetchMessages]);

  return {
    account,
    token,
    messages,
    selectedMessage,
    loading,
    error,
    creating,
    fetchingMessage,
    secondsRemaining,
    createNewAccount,
    selectMessage,
    clearSelection,
    refreshMessages,
  };
}
