"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { AfricaMapSVG } from "./svg/AfricaMapSVG";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/providers/language-provider";

const navLinks = [
  { label: { en: "Features", am: "ባህሪዎች" }, href: "/#features" },
  { label: { en: "How It Works", am: "እንዴት ይሰራል" }, href: "/#how-it-works" },
  { label: { en: "Pricing", am: "ዋጋ" }, href: "/#pricing" },
];

export default function Header() {
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center bg-[var(--bg-ink)] text-[var(--text-on-ink)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-contrast)]">
            <AfricaMapSVG className="h-[18px] w-[18px]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="display text-[17px] font-semibold tracking-tight">
              JobMate
            </span>
            <span className="kicker mt-0.5 text-[9px] tracking-[0.2em]">
              Career Studio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-rule font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label[language]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSelector />
          <ThemeToggle />
          <Link href="/login" className="btn-ghost btn-sm">
            {language === "am" ? "ግቡ" : "Sign in"}
          </Link>
          <Link href="/register" className="btn-primary btn-sm">
            {language === "am" ? "ጀምር" : "Get started"}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="btn-ghost size-8 !px-0"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4 md:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 border-b border-[var(--border)] py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
              >
                <span className="text-[10px] tabular-nums text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.label[language]}
              </Link>
            ))}
            <div className="mt-4 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-secondary flex-1"
              >
                {language === "am" ? "ግቡ" : "Sign in"}
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary flex-1"
              >
                {language === "am" ? "ጀምር" : "Get started"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
