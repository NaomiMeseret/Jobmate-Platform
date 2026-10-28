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
import { Stagger, StaggerItem, TiltSurface } from "../components/modern/motion";

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
      <Stagger className="grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <StaggerItem key={mode.title} className="h-full">
              <TiltSurface className="h-full bg-[var(--bg-surface)]">
                <Link
                  href={mode.href}
                  className="group flex h-full items-start gap-4 p-5 transition-colors hover:bg-[var(--bg-surface-hover)]"
                >
                  <span className="icon-box">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-sm font-semibold">{mode.title}</h2>
                      <ArrowRight className="size-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                      {mode.description}
                    </p>
                  </div>
                </Link>
              </TiltSurface>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Surface className="mt-6">
        <h2 className="text-base font-semibold">Practice tips</h2>
        <Stagger className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-muted)] md:grid-cols-3">
          <StaggerItem>
            <article className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
              Answer out loud before typing to build fluency.
            </article>
          </StaggerItem>
          <StaggerItem>
            <article className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
              Use STAR for behavioral answers: situation, task, action, result.
            </article>
          </StaggerItem>
          <StaggerItem>
            <article className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
              Ask for another version of feedback when a response feels unclear.
            </article>
          </StaggerItem>
        </Stagger>
      </Surface>
    </AppShell>
  );
}
