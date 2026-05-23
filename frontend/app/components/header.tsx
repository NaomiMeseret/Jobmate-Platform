"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { AfricaMapSVG } from "./svg/AfricaMapSVG";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/providers/language-provider";

const navLinks = [
  { label: { en: "Home", am: "ዋና" }, href: "/#home" },
  { label: { en: "Features", am: "ባህሪዎች" }, href: "/#features" },
  { label: { en: "How It Works", am: "እንዴት ይሰራል" }, href: "/#how-it-works" },
  { label: { en: "Testimonials", am: "ምስክርነቶች" }, href: "/#testimonials" },
  { label: { en: "Pricing", am: "ዋጋ" }, href: "/#pricing" },
];

export default function Header() {
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 0.88]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const shadowOpacity = useTransform(scrollY, [0, 70], [0, 0.22]);
  const backgroundColor = useMotionTemplate`rgba(var(--bg-base-rgb), ${backgroundOpacity})`;
  const boxShadow = useMotionTemplate`0 18px 60px rgba(0, 0, 0, ${shadowOpacity})`;

  return (
    <motion.header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="absolute inset-0 border-b backdrop-blur-xl"
        style={{
          backgroundColor,
          borderColor: "var(--border)",
          opacity: borderOpacity,
          boxShadow,
        }}
      />
      <nav className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="group inline-flex items-center gap-2">
          <AfricaMapSVG className="h-6 w-6 opacity-90 transition group-hover:opacity-100" />
          <span className="font-display text-2xl font-semibold tracking-normal">
            <span className="text-[var(--text-primary)]">Job</span>
            <span className="text-[var(--accent-gold)]">Mate</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-normal text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label[language]}
              <motion.span
                className="absolute -bottom-2 left-0 h-px w-full origin-left bg-[var(--accent-gold)]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSelector />
          <ThemeToggle />
          <Link
            href="/register"
            className="cta-glow inline-flex h-10 items-center rounded-lg border border-[var(--border-accent)] bg-[var(--bg-surface)] px-4 text-sm font-medium text-[var(--accent-gold)] backdrop-blur-xl transition hover:bg-[var(--accent-gold)] hover:text-[#080C18]"
          >
            {language === "am" ? "ጀምር" : "Get Started"}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <motion.button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] backdrop-blur-xl"
            whileTap={{ scale: 0.96 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.85 }}
                transition={{ duration: 0.18 }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mx-4 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex flex-col gap-1 p-3"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: -8 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  >
                    {link.label[language]}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="mt-1 inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border-accent)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[#080C18]"
              >
                {language === "am" ? "ጀምር" : "Get Started"}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
