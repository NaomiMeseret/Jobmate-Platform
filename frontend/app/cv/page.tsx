"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowRight,
  FileText,
  History,
  Loader2,
  MessageCircle,
  Send,
  Upload,
} from "lucide-react";
import {
  useAnalyzeCVMutation,
  useGetChatHistoryQuery,
  useGetUserChatsQuery,
  useSendMessageMutation,
  useStartSessionMutation,
  useUploadCVMutation,
} from "@/lib/redux/api/cvApi";
import { AppShell, EmptyState, Surface } from "../components/modern/AppShell";

type ChatMessage = {
  id?: string;
  role: string;
  content: string;
  timestamp?: string;
};

type CVChat = {
  chat_id: string;
  cv_id?: string;
  messages?: ChatMessage[];
  updated_at?: string;
  created_at?: string;
};

function getPayloadData(value: any) {
  return value?.data || value;
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function stringifySuggestion(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  const cvData = value.CVs || value.cvs || {};
  const feedback = value.CVFeedback || value.cv_feedback || {};
  const skillGaps = toArray<any>(value.SkillGaps || value.skill_gaps);

  if (
    Object.keys(cvData).length > 0 ||
    Object.keys(feedback).length > 0 ||
    skillGaps.length > 0
  ) {
    return formatCVAnalysis(cvData, feedback, skillGaps);
  }

  if (Array.isArray(value)) {
    return value
      .map((item, index) =>
        typeof item === "string" ? `${index + 1}. ${item}` : JSON.stringify(item)
      )
      .join("\n");
  }
  return Object.entries(value)
    .map(([key, item]) => {
      const label = key.replaceAll("_", " ");
      if (Array.isArray(item)) {
        return `**${label}**\n${item.map((entry) => `- ${String(entry)}`).join("\n")}`;
      }
      if (typeof item === "object" && item !== null) {
        return `**${label}**\n${JSON.stringify(item, null, 2)}`;
      }
      return `**${label}:** ${String(item)}`;
    })
    .join("\n\n");
}

function readField(source: any, ...keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function formatList(title: string, values: unknown) {
  const list = toArray<string>(values).filter(Boolean);
  if (!list.length) return "";
  return `### ${title}\n${list.map((item) => `- ${item}`).join("\n")}`;
}

function formatCVAnalysis(cvData: any, feedback: any, skillGaps: any[]) {
  const sections: string[] = [];

  const summary = readField(cvData, "Summary", "summary");
  if (summary) {
    sections.push(`### Summary\n${summary}`);
  }

  const skills = readField(cvData, "ExtractedSkills", "extracted_skills");
  const experience = readField(
    cvData,
    "ExtractedExperience",
    "extracted_experience"
  );
  const education = readField(
    cvData,
    "ExtractedEducation",
    "extracted_education"
  );

  const skillsSection = formatList("Extracted Skills", skills);
  if (skillsSection) sections.push(skillsSection);

  const experienceSection = formatList("Experience Signals", experience);
  if (experienceSection) sections.push(experienceSection);

  const educationSection = formatList("Education Signals", education);
  if (educationSection) sections.push(educationSection);

  const strengths = readField(feedback, "Strengths", "strengths");
  const weaknesses = readField(feedback, "Weaknesses", "weaknesses");
  const improvements = readField(
    feedback,
    "ImprovementSuggestions",
    "improvement_suggestions"
  );

  if (strengths || weaknesses || improvements) {
    sections.push(
      [
        "### Feedback",
        strengths ? `**Strengths:** ${strengths}` : "",
        weaknesses ? `**Weaknesses:** ${weaknesses}` : "",
        improvements ? `**Improvements:** ${improvements}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    );
  }

  if (skillGaps.length) {
    sections.push(
      [
        "### Skill Gaps",
        ...skillGaps.map((gap, index) => {
          const name = readField(gap, "SkillName", "skill_name") || `Gap ${index + 1}`;
          const current = readField(gap, "CurrentLevel", "current_level");
          const recommended = readField(
            gap,
            "RecommendedLevel",
            "recommended_level"
          );
          const importance = readField(gap, "Importance", "importance");
          const suggestion = readField(
            gap,
            "ImprovementSuggestions",
            "improvement_suggestions"
          );

          const level =
            current || recommended
              ? `Current ${current || "?"}/5 -> Target ${recommended || "?"}/5`
              : "";

          return [
            `**${index + 1}. ${name}**${importance ? ` (${importance})` : ""}`,
            level,
            suggestion,
          ]
            .filter(Boolean)
            .join("\n");
        }),
      ].join("\n\n")
    );
  }

  return sections.join("\n\n");
}

export default function CvPage() {
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cvId, setCvId] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");

  const [uploadCV, { isLoading: uploading }] = useUploadCVMutation();
  const [analyzeCV, { isLoading: analyzing }] = useAnalyzeCVMutation();
  const [startSession, { isLoading: startingSession }] =
    useStartSessionMutation();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const { data: chats = [], isLoading: chatsLoading, refetch } =
    useGetUserChatsQuery();
  const { data: selectedHistory, isFetching: historyLoading } =
    useGetChatHistoryQuery(
      { chat_id: selectedChat },
      { skip: selectedChat.length === 0 }
    );

  const cvChats = useMemo(() => {
    const payload = getPayloadData(chats);
    return toArray<CVChat>(Array.isArray(payload) ? payload : payload?.chats);
  }, [chats]);

  const historyMessages = useMemo(() => {
    const payload = getPayloadData(selectedHistory);
    const messages = toArray<ChatMessage>(payload?.messages);
    return [...messages, ...localMessages] as ChatMessage[];
  }, [localMessages, selectedHistory]);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setAnalysis("");

    try {
      const response = await uploadCV({
        rawText: file ? undefined : rawText.trim(),
        file: file || undefined,
      }).unwrap();
      const payload = getPayloadData(response);
      const newCvId = payload?.cvId || payload?.cv_id || "";
      setCvId(newCvId);
      if (newCvId) {
        const analysisResponse = await analyzeCV(newCvId).unwrap();
        setAnalysis(
          stringifySuggestion(getPayloadData(analysisResponse)?.suggestions)
        );
      }
      refetch();
    } catch (err: any) {
      setError(
        err?.data?.message ||
          err?.data?.error ||
          "Unable to upload or analyze the CV."
      );
    }
  };

  const openChat = async (chatId?: string) => {
    setError("");
    setLocalMessages([]);

    if (chatId) {
      setSelectedChat(chatId);
      return;
    }

    try {
      const response = await startSession({
        cv_id: cvId || undefined,
      }).unwrap();
      setSelectedChat(response.chat_id);
      refetch();
    } catch (err: any) {
      setError(
        err?.data?.message || err?.data?.error || "Unable to start CV chat."
      );
    }
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedChat || !draft.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: draft.trim(),
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((current) => [...current, userMessage]);
    setDraft("");

    try {
      const response = await sendMessage({
        chat_id: selectedChat,
        message: userMessage.content,
        cv_id: cvId || undefined,
      }).unwrap();
      setLocalMessages((current) => [
        ...current,
        {
          role: response.role || "assistant",
          content: response.content,
          timestamp: response.timestamp,
        },
      ]);
    } catch (err: any) {
      setError(
        err?.data?.message || err?.data?.error || "Unable to send message."
      );
    }
  };

  return (
    <AppShell
      eyebrow="CV Studio"
      title="Analyze, improve, and discuss your CV."
      description="Upload a PDF/DOCX or paste resume text, then get practical feedback and continue with a CV-aware chat."
      actions={
        <Link
          href="/course"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          Course suggestions
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Surface>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
                <Upload className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">Upload or paste CV</h2>
                <p className="text-sm text-slate-500">
                  Use one input at a time for the backend validator.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  CV file
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] || null);
                    if (event.target.files?.[0]) setRawText("");
                  }}
                  className="modern-input"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Or paste resume text
                </span>
                <textarea
                  value={rawText}
                  onChange={(event) => {
                    setRawText(event.target.value);
                    if (event.target.value) setFile(null);
                  }}
                  rows={8}
                  placeholder="Paste your education, experience, skills, and projects..."
                  className="modern-input resize-y"
                />
              </label>

              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={uploading || analyzing || (!file && !rawText.trim())}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white transition hover:bg-[#235553] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(uploading || analyzing) && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {uploading
                  ? "Uploading..."
                  : analyzing
                  ? "Analyzing..."
                  : "Upload and analyze"}
              </button>
            </form>
          </Surface>

          <Surface>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
                  <History className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black">CV chat history</h2>
                  <p className="text-sm text-slate-500">
                    Resume previous CV conversations and keep improving your profile.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openChat()}
                disabled={startingSession}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#183d3d] px-4 text-sm font-black text-white transition hover:bg-[#235553] disabled:opacity-60"
              >
                <MessageCircle className="size-4" />
                New chat
              </button>
            </div>

            {chatsLoading ? (
              <p className="text-sm text-slate-500">Loading chats...</p>
            ) : cvChats.length ? (
              <div className="space-y-2">
                {cvChats.map((chat) => (
                  <button
                    key={chat.chat_id}
                    type="button"
                    onClick={() => openChat(chat.chat_id)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#9ad5c8] hover:bg-white"
                  >
                    <p className="text-sm font-black text-slate-900">
                      {chat.messages?.at(-1)?.content?.slice(0, 80) ||
                        "CV conversation"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {chat.updated_at
                        ? new Date(chat.updated_at).toLocaleString()
                        : chat.chat_id}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No CV chats yet"
                description="Start a session after upload, or open a general CV chat right away."
              />
            )}
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
                <FileText className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">Analysis</h2>
                <p className="text-sm text-slate-500">
                  {cvId ? `Current CV ID: ${cvId}` : "Upload a CV to begin."}
                </p>
              </div>
            </div>

            {analysis ? (
              <div className="markdown-body rounded-lg bg-slate-50 p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysis}
                </ReactMarkdown>
              </div>
            ) : (
              <EmptyState
                title="Analysis will appear here"
                description="JobMate will summarize strengths, weaknesses, ATS improvements, and skill gaps after upload."
              />
            )}
          </Surface>

          <Surface className="min-h-[560px]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
                  <MessageCircle className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black">CV chat</h2>
                  <p className="text-sm text-slate-500">
                    {selectedChat || "Start or select a session."}
                  </p>
                </div>
              </div>
            </div>

            {!selectedChat ? (
              <EmptyState
                title="No active chat"
                description="Start a CV chat to ask about formatting, skills, missing keywords, or rewrite ideas."
              >
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white transition hover:bg-[#235553]"
                >
                  Start CV chat
                  <ArrowRight className="size-4" />
                </button>
              </EmptyState>
            ) : (
              <>
                <div className="flex h-[390px] flex-col gap-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                  {historyLoading && (
                    <p className="text-sm text-slate-500">Loading history...</p>
                  )}
                  {historyMessages.length === 0 && !historyLoading && (
                    <p className="text-sm text-slate-500">
                      Ask JobMate what to improve first.
                    </p>
                  )}
                  {historyMessages.map((message, index) => (
                    <div
                      key={`${message.timestamp || index}-${index}`}
                      className={
                        message.role === "user"
                          ? "ml-auto max-w-[86%] rounded-lg bg-[#183d3d] px-4 py-3 text-white"
                          : "mr-auto max-w-[86%] rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700"
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
                    placeholder="Ask how to improve your CV..."
                    className="modern-input"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#183d3d] text-white transition hover:bg-[#235553] disabled:opacity-60"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </button>
                </form>
              </>
            )}
          </Surface>
        </div>
      </div>
    </AppShell>
  );
}
