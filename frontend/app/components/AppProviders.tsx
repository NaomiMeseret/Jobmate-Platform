"use client";

import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ReduxProvider>
        <LanguageProvider>
          <AnimatePresence mode="wait" initial={false}>
            <ProtectedWrapper key={pathname}>{children}</ProtectedWrapper>
          </AnimatePresence>
          <Toaster position="top-right" reverseOrder={false} />
        </LanguageProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
