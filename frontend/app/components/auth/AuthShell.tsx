"use client";

import Link from "next/link";
import { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import { AfricaMapSVG } from "../svg/AfricaMapSVG";
import LanguageSelector from "../LanguageSelector";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="page-enter min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-[var(--accent)] text-[var(--accent-contrast)]">
              <AfricaMapSVG className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              JobMate
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="card mx-auto w-full max-w-md p-6 md:p-8">{children}</div>
  );
}

export function AuthHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return <p className="alert-error">{children}</p>;
}

export function PrimaryAuthButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn-primary h-11 w-full"
    >
      {children}
    </button>
  );
}
