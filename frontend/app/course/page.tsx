"use client";

import Link from "next/link";
import { BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { useGetSuggestionsQuery } from "@/lib/redux/api/cvApi";
import { AppShell, EmptyState, Surface } from "../components/modern/AppShell";
import { useLanguage } from "@/providers/language-provider";

type Course = {
  Title?: string;
  Provider?: string;
  URL?: string;
  Description?: string;
  Skill?: string;
};

function getCourses(data: any): Course[] {
  const suggestions = data?.data?.suggestions || data?.suggestions || {};
  return (
    suggestions.Courses ||
    suggestions.courses ||
    suggestions.CourseSuggestions ||
    []
  );
}

const copy = {
  en: {
    eyebrow: "Course suggestions",
    title: "Turn CV feedback into a learning plan.",
    description:
      "Use your latest CV analysis to find learning resources that close the most important skill gaps.",
    loading: "Loading suggestions...",
    noCv: "No analyzed CV found",
    analyzeFirst: "Analyze your CV first",
    noCvDesc:
      "Upload and analyze your CV in CV Studio, then come back for course recommendations based on your skill gaps.",
    openCv: "Open CV Studio",
    errorTitle: "Could not load suggestions",
    errorDesc: "The server returned an error while generating course suggestions.",
    retry: "Retry",
    open: "Open",
    recommended: "Recommended course",
    provider: "Learning provider",
    skill: "Skill",
    noDescription: "Course description was not included by the suggestion service.",
    emptyTitle: "No courses returned",
    emptyDesc:
      "Try re-analyzing your CV or adding more details about your skills and goals.",
  },
  am: {
    eyebrow: "የኮርስ ምክሮች",
    title: "የCV ግብረመልስን ወደ የትምህርት ዕቅድ ይቀይሩ።",
    description: "የቅርብ ጊዜ CV ትንታኔዎን በመጠቀም ዋና የክህሎት ክፍተቶችን የሚዘጉ የትምህርት ሀብቶችን ያግኙ።",
    loading: "ምክሮች በመጫን ላይ...",
    noCv: "የተተነተነ CV አልተገኘም",
    analyzeFirst: "መጀመሪያ CVዎን ይተንትኑ",
    noCvDesc: "CVዎን በCV ስቱዲዮ ይስቀሉ እና ይተንትኑ፣ ከዚያ በክህሎት ክፍተቶችዎ መሰረት የኮርስ ምክሮችን ለማግኘት ይመለሱ።",
    openCv: "CV ስቱዲዮ ክፈት",
    errorTitle: "ምክሮችን መጫን አልተቻለም",
    errorDesc: "የኮርስ ምክሮችን ሲፈጥር አገልጋዩ ስህተት መለሰ።",
    retry: "ደግመው ይሞክሩ",
    open: "ክፈት",
    recommended: "የተመከረ ኮርስ",
    provider: "የትምህርት አቅራቢ",
    skill: "ክህሎት",
    noDescription: "የኮርሱ መግለጫ በምክር አገልግሎቱ አልተካተተም።",
    emptyTitle: "ምንም ኮርስ አልተመለሰም",
    emptyDesc: "CVዎን ደግመው ይተንትኑ ወይም ስለ ክህሎቶችዎ እና ግቦችዎ ተጨማሪ ዝርዝር ያክሉ።",
  },
};

export default function Page() {
  const { language } = useLanguage();
  const c = copy[language];
  const { data, error, isLoading, refetch } = useGetSuggestionsQuery();
  const courses = getCourses(data);
  const status = error && "status" in error ? error.status : undefined;

  return (
    <AppShell
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
    >
      <Surface>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            {c.loading}
          </div>
        ) : status === 404 || status === 400 ? (
          <EmptyState
            title={status === 404 ? c.noCv : c.analyzeFirst}
            description={c.noCvDesc}
          >
            <Link
              href="/cv"
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              {c.openCv}
            </Link>
          </EmptyState>
        ) : error ? (
          <EmptyState
            title={c.errorTitle}
            description={c.errorDesc}
          >
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-11 items-center rounded-lg bg-[#183d3d] px-5 text-sm font-black text-white"
            >
              {c.retry}
            </button>
          </EmptyState>
        ) : courses.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course, index) => (
              <article
                key={`${course.Title || "course"}-${index}`}
                className="rounded-lg border border-slate-200 bg-[#fbfcf8] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
                    <BookOpen className="size-5" />
                  </span>
                  {course.URL && (
                    <a
                      href={course.URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      {c.open}
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                <h2 className="mt-5 text-lg font-black text-slate-950">
                  {course.Title || c.recommended}
                </h2>
                <p className="mt-2 text-sm font-bold text-[#1f6f60]">
                  {course.Provider || c.provider}
                </p>
                {course.Skill && (
                  <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600">
                    {c.skill}: {course.Skill}
                  </p>
                )}
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {course.Description ||
                    c.noDescription}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={c.emptyTitle}
            description={c.emptyDesc}
          />
        )}
      </Surface>
    </AppShell>
  );
}
