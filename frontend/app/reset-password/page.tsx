"use client";
import React, { Suspense } from "react";
import { AuthPageShell } from "../components/auth/AuthShell";
import ResetPassword from "../components/auth/ResetPassword";

const page = () => {
  return (
    <AuthPageShell>
      <Suspense fallback={<div className="text-[var(--text-muted)]">Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </AuthPageShell>
  );
};

export default page;
