import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "cyan"
    | "emerald"
    | "amber"
    | "rose"
    | "indigo"
    | "purple"
    | "outline";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-medium",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3 py-1.5 gap-2 font-semibold",
  };

  const variantStyles = {
    default: "bg-slate-800/80 text-slate-300 border border-slate-700/60",
    cyan: "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30",
    emerald: "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30",
    amber: "bg-amber-950/60 text-amber-300 border border-amber-500/30",
    rose: "bg-rose-950/60 text-rose-300 border border-rose-500/30",
    indigo: "bg-indigo-950/60 text-indigo-300 border border-indigo-500/30",
    purple: "bg-purple-950/60 text-purple-300 border border-purple-500/30",
    outline: "bg-transparent text-slate-300 border border-slate-700",
  };

  const dotStyles = {
    default: "bg-slate-400",
    cyan: "bg-cyan-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    indigo: "bg-indigo-400",
    purple: "bg-purple-400",
    outline: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full backdrop-blur-sm transition-colors select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotStyles[variant],
            pulse && "animate-pulse"
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
