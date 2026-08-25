"use client";

import React from "react";
import Link from "next/link";
import { useCivicStore } from "@/lib/mockStore";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  Layers,
  MapPin,
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  RotateCcw,
  BarChart3,
  Bell,
  Activity,
  Shield,
  Building2,
  ChevronRight,
  LogOut,
} from "lucide-react";

export type OfficialViewFilter =
  | "dashboard"
  | "issues"
  | "map"
  | "critical"
  | "high_priority"
  | "in_progress"
  | "resolved"
  | "reopened"
  | "analytics"
  | "notifications";

export interface OfficialSidebarProps {
  activeView: OfficialViewFilter;
  onSelectView: (view: OfficialViewFilter) => void;
  counts: {
    critical: number;
    high: number;
    inProgress: number;
    resolved: number;
    reopened: number;
    notifications: number;
  };
}

export function OfficialSidebar({
  activeView,
  onSelectView,
  counts,
}: OfficialSidebarProps) {
  const { currentUser, currentRole } = useCivicStore();

  const navItems: {
    id: OfficialViewFilter;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeVariant?: "rose" | "amber" | "indigo" | "emerald" | "cyan";
    link?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "issues", label: "Issues", icon: Layers },
    { id: "map", label: "Map", icon: MapPin },
    {
      id: "critical",
      label: "Critical",
      icon: AlertTriangle,
      badgeCount: counts.critical,
      badgeVariant: "rose",
    },
    {
      id: "high_priority",
      label: "High Priority",
      icon: Flame,
      badgeCount: counts.high,
      badgeVariant: "amber",
    },
    {
      id: "in_progress",
      label: "In Progress",
      icon: Clock,
      badgeCount: counts.inProgress,
      badgeVariant: "indigo",
    },
    {
      id: "resolved",
      label: "Resolved",
      icon: CheckCircle2,
      badgeCount: counts.resolved,
      badgeVariant: "emerald",
    },
    {
      id: "reopened",
      label: "Reopened",
      icon: RotateCcw,
      badgeCount: counts.reopened,
      badgeVariant: "rose",
    },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badgeCount: counts.notifications,
      badgeVariant: "cyan",
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-3 px-2">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-cyan-glow group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                CENTRAL-CITY<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider block font-mono text-cyan-400">
                OFFICIAL COMMAND
              </span>
            </div>
          </Link>

          {/* Department Badge */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2 text-xs">
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
                Department
              </span>
              <span className="text-white font-bold text-[11px] truncate block">
                Public Works & Roads (PWD)
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-cyan-400" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      item.badgeVariant === "rose"
                        ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                        : item.badgeVariant === "amber"
                        ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                        : item.badgeVariant === "emerald"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        : item.badgeVariant === "indigo"
                        ? "bg-indigo-950 text-indigo-300 border border-indigo-500/40"
                        : "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Officer Profile */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center space-x-2.5 px-2">
          <Avatar
            name="Eng. Marcus Vance"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            role="authority"
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-white block truncate">
              Eng. Marcus Vance
            </span>
            <span className="text-[10px] text-cyan-400 font-mono block truncate">
              Chief Municipal Dispatcher
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <span>Exit to Public Portal</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
