"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { Reveal, Stagger, StaggerItem } from "./modern/motion";

const steps = [
  {
    title: { en: "Create your profile", am: "ፕሮፋይልዎን ይፍጠሩ" },
    body: {
      en: "Add your CV, goals, and the role you are targeting.",
      am: "CVዎን፣ ግቦችዎን እና የሚፈልጉትን ስራ ያክሉ።",
    },
  },
  {
    title: { en: "Get your analysis", am: "ትንታኔዎን ያግኙ" },
    body: {
      en: "JobMate reviews your CV and suggests concrete CV, job, and interview steps.",
      am: "JobMate የCVዎን ይገምግማል እና ተግባራዊ የCV፣ የስራ እና የቃለመጠይቅ እርምጃዎችን ይጠቁማል።",
    },
  },
  {
    title: { en: "Practice and apply", am: "ይለማመዱ እና ያመልክቱ" },
    body: {
      en: "Rehearse interviews, close skill gaps, and apply with a stronger profile.",
      am: "ቃለመጠይቅ ይለማመዱ፣ የክህሎት ክፍተቶችን ያስተካክሉ እና በጠንካራ ፕሮፋይል ያመልክቱ።",
    },
  },
];

export default function HowItWorksSection() {
  const { language } = useLanguage();

  return (
    <section
      id="how-it-works"
      className="border-t border-[var(--border)] bg-[var(--bg-ink)] px-4 py-16 text-[var(--text-on-ink)] md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
              {language === "am" ? "እንዴት ይሰራል" : "How it works"}
            </p>
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              {language === "am"
                ? "ከመመለሻ ወደ ስራ እድል"
                : "Three steps from upload to offer"}
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-px border border-[var(--text-on-ink)]/15 bg-[var(--text-on-ink)]/15 md:grid-cols-3">
          {steps.map((step, index) => (
            <StaggerItem key={step.title.en}>
              <div className="h-full bg-[var(--bg-ink)] p-6 md:p-8">
                <p className="font-mono text-xs tabular-nums text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-4 text-xl">{step.title[language]}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-on-ink)]/70">
                  {step.body[language]}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <Link
            href="/register"
            className="mt-10 inline-flex h-12 items-center gap-2 border border-[var(--text-on-ink)] px-6 font-mono text-[13px] font-medium text-[var(--text-on-ink)] transition-colors hover:bg-[var(--text-on-ink)] hover:text-[var(--bg-ink)]"
          >
            {language === "am" ? "ጀምር" : "Get started"}
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
