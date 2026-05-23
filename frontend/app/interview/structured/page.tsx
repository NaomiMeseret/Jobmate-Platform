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
import { AppShell, EmptyState, Surface } from "@/app/components/modern/AppShell";

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
        <Link
          href="/interview/structured/history/all"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
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
            <Link
              href="/interview/structured/field"
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              Enter field
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-500">
                <span>
                  Question {Math.min(questionNumber, totalQuestions)} of{" "}
                  {totalQuestions}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#2f7d6d]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            {starting ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Loader2 className="size-4 animate-spin" />
                Starting interview...
              </div>
            ) : completed ? (
              <div className="rounded-lg border border-[#bfe7dc] bg-[#e8f3ef] p-6 text-center">
                <Trophy className="mx-auto size-10 text-[#155e51]" />
                <h2 className="mt-4 text-2xl font-black">
                  Interview completed
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Review your feedback and open history whenever you want to
                  inspect the session again.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f7d6d]">
                    Current question
                  </p>
                  <p className="mt-3 text-lg font-bold leading-8 text-slate-900">
                    {question || "Waiting for the next question..."}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Your answer
                  </span>
                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    rows={8}
                    className="modern-input resize-y"
                    placeholder="Write a complete answer with context, action, and result..."
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting || !answer.trim()}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white transition hover:bg-[#235553] disabled:opacity-60"
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
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-black">Feedback</h2>
                <div className="markdown-body mt-3">
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
    <Suspense fallback={<div className="p-8 text-slate-600">Loading...</div>}>
      <StructuredQuestion />
    </Suspense>
  );
}
