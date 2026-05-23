"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rows3 } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { AppShell, Surface } from "@/app/components/modern/AppShell";

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
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
            <Rows3 className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-black">Interview field</h2>
            <p className="text-sm text-slate-500">
              Example: Software Engineering, Marketing, Accounting.
            </p>
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          <input
            value={field}
            onChange={(event) => {
              setField(event.target.value);
              setError("");
            }}
            placeholder="Software Engineering"
            className="modern-input"
          />
          {error && (
            <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white transition hover:bg-[#235553]"
          >
            Start structured interview
          </button>
        </form>
      </Surface>
    </AppShell>
  );
}
