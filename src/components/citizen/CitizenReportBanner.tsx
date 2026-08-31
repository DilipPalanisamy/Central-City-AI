"use client";

import React from "react";
import Link from "next/link";
import { Camera, Sparkles, Plus, ArrowRight } from "lucide-react";

export interface CitizenReportBannerProps {
  onOpenReportModal?: () => void;
}

export function CitizenReportBanner({ onOpenReportModal }: CitizenReportBannerProps) {
  return (
    <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center space-y-6">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[220px] bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Large Circular Central Report Button */}
      <div className="relative z-10 group">
        <Link href="/report" onClick={onOpenReportModal}>
          <button
            type="button"
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-950 p-1.5 shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-emerald-400 shadow-cyan-glow group-hover:shadow-emerald-glow transition-all duration-300">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-3 text-center border border-white/10 overflow-hidden relative">
                {/* 📷 Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/30 group-hover:rotate-6 transition-transform duration-300 mb-1.5">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>

                {/* Exact Text: REPORT A PROBLEM */}
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors leading-tight">
                  REPORT<br />A PROBLEM
                </span>

                <span className="text-[9px] text-cyan-400 font-mono font-semibold mt-0.5 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI Triage</span>
                </span>
              </div>
            </div>
          </button>
        </Link>
      </div>

      {/* Subtitle */}
      <div className="relative z-10 space-y-1 max-w-md">
        <p className="text-sm font-medium text-slate-200">
          Upload evidence and let AI assess the issue.
        </p>
        <p className="text-xs text-slate-400">
          Photo-first reporting • Automated duplicate detection • Fast-track SLA escalation
        </p>
      </div>
    </div>
  );
}
