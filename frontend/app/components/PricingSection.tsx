"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useInitializeChapaMutation } from "@/lib/redux/api/paymentApi";
import { useState } from "react";

const plans = [
  {
    name: { en: "Starter", am: "ጀማሪ" },
    price: { en: "Free", am: "ነፃ" },
    description: { en: "Start with the core career tools.", am: "በመሰረታዊ የሙያ መሳሪያዎች ይጀምሩ።" },
    id: "starter",
    href: "/register",
    accent: "var(--accent-green)",
    features: { en: ["AI career chat", "Offline career tips", "Basic profile setup"], am: ["የAI ሙያ ውይይት", "የኦፍላይን የሙያ ምክሮች", "መሰረታዊ ፕሮፋይል ማዘጋጀት"] },
  },
  {
    name: { en: "Career Pro", am: "ሙያ Pro" },
    price: { en: "299 ETB", am: "299 ብር" },
    description: { en: "Extra support for serious job prep.", am: "ለጠንካራ የስራ ዝግጅት ተጨማሪ ድጋፍ።" },
    id: "career_pro_et",
    href: "",
    accent: "var(--accent-gold)",
    features: { en: ["CV optimization", "Job matching", "Interview practice history"], am: ["CV ማሻሻያ", "የስራ ማዛመድ", "የቃለመጠይቅ ልምምድ ታሪክ"] },
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function PricingSection() {
  const { language } = useLanguage();
  const [country, setCountry] = useState("ET");
  const [message, setMessage] = useState("");
  const [initializeChapa, { isLoading }] = useInitializeChapaMutation();

  const startPayment = async () => {
    setMessage("");
    if (country !== "ET") {
      setMessage(
        language === "am"
          ? "Career Pro በአገርዎ በቅርቡ ይመጣል።"
          : "Career Pro payments are coming soon for your country."
      );
      return;
    }

    try {
      const response = await initializeChapa({
        plan_id: "career_pro_et",
        country,
      }).unwrap();
      window.location.href = response.checkout_url;
    } catch (err: any) {
      setMessage(
        err?.data?.error ||
          (language === "am"
            ? "ክፍያ መጀመር አልተቻለም። እባክዎ ይግቡ እና ደግመው ይሞክሩ።"
            : "Could not start payment. Please sign in and try again.")
      );
    }
  };

  return (
    <section id="pricing" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
              {language === "am" ? "ዋጋ" : "Pricing"}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-tight tracking-normal text-[var(--text-primary)]">
              {language === "am" ? (
                <>
                  በነፃ ይጀምሩ። <span className="gradient-text">በመተማመን</span> ያድጉ።
                </>
              ) : (
                <>
                  Start Free. Grow with <span className="gradient-text">Confidence.</span>
                </>
              )}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
            {language === "am"
              ? "በነፃ ይጀምሩ። ተጨማሪ ድጋፍ ሲፈልጉ Career Proን ይምረጡ።"
              : "Start free. Upgrade when you need deeper preparation."}
          </p>
        </div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.name.en}
              className="glass-card min-h-[390px] p-6 md:p-7"
              variants={card}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="glass-reflection"
                initial={{ opacity: 0.45 }}
                whileHover={{ opacity: 1 }}
              />
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: plan.accent }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <p
                  className="text-xs font-medium uppercase tracking-[0.08em]"
                  style={{ color: plan.accent }}
                >
                  {plan.name[language]}
                </p>
                <p className="mt-5 font-display text-5xl font-semibold leading-none text-[var(--text-primary)]">
                  {plan.price[language]}
                </p>
                <p className="mt-5 text-base leading-8 text-[var(--text-muted)] md:text-lg">
                  {plan.description[language]}
                </p>
                <ul className="mt-7 space-y-3">
                  {plan.features[language].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-base text-[var(--text-primary)]"
                    >
                      <span
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-surface-hover)]"
                        style={{ color: plan.accent }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.id === "career_pro_et" ? (
                  <div className="mt-auto pt-8">
                    <label className="mb-3 block text-sm font-medium text-[var(--text-muted)]">
                      {language === "am" ? "አገር" : "Country"}
                      <select
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-3 text-[var(--text-primary)] outline-none"
                      >
                        <option value="ET">Ethiopia</option>
                        <option value="KE">Kenya</option>
                        <option value="NG">Nigeria</option>
                        <option value="GH">Ghana</option>
                        <option value="ZA">South Africa</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={startPayment}
                      disabled={isLoading}
                      className="inline-flex w-full items-center justify-between gap-3 rounded-lg border border-[var(--border-accent)] px-4 py-3 text-base font-medium transition hover:bg-[var(--bg-surface-hover)] disabled:opacity-60"
                      style={{ color: plan.accent }}
                    >
                      <span>
                        {country === "ET"
                          ? language === "am"
                            ? "በChapa ይክፈሉ"
                            : "Pay with Chapa"
                          : language === "am"
                            ? "በቅርቡ"
                            : "Coming soon"}
                      </span>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </button>
                    {message && (
                      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                        {message}
                      </p>
                    )}
                  </div>
                ) : (
                  <Link
                    href={plan.href}
                    className="mt-auto inline-flex items-center justify-between gap-3 pt-8 text-base font-medium"
                    style={{ color: plan.accent }}
                  >
                    <span>
                      {language === "am" ? "ዕቅድ ይምረጡ" : "Choose plan"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
