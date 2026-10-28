"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <main className="page-enter flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 text-[var(--text-primary)]">
      <div className="w-full max-w-xl border-t border-[var(--border-strong)] pt-8 text-center">
        <p className="kicker-accent">Error 404</p>
        <h1 className="display mt-4 text-6xl md:text-7xl">Page not found</h1>
        <p className="lede mx-auto mt-4 max-w-md">
          The page you are looking for has moved or no longer exists. Head back
          to the start and pick up where you left off.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button onClick={() => router.push("/")}>Go home</Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
