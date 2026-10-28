"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { ArrowRight, BookOpen, Briefcase, FileText, Lightbulb, MessageCircle, Mic } from "lucide-react";
import { AppShell } from "../components/modern/AppShell";
import type { RootState } from "@/lib/redux/store";
import { useLanguage } from "@/providers/language-provider";

const featureLinks = [
  {
    titleKey: "dashboard_cv_title",
    descriptionKey: "dashboard_cv_desc",
    statKey: "dashboard_cv_stat",
    href: "/cv",
    icon: FileText,
  },
  {
    titleKey: "dashboard_jobs_title",
    descriptionKey: "dashboard_jobs_desc",
    statKey: "dashboard_jobs_stat",
    href: "/chat/jobsearch",
    icon: Briefcase,
  },
  {
    titleKey: "dashboard_interview_title",
    descriptionKey: "dashboard_interview_desc",
    statKey: "dashboard_interview_stat",
    href: "/interview",
    icon: Mic,
  },
  {
    titleKey: "dashboard_courses_title",
    descriptionKey: "dashboard_courses_desc",
    statKey: "dashboard_courses_stat",
    href: "/course",
    icon: BookOpen,
  },
  {
    titleKey: "dashboard_general_title",
    descriptionKey: "dashboard_general_desc",
    statKey: "dashboard_general_stat",
    href: "/chat/general",
    icon: MessageCircle,
  },
  {
    titleKey: "dashboard_tips_title",
    descriptionKey: "dashboard_tips_desc",
    statKey: "dashboard_tips_stat",
    href: "/offline_tips",
    icon: Lightbulb,
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
      <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
        {featureLinks.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.titleKey}
              href={feature.href}
              className="group flex items-start gap-4 bg-[var(--bg-surface)] p-5 transition-colors hover:bg-[var(--bg-surface-hover)]"
            >
              <span className="icon-box">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold">
                    {t(feature.titleKey)}
                  </h2>
                  <ArrowRight className="size-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                  {t(feature.descriptionKey)}
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--accent)]">
                  {t(feature.statKey)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card mt-6 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold">{t("dashboard_flow_title")}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            {t("dashboard_flow_desc")}
          </p>
        </div>
        <Link href="/cv" className="btn-primary shrink-0">
          {t("dashboard_flow_cta")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </AppShell>
  );
}
