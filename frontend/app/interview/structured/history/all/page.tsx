"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { useGetStructuredUserChatsQuery } from "@/lib/redux/api/interviewApi";
import { AppShell, EmptyState, Surface } from "@/app/components/modern/AppShell";

export default function StructuredHistoryAll() {
  const { data, isLoading } = useGetStructuredUserChatsQuery();
  const chats = data?.data?.chats || [];

  return (
    <AppShell
      eyebrow="Structured history"
      title="Continue structured interview sessions."
      description="Return to saved structured interviews and keep practicing from where you stopped."
    >
      <Surface>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
            <History className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-black">Saved structured sessions</h2>
            <p className="text-sm text-slate-500">{chats.length} sessions</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading sessions...</p>
        ) : chats.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {chats.map((chat) => (
              <Link
                key={chat.chat_id}
                href={`/interview/structured/resume?chat_id=${encodeURIComponent(
                  chat.chat_id
                )}`}
                className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-[#9ad5c8] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase text-[#1f6f60]">
                      {chat.field}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-slate-950">
                      {chat.is_completed ? "Completed" : "In progress"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Question {chat.current_question + 1} of{" "}
                      {chat.total_questions}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(chat.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No structured interviews yet"
            description="Start a field-based interview and your progress will appear here."
          >
            <Link
              href="/interview/structured/field"
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              Start structured interview
            </Link>
          </EmptyState>
        )}
      </Surface>
    </AppShell>
  );
}
