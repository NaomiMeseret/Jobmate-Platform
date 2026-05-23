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

const socialLinks = [
  { label: "LinkedIn", href: "/" },
  { label: "Instagram", href: "/" },
  { label: "X", href: "/" },
  { label: "Email", href: "mailto:hello@jobmate.africa" },
];

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-[var(--border-accent)] px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <AfricaMapSVG className="h-8 w-8" />
            <span className="font-display text-2xl font-semibold">
              <span className="text-[var(--text-primary)]">Job</span>
              <span className="text-[var(--accent-gold)]">Mate</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-base leading-8 text-[var(--text-muted)]">
            {language === "am"
              ? "በAI የተጎለበተ የሙያ ልማት ለወጣት አፍሪካዊ ተሰጥኦ፣ ለአካባቢያዊ እውነታዎች እና ለዓለም አቀፍ ምኞት የተገነባ።"
              : "AI-powered career development for young African talent, built for local realities and global ambition."}
          </p>
        </div>

        <FooterColumn title={language === "am" ? "ምርት" : "Product"} links={productLinks} language={language} />
        <FooterColumn title={language === "am" ? "ኩባንያ" : "Company"} links={companyLinks} language={language} />
        <FooterColumn title={language === "am" ? "ማህበራዊ" : "Social"} links={socialLinks.map((link) => ({ ...link, label: { en: link.label, am: link.label } }))} language={language} />
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-[var(--border)] pt-6 text-base text-[var(--text-muted)]">
        <p>
          {language === "am"
            ? "© 2025 JobMate. ለአፍሪካ የተገነባ፣ ለዓለም ዝግጁ።"
            : "© 2025 JobMate. Built for Africa, ready for the world."}
        </p>
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
      <h3 className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
        {title}
      </h3>
      <nav className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.label.en}
            href={link.href}
            className="text-base text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
          >
            {link.label[language]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
