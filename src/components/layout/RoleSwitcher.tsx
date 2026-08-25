"use client";

import React from "react";
import { useCivicStore } from "@/lib/mockStore";
import { UserRole } from "@/types";
import { User, ShieldCheck, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSwitcher({ className }: { className?: string }) {
  const { currentRole, setCurrentRole, addToast } = useCivicStore();

  const roles: {
    id: UserRole;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    activeBg: string;
  }[] = [
    {
      id: "citizen",
      label: "Citizen",
      icon: User,
      color: "text-cyan-400",
      activeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-glow",
    },
    {
      id: "verifier",
      label: "Community Verifier",
      icon: ShieldCheck,
      color: "text-purple-400",
      activeBg: "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/20",
    },
    {
      id: "authority",
      label: "City Authority",
      icon: Building2,
      color: "text-emerald-400",
      activeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-glow",
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    const roleTitles: Record<UserRole, string> = {
      citizen: "Citizen Mode: Report and upvote neighborhood issues",
      verifier: "Verifier Mode: Inspect AI triaged reports and validate authenticity",
      authority: "Authority Mode: Dispatch field units and manage city SLAs",
    };
    addToast("Role Switched", roleTitles[role], "info");
  };

  return (
    <div
      className={cn(
        "flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md",
        className
      )}
    >
      <span className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider hidden lg:inline">
        Persona:
      </span>
      <div className="flex items-center space-x-1">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleSelect(r.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-transparent select-none",
                isActive
                  ? r.activeBg
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "" : r.color)} />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
