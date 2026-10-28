"use client";

import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useInitializeChapaMutation } from "@/lib/redux/api/paymentApi";
import { useState } from "react";
import { Reveal } from "./modern/motion";

const plans = [
  {
    name: { en: "Starter", am: "ጀማሪ" },
    price: { en: "Free", am: "ነፃ" },
    description: {
      en: "Start with the core career tools.",
      am: "በመሰረታዊ የሙያ መሳሪያዎች ይጀምሩ።",
    },
    id: "starter",
    href: "/register",
    features: {
      en: ["AI career chat", "Offline career tips", "Basic profile setup"],
      am: ["የAI ሙያ ውይይት", "የኦፍላይን የሙያ ምክሮች", "መሰረታዊ ፕሮፋይል ማዘጋጀት"],
    },
  },
  {
    name: { en: "Career Pro", am: "ሙያ Pro" },
    price: { en: "299 ETB", am: "299 ብር" },
    perMonth: { en: "per month", am: "በወር" },
    description: {
      en: "Extra support for serious job prep.",
      am: "ለጠንካራ የስራ ዝግጅት ተጨማሪ ድጋፍ።",
    },
    id: "career_pro_et",
    href: "",
    features: {
      en: [
        "CV optimization",
        "Job matching",
        "Interview practice history",
      ],
      am: ["CV ማሻሻያ", "የስራ ማዛመድ", "የቃለመጠይቅ ልምምድ ታሪክ"],
    },
  },
];

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
    <section
      id="pricing"
      className="border-t border-[var(--border)] px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <p className="kicker-accent">
              {language === "am" ? "ዋጋ" : "Pricing"}
            </p>
            <div>
              <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
                {language === "am"
                  ? "በነፃ ይጀምሩ። ተጨማሪ ድጋፍ ሲፈልጉ ያድጉ።"
                  : "Start free. Upgrade when you need more."}
              </h2>
              <p className="lede mt-4 max-w-xl">
                {language === "am"
                  ? "በነፃ ይጀምሩ። ተጨማሪ ድጋፍ ሲፈልጉ Career Proን ይምረጡ።"
                  : "Start free. Upgrade when you need deeper preparation."}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={plan.name.en}
              className="flex flex-col bg-[var(--bg-surface)] p-6 md:p-8"
            >
              <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-4">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs tabular-nums text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display text-xl">{plan.name[language]}</h3>
                </span>
                <span className="kicker">
                  {plan.id === "starter" ? "Free tier" : "Monthly"}
                </span>
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="display tnum text-4xl">
                  {plan.price[language]}
                </span>
                {plan.perMonth && (
                  <span className="text-sm text-[var(--text-muted)]">
                    {plan.perMonth[language]}
                  </span>
                )}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
                {plan.description[language]}
              </p>

              <ul className="mt-7 space-y-3 border-t border-[var(--border)] pt-6">
                {plan.features[language].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === "career_pro_et" ? (
                <div className="mt-auto pt-8">
                  <label className="field-label" htmlFor={`country-${plan.id}`}>
                    {language === "am" ? "አገር" : "Country"}
                  </label>
                  <select
                    id={`country-${plan.id}`}
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="input"
                  >
                    <option value="ET">Ethiopia</option>
                    <option value="KE">Kenya</option>
                    <option value="NG">Nigeria</option>
                    <option value="GH">Ghana</option>
                    <option value="ZA">South Africa</option>
                  </select>
                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={isLoading}
                    className="btn-primary mt-3 w-full"
                  >
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    {country === "ET"
                      ? language === "am"
                        ? "በChapa ይክፈሉ"
                        : "Pay with Chapa"
                      : language === "am"
                        ? "በቅርቡ"
                        : "Coming soon"}
                    {!isLoading && <ArrowRight className="size-4" />}
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
                  className="btn-secondary mt-auto w-full"
                >
                  {language === "am" ? "ዕቅድ ይምረጡ" : "Choose plan"}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
