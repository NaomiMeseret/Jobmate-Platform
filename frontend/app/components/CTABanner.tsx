"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { Reveal } from "./modern/motion";

export default function CTABanner() {
  const { language } = useLanguage();

  return (
    <section className="border-t border-[var(--border)] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-[1.2fr_auto] md:items-end">
            <div>
              <p className="kicker-accent">
                {language === "am" ? "ቀጣይን ይጀምሩ" : "Next step"}
              </p>
              <h2 className="display mt-4 text-[clamp(2rem,5vw,3.25rem)]">
                {language === "am"
                  ? "የወደፊትዎ ዛሬ ይጀምራል።"
                  : "Your next role starts with one document."}
              </h2>
              <p className="lede mt-4 max-w-xl">
                {language === "am"
                  ? "CVዎን ያሻሽሉ፣ ይለማመዱ፣ እና ተስማሚ ስራዎችን ያግኙ።"
                  : "Improve your CV, practice interviews, and find better-fit roles — free to start."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href="/register" className="btn-primary btn-lg">
                {language === "am" ? "ጉዞዎን ይጀምሩ" : "Start your journey"}
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/login" className="btn-secondary btn-lg">
                {language === "am" ? "ግቡ" : "Sign in"}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
