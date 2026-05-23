"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { History, Loader2, MessageCircle, Send } from "lucide-react";
import {
  useGetFreeformHistoryQuery,
  useSendFreeformMessageMutation,
} from "@/lib/redux/api/interviewApi";
import { AppShell, EmptyState, Surface } from "@/app/components/modern/AppShell";

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
        <Link
          href="/interview/freefrom/History/all"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <History className="size-4" />
          History
        </Link>
      }
    >
      <Surface className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-black">Interview chat</h2>
            <p className="text-sm text-slate-500">
              {chatId || "No chat selected"}
            </p>
          </div>
        </div>

        {!chatId ? (
          <EmptyState
            title="No session selected"
            description="Create a new free-form interview session before chatting."
          >
            <Link
              href="/interview/freefrom/session"
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              Create session
            </Link>
          </EmptyState>
        ) : (
          <>
            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
            <div className="flex h-[540px] flex-col gap-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
              {isFetching && (
                <p className="text-sm text-slate-500">Loading history...</p>
              )}
              {!messages.length && !isFetching && (
                <p className="text-sm text-slate-500">
                  Start with a short intro and the role you are preparing for.
                </p>
              )}
              {messages.map((message, index) => (
                <div
                  key={`${message.timestamp || index}-${index}`}
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

            <form onSubmit={handleSend} className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Answer the interviewer or ask for a new question..."
                className="modern-input"
              />
              <button
                type="submit"
                disabled={isLoading || !draft.trim()}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#183d3d] text-white transition hover:bg-[#235553] disabled:opacity-60"
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
    <Suspense fallback={<div className="p-8 text-slate-600">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
