"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { History, Loader2, Send, Trophy } from "lucide-react";
import {
  useAnswerStructuredQuestionMutation,
  useStartStructuredInterviewMutation,
} from "@/lib/redux/api/interviewApi";
import {
  AppShell,
  EmptyState,
  SectionHeader,
  Surface,
} from "@/app/components/modern/AppShell";

function StructuredQuestion() {
  const searchParams = useSearchParams();
  const field = searchParams.get("field") || "";
  const language = searchParams.get("language") || "en";
  const started = useRef(false);
  const [chatId, setChatId] = useState("");
  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const [startStructuredInterview, { isLoading: starting }] =
    useStartStructuredInterviewMutation();
  const [answerStructuredQuestion, { isLoading: submitting }] =
    useAnswerStructuredQuestionMutation();

  useEffect(() => {
    if (!field || started.current) return;
    started.current = true;

    const start = async () => {
      try {
        const response = await startStructuredInterview({
          field,
          preferred_language: language,
        }).unwrap();
        const payload = response?.data || response;
        setChatId(payload.chat_id);
        setQuestion(payload.first_question);
        setTotalQuestions(payload.total_questions || 1);
      } catch (err: any) {
        started.current = false;
        setError(
          err?.data?.message ||
            err?.data?.error ||
            "Unable to start structured interview."
        );
      }
    };

    start();
  }, [field, language, startStructuredInterview]);

  const progress = Math.min((questionNumber / totalQuestions) * 100, 100);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatId || !answer.trim()) return;

    setError("");
    setFeedback("");
    try {
      const response = await answerStructuredQuestion({
        chat_id: chatId,
        answer,
      }).unwrap();
      const payload = response?.data || response;
      setFeedback(payload.feedback || "");
      setAnswer("");
      setTotalQuestions(payload.total_questions || totalQuestions);

      if (payload.is_completed) {
        setCompleted(true);
      } else {
        setQuestion(payload.next_question || "");
        setQuestionNumber((payload.question_index ?? questionNumber) + 1);
      }
    } catch (err: any) {
      setError(
        err?.data?.message || err?.data?.error || "Unable to submit answer."
      );
    }
  };

  return (
    <AppShell
      eyebrow="Structured interview"
      title={field ? `${field} interview` : "Structured interview"}
      description="Answer each generated question and receive AI feedback before the next prompt."
      actions={
        <Link href="/interview/structured/history/all" className="btn-secondary">
          <History className="size-4" />
          History
        </Link>
      }
    >
      <Surface className="mx-auto max-w-5xl">
        {!field ? (
          <EmptyState
            title="Choose a field first"
            description="Structured interviews need a role or field so JobMate can generate relevant questions."
          >
            <Link href="/interview/structured/field" className="btn-primary">
              Enter field
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
                <span>
                  Question {Math.min(questionNumber, totalQuestions)} of{" "}
                  {totalQuestions}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle)]"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {error && <p className="alert-error mb-4">{error}</p>}

            {starting ? (
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Loader2 className="size-4 animate-spin" />
                Starting interview...
              </div>
            ) : completed ? (
              <div className="rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-6 text-center">
                <Trophy className="mx-auto size-8 text-[var(--accent)]" />
                <h2 className="mt-3 text-lg font-semibold">
                  Interview completed
                </h2>
                <p className="mx-auto mt-1.5 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
                  Review your feedback and open history whenever you want to
                  inspect the session again.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-5">
                  <p className="eyebrow">Current question</p>
                  <p className="mt-2.5 text-base leading-7">
                    {question || "Waiting for the next question..."}
                  </p>
                </div>

                <label className="block">
                  <span className="field-label">Your answer</span>
                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    rows={8}
                    className="input resize-y"
                    placeholder="Write a complete answer with context, action, and result..."
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting || !answer.trim()}
                  className="btn-primary"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Submit answer
                </button>
              </form>
            )}

            {feedback && (
              <div className="mt-6">
                <SectionHeader title="Feedback" />
                <div className="markdown-body rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {feedback}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </>
        )}
      </Surface>
    </AppShell>
  );
}

export default function StructuredPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--text-muted)]">Loading...</div>}>
      <StructuredQuestion />
    </Suspense>
  );
}
