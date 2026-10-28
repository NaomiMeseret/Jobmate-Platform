"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rows3 } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { AppShell, SectionHeader, Surface } from "@/app/components/modern/AppShell";

export default function Field() {
  const router = useRouter();
  const { language } = useLanguage();
  const [field, setField] = useState("");
  const [error, setError] = useState("");

  const handleStart = (event: React.FormEvent) => {
    event.preventDefault();
    if (!field.trim()) {
      setError("Please enter your interview field.");
      return;
    }
    router.push(
      `/interview/structured?field=${encodeURIComponent(
        field.trim()
      )}&language=${language}`
    );
  };

  return (
    <AppShell
      eyebrow="Structured interview"
      title="Tell JobMate what role to simulate."
      description="Choose a role or field, then answer focused questions with saved progress."
    >
      <Surface className="mx-auto max-w-2xl">
        <SectionHeader
          icon={<Rows3 className="size-4" />}
          title="Interview field"
          description="Example: Software Engineering, Marketing, Accounting."
        />

        <form onSubmit={handleStart} className="space-y-4">
          <label className="block">
            <span className="field-label">Field or role</span>
            <input
              value={field}
              onChange={(event) => {
                setField(event.target.value);
                setError("");
              }}
              placeholder="Software Engineering"
              className="input"
            />
          </label>
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="btn-primary">
            Start structured interview
          </button>
        </form>
      </Surface>
    </AppShell>
  );
}
