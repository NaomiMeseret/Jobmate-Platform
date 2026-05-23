"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Send, Trophy } from "lucide-react";
import {
  useAnswerStructuredQuestionMutation,
  useLazyResumeStructuredInterviewQuery,
} from "@/lib/redux/api/interviewApi";
import { AppShell, EmptyState, Surface } from "@/app/components/modern/AppShell";

function ResumeContent() {
  const params = useSearchParams();
  const queryChatId = params.get("chat_id") || params.get("chatid") || "";
  const [chatId, setChatId] = useState("");
  const [field, setField] = useState("");
  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [resumeInterview, { isFetching }] = useLazyResumeStructuredInterviewQuery();
  const [answerQuestion, { isLoading }] = useAnswerStructuredQuestionMutation();

  useEffect(() => {
    if (!queryChatId) return;

    const load = async () => {
      try {
        const payload = await resumeInterview({ chat_id: queryChatId }).unwrap();
        setChatId(payload.chat_id);
        setField(payload.field || "");
        setQuestion(payload.next_question || "");
        setQuestionNumber((payload.current_question || 0) + 1);
        setTotalQuestions(payload.total_questions || 1);
        setCompleted(Boolean(payload.is_completed));
      } catch (err: any) {
        setError(
          err?.data?.message ||
            err?.data?.error ||
            "Unable to resume structured interview."
        );
      }
    };

    load();
  }, [queryChatId, resumeInterview]);

  const progress = Math.min((questionNumber / totalQuestions) * 100, 100);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatId || !answer.trim()) return;

    setError("");
    try {
      const response = await answerQuestion({ chat_id: chatId, answer }).unwrap();
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
      eyebrow="Resume structured interview"
      title={field || "Structured interview"}
      description="Continue your saved practice session and build stronger answers one question at a time."
    >
      <Surface className="mx-auto max-w-5xl">
        {!queryChatId ? (
          <EmptyState
            title="No session selected"
            description="Choose a structured interview from history first."
          >
            <Link
              href="/interview/structured/history/all"
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              Open history
            </Link>
          </EmptyState>
        ) : isFetching ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Loading interview...
          </div>
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

            {completed ? (
              <div className="rounded-lg border border-[#bfe7dc] bg-[#e8f3ef] p-6 text-center">
                <Trophy className="mx-auto size-10 text-[#155e51]" />
                <h2 className="mt-4 text-2xl font-black">
                  This interview is complete
                </h2>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f7d6d]">
                    Next question
                  </p>
                  <p className="mt-3 text-lg font-bold leading-8 text-slate-900">
                    {question || "Waiting for the next question..."}
                  </p>
                </div>
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  rows={8}
                  className="modern-input resize-y"
                  placeholder="Write your answer..."
                />
                <button
                  type="submit"
                  disabled={isLoading || !answer.trim()}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white transition hover:bg-[#235553] disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Submit answer
                </button>
              </form>
            )}

            {feedback && (
              <div className="markdown-body mt-6 rounded-lg border border-slate-200 bg-white p-5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {feedback}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </Surface>
    </AppShell>
  );
}

export default function ResumeQuestion() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading...</div>}>
      <ResumeContent />
    </Suspense>
  );
}
