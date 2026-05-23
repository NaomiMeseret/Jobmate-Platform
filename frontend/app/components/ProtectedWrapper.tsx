"use client";

import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";

interface ProtectedWrapperProps {
  children: React.ReactNode;
}

const unprotectedRoutes = ["/login", "/register", "/reset-password", "/"];

export default function ProtectedWrapper({ children }: ProtectedWrapperProps) {
  const reduxToken = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();
  const pathname = usePathname(); // ✅ declare before use

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || reduxToken;
    const cleanPath = pathname.split("?")[0]; // ✅ now safe

    if (!token && !unprotectedRoutes.includes(cleanPath)) {
      router.replace(`/login?redirect=${cleanPath}`);
      return;
    }

    if (token && ["/login", "/register", "/"].includes(cleanPath)) {
      router.replace("/dashboard");
      return;
    }

    setIsReady(true);
  }, [reduxToken, pathname, router]);

  if (!isReady)
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card px-8 py-6 text-center">
          <div className="glass-reflection opacity-70" />
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-green)]">
              JobMate
            </p>
            <h1 className="gradient-text mt-2 font-display text-3xl font-semibold">
              Loading your workspace
            </h1>
          </div>
        </div>
      </div>
    );

  return <>{children}</>;
}
