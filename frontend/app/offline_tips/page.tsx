"use client";

import { useState } from "react";
import { BookOpen, Briefcase, Lightbulb, PenLine, Sparkles, Target } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { tips } from "../components/offline_tips/tips";
import { AppShell, Surface } from "../components/modern/AppShell";

const tabs = [
  { id: "cv_guide", label: "CV Writing", icon: PenLine },
  { id: "interviewQuestions", label: "Interview Prep", icon: Target },
  { id: "jobBoards", label: "Job Boards", icon: Briefcase },
  { id: "skill_enhancements", label: "Skill Growth", icon: BookOpen },
  { id: "marketInsights", label: "Market Insights", icon: Lightbulb },
  { id: "motivation_tips", label: "Motivation", icon: Sparkles },
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
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Surface>
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    activeTab === tab.id
                      ? "flex w-full items-center gap-3 rounded-lg bg-[#e8f3ef] px-3 py-3 text-left text-sm font-black text-[#155e51]"
                      : "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  }
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Surface>

        <Surface>
          <div className="mb-6 rounded-lg border border-[#bfe7dc] bg-[#e8f3ef] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f7d6d]">
              Active guide
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {title}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {list.map((tip: string, index: number) => (
              <article
                key={`${tip}-${index}`}
                className="rounded-lg border border-slate-200 bg-[#fbfcf8] p-5"
              >
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#2f7d6d]">
                  Tip {index + 1}
                </span>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {tip}
                </p>
              </article>
            ))}
          </div>

          {proTip.length > 0 && (
            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-black text-slate-950">
                {proTip[0]}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {proTip[1]}
              </p>
            </div>
          )}
        </Surface>
      </div>
    </AppShell>
  );
}
