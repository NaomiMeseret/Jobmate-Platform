"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { useGetStructuredUserChatsQuery } from "@/lib/redux/api/interviewApi";
import {
  AppShell,
  EmptyState,
  SectionHeader,
  Surface,
} from "@/app/components/modern/AppShell";

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
        <SectionHeader
          icon={<History className="size-4" />}
          title="Saved structured sessions"
          description={`${chats.length} sessions`}
        />

        {isLoading ? (
          <p className="muted">Loading sessions...</p>
        ) : chats.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {chats.map((chat) => (
              <Link
                key={chat.chat_id}
                href={`/interview/structured/resume?chat_id=${encodeURIComponent(
                  chat.chat_id
                )}`}
                className="group rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      {chat.field}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold">
                      {chat.is_completed ? "Completed" : "In progress"}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Question {chat.current_question + 1} of{" "}
                      {chat.total_questions}
                    </p>
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
            title="No structured interviews yet"
            description="Start a field-based interview and your progress will appear here."
          >
            <Link href="/interview/structured/field" className="btn-primary">
              Start structured interview
            </Link>
          </EmptyState>
        )}
      </Surface>
    </AppShell>
  );
}
