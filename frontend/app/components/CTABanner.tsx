"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { AfricaMapSVG } from "./svg/AfricaMapSVG";
import { useLanguage } from "@/providers/language-provider";

export default function CTABanner() {
  const { language } = useLanguage();

  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <motion.div
        className="glass-card relative mx-auto max-w-7xl overflow-hidden p-8 text-center md:p-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden="true"
        />
        <AfricaMapSVG className="absolute -right-10 -top-16 h-72 w-72 opacity-15 md:h-96 md:w-96" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
            {language === "am" ? "በJobMate ይጀምሩ" : "Start with JobMate"}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-tight tracking-normal text-[var(--text-primary)]">
            {language === "am" ? (
              <>
                የወደፊትዎ <span className="gradient-text">ዛሬ</span> ይጀምራል።
              </>
            ) : (
              <>
                Your Future Starts <span className="gradient-text">Today.</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
            {language === "am"
              ? "CVዎን ያሻሽሉ፣ ይለማመዱ፣ እና ተስማሚ ስራዎችን ያግኙ።"
              : "Improve your CV, practice interviews, and find better-fit roles."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-gold)] px-5 text-base font-medium text-[#080C18] shadow-[0_16px_48px_var(--glow-gold)] sm:w-auto"
              >
                {language === "am" ? "ጉዞዎን ይጀምሩ" : "Start Your Journey"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-5 text-base font-medium text-[var(--text-muted)] backdrop-blur-xl transition hover:text-[var(--text-primary)] sm:w-auto"
              >
                <Play className="h-4 w-4" />
                {language === "am" ? "ዴሞ ይመልከቱ" : "Watch Demo"}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
