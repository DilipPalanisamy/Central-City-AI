"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCivicStore } from "@/lib/mockStore";
import {
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  Building2,
  BarChart3,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole, issues } = useCivicStore();

  const pendingVerificationCount = issues.filter(
    (i) => i.status === "reported" || i.status === "ai_analyzed"
  ).length;
  const criticalCount = issues.filter(
    (i) => i.severity === "critical" && i.status !== "resolved"
  ).length;

  const navItems = [
    {
      title: "Navigation",
      items: [
        {
          label: "Civic Command Hub",
          href: "/",
          icon: LayoutDashboard,
          badge: "Live",
          badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        },
        {
          label: "Report Civic Issue",
          href: "#report-modal",
          icon: PlusCircle,
          badge: "AI Triage",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          roles: ["citizen", "verifier", "authority"],
        },
        {
          label: "Community Verification",
          href: "#verification-feed",
          icon: ShieldCheck,
          badge: `${pendingVerificationCount} Pending`,
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          roles: ["verifier", "authority", "citizen"],
        },
        {
          label: "Authority Dispatch Desk",
          href: "#authority-console",
          icon: Building2,
          badge: `${criticalCount} Urgent`,
          badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          roles: ["authority"],
        },
        {
          label: "Interactive City Map",
          href: "#city-map",
          icon: MapPin,
          roles: ["citizen", "verifier", "authority"],
        },
        {
          label: "Ward Telemetry & Analytics",
          href: "#ward-analytics",
          icon: BarChart3,
          roles: ["citizen", "verifier", "authority"],
        },
      ],
    },
    {
      title: "Intelligence & Insights",
      items: [
        {
          label: "AI Neural Diagnostics",
          href: "#ai-diagnostics",
          icon: Sparkles,
          roles: ["verifier", "authority"],
        },
        {
          label: "SLA Resolution Timers",
          href: "#sla-timers",
          icon: Clock,
          roles: ["authority"],
        },
        {
          label: "Civic Leaderboard",
          href: "#leaderboard",
          icon: TrendingUp,
          roles: ["citizen", "verifier"],
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 flex flex-col justify-between p-4",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Top Section: Nav items */}
        <div className="space-y-6 overflow-y-auto pr-1">
          {navItems.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h4>
              <div className="space-y-1 pt-1">
                {section.items
                  .filter((item) => !item.roles || item.roles.includes(currentRole))
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-cyan-glow"
                            : "text-slate-400 hover:text-white hover:bg-slate-900/90"
                        )}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon
                            className={cn(
                              "w-4 h-4 transition-colors",
                              isActive
                                ? "text-cyan-400"
                                : "text-slate-400 group-hover:text-white"
                            )}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                              item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Platform Status Widget */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">AI Engine Latency</span>
              <span className="text-cyan-400 font-mono font-bold">340ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Active City Units</span>
              <span className="text-emerald-400 font-mono font-bold">42 Dispatched</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[92%]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
