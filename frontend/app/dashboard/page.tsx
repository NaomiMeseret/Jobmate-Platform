"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  MessageCircle,
  Mic,
  Sparkles,
} from "lucide-react";
import { AppShell, Surface } from "../components/modern/AppShell";
import type { RootState } from "@/lib/redux/store";
import { useLanguage } from "@/providers/language-provider";

const featureCards = [
  {
    titleKey: "dashboard_cv_title",
    descriptionKey: "dashboard_cv_desc",
    href: "/cv",
    icon: FileText,
    statKey: "dashboard_cv_stat",
    accent: "var(--accent-gold)",
  },
  {
    titleKey: "dashboard_jobs_title",
    descriptionKey: "dashboard_jobs_desc",
    href: "/chat/jobsearch",
    icon: Briefcase,
    statKey: "dashboard_jobs_stat",
    accent: "var(--accent-green)",
  },
  {
    titleKey: "dashboard_interview_title",
    descriptionKey: "dashboard_interview_desc",
    href: "/interview",
    icon: Mic,
    statKey: "dashboard_interview_stat",
    accent: "var(--accent-indigo)",
  },
  {
    titleKey: "dashboard_courses_title",
    descriptionKey: "dashboard_courses_desc",
    href: "/course",
    icon: BookOpen,
    statKey: "dashboard_courses_stat",
    accent: "var(--accent-green)",
  },
  {
    titleKey: "dashboard_general_title",
    descriptionKey: "dashboard_general_desc",
    href: "/chat/general",
    icon: MessageCircle,
    statKey: "dashboard_general_stat",
    accent: "var(--accent-indigo)",
  },
  {
    titleKey: "dashboard_tips_title",
    descriptionKey: "dashboard_tips_desc",
    href: "/offline_tips",
    icon: Sparkles,
    statKey: "dashboard_tips_stat",
    accent: "var(--accent-gold)",
  },
];

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useLanguage();
  const name = user?.firstName || "there";

  return (
    <AppShell
      eyebrow={t("dashboard_eyebrow")}
      title={t("dashboard_welcome").replace("{name}", name)}
      description={t("dashboard_description")}
    >
      <motion.div
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {featureCards.map((card) => {
          const Icon = card.icon;
          const title = t(card.titleKey);
          return (
            <motion.div
              key={card.titleKey}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={card.href}
                className="glass-card group block min-h-[270px] p-6 transition hover:-translate-y-1 hover:shadow-[0_26px_80px_var(--glow-gold)]"
                style={{ borderTopColor: card.accent, borderTopWidth: 3 }}
              >
                <div className="glass-reflection opacity-70 transition group-hover:opacity-100" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="grid size-14 place-items-center rounded-lg border bg-[var(--bg-surface-hover)]"
                      style={{
                        borderColor: card.accent,
                        color: card.accent,
                        boxShadow: `0 18px 55px color-mix(in srgb, ${card.accent} 24%, transparent)`,
                      }}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--bg-surface-hover)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                      {t(card.statKey)}
                    </span>
                  </div>
                  <h2 className="mt-7 font-display text-2xl font-semibold leading-tight text-[var(--text-primary)]">
                    {title}
                  </h2>
                  <p className="mt-3 min-h-16 text-base leading-7 text-[var(--text-muted)]">
                    {t(card.descriptionKey)}
                  </p>
                  <span
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold"
                    style={{ color: card.accent }}
                  >
                    {t("continue")}
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <Surface className="mt-6 grid gap-5 border-[var(--border-accent)] bg-[linear-gradient(135deg,var(--glow-gold),var(--glow-green))] md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
            {t("dashboard_flow_title")}
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
            {t("dashboard_flow_desc")}
          </p>
        </div>
        <Link
          href="/cv"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-accent)] bg-[var(--accent-gold)] px-5 text-sm font-semibold text-[#080c18] shadow-[0_18px_50px_var(--glow-gold)] transition hover:-translate-y-0.5"
        >
          {t("dashboard_flow_cta")}
          <ArrowRight className="size-4" />
        </Link>
      </Surface>
    </AppShell>
  );
}
