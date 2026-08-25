"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function AdminAnalyticsView() {
  const wardsData = [
    {
      ward: "Ward 14",
      name: "Metro Central Hub",
      healthScore: 94,
      totalIssues: 420,
      resolvedRate: 95.2,
      avgResolutionHours: 7.4,
      activeQuorums: 6,
    },
    {
      ward: "Ward 12",
      name: "Old Town District",
      healthScore: 88,
      totalIssues: 380,
      resolvedRate: 91.8,
      avgResolutionHours: 11.2,
      activeQuorums: 4,
    },
    {
      ward: "Ward 07",
      name: "Sunset Corridor",
      healthScore: 96,
      totalIssues: 290,
      resolvedRate: 98.4,
      avgResolutionHours: 5.6,
      activeQuorums: 2,
    },
    {
      ward: "Ward 04",
      name: "Bayfront Marina",
      healthScore: 91,
      totalIssues: 402,
      resolvedRate: 93.6,
      avgResolutionHours: 9.1,
      activeQuorums: 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Civic Health & Ward Performance Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Comparative response velocity and citizen participation rates across city wards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            City Civic Health: 92.2 / 100
          </Badge>
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wardsData.map((ward) => (
          <div
            key={ward.ward}
            className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  {ward.ward}
                </span>
                <h3 className="text-sm font-black text-white">{ward.name}</h3>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {ward.healthScore}/100
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">Health Score</span>
              </div>
            </div>

            {/* Resolution Progress */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Resolution Rate</span>
                <span className="font-mono text-white font-bold">{ward.resolvedRate}%</span>
              </div>
              <ProgressBar value={ward.resolvedRate} variant="emerald" size="sm" showPercentage={false} />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Issues</span>
                <span className="font-mono font-bold text-white">{ward.totalIssues}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Avg SLA</span>
                <span className="font-mono font-bold text-cyan-400">{ward.avgResolutionHours}h</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Quorums</span>
                <span className="font-mono font-bold text-amber-400">{ward.activeQuorums} Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
