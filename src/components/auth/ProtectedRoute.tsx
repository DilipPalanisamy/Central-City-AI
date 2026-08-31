"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Loader2, Sparkles } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`;
      router.push(redirectUrl);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-100 space-y-4 font-sans">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="w-full h-full rounded-full flex items-center justify-center text-cyan-400">
            <Shield className="w-7 h-7" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <span className="text-sm font-black tracking-wider uppercase text-white">
            Verifying Google Session
          </span>
          <p className="text-xs text-slate-400">Central-City-AI Security Gateway</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
