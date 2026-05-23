"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex h-10 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-1 text-sm font-medium text-[var(--text-muted)] shadow-sm backdrop-blur-xl"
      aria-label="Language selector"
    >
      <Globe className="ml-2 size-4" aria-hidden="true" />
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
            "h-8 rounded-md px-2.5 transition",
            language === option.value
              ? "bg-[var(--accent-gold)] text-[#080c18]"
              : "hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
