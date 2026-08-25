"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, Plus, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CentralReportButtonProps {
  onClick?: () => void;
  className?: string;
}

export function CentralReportButton({ onClick, className }: CentralReportButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("relative flex flex-col items-center justify-center my-6 group", className)}>
      {/* Outer Glow */}
      <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-emerald-500/20 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Subtle outer pulsing ring */}
      <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-cyan-500/20 animate-ping pointer-events-none opacity-30 [animation-duration:3s]" />
      <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-cyan-500/30 animate-pulse pointer-events-none opacity-40" />

      {/* Main Large Circular Button */}
      <Link href="/report" onClick={onClick}>
        <button
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-slate-950 p-1.5 shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-500/40"
        >
          {/* Glowing Border Ring */}
          <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-emerald-400 shadow-cyan-glow group-hover:shadow-emerald-glow transition-all duration-300">
            {/* Inner Button Surface */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-3 text-center border border-white/10 overflow-hidden relative">
              {/* + / Camera Icon Badge */}
              <div className="relative mb-2">
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/30 group-hover:rotate-6 transition-transform duration-300">
                  <div className="flex items-center gap-0.5">
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Exact Text: REPORT A PROBLEM */}
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors leading-tight">
                REPORT<br />A PROBLEM
              </span>

              {/* Subtle AI Scan Label */}
              <span className="text-[10px] text-cyan-400 font-mono font-semibold mt-1 flex items-center gap-1 opacity-90">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI Powered</span>
              </span>
            </div>
          </div>
        </button>
      </Link>

      {/* Pill Badge Below Button */}
      <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-glass text-xs text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">Click to Upload Photo First</span>
        <span className="text-slate-500">•</span>
        <span className="text-cyan-400 font-mono text-[11px]">Instant AI Triage</span>
      </div>
    </div>
  );
}
