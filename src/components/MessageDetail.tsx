"use client";

import { ArrowLeft, Clock, Paperclip, User, Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import type { MailMessage } from "@/src/hooks/useMail";

interface MessageDetailProps {
  message: MailMessage | null;
  loading: boolean;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\bon\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\bon\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export default function MessageDetail({
  message,
  loading,
  onBack,
}: MessageDetailProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!message || !iframeRef.current) return;

    const htmlContent =
      message.html && message.html.length > 0 ? message.html.join("") : null;

    if (htmlContent) {
      const sanitized = sanitizeHtml(htmlContent);
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              * { box-sizing: border-box; }
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #1e293b;
                background: transparent;
                margin: 0;
                padding: 24px;
                line-height: 1.6;
                font-size: 14px;
                word-break: break-word;
              }
              a { color: #8b5cf6; text-decoration: underline; text-underline-offset: 3px; }
              img { max-width: 100%; height: auto; border-radius: 12px; margin: 12px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
              table { width: 100%; max-width: 100%; border-collapse: collapse; margin: 12px 0; }
              td, th { padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
              th { background: #f8fafc; font-weight: 600; }
              pre, code { background: #f1f5f9; padding: 3px 6px; border-radius: 6px; font-size: 13px; color: #475569; }
              pre { padding: 16px; overflow-x: auto; }
              blockquote { border-left: 4px solid #8b5cf6; margin: 16px 0; padding: 8px 16px; color: #475569; background: #f8fafc; border-radius: 0 8px 8px 0; }
              h1, h2, h3, h4 { color: #0f172a; margin: 24px 0 12px; font-weight: 700; letter-spacing: -0.02em; }
              p { margin: 12px 0; }
            </style>
          </head>
          <body>${sanitized}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [message]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card h-full flex flex-col items-center justify-center p-8 text-center"
      >
        <Loader2 size={32} className="text-[var(--accent)] animate-spin mb-4" />
        <p className="text-base font-medium text-[var(--fg-muted)]">Loading message content...</p>
      </motion.div>
    );
  }

  if (!message) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="glass-card h-full flex flex-col items-center justify-center bg-[rgba(255,255,255,0.4)]"
      >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[var(--border)] flex items-center justify-center mb-5 animate-float" style={{ animationDelay: '0.5s' }}>
          <Mail size={28} className="text-[var(--accent-light)]" />
        </div>
        <p className="text-base font-bold text-[var(--fg)] tracking-tight">
          Read Your Emails
        </p>
        <p className="text-sm text-[var(--fg-muted)] mt-1.5 max-w-[200px] text-center">
          Select any message from the inbox to read it here
        </p>
      </motion.div>
    );
  }

  const hasHtml = message.html && message.html.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--border)] shrink-0 bg-[rgba(248,250,252,0.5)]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--accent)] text-sm font-semibold hover:text-[var(--accent-hover)] transition-colors duration-200 mb-4 cursor-pointer w-fit px-3 py-1.5 -ml-3 rounded-lg hover:bg-[var(--accent-subtle)]"
        >
          <ArrowLeft size={16} />
          Back to inbox
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-[var(--fg)] mb-4 leading-snug tracking-tight">
          {message.subject || "(No subject)"}
        </h1>

        <div className="flex flex-col gap-2.5 bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
              <User size={14} className="text-[var(--accent)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[var(--fg)] font-semibold truncate">
                {message.from.name || message.from.address}
              </span>
              <span className="text-[var(--fg-muted)] text-[11px] truncate mt-0.5">
                {message.from.address}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[var(--fg-muted)] font-medium pt-2 border-t border-[rgba(0,0,0,0.05)] mt-1">
            <Clock size={14} className="text-[var(--fg-dim)] shrink-0" />
            <span>{formatDate(message.createdAt)}</span>
            {message.hasAttachments && (
              <>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1 text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-md">
                  <Paperclip size={12} />
                  Attachments
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {hasHtml ? (
          <iframe
            ref={iframeRef}
            title="Email content"
            className="w-full h-full border-none"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="p-6 md:p-8">
            <div className="email-content whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--fg)]">
              {message.text || "No content available."}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
