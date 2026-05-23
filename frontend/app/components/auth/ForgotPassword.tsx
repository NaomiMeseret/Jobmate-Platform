"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRequestPasswordResetMutation } from "@/lib/redux/api/authApi";
import { useLanguage } from "@/providers/language-provider";
import { AuthHeader, PrimaryAuthButton } from "./AuthShell";

export default function ForgotPassword({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestReset({ email }).unwrap();
      toast.success("Password reset OTP sent to your email");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Failed to send reset OTP. Try again.");
    }
  };

  return (
    <>
      <AuthHeader
        eyebrow="Account recovery"
        title={t("f_title")}
        description="Enter your email and JobMate will send a reset code."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="modern-input"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)] px-4 text-base font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)]"
          >
            {t("cancel")}
          </button>
          <PrimaryAuthButton disabled={isLoading}>
            {isLoading ? t("sending") : t("sendOtp")}
          </PrimaryAuthButton>
        </div>
      </form>
    </>
  );
}
