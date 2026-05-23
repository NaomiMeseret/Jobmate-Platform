"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/lib/redux/api/authApi";
import { useLanguage } from "@/providers/language-provider";
import {
  AuthCard,
  AuthError,
  AuthHeader,
  PrimaryAuthButton,
} from "./AuthShell";

export default function OTPForm({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ firstName, lastName, email, password, otp }).unwrap();
      toast.success("Registered successfully. You can now log in.");
      router.push("/login");
    } catch {
      setError(t("otp_failed"));
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        eyebrow="Verification"
        title={t("otp_title")}
        description={`${t("otp_subtitle1")} ${email}. ${t("otp_subtitle2")}`}
      />

      <form onSubmit={handleRegister} className="space-y-4">
        {error && <AuthError>{error}</AuthError>}
        <input
          name="otp"
          type="text"
          inputMode="numeric"
          placeholder={t("otp_placeholder")}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="modern-input text-center text-xl font-black tracking-[0.4em]"
        />
        <PrimaryAuthButton disabled={isLoading}>
          {isLoading ? t("otp_verifying") : t("otp_button")}
        </PrimaryAuthButton>
      </form>
    </AuthCard>
  );
}
