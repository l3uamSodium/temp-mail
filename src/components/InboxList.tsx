"use client";

import { useState } from "react";
import { Inbox, Paperclip, ChevronRight, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MailMessageSummary } from "@/src/hooks/useMail";

interface InboxListProps {
  messages: MailMessageSummary[];
  loading: boolean;
  onSelect: (id: string) => void;
  selectedId?: string | null;
  onRefresh?: () => Promise<void>;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getInitials(name: string, address: string): string {
  if (name && name.length > 0) {
    return name.split(" ").map((s) => s[0]).join("").toUpperCase().slice(0, 2);
  }
  return address.slice(0, 2).toUpperCase();
}

// Lighter pastel colors for avatars
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 65%)`;
}

export default function InboxList({
  messages,
  loading,
  onSelect,
  selectedId,
  onRefresh,
}: InboxListProps) {
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !localRefreshing) {
      setLocalRefreshing(true);
      await onRefresh();
      // Brief synthetic delay so the spin is visually noticeable even if API is instant
      setTimeout(() => setLocalRefreshing(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[rgba(255,255,255,0.4)]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[rgba(139,92,246,0.1)]">
            <Inbox size={18} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-sm font-bold text-[var(--fg)] tracking-tight">
            Inbox
          </h2>
          {messages.length > 0 && (
            <span className="bg-[var(--accent)] text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center shadow-sm">
              {messages.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={localRefreshing}
              className="p-1.5 mr-1 rounded-full hover:bg-[rgba(255,255,255,0.8)] text-[var(--accent)] transition-colors border border-transparent shadow-sm"
              title="Refresh Inbox"
            >
              <RefreshCcw size={14} className={localRefreshing ? "animate-spin" : ""} strokeWidth={2.5} />
            </button>
          )}
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-[var(--border)]">
            <div className="pulse-dot" />
            <span className="text-[11px] text-[var(--fg-muted)] font-bold tracking-wide">Live</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[rgba(255,255,255,0.2)]">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-2">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2.5 mt-1">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full px-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[white] shadow-md border border-[var(--border)] flex items-center justify-center mb-4 animate-float">
              <Inbox size={28} className="text-[var(--accent-light)]" />
            </div>
            <p className="text-base text-[var(--fg)] font-bold mb-1 tracking-tight">
              Inbox is empty
            </p>
            <p className="text-sm text-[var(--fg-muted)] max-w-[240px] leading-relaxed">
              Waiting for incoming emails. They will appear here instantly.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onSelect(msg.id)}
                className={`w-full text-left px-5 py-4 flex items-start gap-4 transition-all duration-300 ease-in-out border-b border-[var(--border)] cursor-pointer group
                  ${
                    selectedId === msg.id
                      ? "bg-white shadow-sm border-l-4 border-l-[var(--accent)]"
                      : "hover:bg-[rgba(255,255,255,0.7)]"
                  }
                  ${!msg.seen && selectedId !== msg.id ? "bg-[rgba(255,255,255,0.4)]" : ""}
                `}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${stringToColor(msg.from.address)}, ${stringToColor(msg.from.address + "x")})`,
                  }}
                >
                  {getInitials(msg.from.name, msg.from.address)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-sm truncate ${!msg.seen ? "font-bold text-[var(--fg)]" : "font-semibold text-[var(--fg-muted)]"}`}>
                      {msg.from.name || msg.from.address}
                    </span>
                    <span className="text-xs font-medium text-[var(--fg-muted)] whitespace-nowrap shrink-0">
                      {timeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm truncate mb-1 ${!msg.seen ? "font-semibold text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                    {msg.subject || "(No subject)"}
                  </p>
                  <p className="text-xs text-[var(--fg-dim)] truncate">
                    {msg.intro || "No preview available"}
                  </p>
                  {msg.hasAttachments && (
                    <div className="flex items-center gap-1.5 mt-2 bg-[rgba(0,0,0,0.04)] w-max px-2 py-0.5 rounded text-[11px] font-medium text-[var(--fg-muted)]">
                      <Paperclip size={12} />
                      <span>Attachment</span>
                    </div>
                  )}
                </div>

                {/* Indicators */}
                <div className="flex items-center gap-2 shrink-0 self-center">
                  {!msg.seen && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-sm" />
                  )}
                  <ChevronRight
                    size={16}
                    className="text-[var(--fg-dim)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                  />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
