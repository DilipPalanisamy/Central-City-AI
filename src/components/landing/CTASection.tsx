"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Camera, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export interface CTASectionProps {
  onOpenReportModal?: () => void;
}

export function CTASection({ onOpenReportModal }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-24 border-t border-slate-800/80 relative overflow-hidden">
      {/* Radiant Background Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Across All Municipal Wards</span>
        </div>

        {/* Exact Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Make Your City Better, One Report at a Time.
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Join thousands of citizens improving public safety, fixing infrastructure, and ensuring municipal responsiveness through evidence-based reporting.
        </p>

        {/* Exact Button: REPORT A PROBLEM */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Link href="/report" className="w-full sm:w-auto">
            <Button
              variant="glow"
              size="lg"
              onClick={onOpenReportModal}
              leftIcon={<Camera className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto text-xs sm:text-sm font-black uppercase tracking-wider px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
            >
              REPORT A PROBLEM
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
