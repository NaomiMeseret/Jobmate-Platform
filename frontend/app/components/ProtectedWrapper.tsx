"use client";

import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { BrandMark } from "./modern/AppShell";

interface ProtectedWrapperProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/register", "/reset-password", "/"];

function isPublicRoute(path: string) {
  return PUBLIC_ROUTES.some((route) =>
    route === "/" ? path === "/" : path === route || path.startsWith(`${route}/`)
  );
}

export default function ProtectedWrapper({ children }: ProtectedWrapperProps) {
  const reduxToken = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);

  const cleanPath = pathname ? pathname.split("?")[0] : "";
  const publicRoute = isPublicRoute(cleanPath);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || reduxToken;

    if (!token && !publicRoute) {
      router.replace(`/login?redirect=${cleanPath}`);
      return;
    }

    if (token && ["/login", "/register", "/"].includes(cleanPath)) {
      router.replace("/dashboard");
      return;
    }

    setChecked(true);
  }, [reduxToken, cleanPath, publicRoute, router]);

  // Public routes render on the server. Waiting for the token check here would
  // ship an empty document and flash a loading screen on every page load.
  if (publicRoute) return <>{children}</>;

  if (!checked)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg-base)] px-4">
        <BrandMark />
        <p className="text-sm text-[var(--text-muted)]">
          Loading your workspace...
        </p>
      </div>
    );

  return <>{children}</>;
}
