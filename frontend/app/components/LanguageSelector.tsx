"use client";

import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex h-8 items-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-0.5"
      aria-label="Language selector"
    >
      {[
        { value: "en", label: "EN" },
        { value: "am", label: "አማ" },
      ].map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value as "en" | "am")}
          aria-pressed={language === option.value}
          className={cn(
            "h-7 rounded px-2.5 text-xs font-medium transition-colors",
            language === option.value
              ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
