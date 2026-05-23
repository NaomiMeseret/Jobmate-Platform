"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { useGetFreeformUserChatsQuery } from "@/lib/redux/api/interviewApi";
import { AppShell, EmptyState, Surface } from "@/app/components/modern/AppShell";

export default function FreeformHistoryAll() {
  const { data, isLoading } = useGetFreeformUserChatsQuery();
  const chats = data?.data?.chats || [];

  return (
    <AppShell
      eyebrow="Free-form history"
      title="Resume interview coaching sessions."
      description="Pick up where you left off or review past interview practice."
    >
      <Surface>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
            <History className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-black">Saved free-form sessions</h2>
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
                href={`/interview/freefrom/AIchat?chat_id=${encodeURIComponent(
                  chat.chat_id
                )}`}
                className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-[#9ad5c8] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase text-[#1f6f60]">
                      {chat.session_type}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-slate-950">
                      {chat.last_message || "Interview session"}
                    </h3>
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
            title="No free-form interviews yet"
            description="Create your first coaching room to build history."
          >
            <Link
              href="/interview/freefrom/session"
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              Create session
            </Link>
          </EmptyState>
        )}
      </Surface>
    </AppShell>
  );
}
