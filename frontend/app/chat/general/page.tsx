"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useSendMessageMutation } from "@/lib/redux/api/generalApi";
import { AppShell, Surface } from "@/app/components/modern/AppShell";
import { useLanguage } from "@/providers/language-provider";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const copy = {
  en: {
    eyebrow: "General assistant",
    title: "Ask open career questions.",
    description:
      "Use this space for career questions that do not fit a dedicated tool.",
    welcome:
      "Ask me about CV writing, interview prep, job search strategy, workplace communication, or your next learning goal.",
    error: "I could not process that message right now. Please try again.",
    cardTitle: "Career chat",
    cardSubtitle: "Fast guidance for anything that does not fit a dedicated tool.",
    prompts: [
      "Improve my LinkedIn headline",
      "Prepare for a phone screen",
      "Plan a 30-day skill sprint",
    ],
    placeholder: "Ask JobMate anything career-related...",
    send: "Send message",
  },
  am: {
    eyebrow: "አጠቃላይ ረዳት",
    title: "ክፍት የሙያ ጥያቄዎችን ይጠይቁ።",
    description: "በተለየ መሳሪያ ውስጥ የማይገቡ የሙያ ጥያቄዎችን እዚህ ይጠይቁ።",
    welcome:
      "ስለ CV አጻጻፍ፣ የቃለመጠይቅ ዝግጅት፣ የስራ ፍለጋ ስትራቴጂ፣ የስራ ቦታ ግንኙነት ወይም ቀጣዩ የትምህርት ግብዎ ይጠይቁኝ።",
    error: "መልእክቱን አሁን ማቀናበር አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    cardTitle: "የሙያ ውይይት",
    cardSubtitle: "በተለየ መሳሪያ ውስጥ ለማይገቡ ጥያቄዎች ፈጣን መመሪያ።",
    prompts: ["የLinkedIn ርዕሴን አሻሽል", "ለስልክ ቃለመጠይቅ አዘጋጅኝ", "የ30 ቀን የክህሎት ዕቅድ አዘጋጅ"],
    placeholder: "ስለ ሙያ ማንኛውንም ነገር JobMateን ይጠይቁ...",
    send: "መልእክት ላክ",
  },
};

export default function GeneralPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: c.welcome,
    },
  ]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [{ role: "assistant", content: c.welcome }]
        : current
    );
  }, [c.welcome]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;

    const content = draft.trim();
    setMessages((current) => [...current, { role: "user", content }]);
    setDraft("");

    try {
      const response = await sendMessage({
        user_id: "current-user",
        message: content,
        is_from_user: true,
      }).unwrap();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: response.reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: c.error,
        },
      ]);
    }
  };

  return (
    <AppShell
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
    >
      <Surface className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-black">{c.cardTitle}</h2>
            <p className="text-sm text-slate-500">
              {c.cardSubtitle}
            </p>
          </div>
        </div>

        <div className="flex h-[560px] flex-col gap-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[84%] rounded-lg bg-[#183d3d] px-4 py-3 text-white"
                  : "mr-auto max-w-[84%] rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700"
              }
            >
              <div className="markdown-body text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-[#fbfcf8] p-3 sm:grid-cols-3">
          {c.prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setDraft(prompt)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Sparkles className="size-4 text-[#2f7d6d]" />
                {prompt}
              </button>
            ))}
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={c.placeholder}
            className="modern-input"
          />
          <button
            type="submit"
            disabled={isLoading || !draft.trim()}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#183d3d] text-white transition hover:bg-[#235553] disabled:opacity-60"
            aria-label={c.send}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
      </Surface>
    </AppShell>
  );
}
