"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Activity,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

export function StatisticsSection() {
  const stats = [
    {
      label: "Total Reports",
      value: "10,240",
      subtext: "Logged on Civic Ledger",
      icon: Activity,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    {
      label: "Issues Resolved",
      value: "7,832",
      subtext: "Photo Proof Verified",
      icon: CheckCircle2,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    {
      label: "Active Citizens",
      value: "24,600",
      subtext: "Community Guardians",
      icon: Users,
      color: "text-purple-400",
      border: "border-purple-500/30",
    },
    {
      label: "Resolution Rate",
      value: "92%",
      subtext: "Within Mandated SLA",
      icon: TrendingUp,
      color: "text-amber-400",
      border: "border-amber-500/30",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Impact & Scale</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Citywide Civic Intelligence by the Numbers
          </h2>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl bg-slate-950 border ${item.border} shadow-glass text-center space-y-2 group transition-all duration-300 hover:scale-[1.02]`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className={`text-3xl sm:text-4xl font-black font-mono ${item.color} pt-2`}>
                  {item.value}
                </div>

                <span className="text-xs sm:text-sm font-bold text-white block">
                  {item.label}
                </span>

                <span className="text-[11px] text-slate-400 block font-mono">
                  {item.subtext}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
