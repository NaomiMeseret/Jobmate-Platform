"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { useCreateFreeformSessionMutation } from "@/lib/redux/api/interviewApi";
import { AppShell, Surface } from "@/app/components/modern/AppShell";

const sessionTypes = [
  {
    id: "general",
    title: "General interview",
    description: "Warm up with broad questions about background and goals.",
  },
  {
    id: "technical",
    title: "Technical interview",
    description: "Practice role-specific explanations, problem solving, and tradeoffs.",
  },
  {
    id: "behavioral",
    title: "Behavioral interview",
    description: "Build stronger examples for teamwork, conflict, ownership, and impact.",
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
        <div className="grid gap-4 md:grid-cols-3">
          {sessionTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelected(type.id)}
              className={
                selected === type.id
                  ? "rounded-lg border border-[#2f7d6d] bg-[#e8f3ef] p-5 text-left shadow-sm"
                  : "rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#9ad5c8]"
              }
            >
              <span className="grid size-11 place-items-center rounded-lg bg-white text-[#155e51]">
                <MessageCircle className="size-5" />
              </span>
              <h2 className="mt-5 text-lg font-black text-slate-950">
                {type.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {type.description}
              </p>
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={isLoading}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white transition hover:bg-[#235553] disabled:opacity-60"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          Start session
        </button>
      </Surface>
    </AppShell>
  );
}
