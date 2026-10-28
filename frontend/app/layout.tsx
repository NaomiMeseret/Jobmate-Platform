import type React from "react";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  Noto_Sans_Ethiopic,
  Noto_Serif_Ethiopic,
  Spectral,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "./components/AppProviders";

/**
 * Type system
 * - Display: Spectral, a serif that gives the product an editorial voice.
 * - Body / mono: Geist, bundled locally with the app (no network fetch at build).
 * - Ethiopic: Noto Serif + Sans Ethiopic so Amharic keeps the same voice.
 */
// Spectral ships discrete weights, so it needs an explicit weight list.
// The Noto Ethiopic families are variable fonts: no `weight` option, which
// keeps Next to a single font query per family.
const display = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Ethiopic companions: serif for display contexts, sans for running text.
const ethiopicSerif = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic-serif",
  display: "swap",
});

const ethiopicSans = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobMate - Your AI Career Buddy",
  description:
    "AI-powered career assistant for Ethiopian youth - CV feedback, job matching, and interview practice",
  icons: {
    icon: [{ url: "/icon.svg?v=3", type: "image/svg+xml" }],
    shortcut: "/icon.svg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${ethiopicSerif.variable} ${ethiopicSans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
        <Script
          src="https://faris-asist.getchereta.com/widget/loader.js"
          strategy="afterInteractive"
          data-base-url="https://faris-asist.getchereta.com"
          data-widget-key="wk_g5zgsrezkg95lm1b3bfvjv7wtv36bus0"
        />
      </body>
    </html>
  );
}
