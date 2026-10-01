import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { themeScript } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Signalpost — Verified company intelligence, backed by evidence",
    template: "%s · Signalpost",
  },
  description:
    "Search Norwegian companies by organisation number and build current, evidence-backed company profiles from permitted public sources.",
  applicationName: "Signalpost",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-[var(--sp-bg)] text-[var(--sp-text)] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--sp-surface)] focus:px-3 focus:py-2 focus:text-sm focus:shadow-[var(--sp-shadow-md)]"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
