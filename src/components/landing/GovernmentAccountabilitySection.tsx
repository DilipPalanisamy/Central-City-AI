"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  CheckCircle2,
  Camera,
  ArrowRight,
  Check,
  Building2,
  Lock,
} from "lucide-react";

export function GovernmentAccountabilitySection() {
  return (
    <section id="accountability" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-emerald-glow">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Civic Integrity</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Government Accountability & Resolution Proof
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Central-City-AI eliminates ghost resolutions. Municipal officials must upload photographic resolution evidence before any issue can be marked resolved on the public civic ledger.
          </p>
        </div>

        {/* Before / After Visual Showcase Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-glass space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                CC-2026-8945
              </span>
              <Badge variant="emerald" size="sm">
                RESOLUTION PROOF MANDATE
              </Badge>
            </div>

            <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>SLA Met: 13.2h / 24h</span>
            </span>
          </div>

          {/* Simple Before / After Visual Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Before Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  1. Before (Citizen Hazard Report)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Initial Defect</span>
              </div>

              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-rose-500/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80"
                  alt="Streetlight fault before repair"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                  Broken Streetlight Outage
                </span>
              </div>
            </div>

            {/* After Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  2. After (Official Resolution Evidence)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">Verified Proof</span>
              </div>

              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/50 shadow-emerald-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80"
                  alt="Streetlight repaired after"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Restored &amp; Photographed</span>
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Footer Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">
                Two-Way Verification Protocol
              </span>
              <p className="text-slate-400 text-[11px]">
                Once officials upload proof, local citizens are prompted: &quot;Is the problem actually fixed?&quot; If defective, the work order is automatically reopened.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="cyan" size="sm">
                No Ghost Closures
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
