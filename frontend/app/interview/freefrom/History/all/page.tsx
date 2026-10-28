"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { useGetFreeformUserChatsQuery } from "@/lib/redux/api/interviewApi";
import {
  AppShell,
  EmptyState,
  SectionHeader,
  Surface,
} from "@/app/components/modern/AppShell";

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
        <SectionHeader
          icon={<History className="size-4" />}
          title="Saved free-form sessions"
          description={`${chats.length} sessions`}
        />

        {isLoading ? (
          <p className="muted">Loading sessions...</p>
        ) : chats.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {chats.map((chat) => (
              <Link
                key={chat.chat_id}
                href={`/interview/freefrom/AIchat?chat_id=${encodeURIComponent(
                  chat.chat_id
                )}`}
                className="group rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      {chat.session_type}
                    </p>
                    <h3 className="mt-1.5 text-sm font-medium leading-6">
                      {chat.last_message || "Interview session"}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {new Date(chat.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No free-form interviews yet"
            description="Create your first coaching room to build history."
          >
            <Link href="/interview/freefrom/session" className="btn-primary">
              Create session
            </Link>
          </EmptyState>
        )}
      </Surface>
    </AppShell>
  );
}
