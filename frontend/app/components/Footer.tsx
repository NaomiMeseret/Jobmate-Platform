"use client";

import Link from "next/link";
import { AfricaMapSVG } from "./svg/AfricaMapSVG";
import { useLanguage } from "@/providers/language-provider";

const productLinks = [
  { label: { en: "Career Guidance", am: "የሙያ መመሪያ" }, href: "/chat/general" },
  { label: { en: "CV Optimization", am: "CV ማሻሻያ" }, href: "/cv" },
  { label: { en: "Job Matching", am: "የስራ ማዛመድ" }, href: "/chat/jobsearch" },
  { label: { en: "Interview Prep", am: "የቃለመጠይቅ ዝግጅት" }, href: "/interview" },
];

const companyLinks = [
  { label: { en: "Dashboard", am: "ዳሽቦርድ" }, href: "/dashboard" },
  { label: { en: "Courses", am: "ኮርሶች" }, href: "/course" },
  { label: { en: "Offline Tips", am: "የኦፍላይን ምክሮች" }, href: "/offline_tips" },
  { label: { en: "Get Started", am: "ጀምር" }, href: "/register" },
];

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-ink)] px-4 py-14 text-[var(--text-on-ink)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center border border-[var(--text-on-ink)]/25 transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                <AfricaMapSVG className="h-[18px] w-[18px]" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="display text-[17px] font-semibold tracking-tight">
                  JobMate
                </span>
                <span className="kicker mt-0.5 text-[9px] tracking-[0.2em]">
                  Career Studio
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--text-on-ink)]/65">
              {language === "am"
                ? "በAI የተጎለበተ የሙያ ልማት ለወጣት አፍሪካዊ ተሰጥኦ፣ ለአካባቢያዊ እውነታዎች እና ለዓለም አቀፍ ምኞት የተገነባ።"
                : "AI-powered career development for young African talent, built for local realities and global ambition."}
            </p>
          </div>

          <FooterColumn
            title={language === "am" ? "ምርት" : "Product"}
            links={productLinks}
            language={language}
          />
          <FooterColumn
            title={language === "am" ? "አገሓኝ" : "Explore"}
            links={companyLinks}
            language={language}
          />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--text-on-ink)]/15 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-on-ink)]/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {language === "am"
              ? "© 2025 JobMate. ለአፍሪካ የተገነባ፣ ለዓለም ዝግጁ።"
              : "© 2025 JobMate. Built for Africa, ready for the world."}
          </p>
          <a
            href="mailto:hello@jobmate.africa"
            className="transition-colors hover:text-[var(--text-on-ink)]"
          >
            hello@jobmate.africa
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  language,
}: {
  title: string;
  links: Array<{ label: { en: string; am: string }; href: string }>;
  language: "en" | "am";
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-on-ink)]/50">
        {title}
      </h3>
      <nav className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.label.en}
            href={link.href}
            className="text-sm text-[var(--text-on-ink)]/75 transition-colors hover:text-[var(--text-on-ink)]"
          >
            {link.label[language]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
