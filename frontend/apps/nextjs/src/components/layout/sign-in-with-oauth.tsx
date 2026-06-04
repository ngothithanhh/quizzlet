"use client";

import GoogleIcon from "../icons/google";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/quizzlet";

export default function SignInWithOauth() {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <GoogleIcon className="h-4 w-4" />
      Tiếp tục với Google
    </button>
  );
}
