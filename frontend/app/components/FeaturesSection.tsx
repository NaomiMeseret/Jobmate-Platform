"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AIBrainSVG } from "./svg/AIBrainSVG";
import { CareerPathSVG } from "./svg/CareerPathSVG";
import { CVDocumentSVG } from "./svg/CVDocumentSVG";
import { InterviewSVG } from "./svg/InterviewSVG";
import { useLanguage } from "@/providers/language-provider";

const features = [
  {
    label: { en: "AI Guidance", am: "የAI መመሪያ" },
    title: { en: "Personalized Career Roadmaps", am: "ለእርስዎ የተለየ የሙያ መንገድ" },
    body: {
      en: "Get simple next steps based on your goals and skills.",
      am: "በግቦችዎ እና ክህሎቶችዎ መሰረት ቀላል ቀጣይ እርምጃዎችን ያግኙ።",
    },
    href: "/chat/general",
    accent: "var(--accent-indigo)",
    visual: AIBrainSVG,
  },
  {
    label: { en: "CV Studio", am: "CV ስቱዲዮ" },
    title: { en: "AI-Powered CV Optimization", am: "በAI የተጎለበተ CV ማሻሻያ" },
    body: {
      en: "Find weak spots and improve your CV faster.",
      am: "የCVዎን ደካማ ቦታዎች ያግኙ እና በፍጥነት ያሻሽሉ።",
    },
    href: "/cv",
    accent: "var(--accent-gold)",
    visual: CVDocumentSVG,
  },
  {
    label: { en: "Job Matching", am: "የስራ ማዛመድ" },
    title: { en: "Intelligent Job Matching", am: "ብልህ የስራ ማዛመድ" },
    body: {
      en: "Search for roles using your skills and preferred work style.",
      am: "በክህሎቶችዎ እና በሚፈልጉት የስራ አይነት ስራዎችን ይፈልጉ።",
    },
    href: "/chat/jobsearch",
    accent: "var(--accent-green)",
    visual: CareerPathSVG,
  },
  {
    label: { en: "Interview Prep", am: "የቃለመጠይቅ ዝግጅት" },
    title: { en: "AI Interview Coach", am: "የAI ቃለመጠይቅ አሰልጣኝ" },
    body: {
      en: "Practice answers and get quick feedback.",
      am: "መልሶችን ይለማመዱ እና ፈጣን ግብረመልስ ያግኙ።",
    },
    href: "/interview",
    accent: "var(--accent-gold)",
    visual: InterviewSVG,
  },
];

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function FeaturesSection() {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
            {language === "am" ? "የባህሪዎች ካርታ" : "Feature map"}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-tight tracking-normal text-[var(--text-primary)]">
            {language === "am" ? (
              <>
                ሙያዎን <span className="gradient-text">ለማፋጠን</span> የሚያስፈልግዎ ሁሉ
              </>
            ) : (
              <>
                Everything You Need to{" "}
                <span className="gradient-text">Accelerate</span> Your Career
              </>
            )}
          </h2>
        </div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((feature, index) => {
            const Visual = feature.visual;
            const floatY = index % 2 === 0 ? -7 : -5;
            const floatX = index % 2 === 0 ? 3 : -3;

            return (
              <motion.div key={feature.title.en} variants={cardVariants}>
                <motion.div
                  className="glass-card group min-h-[370px]"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { y: [0, floatY, 0], x: [0, floatX, 0] }
                  }
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{
                    y: {
                      duration: 4 + index * 0.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.25,
                    },
                    x: {
                      duration: 5 + index * 0.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.25,
                    },
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <motion.div
                    className="glass-reflection"
                    initial={{ opacity: 0.42 }}
                    whileHover={{ opacity: 1 }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ background: feature.accent }}
                  />
                  <div
                    className="absolute inset-x-0 top-0 h-32 opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--bg-surface-hover), transparent 62%)",
                    }}
                  />
                  <div
                    className="absolute inset-x-8 bottom-0 h-px opacity-70 transition-opacity group-hover:opacity-100"
                    style={{ background: feature.accent }}
                  />
                  <Link
                    href={feature.href}
                    className="relative z-10 flex h-full flex-col p-6 md:p-8"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p
                          className="text-xs font-medium uppercase tracking-[0.08em]"
                          style={{ color: feature.accent }}
                        >
                          {feature.label[language]}
                        </p>
                        <h3 className="mt-4 max-w-md text-[clamp(1.2rem,2vw,1.55rem)] font-medium leading-tight text-[var(--text-primary)]">
                          {feature.title[language]}
                        </h3>
                      </div>
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)] font-display text-xl font-semibold text-[var(--text-primary)]"
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <div className="relative mt-7 h-28 overflow-hidden">
                      <Visual className="absolute -left-4 top-1 h-32 w-32 opacity-95 transition-transform duration-500 group-hover:scale-105" />
                      <div
                        className="absolute bottom-4 left-28 right-0 h-px"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--border-accent), transparent)",
                        }}
                      />
                    </div>

                    <p className="mt-1 max-w-xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
                      {feature.body[language]}
                    </p>
                    <span
                      className="mt-auto inline-flex items-center justify-between gap-3 pt-8 text-base font-medium"
                      style={{ color: feature.accent }}
                    >
                      <span>{language === "am" ? "ባህሪውን ክፈት" : "Open feature"}</span>
                      <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)] transition-transform group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
