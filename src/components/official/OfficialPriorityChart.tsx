"use client";

import React from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Flame,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";

export function OfficialPriorityChart() {
  const priorityBreakdown = [
    {
      level: "Critical Priority (Immediate)",
      count: 4,
      percentage: 18,
      slaCompliance: "96.4%",
      color: "bg-rose-500",
      textColor: "text-rose-400",
      barVariant: "rose" as const,
    },
    {
      level: "High Priority (6h SLA)",
      count: 12,
      percentage: 42,
      slaCompliance: "94.8%",
      color: "bg-amber-500",
      textColor: "text-amber-400",
      barVariant: "amber" as const,
    },
    {
      level: "Medium Priority (24h SLA)",
      count: 9,
      percentage: 28,
      slaCompliance: "98.2%",
      color: "bg-cyan-500",
      textColor: "text-cyan-400",
      barVariant: "cyan" as const,
    },
    {
      level: "Low Priority (Scheduled)",
      count: 3,
      percentage: 12,
      slaCompliance: "100%",
      color: "bg-indigo-500",
      textColor: "text-indigo-400",
      barVariant: "indigo" as const,
    },
  ];

  const categoryDistribution = [
    { name: "Potholes & Roads", share: 38, count: 18, color: "text-cyan-400" },
    { name: "Water Pipelines", share: 24, count: 11, color: "text-blue-400" },
    { name: "Streetlight Outages", share: 16, count: 8, color: "text-amber-400" },
    { name: "Waste Dumping", share: 14, count: 6, color: "text-emerald-400" },
    { name: "Traffic Signals", share: 8, count: 4, color: "text-purple-400" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Priority & SLA Compliance Matrix
            </h3>
            <span className="text-[11px] text-slate-400">
              Real-time municipal triage distribution
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-emerald-glow">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>94.8% SLA On-Time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Priority Breakdown Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Active Incidents by Priority Weight
          </span>

          <div className="space-y-3.5">
            {priorityBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.level}</span>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className={`font-black ${item.textColor}`}>
                      {item.count} Active ({item.percentage}%)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {item.slaCompliance} SLA
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={item.percentage}
                  variant={item.barVariant}
                  size="sm"
                  showPercentage={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Category Distribution Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Category Share Allocation
          </span>

          {/* Visual Stacked Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-950">
            <div style={{ width: "38%" }} className="bg-cyan-400 h-full" />
            <div style={{ width: "24%" }} className="bg-blue-500 h-full" />
            <div style={{ width: "16%" }} className="bg-amber-400 h-full" />
            <div style={{ width: "14%" }} className="bg-emerald-400 h-full" />
            <div style={{ width: "8%" }} className="bg-purple-500 h-full" />
          </div>

          <div className="space-y-2 pt-1">
            {categoryDistribution.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs text-slate-300"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className={`font-mono font-bold ${cat.color}`}>
                  {cat.count} ({cat.share}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
