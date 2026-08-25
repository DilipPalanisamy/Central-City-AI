"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Users,
  ShieldCheck,
  Building2,
  Layers,
  Cpu,
  Sliders,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export interface AdminOverviewViewProps {
  onNavigateTab: (tab: any) => void;
}

export function AdminOverviewView({ onNavigateTab }: AdminOverviewViewProps) {
  const kpiCards = [
    {
      label: "Total Registered Citizens",
      value: "14,820",
      change: "+12.4% this month",
      icon: Users,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20",
      tab: "users",
    },
    {
      label: "Municipal Field Officials",
      value: "184",
      change: "Across 8 Departments",
      icon: ShieldCheck,
      color: "text-indigo-400",
      border: "border-indigo-500/30",
      bg: "bg-indigo-950/20",
      tab: "officials",
    },
    {
      label: "Total Civic Issues Logged",
      value: "1,492",
      change: "91% Resolution Rate",
      icon: Layers,
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-950/20",
      tab: "issues",
    },
    {
      label: "AI Neural Triage Accuracy",
      value: "94.6%",
      change: "340ms Inference Time",
      icon: Cpu,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20",
      tab: "ai_monitoring",
    },
    {
      label: "Open Citizen Disputes",
      value: "12",
      change: "Needs Quality Inspection",
      icon: AlertTriangle,
      color: "text-rose-400",
      border: "border-rose-500/30",
      bg: "bg-rose-950/20",
      tab: "disputes",
    },
    {
      label: "Citywide SLA Compliance",
      value: "94.8%",
      change: "Target < 24h average",
      icon: TrendingUp,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-950/20",
      tab: "analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-4 rounded-3xl bg-slate-950 border ${card.border} hover:scale-[1.02] cursor-pointer transition-all shadow-glass flex flex-col justify-between space-y-3 group`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-2xl ${card.bg} border border-slate-800 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div className="space-y-0.5">
                <div className={`text-xl sm:text-2xl font-black font-mono ${card.color}`}>
                  {card.value}
                </div>
                <span className="text-xs font-bold text-white block truncate">
                  {card.label}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Real-Time Governance Stream & SLA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live System Activity Stream (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Governance & Dispatch Stream
              </h3>
            </div>
            <Badge variant="cyan" size="sm">
              Live Feed
            </Badge>
          </div>

          <div className="space-y-3">
            {[
              {
                time: "2 mins ago",
                actor: "CityVision-v4.2",
                action: "Neural Triage Complete",
                detail: "Classified Pothole on Market St with 94% confidence. Assigned HIGH priority.",
                badge: "AI 94%",
                variant: "cyan" as const,
              },
              {
                time: "15 mins ago",
                actor: "Democratic Engine",
                action: "Quorum Threshold Met",
                detail: "5 affected residents reached for CC-2026-8942. Auto-escalation triggered.",
                badge: "Escalated",
                variant: "amber" as const,
              },
              {
                time: "45 mins ago",
                actor: "Eng. Marcus Vance",
                action: "Field Dispatch Confirmed",
                detail: "Asphalt Patch Truck #14 deployed to Ward 14. 6-hour SLA timer started.",
                badge: "Dispatched",
                variant: "indigo" as const,
              },
              {
                time: "2 hours ago",
                actor: "Technician Leo Rossi",
                action: "Work Order Resolved",
                detail: "24th St Streetlight Outage restored. Before & after evidence submitted.",
                badge: "Resolved",
                variant: "emerald" as const,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{item.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      by {item.actor}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={item.variant} size="sm">
                    {item.badge}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Department Health & Quick Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Department Response Health
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              94.8% SLA Target
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { name: "Public Works (Roads)", compliance: 96, active: 18, color: "cyan" as const },
              { name: "Water & Sewerage", compliance: 92, active: 11, color: "indigo" as const },
              { name: "Street Lighting Grid", compliance: 99, active: 8, color: "emerald" as const },
              { name: "Waste & Sanitation", compliance: 89, active: 6, color: "amber" as const },
            ].map((dept, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{dept.name}</span>
                  <span className="font-mono text-white font-bold">
                    {dept.compliance}% SLA ({dept.active} Active)
                  </span>
                </div>
                <ProgressBar
                  value={dept.compliance}
                  variant={dept.color}
                  size="sm"
                  showPercentage={false}
                />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("threshold_rules")}
              leftIcon={<Sliders className="w-3.5 h-3.5 text-amber-400" />}
            >
              Threshold Rules
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={() => onNavigateTab("ai_monitoring")}
              leftIcon={<Cpu className="w-3.5 h-3.5 text-cyan-400" />}
            >
              AI Health Monitor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
