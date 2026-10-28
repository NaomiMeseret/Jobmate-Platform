"use client";

import { FcGoogle } from "react-icons/fc";
import { API_BASE_URL } from "@/lib/redux/api/baseQuery";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth/google/login`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="btn-secondary h-11 w-full"
    >
      <FcGoogle className="size-5" />
      <span>Continue with Google</span>
    </button>
  );
}
