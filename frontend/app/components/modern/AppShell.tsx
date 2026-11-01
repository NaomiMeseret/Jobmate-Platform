"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Briefcase,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  MessageCircle,
  Mic,
  X,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useLogout } from "@/lib/redux/hooks/useLogout";
import type { RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import ThemeToggle from "../ThemeToggle";
import { AfricaMapSVG } from "../svg/AfricaMapSVG";
import LanguageSelector from "../LanguageSelector";
import { TiltSurface } from "./motion";

const navItems = [
  { href: "/dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard },
  { href: "/cv", labelKey: "nav_cv", icon: FileText },
  { href: "/chat/jobsearch", labelKey: "nav_jobs", icon: Briefcase },
  { href: "/interview", labelKey: "nav_interview", icon: Mic },
  { href: "/course", labelKey: "nav_courses", icon: BookOpen },
  { href: "/pricing", labelKey: "nav_pricing", icon: CreditCard },
  { href: "/offline_tips", labelKey: "nav_tips", icon: Lightbulb },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center bg-[var(--bg-ink)] text-[var(--text-on-ink)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-contrast)]">
        <AfricaMapSVG className="h-[18px] w-[18px]" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="display text-[17px] font-semibold tracking-tight">
            JobMate
          </span>
          <span className="kicker mt-0.5 text-[9px] tracking-[0.2em]">
            Career Studio
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(
      window.localStorage.getItem("jobmate-sidebar-collapsed") === "true"
    );
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((collapsed) => {
      const nextCollapsed = !collapsed;
      window.localStorage.setItem(
        "jobmate-sidebar-collapsed",
        String(nextCollapsed)
      );
      return nextCollapsed;
    });
  };

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-[var(--bg-ink)]/40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] transition-[width,transform] duration-300 ease-out lg:translate-x-0",
          menuOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[248px]"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center justify-between border-b border-[var(--border)] px-5",
            sidebarCollapsed && "lg:justify-center lg:px-2"
          )}
        >
          <BrandMark compact={sidebarCollapsed} />
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMenuOpen(false)}
            className="btn-ghost btn-sm -mr-1 size-8 !px-0 lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="app-sidebar"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleSidebar}
          className="absolute -right-3 top-[4.75rem] z-10 hidden size-7 place-items-center border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-muted)] shadow-sm transition-colors hover:text-[var(--text-primary)] lg:grid"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>

        <div
          className={cn(
            "border-b border-[var(--border)] px-5 py-3",
            sidebarCollapsed && "lg:hidden"
          )}
        >
          <p className="kicker">Workspace</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {navItems.map((item, index) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                  sidebarCollapsed && "lg:justify-center lg:px-0",
                  active
                    ? "bg-[var(--bg-ink)] font-medium text-[var(--text-on-ink)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                )}
                aria-current={active ? "page" : undefined}
                title={sidebarCollapsed ? t(item.labelKey) : undefined}
              >
                {!sidebarCollapsed && (
                  <span
                    className={cn(
                      "w-4 font-mono text-[10px] tabular-nums",
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--border-strong)]"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <Icon className="size-4 shrink-0" />
                <span className={cn("flex-1", sidebarCollapsed && "lg:hidden")}>
                  {t(item.labelKey)}
                </span>
                {active && !sidebarCollapsed && (
                  <span className="h-1.5 w-1.5 bg-[var(--accent)]" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              sidebarCollapsed && "lg:flex-col lg:gap-2"
            )}
          >
            <span className="grid size-8 shrink-0 place-items-center bg-[var(--accent-subtle)] font-mono text-xs font-semibold text-[var(--accent)]">
              {(user?.firstName || user?.email || "J").charAt(0).toUpperCase()}
            </span>
            <div className={cn("min-w-0 flex-1", sidebarCollapsed && "lg:hidden")}>
              <p className="truncate text-sm font-medium">
                {user?.firstName || user?.email || "JobMate user"}
              </p>
              <p className="kicker truncate text-[9px]">
                {t("signed_in")}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="btn-ghost btn-sm size-8 !px-0 text-[var(--danger)] hover:text-[var(--danger)]"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className={sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[248px]"}>
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="btn-ghost size-9 !px-0 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="lg:hidden">
              <BrandMark compact />
            </div>

            <p className="kicker hidden lg:block">
              {eyebrow || t("appSubtitle")}
            </p>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/chat/general"
                className="btn-secondary btn-sm hidden sm:inline-flex"
              >
                <MessageCircle className="size-4" />
                {t("ask_jobmate")}
              </Link>
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </header>

        <main
          key={pathname}
          className="page-enter mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14"
        >
          {(title || description || actions) && (
            <div className="mb-10 flex flex-col gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                {eyebrow && <p className="kicker-accent">{eyebrow}</p>}
                {title && (
                  <h1 className="display mt-3 text-3xl md:text-4xl">{title}</h1>
                )}
                {description && (
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)] md:text-base">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
              )}
            </div>
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
    <TiltSurface as="section" className={cn("panel p-5 md:p-6", className)}>
      {children}
    </TiltSurface>
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
    <Link href={href} className={cn("btn-primary", className)}>
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
    <div className="border border-dashed border-[var(--border-strong)] px-6 py-12 text-center">
      <p className="kicker">Empty</p>
      <h3 className="display mt-2 text-lg">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
      <div className="flex items-start gap-3">
        {icon && <span className="icon-box">{icon}</span>}
        <div>
          <h2 className="display text-xl">{title}</h2>
          {description && (
            <p className="mt-1.5 text-sm leading-5 text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
