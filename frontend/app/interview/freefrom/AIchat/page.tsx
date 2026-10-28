"use client";

import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { History, Loader2, MessageCircle, Send } from "lucide-react";
import {
  useGetFreeformHistoryQuery,
  useSendFreeformMessageMutation,
} from "@/lib/redux/api/interviewApi";
import {
  AppShell,
  EmptyState,
  SectionHeader,
  Surface,
} from "@/app/components/modern/AppShell";

type Message = {
  role: string;
  content: string;
  timestamp?: string;
};

function ChatContent() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat_id") || searchParams.get("chatid") || "";
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const { data: history, isFetching } = useGetFreeformHistoryQuery(chatId, {
    skip: !chatId,
  });
  const [sendFreeformMessage, { isLoading }] = useSendFreeformMessageMutation();

  const messages = useMemo(() => {
    const existing = history?.data?.messages || history?.messages || [];
    return [...existing, ...localMessages] as Message[];
  }, [history, localMessages]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatId || !draft.trim()) return;

    const userMessage = {
      role: "user",
      content: draft.trim(),
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");

    try {
      const response = await sendFreeformMessage({
        chat_id: chatId,
        message: userMessage.content,
      }).unwrap();
      const payload = response?.data || response;
      setLocalMessages((current) => [
        ...current,
        {
          role: payload.role || "assistant",
          content: payload.content,
          timestamp: payload.timestamp,
        },
      ]);
    } catch (err: any) {
      setError(
        err?.data?.message ||
          err?.data?.error ||
          "Unable to send interview message."
      );
    }
  };

  return (
    <AppShell
      eyebrow="Free-form interview"
      title="Practice in a conversational room."
      description="Keep the conversation natural, practice your answers, and review the coach's feedback as you go."
      actions={
        <Link href="/interview/freefrom/History/all" className="btn-secondary">
          <History className="size-4" />
          History
        </Link>
      }
    >
      <Surface className="mx-auto max-w-5xl">
        <SectionHeader
          icon={<MessageCircle className="size-4" />}
          title="Interview chat"
          description={chatId || "No chat selected"}
        />

        {!chatId ? (
          <EmptyState
            title="No session selected"
            description="Create a new free-form interview session before chatting."
          >
            <Link href="/interview/freefrom/session" className="btn-primary">
              Create session
            </Link>
          </EmptyState>
        ) : (
          <>
            {error && <p className="alert-error mb-4">{error}</p>}
            <div className="chat-panel h-[540px]">
              {isFetching && (
                <p className="text-sm text-[var(--text-muted)]">
                  Loading history...
                </p>
              )}
              {!messages.length && !isFetching && (
                <p className="text-sm text-[var(--text-muted)]">
                  Start with a short intro and the role you are preparing for.
                </p>
              )}
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp || index}-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    message.role === "user" ? "chat-user" : "chat-assistant"
                  }
                >
                  <div className="markdown-body text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSend} className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Answer the interviewer or ask for a new question..."
                className="input"
                aria-label="Send message"
              />
              <button
                type="submit"
                disabled={isLoading || !draft.trim()}
                className="btn-primary size-10 shrink-0 !px-0"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </form>
          </>
        )}
      </Surface>
    </AppShell>
  );
}

export default function AIchat() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--text-muted)]">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
