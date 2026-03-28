"use client";

import { useState } from "react";
import { Copy, Check, RefreshCcw, Mail, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MailAccount } from "@/src/hooks/useMail";

interface EmailDisplayProps {
  account: MailAccount | null;
  creating: boolean;
  secondsRemaining: number;
  onNewAddress: () => void;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function EmailDisplay({
  account,
  creating,
  secondsRemaining,
  onNewAddress,
}: EmailDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = account.address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Timer ring
  const progress = secondsRemaining / 600;
  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference * (1 - progress);

  const timerColor =
    secondsRemaining > 300
      ? "var(--success)"
      : secondsRemaining > 120
      ? "var(--warning)"
      : secondsRemaining > 60
      ? "#f97316"
      : "var(--danger)";

  const isUrgent = secondsRemaining <= 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center">
            <Mail size={20} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--fg-muted)] tracking-tight">
              Your Temporary Email
            </h2>
          </div>
        </div>

        {/* Timer */}
        {account && !creating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-[rgba(255,255,255,0.5)] px-3 py-2 rounded-xl border border-[var(--border)] shadow-sm"
          >
            <div className="relative w-[48px] h-[48px] flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                <circle
                  cx="24" cy="24" r="22" fill="none"
                  stroke={timerColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
                />
              </svg>
              <Timer size={16} style={{ color: timerColor }} className={isUrgent ? "animate-pulse" : ""} />
            </div>
            <div className="text-left pr-2">
              <div className={`font-mono text-xl font-bold leading-none tracking-tight ${isUrgent ? "text-[var(--danger)] animate-pulse" : "text-[var(--fg)]"}`}>
                {formatTime(secondsRemaining)}
              </div>
              <div className="text-[10px] text-[var(--fg-dim)] mt-1 uppercase font-semibold tracking-widest">
                Expires In
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative">
        {creating ? (
          <div className="flex items-center gap-3 py-4">
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-[var(--fg-muted)]">Generating a fresh inbox...</span>
          </div>
        ) : account ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 w-full min-w-0 bg-white rounded-2xl px-6 py-4 md:py-5 border border-[var(--border)] shadow-sm transition-all relative group overflow-hidden hover:border-[rgba(139,92,246,0.3)] hover:shadow-md">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.03)_0%,transparent_100%)] pointer-events-none" />
              <span className="font-mono text-xl md:text-2xl font-medium text-[var(--fg)] truncate block tracking-tight relative z-10 transition-transform group-hover:scale-[1.01] origin-left">
                {account.address}
              </span>
            </div>

            <div className="flex w-full md:w-auto items-center gap-3 shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex-1 md:flex-none btn-glow flex items-center justify-center gap-2 py-4 md:py-3.5 w-full md:w-[150px]"
                title="Copy email address"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check size={18} />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy size={18} />
                      Copy Email
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNewAddress}
                disabled={creating}
                className="flex-1 md:flex-none btn-outline flex items-center justify-center gap-2 py-4 md:py-3.5 bg-white"
                title="Generate new email"
              >
                <RefreshCcw size={18} className={creating ? "animate-spin" : ""} />
                New
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="skeleton h-[68px] w-full rounded-2xl" />
        )}
      </div>

      {/* Expiry warning */}
      <AnimatePresence>
        {isUrgent && account && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 20 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center gap-3 text-sm text-[var(--danger)] font-medium">
              <Timer size={18} className="animate-pulse shrink-0" />
              <span>
                Address expires in <strong>{formatTime(secondsRemaining)}</strong>. A new one will be generated smoothly.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`toast ${copied ? "show" : ""}`}>
        ✓ Copied to clipboard
      </div>
    </motion.div>
  );
}
