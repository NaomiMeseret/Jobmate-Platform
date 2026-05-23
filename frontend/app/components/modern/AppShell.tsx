"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Mic,
  PanelLeftClose,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useLogout } from "@/lib/redux/hooks/useLogout";
import type { RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import ThemeToggle from "../ThemeToggle";
import { AfricaMapSVG } from "../svg/AfricaMapSVG";
import LanguageSelector from "../LanguageSelector";

const navItems = [
  { href: "/dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard },
  { href: "/cv", labelKey: "nav_cv", icon: FileText },
  { href: "/chat/jobsearch", labelKey: "nav_jobs", icon: Briefcase },
  { href: "/interview", labelKey: "nav_interview", icon: Mic },
  { href: "/course", labelKey: "nav_courses", icon: BookOpen },
  { href: "/pricing", labelKey: "nav_pricing", icon: CreditCard },
  { href: "/offline_tips", labelKey: "nav_tips", icon: Sparkles },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-lg border border-[var(--border-accent)] bg-[var(--bg-surface)] text-[var(--accent-gold)] shadow-[0_18px_50px_var(--glow-gold)] backdrop-blur-xl transition group-hover:-translate-y-0.5">
        <AfricaMapSVG className="h-6 w-6" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-2xl font-semibold tracking-normal">
            <span className="text-[var(--text-primary)]">Job</span>
            <span className="text-[var(--accent-gold)]">Mate</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            AI career companion
          </span>
        </span>
      )}
    </Link>
  );
}

export function AppShell({
  children,
  title,
  eyebrow,
  description,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const logout = useLogout();
  const { t } = useLanguage();
  const user = useSelector((state: RootState) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[var(--border)] bg-[rgba(var(--bg-base-rgb),0.9)] px-4 py-5 shadow-[24px_0_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative pr-12">
          <BrandMark />
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-0 top-0 inline-flex size-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)]"
          >
            <PanelLeftClose className="hidden size-4 sm:block" />
            <X className="size-4 sm:hidden" />
          </button>
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "border-[var(--border-accent)] bg-[var(--glow-gold)] text-[var(--accent-gold)] shadow-[0_12px_32px_var(--glow-gold)]"
                    : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="size-4 transition group-hover:scale-110" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--glow-green)] text-sm font-semibold text-[var(--accent-green)]">
              {(user?.firstName || user?.email || "J").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {t("signed_in")}
              </p>
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {user?.firstName || user?.email || "JobMate user"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-400 transition hover:bg-red-500/15"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div
        className={cn(
          "transition-[padding] duration-300 ease-out",
          sidebarOpen ? "lg:pl-72" : "lg:pl-0"
        )}
      >
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(var(--bg-base-rgb),0.82)] px-4 py-3 backdrop-blur-2xl md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {!sidebarOpen && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  aria-expanded={sidebarOpen}
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm backdrop-blur-xl transition hover:border-[var(--border-accent)] hover:text-[var(--accent-gold)]"
                >
                  <Menu className="size-4" />
                </button>
                <BrandMark compact />
              </div>
            )}
            <nav className="hidden flex-1 items-center justify-center gap-1 md:flex lg:hidden">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  >
                    <Icon className="size-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/chat/general"
                className="cta-glow hidden h-10 items-center gap-2 rounded-lg border border-[var(--border-accent)] bg-[var(--accent-gold)] px-4 text-sm font-semibold text-[#080c18] shadow-sm transition hover:scale-[1.02] sm:inline-flex"
              >
                <MessageCircle className="size-4" />
                {t("ask_jobmate")}
              </Link>
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {(title || description || actions) && (
            <motion.section
              className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-3xl">
                {eyebrow && (
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-green)]">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h1 className="gradient-text mt-2 font-display text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </motion.section>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export function Surface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("glass-card p-5 text-[var(--text-primary)]", className)}
    >
      <div className="glass-reflection opacity-70" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-accent)] bg-[var(--accent-gold)] px-5 text-sm font-semibold text-[#080c18] shadow-[0_18px_50px_var(--glow-gold)] transition hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border-accent)] bg-[var(--bg-surface)] p-8 text-center">
      <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-base leading-7 text-[var(--text-muted)]">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
