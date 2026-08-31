import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: React.ReactNode;
  variant?: "cyan" | "emerald" | "amber" | "rose" | "indigo" | "default";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const iconBgStyles = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    cyan: "bg-cyan-950/60 text-cyan-400 border-cyan-500/30",
    emerald: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-950/60 text-amber-400 border-amber-500/30",
    rose: "bg-rose-950/60 text-rose-400 border-rose-500/30",
    indigo: "bg-indigo-950/60 text-indigo-400 border-indigo-500/30",
  };

  return (
    <div
      className={cn(
        "relative p-5 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 shadow-glass transition-all duration-300 group hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-105",
              iconBgStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border",
              change.isNeutral
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : change.isPositive
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                : "bg-rose-950/60 text-rose-400 border-rose-500/30"
            )}
          >
            {change.isNeutral ? (
              <Minus className="w-3 h-3 mr-0.5" />
            ) : change.isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {change.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
