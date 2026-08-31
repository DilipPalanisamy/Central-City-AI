"use client";

import React from "react";
import Link from "next/link";
import { CentralReportButton } from "./CentralReportButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  Flame,
} from "lucide-react";

export interface HeroSectionProps {
  onOpenReportModal?: () => void;
  onSelectCategory?: (cat: any) => void;
}

export function HeroSection({
  onOpenReportModal,
  onSelectCategory,
}: HeroSectionProps) {
  return (
    <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
      {/* Subtle Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Autonomous Civic Technology Platform</span>
        </div>

        {/* 2. Main 4-Line Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          See the Problem.<br />
          <span className="text-cyan-400">AI Understands.</span><br />
          <span className="text-purple-400">Communities Verify.</span><br />
          <span className="text-emerald-400">Authorities Resolve.</span>
        </h1>

        {/* 2. Supporting Text */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Central-City-AI transforms civic problems into evidence-based, community-supported actions and connects them with the right authorities.
        </p>

        {/* 3. Central Prominent Circular Report Button */}
        <div className="pt-2 pb-4">
          <CentralReportButton onClick={onOpenReportModal} />
        </div>

        {/* Quick Features Row */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200">Photo-First AI Vision Triage</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-200">&ldquo;I&apos;m Affected&rdquo; Consensus</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200">Mandated SLA Resolution Proof</span>
          </div>
        </div>
      </div>
    </section>
  );
}
