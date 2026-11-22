import type { Metadata } from "next";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hardware Hub — Diagnose, compare, and learn your PC hardware",
  description:
    "Guided hardware troubleshooting, spec comparisons, and plain-English hardware education.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the init script adds the "dark" class to <html>
    // before React hydrates, which would otherwise log a className mismatch.
    <html lang="en" className="bg-sky-50 dark:bg-slate-900" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}