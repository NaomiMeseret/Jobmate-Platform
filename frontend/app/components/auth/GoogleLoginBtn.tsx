"use client";
import { FcGoogle } from "react-icons/fc";
import { API_BASE_URL } from "@/lib/redux/api/baseQuery";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "@/lib/redux/authSlice";
// import toast from "react-hot-toast";

export default function GoogleLoginButton() {
  // const router = useRouter();
  // const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth/google/login`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)] text-base font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)]"
    >
      <FcGoogle size={20} />
      <span>Continue with Google</span>
    </button>
  );
}
