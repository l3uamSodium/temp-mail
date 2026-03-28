import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TempMail — Disposable Temporary Email",
  description:
    "Create instant, anonymous, disposable email addresses. No sign-up required. Receive emails in real-time with auto-refresh. Private, secure, and free.",
  keywords: [
    "temp mail",
    "temporary email",
    "disposable email",
    "anonymous email",
    "free email",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
