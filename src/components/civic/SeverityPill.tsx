import React from "react";
import { IssueSeverity } from "@/types";
import { getSeverityMeta } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface SeverityPillProps {
  severity: IssueSeverity;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

export function SeverityPill({
  severity,
  size = "md",
  showDot = true,
  className,
}: SeverityPillProps) {
  const meta = getSeverityMeta(severity);

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 font-medium tracking-wide",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-sm px-3 py-1.5 font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md uppercase tracking-wider select-none",
        meta.bgClass,
        meta.borderClass,
        meta.colorClass,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta.dotClass)}
        />
      )}
      {meta.label}
    </span>
  );
}
