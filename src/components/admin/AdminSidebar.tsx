"use client";

import React from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Layers,
  Cpu,
  Sliders,
  AlertTriangle,
  BarChart3,
  FileText,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "users"
  | "officials"
  | "departments"
  | "issues"
  | "ai_monitoring"
  | "threshold_rules"
  | "disputes"
  | "analytics"
  | "audit_logs"
  | "settings";

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  counts?: {
    disputes?: number;
    issues?: number;
    users?: number;
  };
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  counts = {},
}: AdminSidebarProps) {
  const menuItems: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeVariant?: "rose" | "amber" | "cyan" | "indigo" | "emerald";
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users, badgeCount: 14820 },
    { id: "officials", label: "Officials", icon: ShieldCheck, badgeCount: 184 },
    { id: "departments", label: "Departments", icon: Building2, badgeCount: 8 },
    { id: "issues", label: "Issues", icon: Layers, badgeCount: counts.issues || 1492 },
    { id: "ai_monitoring", label: "AI Monitoring", icon: Cpu, badgeVariant: "cyan" },
    {
      id: "threshold_rules",
      label: "Threshold Rules",
      icon: Sliders,
      badgeVariant: "amber",
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: AlertTriangle,
      badgeCount: counts.disputes || 12,
      badgeVariant: "rose",
    },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "audit_logs", label: "Audit Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-3 px-2">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-cyan-glow group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                CENTRAL-CITY<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider block font-mono text-purple-400 font-bold">
                ROOT GOVERNANCE
              </span>
            </div>
          </Link>

          {/* System Mode Pill */}
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <div className="min-w-0">
              <span className="text-white font-bold text-[11px] truncate block">
                SuperAdmin Console
              </span>
              <span className="text-[9px] text-purple-300 font-mono block">
                Full Policy & Triage Rights
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-950/80 text-purple-200 border border-purple-500/40 shadow-purple-glow font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-purple-400" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badgeCount !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      item.badgeVariant === "rose"
                        ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                        : item.badgeVariant === "amber"
                        ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {item.badgeCount > 999
                      ? `${(item.badgeCount / 1000).toFixed(1)}k`
                      : item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Exit */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center space-x-2.5 px-2">
          <Avatar
            name="Mayor Elena Rostova"
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            role="authority"
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-white block truncate">
              Elena Rostova
            </span>
            <span className="text-[10px] text-purple-400 font-mono block truncate">
              City Administrator
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
