"use client";

import { ThemeProvider } from "next-themes";
import type React from "react";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/providers/ReduxProvider";
import { LanguageProvider } from "@/providers/language-provider";
import ProtectedWrapper from "./ProtectedWrapper";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ReduxProvider>
        <LanguageProvider>
          <ProtectedWrapper>{children}</ProtectedWrapper>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              className:
                "!rounded-md !border !border-[var(--border)] !bg-[var(--bg-surface)] !text-sm !text-[var(--text-primary)] !shadow-sm",
            }}
          />
        </LanguageProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
