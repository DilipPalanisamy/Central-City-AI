"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCivicStore } from "@/lib/mockStore";
import {
  Users,
  MapPin,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export function CommunityVerificationSection() {
  const { addToast } = useCivicStore();
  const [isAffected, setIsAffected] = useState(false);
  const [affectedCount, setAffectedCount] = useState(4);
  const threshold = 5;

  const handleToggleAffected = () => {
    if (!isAffected) {
      setIsAffected(true);
      setAffectedCount((prev) => prev + 1);
      addToast(
        "Impact Signal Registered (+15 Karma)",
        "Your 'I'M AFFECTED' signal has reached 5/5! Threshold met for fast-track dispatch.",
        "success"
      );
    } else {
      setIsAffected(false);
      setAffectedCount((prev) => prev - 1);
    }
  };

  const progressPercent = Math.min(100, Math.round((affectedCount / threshold) * 100));

  return (
    <section id="community" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-purple-glow">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Democratic Civic Power</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Community Discovery & Collective Impact
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Citizens can discover existing civic problems in their neighborhood and select <strong className="text-purple-300 font-bold">&ldquo;I&apos;m Affected&rdquo;</strong> to amplify the issue&apos;s urgency. Each signal moves the complaint closer to autonomous government escalation.
          </p>
        </div>

        {/* Mock Issue Card Showcase */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-purple-500/40 shadow-2xl space-y-6">
          {/* Mock Issue Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                CC-2026-8942
              </span>
              <Badge variant="rose" size="sm">
                HIGH PRIORITY
              </Badge>
              <Badge variant="cyan" size="sm">
                AI Vision 94%
              </Badge>
            </div>

            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Target SLA: 6 Hours
            </span>
          </div>

          {/* Issue Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
                alt="Deep road pothole"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-8 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                Deep Hazardous Pothole on High-Speed Transit Lane
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Avinashipalayam, Near Main Junction • Ward 14</span>
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crater-like pothole expanding near the bus lane. Vehicles are swerving into incoming traffic to avoid damage.
              </p>
            </div>
          </div>

          {/* Threshold Quorum Progress */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Democratic Escalation Quorum</span>
              </span>
              <span className="font-mono text-purple-300">
                {affectedCount} / {threshold} Affected Citizens ({progressPercent}%)
              </span>
            </div>

            <ProgressBar
              value={progressPercent}
              variant={affectedCount >= threshold ? "rose" : "indigo"}
              size="md"
              showPercentage={false}
            />

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                {affectedCount >= threshold
                  ? "🚨 THRESHOLD REACHED: Auto-escalated to Department of Roads!"
                  : `Need ${threshold - affectedCount} more affected citizen signature to auto-escalate.`}
              </span>
            </div>
          </div>

          {/* Primary Action Button: "I'M AFFECTED" */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400">
              <span>Click to simulate marking yourself affected in this neighborhood.</span>
            </div>

            <button
              type="button"
              onClick={handleToggleAffected}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border ${
                isAffected
                  ? "bg-purple-600 border-purple-400 text-white shadow-purple-glow"
                  : "bg-slate-900 hover:bg-purple-950/60 border-purple-500/40 text-purple-300 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isAffected ? "✓ You Marked: I'M AFFECTED" : "I'M AFFECTED"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
