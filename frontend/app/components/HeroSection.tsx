"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, Play, Sparkles, TrendingUp, Zap } from "lucide-react";
import { AfricaMapSVG } from "./svg/AfricaMapSVG";
import { GlobalConnectionSVG } from "./svg/GlobalConnectionSVG";
import { useLanguage } from "@/providers/language-provider";

const avatars = [
  "linear-gradient(135deg, var(--accent-gold), var(--accent-green))",
  "linear-gradient(135deg, var(--accent-indigo), var(--accent-gold))",
  "linear-gradient(135deg, var(--accent-green), var(--accent-indigo))",
  "linear-gradient(135deg, var(--text-primary), var(--accent-gold))",
  "linear-gradient(135deg, var(--accent-gold), var(--text-primary))",
];

const copy = {
  en: {
    pill: "AI-Powered Career Platform",
    headline: [["Your", "Career,"], ["Powered", "by", "AI."], ["Built", "for", "Africa."]],
    body:
      "JobMate helps you improve your CV, prepare for interviews, and find better job matches.",
    primary: "Start Your Journey",
    secondary: "Watch Demo",
    proof: "Early access with 35 students and young professionals",
    stats: ["Interview Success Rate", "Prep Sprint", "Job Matches"],
  },
  am: {
    pill: "በAI የተጎለበተ የሙያ መድረክ",
    headline: [["ሙያዎ", "በAI"], ["የተጎለበተ።"], ["ለአፍሪካ", "የተገነባ።"]],
    body:
      "JobMate CVዎን ለማሻሻል፣ ለቃለመጠይቅ ለመዘጋጀት እና ተስማሚ ስራዎችን ለማግኘት ይረዳዎታል።",
    primary: "ጉዞዎን ይጀምሩ",
    secondary: "ዴሞ ይመልከቱ",
    proof: "ከ35 ተማሪዎች እና ወጣት ባለሙያዎች ጋር በቅድመ መዳረሻ",
    stats: ["የቃለመጠይቅ ስኬት", "የዝግጅት ጊዜ", "የስራ ማዛመዶች"],
  },
};

const statCards = [
  {
    label: "Interview Success Rate",
    value: "18",
    icon: TrendingUp,
    color: "var(--accent-green)",
    className: "left-0 top-12 md:left-2 md:top-16",
  },
  {
    label: "Prep Sprint",
    value: "14 days",
    icon: Zap,
    color: "var(--accent-gold)",
    className: "right-0 top-44 md:right-2 md:top-52",
  },
  {
    label: "Job Matches",
    value: "45",
    icon: Globe2,
    color: "var(--accent-indigo)",
    className: "bottom-6 left-10 md:bottom-10 md:left-20",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const word = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  const { language } = useLanguage();
  const c = copy[language];

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden px-4 pt-28 md:px-8 lg:pt-32"
    >
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-14 pb-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative z-10 max-w-3xl">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {c.pill}
          </motion.div>

          <motion.h1
            className="mt-7 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.95] tracking-normal"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {c.headline.map((line) => (
              <span key={line.join(" ")} className="block">
                {line.map((text) => (
                  <motion.span
                    key={text}
                    className="gradient-text mr-4 inline-block"
                    variants={word}
                  >
                    {text}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-7 max-w-2xl text-base leading-8 text-[var(--text-muted)] md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
          >
            {c.body}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-gold)] px-5 text-sm font-medium text-[#080C18] shadow-[0_16px_48px_var(--glow-gold)] sm:w-auto"
              >
                {c.primary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-5 text-sm font-medium text-[var(--text-muted)] backdrop-blur-xl transition hover:text-[var(--text-primary)] sm:w-auto"
              >
                <Play className="h-4 w-4" />
                {c.secondary}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-col gap-3 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
          >
            <div className="flex -space-x-2">
              {avatars.map((background, index) => (
                <span
                  key={background}
                  className="h-9 w-9 rounded-full border-2 border-[var(--bg-base)]"
                  style={{ background, zIndex: avatars.length - index }}
                />
              ))}
            </div>
            <p>{c.proof}</p>
          </motion.div>
        </div>

        <div className="relative min-h-[480px] lg:min-h-[620px]">
          <AfricaMapSVG className="absolute right-0 top-4 h-[72%] w-[72%] opacity-[0.16]" />
          <motion.div
            className="absolute inset-x-4 top-8 mx-auto max-w-[560px]"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlobalConnectionSVG className="h-auto w-full drop-shadow-[0_28px_90px_var(--glow-green)]" />
          </motion.div>

          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.label}
                className={`glass-card absolute z-10 w-[min(78vw,230px)] p-4 ${card.className}`}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                  scale: 1,
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{
                  opacity: { duration: 0.45, delay: 0.85 + index * 0.12 },
                  scale: { duration: 0.45, delay: 0.85 + index * 0.12 },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1 + index * 0.25,
                  },
                }}
              >
                <motion.div
                  className="glass-reflection"
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl font-semibold leading-none text-[var(--text-primary)]">
                      {card.value}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      {c.stats[index]}
                    </p>
                  </div>
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)]"
                    style={{ color: card.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
