"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Lock,
  Globe,
} from "lucide-react";

// Official Google "G" Multi-Color Vector SVG Icon
export function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { loginWithGoogle, isAuthenticated, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect automatically
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);

    try {
      await loginWithGoogle();
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Google Sign in failure:", error);
      if (error?.type !== "popup_closed") {
        setErrorMessage(
          error.message || "Failed to complete Google authentication. Please try again."
        );
      }
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Top Bar with Return Link */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Google Identity Services</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md w-full mx-auto px-4 py-8 relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Civic Login</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            CENTRAL-CITY-AI
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            &ldquo;Your community. Your voice. Your city.&rdquo;
          </p>
        </div>

        {/* Auth Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1.5 pb-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-cyan-400 shadow-inner">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-base font-bold text-white pt-2">
              Citizen Authentication
            </h2>
            <p className="text-xs text-slate-400">
              Sign in to report hazards, verify civic repairs, and track resolutions.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* PROMINENT GOOGLE AUTHENTICATION BUTTON */}
          <div className="space-y-4 pt-2">
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Subtext */}
            <p className="text-center text-xs text-slate-400">
              Sign in securely with your Google account.
            </p>
          </div>

          {/* Features Highlights */}
          <div className="border-t border-slate-800/80 pt-5 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero passwords to remember or reset</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Instant civic karma &amp; verified reporter status</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Direct Google Identity Services OAuth 2.0</span>
            </div>
          </div>
        </div>

        {/* Terms and Privacy Footnote */}
        <p className="text-center text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
          By continuing with Google, you agree to Central-City-AI&apos;s Civic Terms of Service and Privacy Policy.
        </p>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 py-6 relative z-10 text-center text-xs text-slate-500">
        © 2026 Central-City-AI. Autonomous Civic Intelligence Platform.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
