"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useCivicStore } from "@/lib/mockStore";
import {
  FileText,
  Clock,
  Heart,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";

export function CitizenWelcome() {
  const { user } = useAuth();
  const { currentUser } = useCivicStore();

  const greetingName = user?.displayName || "Citizen";

  const stats = [
    {
      label: "My Reports",
      value: "12",
      icon: FileText,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20",
    },
    {
      label: "Active Reports",
      value: "4",
      icon: Clock,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-950/20",
    },
    {
      label: "Issues Supported",
      value: "8",
      icon: Heart,
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-950/20",
    },
    {
      label: "Resolved",
      value: "7",
      icon: CheckCircle2,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Headline Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">
              Ward 14 (Metro Central) • Google Verified Citizen
            </span>
          </div>

          {/* Exact Heading with real Google Display Name */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good evening, {greetingName}.
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300">
            Help make your community better by reporting problems that matter.
          </p>
        </div>

        {/* Civic Karma Badge */}
        <div className="shrink-0 flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Civic Karma
            </span>
            <span className="text-lg font-black text-white font-mono">
              +{currentUser.civicKarma || 840} pts
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl bg-slate-950 border ${stat.border} shadow-glass space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
