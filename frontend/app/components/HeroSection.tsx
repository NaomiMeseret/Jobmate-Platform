"use client";

import Link from "next/link";
import { ArrowRight, Check, ScanLine } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { LiveDot, Reveal } from "./modern/motion";

const copy = {
  en: {
    kicker: "Career preparation platform",
    headline: "Career support built for African youth.",
    body: "JobMate reviews your CV, finds roles that match your skills, suggests courses to close skill gaps, and lets you practice interviews — in English or Amharic.",
    primary: "Create free account",
    secondary: "Sign in",
    note: "Free to start. No credit card required.",
    previewTitle: "CV Studio",
    previewStatus: "Analysing document",
    preview: {
      headline: "Experience",
      finding: "Two roles list no measurable outcome. Add a result with a number.",
      score: "Clarity score",
      scoreValue: "68",
    },
    points: {
      title: "What JobMate does",
      items: [
        "CV analysis with practical, section-by-section feedback",
        "Job search through a normal conversation",
        "Interview practice with saved history",
        "Course suggestions based on your skill gaps",
      ],
    },
  },
  am: {
    kicker: "የሙያ ዝግጅት መድረክ",
    headline: "ለወጣት አፍሪካውያን የተገነባ የሙያ ድጋፍ።",
    body: "JobMate የCVዎን ይገምግማል፣ ክህሎቶችዎን የሚዛመዱ ስራዎችን ያገኛል፣ የክህሎት ክፍተቶችዎን የሚዘጉ ኮርሶችን ይመክራል፣ እና በአማርኛ ወይም በእንግሊዝኛ ለቃለመጠይቅ መለማመድ ያስችልዎታል።",
    primary: "ነፃ መለያ ይፍጠሩ",
    secondary: "ግቡ",
    note: "ለመጀመሪያ ነፃ ነው። የክፍያ ካርድ አያስፈልግም።",
    previewTitle: "CV ስቱዲዮ",
    previewStatus: "ሰነድን በመተንተን ላይ",
    preview: {
      headline: "የስራ ልምምድ",
      finding: "ሁለት ስራዎች የሚሰራ ውጤት አይገልጡም። በቁጥር የሚሸራ ውጤት ያክሉ።",
      score: "የግልጽነት ውጤት",
      scoreValue: "68",
    },
    points: {
      title: "JobMate የሚሰረዘው",
      items: [
        "በክፍል ክፍል የሚሰጥ ተግባራዊ የCV ትንታኔ",
        "በተፈጥሯዊ ውይይት የስራ ፍለጋ",
        "የተቀመጠ ታሪክ ያለው የቃለመጠይቅ ልምምድ",
        "ከክህሎት ክፍተቶችዎ መሰረት የኮርስ ምክሮች",
      ],
    },
  },
};

export default function HeroSection() {
  const { language } = useLanguage();
  const c = copy[language];

  return (
    <section className="px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
            <LiveDot />
            <p className="kicker">{c.kicker}</p>
            <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--border-strong)] sm:block">
              EN / አማ
            </span>
          </div>
        </Reveal>

        <div className="grid gap-12 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Reveal delay={0.05}>
              <h1 className="display text-[clamp(2.5rem,6.5vw,4.5rem)]">
                {c.headline}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lede mt-7 max-w-xl">{c.body}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn-primary btn-lg">
                  {c.primary}
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/login" className="btn-secondary btn-lg">
                  {c.secondary}
                </Link>
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {c.note}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-12 border-t border-[var(--border)]">
                {c.points.items.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-b border-[var(--border)] py-3.5"
                  >
                    <span className="mt-0.5 font-mono text-[11px] tabular-nums text-[var(--accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--border-strong)]" />
                    <span className="text-sm leading-6 text-[var(--text-muted)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.2} y={24}>
            <div className="relative">
              <div className="panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
                  <span className="flex items-center gap-2">
                    <ScanLine className="size-4 text-[var(--accent)]" />
                    <span className="kicker">{c.previewTitle}</span>
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    <LiveDot />
                    {c.previewStatus}
                  </span>
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    <p className="kicker">{c.preview.headline}</p>
                    <div className="mt-3 space-y-2" aria-hidden="true">
                      <div className="h-2 w-full bg-[var(--bg-subtle)]" />
                      <div className="h-2 w-[88%] bg-[var(--bg-subtle)]" />
                      <div className="h-2 w-[64%] bg-[var(--bg-subtle)]" />
                    </div>
                  </div>

                  <div className="border-l-2 border-[var(--accent)] bg-[var(--accent-subtle)] px-4 py-3">
                    <p className="kicker-accent">Feedback</p>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--text-primary)]">
                      {c.preview.finding}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <p className="kicker">{c.preview.score}</p>
                      <p className="display tnum text-3xl">
                        {c.preview.scoreValue}
                        <span className="text-base text-[var(--text-muted)]">
                          /100
                        </span>
                      </p>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full bg-[var(--bg-subtle)]">
                      <div
                        className="h-full bg-[var(--accent)]"
                        style={{ width: `${c.preview.scoreValue}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="h-px w-full bg-[var(--accent)] opacity-80"
                  style={{ animation: "jm-scan 3.6s ease-in-out infinite" }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
