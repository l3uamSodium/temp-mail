"use client";

import { useMail } from "@/src/hooks/useMail";
import EmailDisplay from "@/src/components/EmailDisplay";
import InboxList from "@/src/components/InboxList";
import MessageDetail from "@/src/components/MessageDetail";
import { BannerCarousel } from "@/src/components/BannerCarousel";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  RefreshCcw,
  Shield,
  Zap,
  Clock,
  Heart,
  Mail,
} from "lucide-react";

export default function Home() {
  const {
    account,
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
  } = useMail();

  // Error state
  if (error && !account) {
    return (
      <div className="flex-1 flex flex-col min-h-dvh">
        <div className="mesh-bg" />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 max-w-md w-full text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center mx-auto mb-4 border border-[rgba(239,68,68,0.2)]">
              <AlertTriangle size={24} className="text-[var(--danger)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--fg)] mb-2 tracking-tight">
              Connection Error
            </h2>
            <p className="text-sm text-[var(--fg-muted)] mb-6 leading-relaxed">{error}</p>
            <button onClick={createNewAccount} className="btn-glow">
              <RefreshCcw size={16} className="inline mr-2" />
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-dvh">
        <div className="mesh-bg" />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-8 rounded-3xl text-center"
          >
            <div className="w-12 h-12 border-3 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-semibold text-[var(--fg)] mb-1 tracking-tight">
              Setting up your mailbox
            </h2>
            <p className="text-sm text-[var(--fg-muted)]">
              Creating a secure temporary email address...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-dvh position-relative z-0">
      <div className="mesh-bg" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-none border-x-0 border-t-0 border-b-[var(--border)] sticky top-0 z-50 bg-[rgba(255,255,255,0.7)]"
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 cursor-default">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)] ring-2 ring-white/50">
              <Mail size={20} className="text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[17px] font-black text-[var(--fg)] tracking-tight leading-none mb-1">
                Temp<span className="text-[var(--accent)]">Mail</span>
              </h1>
              <p className="text-[9px] text-[var(--fg-muted)] font-bold uppercase tracking-[0.2em] leading-none">
                by <span className="text-[var(--accent-hover)]">Korawit</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[var(--fg-muted)] tracking-wide">
              #โปรดจ้างฉัน
            </span>
            <a
              href="https://www.facebook.com/korawit.thipmonthian/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#1877F2] to-[#166FE5] text-white rounded-[14px] shadow-lg shadow-[#1877F2]/40 ring-2 ring-white/50 transition-all duration-300 hover:-translate-y-0.5 group"
              title="Hire me on Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform duration-300"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8 flex flex-col"
      >
        <BannerCarousel />

        {/* Email Display */}
        <div className="mb-8">
          <EmailDisplay
            account={account}
            creating={creating}
            secondsRemaining={secondsRemaining}
            onNewAddress={createNewAccount}
          />
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 glass border-[rgba(239,68,68,0.3)] bg-[rgba(254,226,226,0.6)] px-4 py-3 flex items-center gap-2 text-sm text-[var(--danger)] font-medium"
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inbox + Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[560px]">
          <div className="min-h-0">
            <InboxList
              messages={messages}
              loading={loading}
              onSelect={selectMessage}
              selectedId={selectedMessage?.id}
              onRefresh={refreshMessages}
            />
          </div>
          <div className="hidden lg:block min-h-0">
            <MessageDetail
              message={selectedMessage}
              loading={fetchingMessage}
              onBack={clearSelection}
            />
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-[rgba(248,250,252,0.85)] backdrop-blur-xl overflow-y-auto"
            >
              <div className="p-4 md:p-6 max-w-xl mx-auto h-full py-16">
                <MessageDetail
                  message={selectedMessage}
                  loading={fetchingMessage}
                  onBack={clearSelection}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>


    </div>
  );
}
