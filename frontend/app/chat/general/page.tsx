"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useSendMessageMutation } from "@/lib/redux/api/generalApi";
import {
  AppShell,
  SectionHeader,
  Surface,
} from "@/app/components/modern/AppShell";
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
        <SectionHeader
          icon={<MessageCircle className="size-4" />}
          title={c.cardTitle}
          description={c.cardSubtitle}
        />

        <div className="chat-panel h-[560px]">
          {messages.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}`}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={message.role === "user" ? "chat-user" : "chat-assistant"}
            >
              <div className="markdown-body text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {c.prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setDraft(prompt)}
              className="btn-secondary btn-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={c.placeholder}
            className="input"
            aria-label={c.send}
          />
          <button
            type="submit"
            disabled={isLoading || !draft.trim()}
            className="btn-primary size-10 shrink-0 !px-0"
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
