"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Flame,
  Users,
  AlertTriangle,
  Zap,
  Building2,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function SmartEscalationSection() {
  const escalationSteps = [
    {
      step: "01",
      title: "AI Priority",
      icon: Flame,
      color: "text-cyan-400",
      border: "border-cyan-500/40",
      bg: "bg-cyan-950/20",
      description: "Computer vision evaluates defect danger and assigns initial priority weight (LOW, MEDIUM, HIGH, CRITICAL).",
    },
    {
      step: "02",
      title: "Community Support",
      icon: Users,
      color: "text-purple-400",
      border: "border-purple-500/40",
      bg: "bg-purple-950/20",
      description: "Nearby residents discover the issue and signal collective impact using the \"I'm Affected\" button.",
    },
    {
      step: "03",
      title: "Threshold Reached",
      icon: AlertTriangle,
      color: "text-rose-400",
      border: "border-rose-500/40",
      bg: "bg-rose-950/20",
      description: "When the required affected citizen quorum is reached (e.g. 5/5 signatures), democratic consensus locks.",
    },
    {
      step: "04",
      title: "Automatic Escalation",
      icon: Zap,
      color: "text-amber-400",
      border: "border-amber-500/40",
      bg: "bg-amber-950/20",
      description: "Platform triggers autonomous dispatch directives directly into the municipal public works queue.",
    },
    {
      step: "05",
      title: "Government Action",
      icon: Building2,
      color: "text-emerald-400",
      border: "border-emerald-500/40",
      bg: "bg-emerald-950/20",
      description: "Assigned field crews deploy on site, execute repairs within the mandated SLA, and upload resolution proof.",
    },
  ];

  return (
    <section id="smart-escalation" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-amber-glow">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Autonomous Civic Dispatch Pipeline</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Smart Escalation Lifecycle
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            From initial photo analysis to physical government resolution without bureaucratic bottlenecks.
          </p>
        </div>

        {/* 5-Step Escalation Sequence Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {escalationSteps.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === escalationSteps.length - 1;

            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-slate-950 border ${item.border} ${item.bg} shadow-glass flex flex-col justify-between space-y-4 relative group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      STEP {item.step}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Down/Right Arrow Indicator */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-900 border border-slate-800 items-center justify-center text-slate-400 shadow-md">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
