"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/lib/redux/api/authApi";
import { setCredentials } from "@/lib/redux/authSlice";
import { useLanguage } from "@/providers/language-provider";
import ForgotPassword from "./ForgotPassword";
import GoogleLoginButton from "./GoogleLoginBtn";
import {
  AuthCard,
  AuthError,
  AuthHeader,
  PrimaryAuthButton,
} from "./AuthShell";

export default function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const callbackHandled = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (callbackHandled.current) return;
    callbackHandled.current = true;

    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        dispatch(setCredentials({ user, accessToken: token }));
        toast.success("Logged in with Google");
        router.replace(redirect);
      } catch {
        setError("Unable to finish Google login. Please try again.");
      }
    }
  }, [dispatch, redirect, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.user.acces_token,
        })
      );
      toast.success("Logged in successfully");
      router.push(redirect);
    } catch (err: any) {
      setError(
        err?.data?.error ||
          err?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <AuthCard>
      {showForgotPassword ? (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      ) : (
        <>
          <AuthHeader
            eyebrow="Sign in"
            title={t("l_welcome")}
            description={t("l_subtitle")}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <AuthError>{error}</AuthError>}

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                {t("email")}
              </span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="modern-input modern-input-with-icon"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                {t("password")}
              </span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="modern-input modern-input-with-icon"
                />
              </span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm font-medium text-[var(--accent-green)] hover:underline"
            >
              {t("l_forgotPassword") || "Forgot password?"}
            </button>

            <PrimaryAuthButton disabled={isLoading}>
              {isLoading ? t("l_signingIn") : t("l_signIn")}
            </PrimaryAuthButton>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-medium uppercase text-[var(--text-muted)]">
              or
            </span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <GoogleLoginButton />

          <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
            {t("l_noAccount")}{" "}
            <Link href="/register" className="font-medium text-[var(--accent-green)]">
              {t("l_register")}
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
