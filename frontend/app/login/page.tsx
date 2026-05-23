import LoginForm from "../components/auth/LoginForm";
import { AuthPageShell } from "../components/auth/AuthShell";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={<div className="text-[var(--text-muted)]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
