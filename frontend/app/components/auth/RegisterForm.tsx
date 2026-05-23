"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";
import { useRequestOtpMutation } from "@/lib/redux/api/authApi";
import { useLanguage } from "@/providers/language-provider";
import {
  AuthCard,
  AuthError,
  AuthHeader,
  PrimaryAuthButton,
} from "./AuthShell";
import OTPForm from "./OTPForm";

export default function RegisterForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [requestOtp, { isLoading }] = useRequestOtpMutation();

  const passwordErrors = [
    password.length >= 8 ? "" : "8 characters",
    /[A-Z]/.test(password) ? "" : "1 uppercase letter",
    /[a-z]/.test(password) ? "" : "1 lowercase letter",
    /[0-9]/.test(password) ? "" : "1 number",
    /[!@#$%^&*]/.test(password) ? "" : "1 special character",
  ].filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordErrors.length) {
      setError(`Password needs ${passwordErrors.join(", ")}.`);
      return;
    }

    try {
      await requestOtp({ email }).unwrap();
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Try again.");
    }
  };

  if (step === "otp") {
    return (
      <OTPForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
      />
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        eyebrow="Create account"
        title={t("r_join")}
        description={t("r_create")}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthError>{error}</AuthError>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            icon={<User className="size-4" />}
            label={t("r_firstName")}
            value={firstName}
            onChange={setFirstName}
            name="firstName"
          />
          <Field
            icon={<User className="size-4" />}
            label={t("r_lastName")}
            value={lastName}
            onChange={setLastName}
            name="lastName"
          />
        </div>

        <Field
          icon={<Mail className="size-4" />}
          label={t("email")}
          value={email}
          onChange={setEmail}
          name="email"
          type="email"
        />

        <Field
          icon={<Lock className="size-4" />}
          label={t("password")}
          value={password}
          onChange={setPassword}
          name="password"
          type="password"
        />

        <PrimaryAuthButton disabled={isLoading}>
          {isLoading ? "Sending OTP..." : t("r_createAccount")}
        </PrimaryAuthButton>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
        {t("r_noAccount")}{" "}
        <Link href="/login" className="font-medium text-[var(--accent-green)]">
          {t("r_login")}
        </Link>
      </p>
    </AuthCard>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  name,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="modern-input modern-input-with-icon"
        />
      </span>
    </label>
  );
}
