"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, UserPlus } from "lucide-react";
import { AIBrainSVG } from "./svg/AIBrainSVG";
import { useLanguage } from "@/providers/language-provider";

const steps = [
  {
    title: { en: "Create Your Profile", am: "ፕሮፋይልዎን ይፍጠሩ" },
    body: {
      en: "Add your CV, goals, and target role.",
      am: "CVዎን፣ ግቦችዎን እና የሚፈልጉትን ስራ ያክሉ።",
    },
    href: "/register",
    accent: "var(--accent-gold)",
    icon: UserPlus,
  },
  {
    title: { en: "AI Analyzes & Matches", am: "AI ይተነትናል እና ያዛምዳል" },
    body: {
      en: "JobMate suggests CV, job, and interview steps.",
      am: "JobMate የCV፣ የስራ እና የቃለመጠይቅ እርምጃዎችን ይጠቁማል።",
    },
    href: "/dashboard",
    accent: "var(--accent-indigo)",
    icon: AIBrainSVG,
  },
  {
    title: { en: "Land Your Dream Job", am: "የሚፈልጉትን ስራ ያግኙ" },
    body: {
      en: "Apply with a clearer profile and more practice.",
      am: "በግልጽ ፕሮፋይል እና ተጨማሪ ልምምድ ያመልክቱ።",
    },
    href: "/interview",
    accent: "var(--accent-green)",
    icon: Trophy,
  },
];

const parentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function StepIcon({
  step,
}: {
  step: (typeof steps)[number];
}) {
  const Icon = step.icon;

  if (Icon === AIBrainSVG) {
    return <AIBrainSVG className="h-14 w-14" />;
  }

  return <Icon className="h-6 w-6" />;
}

export default function HowItWorksSection() {
  const { language } = useLanguage();
  return (
    <section id="how-it-works" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
              {language === "am" ? "እንዴት ይሰራል" : "How it works"}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-tight tracking-normal text-[var(--text-primary)]">
              {language === "am" ? (
                <>
                  ከፕሮፋይል ወደ <span className="gradient-text">እድል</span>
                </>
              ) : (
                <>
                  From Profile to <span className="gradient-text">Opportunity</span>
                </>
              )}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
            {language === "am"
              ? "CVዎን ያክሉ፣ ቀጣዩን እርምጃ ያግኙ፣ እና በልምምድ ይዘጋጁ።"
              : "Add your CV, get next steps, and practice before you apply."}
          </p>
        </div>

        <motion.div
          className="relative mt-14 grid gap-5 lg:grid-cols-3"
          variants={parentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <svg
            className="pointer-events-none absolute left-[16%] right-[16%] top-[92px] hidden h-12 w-[68%] overflow-visible lg:block"
            viewBox="0 0 760 80"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M8 42C126 6 246 76 380 42C514 8 638 74 752 42"
              stroke="var(--accent-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="10 14"
              initial={{ pathLength: 0, opacity: 0.25 }}
              whileInView={{ pathLength: 1, opacity: 0.8 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.25 }}
            />
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={step.title.en}
              className="glass-card group min-h-[330px]"
              variants={stepVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="glass-reflection"
                initial={{ opacity: 0.55 }}
                whileHover={{ opacity: 1 }}
              />
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: step.accent }}
              />
              <Link
                href={step.href}
                className="relative z-10 flex h-full flex-col p-6 md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)]"
                    style={{ color: step.accent }}
                  >
                    <StepIcon step={step} />
                  </span>
                  <span
                    className="font-display text-4xl font-semibold leading-none opacity-60"
                    style={{ color: step.accent }}
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-9 text-[clamp(1.1rem,2vw,1.4rem)] font-medium leading-snug text-[var(--text-primary)]">
                  {step.title[language]}
                </h3>
                <p className="mt-4 text-base leading-8 text-[var(--text-muted)] md:text-lg">
                  {step.body[language]}
                </p>
                <span
                  className="mt-auto inline-flex items-center gap-2 pt-8 text-base font-medium"
                  style={{ color: step.accent }}
                >
                  {language === "am" ? "ቀጥል" : "Continue"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
