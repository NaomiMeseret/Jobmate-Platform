"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
import {
  AppShell,
  EmptyState,
  SectionHeader,
  Surface,
} from "../components/modern/AppShell";

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
        <Link href="/course" className="btn-secondary">
          Course suggestions
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Surface>
            <SectionHeader
              icon={<Upload className="size-4" />}
              title="Upload or paste CV"
              description="Use one input at a time for the backend validator."
            />

            <form onSubmit={handleUpload} className="space-y-4">
              <label className="block">
                <span className="field-label">CV file</span>
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] || null);
                    if (event.target.files?.[0]) setRawText("");
                  }}
                  className="input"
                />
              </label>

              <label className="block">
                <span className="field-label">Or paste resume text</span>
                <textarea
                  value={rawText}
                  onChange={(event) => {
                    setRawText(event.target.value);
                    if (event.target.value) setFile(null);
                  }}
                  rows={8}
                  placeholder="Paste your education, experience, skills, and projects..."
                  className="input resize-y"
                />
              </label>

              {error && <p className="alert-error">{error}</p>}

              <button
                type="submit"
                disabled={uploading || analyzing || (!file && !rawText.trim())}
                className="btn-primary h-11 w-full"
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
            <SectionHeader
              icon={<History className="size-4" />}
              title="CV chat history"
              description="Resume previous CV conversations and keep improving your profile."
              action={
                <button
                  type="button"
                  onClick={() => openChat()}
                  disabled={startingSession}
                  className="btn-secondary btn-sm"
                >
                  <MessageCircle className="size-4" />
                  New chat
                </button>
              }
            />

            {chatsLoading ? (
              <p className="muted">Loading chats...</p>
            ) : cvChats.length ? (
              <div className="space-y-2">
                {cvChats.map((chat) => (
                  <button
                    key={chat.chat_id}
                    type="button"
                    onClick={() => openChat(chat.chat_id)}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-3 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]"
                  >
                    <p className="truncate text-sm font-medium">
                      {chat.messages?.at(-1)?.content?.slice(0, 80) ||
                        "CV conversation"}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
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
            <SectionHeader
              icon={<FileText className="size-4" />}
              title="Analysis"
              description={
                cvId ? `Current CV ID: ${cvId}` : "Upload a CV to begin."
              }
            />

            {analysis ? (
              <div className="markdown-body rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
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
            <SectionHeader
              icon={<MessageCircle className="size-4" />}
              title="CV chat"
              description={selectedChat || "Start or select a session."}
            />

            {!selectedChat ? (
              <EmptyState
                title="No active chat"
                description="Start a CV chat to ask about formatting, skills, missing keywords, or rewrite ideas."
              >
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="btn-primary"
                >
                  Start CV chat
                  <ArrowRight className="size-4" />
                </button>
              </EmptyState>
            ) : (
              <>
                <div className="chat-panel h-[390px]">
                  {historyLoading && (
                    <p className="text-sm text-[var(--text-muted)]">
                      Loading history...
                    </p>
                  )}
                  {historyMessages.length === 0 && !historyLoading && (
                    <p className="text-sm text-[var(--text-muted)]">
                      Ask JobMate what to improve first.
                    </p>
                  )}
                  {historyMessages.map((message, index) => (
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
                    placeholder="Ask how to improve your CV..."
                    className="input"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="btn-primary size-10 shrink-0 !px-0"
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
