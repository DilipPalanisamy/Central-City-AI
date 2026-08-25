"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";

export default function RootEntryPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

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
          CENTRAL-CITY-AI
        </span>
        <p className="text-xs text-slate-400">Redirecting to Secure Gateway...</p>
      </div>
    </div>
  );
}
