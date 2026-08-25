import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  variant?: "cyan" | "emerald" | "amber" | "rose" | "indigo" | "gradient";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  variant = "cyan",
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantStyles = {
    cyan: "bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-cyan-glow",
    emerald: "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-emerald-glow",
    amber: "bg-gradient-to-r from-amber-600 to-amber-400",
    rose: "bg-gradient-to-r from-rose-600 to-rose-400 shadow-rose-glow",
    indigo: "bg-gradient-to-r from-indigo-600 to-indigo-400",
    gradient: "bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="font-mono font-medium text-slate-400">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/40 p-0.5",
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {sublabel && <p className="text-[11px] text-slate-400">{sublabel}</p>}
    </div>
  );
}
