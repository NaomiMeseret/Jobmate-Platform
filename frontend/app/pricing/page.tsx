"use client";

import { Check, Crown, Gift, LockKeyhole } from "lucide-react";
import PricingSection from "../components/PricingSection";
import { AppShell, Surface } from "../components/modern/AppShell";
import { useLanguage } from "@/providers/language-provider";

const planDetails = {
  en: {
    eyebrow: "Plans",
    title: "Choose the support level that fits your career stage.",
    description:
      "Starter keeps JobMate accessible for everyone. Career Pro adds deeper preparation for users who need more focused guidance.",
    freeTitle: "Free plan includes",
    proTitle: "Career Pro includes",
    noteTitle: "How payments work",
    note:
      "Career Pro is available in Ethiopia through Chapa in ETB. For Kenya, Nigeria, Ghana, South Africa, and more African countries, paid plans are marked as coming soon while the free plan remains available.",
    free: [
      "General AI career chat",
      "CV upload and basic analysis",
      "Remote job search links",
      "Interview practice starter sessions",
      "Course suggestions from CV gaps",
      "Offline career tips",
    ],
    pro: [
      "More CV analyses and saved CV history",
      "Deeper CV improvement guidance",
      "Saved interview practice history",
      "Structured interview preparation",
      "Priority AI usage when quotas are limited",
      "More detailed course and skill-gap roadmap",
    ],
  },
  am: {
    eyebrow: "ዕቅዶች",
    title: "ለሙያ ደረጃዎ የሚስማማውን ድጋፍ ይምረጡ።",
    description:
      "ጀማሪ ዕቅድ JobMateን ለሁሉም ተደራሽ ያደርጋል። Career Pro ጥልቅ ዝግጅት ለሚፈልጉ ተጠቃሚዎች ተጨማሪ ድጋፍ ይጨምራል።",
    freeTitle: "ነፃ ዕቅድ የሚያካትተው",
    proTitle: "Career Pro የሚያካትተው",
    noteTitle: "ክፍያው እንዴት ይሰራል",
    note:
      "Career Pro በኢትዮጵያ በChapa እና በETB ይገኛል። ለኬንያ፣ ናይጄሪያ፣ ጋና፣ ደቡብ አፍሪካ እና ሌሎች አገሮች የተከፈለ ዕቅድ በቅርቡ ይመጣል፤ ነፃው ዕቅድ ግን ይገኛል።",
    free: [
      "አጠቃላይ የAI ሙያ ውይይት",
      "CV መስቀል እና መሰረታዊ ትንታኔ",
      "የርቀት ስራ ፍለጋ ሊንኮች",
      "የቃለመጠይቅ መጀመሪያ ልምምድ",
      "ከCV ክፍተቶች የኮርስ ምክሮች",
      "የኦፍላይን የሙያ ምክሮች",
    ],
    pro: [
      "ተጨማሪ CV ትንታኔዎች እና የተቀመጠ ታሪክ",
      "ጥልቅ CV ማሻሻያ መመሪያ",
      "የተቀመጠ የቃለመጠይቅ ልምምድ ታሪክ",
      "የተዋቀረ የቃለመጠይቅ ዝግጅት",
      "AI ገደቦች ሲኖሩ ቅድሚያ ያለው አጠቃቀም",
      "ዝርዝር የኮርስ እና የክህሎት ክፍተት መንገድ",
    ],
  },
};

function FeatureList({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "free" | "pro";
}) {
  const Icon = variant === "free" ? Gift : Crown;
  const accent = variant === "free" ? "var(--accent-green)" : "var(--accent-gold)";

  return (
    <Surface>
      <div className="mb-5 flex items-center gap-3">
        <span
          className="grid size-11 place-items-center rounded-lg border bg-[var(--bg-surface-hover)]"
          style={{ borderColor: accent, color: accent }}
        >
          <Icon className="size-5" />
        </span>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-7 text-[var(--text-muted)]">
            <Check className="mt-1 size-4 shrink-0 text-[var(--accent-green)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}

export default function PricingPage() {
  const { language } = useLanguage();
  const copy = planDetails[language];

  return (
    <AppShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <FeatureList title={copy.freeTitle} items={copy.free} variant="free" />
        <FeatureList title={copy.proTitle} items={copy.pro} variant="pro" />
      </div>

      <Surface className="mt-5 border-[var(--border-accent)]">
        <div className="flex gap-3">
          <LockKeyhole className="mt-1 size-5 shrink-0 text-[var(--accent-gold)]" />
          <div>
            <h2 className="font-display text-2xl font-semibold">{copy.noteTitle}</h2>
            <p className="mt-2 text-base leading-8 text-[var(--text-muted)]">
              {copy.note}
            </p>
          </div>
        </div>
      </Surface>

      <div className="mt-8">
        <PricingSection />
      </div>
    </AppShell>
  );
}
