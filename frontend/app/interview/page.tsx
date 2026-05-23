"use client";

import Link from "next/link";
import {
  ArrowRight,
  History,
  MessageCircle,
  Mic,
  Rows3,
} from "lucide-react";
import { AppShell, Surface } from "../components/modern/AppShell";

const modes = [
  {
    title: "Free-form coaching",
    description:
      "Create a conversational interview room for general, technical, or behavioral practice.",
    href: "/interview/freefrom/session",
    icon: MessageCircle,
  },
  {
    title: "Structured interview",
    description:
      "Enter a field and answer AI-generated questions one by one with feedback.",
    href: "/interview/structured/field",
    icon: Rows3,
  },
  {
    title: "Free-form history",
    description: "Resume or review previous free-form interview sessions.",
    href: "/interview/freefrom/History/all",
    icon: History,
  },
  {
    title: "Structured history",
    description: "Continue saved structured interviews or inspect past answers.",
    href: "/interview/structured/history/all",
    icon: Mic,
  },
];

export default function Interview() {
  return (
    <AppShell
      eyebrow="Interview practice"
      title="Practice with the mode that matches your next interview."
      description="Choose open-ended coaching, structured question practice, or return to saved interview sessions."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Link
              key={mode.title}
              href={mode.href}
              className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#9ad5c8] hover:shadow-lg"
            >
              <span className="grid size-12 place-items-center rounded-lg bg-[#e8f3ef] text-[#155e51]">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-6 text-xl font-black text-slate-950">
                {mode.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {mode.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#1f6f60]">
                Open
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>

      <Surface className="mt-6">
        <h2 className="text-xl font-black">Practice tips</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "Answer out loud before typing to build fluency.",
            "Use STAR for behavioral answers: situation, task, action, result.",
            "Ask for another version of feedback when a response feels unclear.",
          ].map((tip) => (
            <div
              key={tip}
              className="rounded-lg border border-slate-200 bg-[#fbfcf8] p-4 text-sm font-semibold leading-6 text-slate-700"
            >
              {tip}
            </div>
          ))}
        </div>
      </Surface>
    </AppShell>
  );
}
