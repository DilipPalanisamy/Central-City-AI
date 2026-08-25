import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "interactive" | "glow" | "outline";
  glowColor?: "cyan" | "emerald" | "rose" | "indigo";
}

export function Card({
  className,
  variant = "glass",
  glowColor = "cyan",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-slate-900 border border-slate-800 text-slate-100",
    glass:
      "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 text-slate-100 shadow-glass transition-all duration-200",
    interactive:
      "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/50 hover:shadow-cyan-glow cursor-pointer transition-all duration-300 text-slate-100",
    glow:
      glowColor === "cyan"
        ? "bg-slate-900/80 border border-cyan-500/30 shadow-cyan-glow text-slate-100"
        : glowColor === "emerald"
        ? "bg-slate-900/80 border border-emerald-500/30 shadow-emerald-glow text-slate-100"
        : glowColor === "rose"
        ? "bg-slate-900/80 border border-rose-500/30 shadow-rose-glow text-slate-100"
        : "bg-slate-900/80 border border-indigo-500/30 shadow-indigo-glow text-slate-100",
    outline: "bg-transparent border border-slate-800 text-slate-100",
  };

  return (
    <div
      className={cn(
        "rounded-2xl relative overflow-hidden transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-5 sm:p-6 flex flex-col space-y-1.5", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg sm:text-xl font-semibold tracking-tight text-white",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs sm:text-sm text-slate-400 leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 sm:p-6 pt-0 sm:pt-0", className)} {...props} />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 pt-0 sm:pt-0 flex items-center border-t border-slate-800/50 mt-4",
        className
      )}
      {...props}
    />
  );
}
