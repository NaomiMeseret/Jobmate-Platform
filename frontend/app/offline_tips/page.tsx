"use client";

import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  Lightbulb,
  PenLine,
  Target,
  Users,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { tips } from "../components/offline_tips/tips";
import { AppShell, Surface } from "../components/modern/AppShell";
import { Stagger, StaggerItem, TiltSurface } from "../components/modern/motion";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "cv_guide", label: "CV Writing", icon: PenLine },
  { id: "interviewQuestions", label: "Interview Prep", icon: Target },
  { id: "jobBoards", label: "Job Boards", icon: Briefcase },
  { id: "skill_enhancements", label: "Skill Growth", icon: BookOpen },
  { id: "marketInsights", label: "Market Insights", icon: Lightbulb },
  { id: "motivation_tips", label: "Motivation", icon: Users },
] as const;

export default function Offline() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("cv_guide");
  const activeTips = tips[language][activeTab] || [];
  const title = Array.isArray(activeTips[0]) ? activeTips[0][0] : "Career tips";
  const list = Array.isArray(activeTips[1]) ? activeTips[1] : [];
  const proTip = Array.isArray(activeTips[2]) ? activeTips[2] : [];

  return (
    <AppShell
      eyebrow="Offline resources"
      title="Practical career tips, always close."
      description="Browse the built-in guidance library for CV writing, interviews, job boards, skill growth, market insight, and motivation."
    >
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Surface className="h-fit !p-3">
          <nav className="flex flex-col gap-0.5" aria-label="Tip categories">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? "true" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-[var(--accent-subtle)] font-medium text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </Surface>

        <Surface>
          <p className="eyebrow">Active guide</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>

          <Stagger className="mt-6 grid gap-4 md:grid-cols-2">
            {list.map((tip: string, index: number) => (
              <StaggerItem key={`${tip}-${index}`}>
                <TiltSurface
                  as="article"
                  maxTilt={2}
                  className="h-full rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-5"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Tip {index + 1}
                  </span>
                  <p className="mt-2.5 text-sm leading-6 text-[var(--text-muted)]">
                    {tip}
                  </p>
                </TiltSurface>
              </StaggerItem>
            ))}
          </Stagger>

          {proTip.length > 0 && (
            <div className="mt-5 rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-5">
              <h3 className="text-sm font-semibold text-[var(--accent)]">
                {proTip[0]}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {proTip[1]}
              </p>
            </div>
          )}
        </Surface>
      </div>
    </AppShell>
  );
}
