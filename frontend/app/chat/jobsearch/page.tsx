"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Briefcase,
  ExternalLink,
  History,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import {
  useGetAllChatsQuery,
  useGetChatByIdQuery,
  useSendMsgMutation,
} from "@/lib/redux/api/JobApi";
import {
  AppShell,
  EmptyState,
  SectionHeader,
  Surface,
} from "@/app/components/modern/AppShell";
import { useLanguage } from "@/providers/language-provider";

type Job = {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  source?: string;
  link?: string;
  requirements?: string[];
};

type JobChatSummary = {
  id?: string;
  chat_id?: string;
  _id?: string;
  messages?: Array<{ role?: string; content?: string; message?: string }>;
  updated_at?: string;
};

type ThreadMessage = {
  role: "user" | "assistant";
  content: string;
  jobs?: Job[];
};

function getPayloadData(value: any) {
  return value?.data || value;
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function getChatId(chat: JobChatSummary) {
  return chat.chat_id || chat.id || chat._id || "";
}

function normalizeJob(job: any): Job {
  return {
    title: job?.title || job?.Title || "",
    company: job?.company || job?.Company || "",
    location: job?.location || job?.Location || "",
    type: job?.type || job?.Type || "",
    source: job?.source || job?.Source || "",
    link: job?.link || job?.Link || "",
    requirements: toArray<string>(job?.requirements || job?.Requirements),
  };
}

function normalizeJobs(value: unknown): Job[] {
  return toArray<any>(value)
    .map(normalizeJob)
    .filter(
      (job) =>
        job.title ||
        job.company ||
        job.location ||
        job.link ||
        (job.requirements?.length ?? 0) > 0
    );
}

function normalizeHistory(chat: any): ThreadMessage[] {
  const payload = getPayloadData(chat);
  const messages = toArray<any>(payload?.messages || payload?.Messages);
  const rootJobs = normalizeJobs(
    payload?.job_results || payload?.JobResults || payload?.jobs || payload?.Jobs
  );
  const lastAssistantIndex = messages.findLastIndex(
    (message: any) => message.role !== "user"
  );

  return messages.map((message: any, index) => {
    const messageJobs = normalizeJobs(message.jobs || message.Jobs);
    return {
      role: message.role === "user" ? "user" : "assistant",
      content: message.content || message.message || "",
      jobs:
        messageJobs.length > 0
          ? messageJobs
          : index === lastAssistantIndex
          ? rootJobs
          : [],
    };
  });
}

const copy = {
  en: {
    eyebrow: "Job Search",
    title: "Find relevant roles by chatting naturally.",
    description:
      "Tell JobMate what you are looking for, then review matched roles and saved search conversations.",
    welcome:
      "Tell me the role, location, work style, and skills you want. Example: remote junior frontend jobs using React.",
    found: "I found a few roles to review.",
    error: "I could not reach job search right now. Please try again in a moment.",
    savedTitle: "Saved searches",
    savedDesc: "Continue previous job search conversations.",
    loading: "Loading job chats...",
    defaultChat: "Job search",
    emptyTitle: "No saved job chats",
    emptyDesc: "Send your first search prompt and JobMate will save the thread.",
    assistantTitle: "Job assistant",
    newSearch: "New search",
    untitled: "Untitled role",
    companyMissing: "Company not listed",
    locationFlexible: "Location flexible",
    view: "View",
    placeholder: "Try: remote backend jobs for Go and MongoDB...",
    searchJobs: "Search jobs",
  },
  am: {
    eyebrow: "የስራ ፍለጋ",
    title: "በተፈጥሯዊ ውይይት ተዛማጅ ስራዎችን ያግኙ።",
    description: "ምን እየፈለጉ እንደሆነ ለJobMate ይንገሩ፣ ከዚያ የተገኙ ስራዎችን እና የተቀመጡ ውይይቶችን ይመልከቱ።",
    welcome: "የሚፈልጉትን ሚና፣ ቦታ፣ የስራ አይነት እና ክህሎቶች ይንገሩኝ። ምሳሌ፦ React የሚጠቀሙ የርቀት junior frontend ስራዎች።",
    found: "ለመመልከት ጥቂት ስራዎችን አገኘሁ።",
    error: "የስራ ፍለጋን አሁን መድረስ አልተቻለም። እባክዎ በኋላ ይሞክሩ።",
    savedTitle: "የተቀመጡ ፍለጋዎች",
    savedDesc: "ያለፉ የስራ ፍለጋ ውይይቶችን ይቀጥሉ።",
    loading: "የስራ ውይይቶች በመጫን ላይ...",
    defaultChat: "የስራ ፍለጋ",
    emptyTitle: "የተቀመጠ የስራ ውይይት የለም",
    emptyDesc: "የመጀመሪያ የፍለጋ ጥያቄዎን ይላኩ እና JobMate ውይይቱን ያስቀምጣል።",
    assistantTitle: "የስራ ረዳት",
    newSearch: "አዲስ ፍለጋ",
    untitled: "ርዕስ የሌለው ስራ",
    companyMissing: "ኩባንያ አልተጠቀሰም",
    locationFlexible: "ቦታ ተለዋዋጭ ነው",
    view: "ይመልከቱ",
    placeholder: "ምሳሌ፦ ለGo እና MongoDB የርቀት backend ስራዎች...",
    searchJobs: "ስራዎችን ፈልግ",
  },
};

export default function JobSearch() {
  const { language } = useLanguage();
  const c = copy[language];
  const [selectedChatId, setSelectedChatId] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ThreadMessage[]>([
    {
      role: "assistant",
      content: c.welcome,
    },
  ]);
  const [sendMsg, { isLoading: sending }] = useSendMsgMutation();
  const { data: chats = [], isLoading: chatsLoading, refetch } =
    useGetAllChatsQuery({});
  const { data: selectedChat } = useGetChatByIdQuery(selectedChatId, {
    skip: !selectedChatId,
  });

  const jobChats = useMemo(() => {
    const payload = getPayloadData(chats);
    return toArray<JobChatSummary>(
      Array.isArray(payload) ? payload : payload?.chats
    );
  }, [chats]);

  const visibleMessages = useMemo(() => {
    const history = normalizeHistory(selectedChat);
    return history.length ? history : messages;
  }, [messages, selectedChat]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;

    const userMessage: ThreadMessage = { role: "user", content: draft.trim() };
    setMessages((current) => [...current, userMessage]);
    setDraft("");

    try {
      const response = await sendMsg({
        message: userMessage.content,
        chat_id: selectedChatId || undefined,
      }).unwrap();
      setSelectedChatId(response.chat_id || selectedChatId);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.message || c.found,
          jobs: normalizeJobs(response.jobs),
        },
      ]);
      refetch();
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: c.error,
        },
      ]);
    }
  };

  return (
    <AppShell
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
    >
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Surface>
          <SectionHeader
            icon={<History className="size-4" />}
            title={c.savedTitle}
            description={c.savedDesc}
          />
          {chatsLoading ? (
            <p className="muted">{c.loading}</p>
          ) : jobChats.length ? (
            <div className="space-y-2">
              {jobChats.map((chat) => {
                const chatId = getChatId(chat);
                const last = chat.messages?.at(-1);
                return (
                  <button
                    key={chatId}
                    type="button"
                    onClick={() => setSelectedChatId(chatId)}
                    className={
                      chatId === selectedChatId
                        ? "w-full rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-3 text-left"
                        : "w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-3 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]"
                    }
                  >
                    <p className="truncate text-sm font-medium">
                      {(last?.content || last?.message || c.defaultChat).slice(
                        0,
                        90
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {chat.updated_at
                        ? new Date(chat.updated_at).toLocaleString()
                        : chatId}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <EmptyState title={c.emptyTitle} description={c.emptyDesc} />
          )}
        </Surface>

        <Surface className="min-h-[700px]">
          <SectionHeader
            icon={<Briefcase className="size-4" />}
            title={c.assistantTitle}
            description={selectedChatId || c.newSearch}
          />

          <div className="chat-panel h-[520px]">
            {visibleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "chat-user"
                    : "chat-assistant w-full max-w-[92%]"
                }
              >
                <div className="markdown-body text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.jobs?.length ? (
                  <div className="mt-4 grid gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      {message.jobs.length} matched{" "}
                      {message.jobs.length === 1 ? "role" : "roles"}
                    </p>
                    {message.jobs.map((job, jobIndex) => (
                      <article
                        key={`${job.title}-${jobIndex}`}
                        className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold">
                              {job.title || c.untitled}
                            </h3>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                              {job.company || c.companyMissing}
                            </p>
                            <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                              <MapPin className="size-3" />
                              {job.location || c.locationFlexible}
                            </p>
                          </div>
                          {job.link && (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-primary btn-sm shrink-0"
                            >
                              {c.view}
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.type && (
                            <span className="rounded border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                              {job.type}
                            </span>
                          )}
                          {job.source && (
                            <span className="rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                              {job.source}
                            </span>
                          )}
                          {job.requirements?.slice(0, 5).map((req) => (
                            <span
                              key={req}
                              className="rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={c.placeholder}
              className="input"
              aria-label={c.searchJobs}
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="btn-primary size-10 shrink-0 !px-0"
              aria-label={c.searchJobs}
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </form>
        </Surface>
      </div>
    </AppShell>
  );
}
