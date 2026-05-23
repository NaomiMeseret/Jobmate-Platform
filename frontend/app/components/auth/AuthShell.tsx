"use client";

import Link from "next/link";
import { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import { AfricaMapSVG } from "../svg/AfricaMapSVG";
import LanguageSelector from "../LanguageSelector";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[var(--text-primary)] md:px-8">
      <div className="absolute left-6 top-6 z-10 flex items-center gap-3 md:left-8 md:top-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <AfricaMapSVG className="h-6 w-6 opacity-90" />
          <span className="font-display text-2xl font-semibold">
            <span>Job</span>
            <span className="text-[var(--accent-gold)]">Mate</span>
          </span>
        </Link>
      </div>
      <div className="absolute right-6 top-6 z-10 flex items-center gap-2 md:right-8 md:top-8">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <AfricaMapSVG className="pointer-events-none absolute -right-16 top-24 h-80 w-80 opacity-10 md:h-[30rem] md:w-[30rem]" />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="glass-card mx-auto w-full max-w-md p-6 md:p-7">
      <div className="glass-reflection" />
      <div className="relative z-10">{children}</div>
    </div>
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
    <div className="mb-7">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
      {children}
    </p>
  );
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
      className="h-12 w-full rounded-lg bg-[var(--accent-gold)] px-4 text-base font-medium text-[#080C18] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
