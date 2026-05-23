"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/lib/redux/api/authApi";
import { useLanguage } from "@/providers/language-provider";
import { AuthCard, AuthHeader, PrimaryAuthButton } from "./AuthShell";

export default function ResetPassword() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email, otp, new_password }).unwrap();
      toast.success("Password reset successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to reset password. Check your OTP and try again.");
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        eyebrow="Secure reset"
        title={t("reset_title")}
        description="Use the OTP from your email and choose a stronger password."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="modern-input"
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="modern-input"
        />
        <input
          type="password"
          placeholder={t("password")}
          value={new_password}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="modern-input"
        />
        <PrimaryAuthButton disabled={isLoading}>
          {isLoading ? t("sending") : t("resetBtn")}
        </PrimaryAuthButton>
      </form>
    </AuthCard>
  );
}
