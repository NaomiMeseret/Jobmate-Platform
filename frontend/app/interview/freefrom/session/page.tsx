"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateFreeformSessionMutation } from "@/lib/redux/api/interviewApi";
import { AppShell, Surface } from "@/app/components/modern/AppShell";
import { cn } from "@/lib/utils";

const sessionTypes = [
  {
    id: "general",
    title: "General interview",
    description: "Warm up with broad questions about background and goals.",
  },
  {
    id: "technical",
    title: "Technical interview",
    description:
      "Practice role-specific explanations, problem solving, and tradeoffs.",
  },
  {
    id: "behavioral",
    title: "Behavioral interview",
    description:
      "Build stronger examples for teamwork, conflict, ownership, and impact.",
  },
];

export default function FreeformSession() {
  const router = useRouter();
  const [selected, setSelected] = useState("general");
  const [error, setError] = useState("");
  const [createSession, { isLoading }] = useCreateFreeformSessionMutation();

  const handleStart = async () => {
    setError("");
    try {
      const response = await createSession({ session_type: selected }).unwrap();
      const chatId = response?.data?.chat_id || response?.chat_id;
      router.push(`/interview/freefrom/AIchat?chat_id=${encodeURIComponent(chatId)}`);
    } catch (err: any) {
      setError(
        err?.data?.message ||
          err?.data?.error ||
          "Unable to create interview session."
      );
    }
  };

  return (
    <AppShell
      eyebrow="Free-form interview"
      title="Choose a coaching room."
      description="Choose the kind of practice you need, then start a live coaching conversation."
    >
      <Surface className="mx-auto max-w-4xl">
        <fieldset>
          <legend className="field-label">Session type</legend>
          <div className="grid gap-3 md:grid-cols-3">
            {sessionTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelected(type.id)}
                aria-pressed={selected === type.id}
                className={cn(
                  "rounded-md border p-4 text-left transition-colors",
                  selected === type.id
                    ? "border-[var(--accent-border)] bg-[var(--accent-subtle)]"
                    : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]"
                )}
              >
                <h2 className="text-sm font-semibold">{type.title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="alert-error mt-4">{error}</p>}

        <button
          type="button"
          onClick={handleStart}
          disabled={isLoading}
          className="btn-primary mt-6"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          Start session
        </button>
      </Surface>
    </AppShell>
  );
}
