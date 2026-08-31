"use client";

import React from "react";
import {
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  RotateCcw,
  Hourglass,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export interface DashboardMetrics {
  critical: number;
  highPriority: number;
  pending: number;
  inProgress: number;
  resolved: number;
  reopened: number;
}

export interface OfficialDashboardCardsProps {
  metrics: DashboardMetrics;
  onSelectCategoryFilter?: (filter: string) => void;
}

export function OfficialDashboardCards({
  metrics,
  onSelectCategoryFilter,
}: OfficialDashboardCardsProps) {
  const cards = [
    {
      id: "critical",
      label: "Critical Issues",
      count: metrics.critical,
      subtext: "Needs Immediate 2h - 4h SLA",
      icon: AlertTriangle,
      border: "border-rose-500/40 hover:border-rose-500",
      bg: "bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950",
      textColor: "text-rose-400",
      glow: "shadow-rose-glow",
      badge: "Urgent",
      badgeClass: "bg-rose-950 text-rose-300 border-rose-500/40",
    },
    {
      id: "high_priority",
      label: "High Priority",
      count: metrics.highPriority,
      subtext: "Mandated 6h - 8h SLA window",
      icon: Flame,
      border: "border-amber-500/40 hover:border-amber-500",
      bg: "bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950",
      textColor: "text-amber-400",
      glow: "shadow-amber-glow",
      badge: "Target SLA",
      badgeClass: "bg-amber-950 text-amber-300 border-amber-500/40",
    },
    {
      id: "pending",
      label: "Pending",
      count: metrics.pending,
      subtext: "Awaiting quorum or AI triage",
      icon: Hourglass,
      border: "border-cyan-500/40 hover:border-cyan-500",
      bg: "bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950",
      textColor: "text-cyan-400",
      glow: "shadow-cyan-glow",
      badge: "In Queue",
      badgeClass: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: metrics.inProgress,
      subtext: "Field crews deployed on site",
      icon: Clock,
      border: "border-indigo-500/40 hover:border-indigo-500",
      bg: "bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950",
      textColor: "text-indigo-300",
      glow: "shadow-cyan-glow",
      badge: "Deployed",
      badgeClass: "bg-indigo-950 text-indigo-300 border-indigo-500/40",
    },
    {
      id: "resolved",
      label: "Resolved",
      count: metrics.resolved,
      subtext: "Fixed & Photo-Verified",
      icon: CheckCircle2,
      border: "border-emerald-500/40 hover:border-emerald-500",
      bg: "bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950",
      textColor: "text-emerald-400",
      glow: "shadow-emerald-glow",
      badge: "99% Approval",
      badgeClass: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
    },
    {
      id: "reopened",
      label: "Reopened",
      count: metrics.reopened,
      subtext: "Community Dispute Flagged",
      icon: RotateCcw,
      border: "border-rose-500/30 hover:border-rose-500",
      bg: "bg-gradient-to-b from-rose-950/30 via-slate-900 to-slate-950",
      textColor: "text-rose-300",
      glow: "shadow-rose-glow",
      badge: "Audit Required",
      badgeClass: "bg-rose-950 text-rose-300 border-rose-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => onSelectCategoryFilter && onSelectCategoryFilter(card.id)}
            className={`p-4 rounded-3xl border ${card.border} ${card.bg} transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-glass flex flex-col justify-between space-y-3 group`}
          >
            {/* Top Icon & Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`w-9 h-9 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center ${card.textColor} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Metric Number & Label */}
            <div className="space-y-0.5">
              <div className={`text-2xl sm:text-3xl font-black font-mono ${card.textColor}`}>
                {card.count}
              </div>
              <span className="text-xs font-bold text-white block truncate">
                {card.label}
              </span>
              <p className="text-[10px] text-slate-400 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
