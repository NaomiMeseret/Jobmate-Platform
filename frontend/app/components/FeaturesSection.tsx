"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, FileText, LineChart, Mic } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { Reveal, Stagger, StaggerItem } from "./modern/motion";

const features = [
  {
    icon: LineChart,
    label: { en: "AI Guidance", am: "የAI መመሪያ" },
    title: { en: "Personalized career roadmaps", am: "ለእርስዎ የተለየ የሙያ መንገድ" },
    body: {
      en: "Get simple next steps based on your goals and skills.",
      am: "በግቦችዎ እና ክህሎቶችዎ መሰረት ቀላል ቀጣይ እርምጃዎችን ያግኙ።",
    },
    href: "/chat/general",
  },
  {
    icon: FileText,
    label: { en: "CV Studio", am: "CV ስቱዲዮ" },
    title: { en: "CV analysis and feedback", am: "የCV ትንታኔ እና ግብረመልስ" },
    body: {
      en: "Upload your CV and find weak spots, missing keywords, and skill gaps.",
      am: "CVዎን ይስቀሉ፤ ደካማ ቦታዎች፣ የሌሉ ቃላት እና የክህሎት ክፍተቶችን ያግኙ።",
    },
    href: "/cv",
  },
  {
    icon: Briefcase,
    label: { en: "Job Matching", am: "የስራ ማዛመድ" },
    title: { en: "Job search by conversation", am: "በውይይት የስራ ፍለጋ" },
    body: {
      en: "Describe the role you want and review matched openings in one chat.",
      am: "የሚፈልጉትን ሚና ይግለጡ እና በአንድ ውይይት ውስጥ የተዛመዱ ስራዎችን ይመልከቱ።",
    },
    href: "/chat/jobsearch",
  },
  {
    icon: Mic,
    label: { en: "Interview Prep", am: "የቃለመጠይቅ ዝግጅት" },
    title: { en: "Interview practice with feedback", am: "ከግብረመልስ ጋር የቃለመጠይቅ ልምምድ" },
    body: {
      en: "Practice free-form or structured interviews and keep your history.",
      am: "ነፃ ወይም የተዋቀረ ቃለመጠይቅ ይለማመዱ እና ታሪክዎን ያስቀምጡ።",
    },
    href: "/interview",
  },
];

export default function FeaturesSection() {
  const { language } = useLanguage();

  return (
    <section
      id="features"
      className="border-t border-[var(--border)] px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <p className="kicker-accent">
              {language === "am" ? "ባህሪዎች" : "Capabilities"}
            </p>
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              {language === "am"
                ? "ሙያዎን ለማፋጠን የሚያስፈልጉዎ ሁሉ"
                : "Everything you need to prepare for your next role"}
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-12 border-t border-[var(--border)]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title.en}>
                <Link
                  href={feature.href}
                  className="group grid gap-4 border-b border-[var(--border)] py-7 transition-colors hover:bg-[var(--bg-surface-hover)] md:grid-cols-[4rem_1fr_auto] md:items-baseline md:gap-6 md:px-2"
                >
                  <span className="flex items-center gap-3 md:block">
                    <span className="font-mono text-xs tabular-nums text-[var(--accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon className="mt-3 size-5 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)] md:size-5" />
                  </span>

                  <span className="block">
                    <span className="kicker block">{feature.label[language]}</span>
                    <span className="display mt-2 block text-2xl">
                      {feature.title[language]}
                    </span>
                    <span className="mt-2 block max-w-lg text-sm leading-6 text-[var(--text-muted)]">
                      {feature.body[language]}
                    </span>
                  </span>

                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                    {language === "am" ? "ክፈት" : "Open"}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
