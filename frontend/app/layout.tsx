import type React from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "./components/AppProviders";
import Background from "./components/Background";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobMate - Your AI Career Buddy",
  description:
    "AI-powered career assistant for Ethiopian youth - CV feedback, job matching, and interview practice",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Background />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
