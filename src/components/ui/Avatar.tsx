import React from "react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

export interface AvatarProps {
  src?: string;
  name: string;
  role?: UserRole;
  size?: "sm" | "md" | "lg" | "xl";
  showRoleBadge?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name,
  role,
  size = "md",
  showRoleBadge = false,
  className,
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const roleBorderClasses = {
    citizen: "ring-2 ring-cyan-500/50",
    verifier: "ring-2 ring-purple-500/50",
    authority: "ring-2 ring-emerald-500/50",
  };

  const getInitials = (n: string) => {
    const parts = n.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-bold bg-slate-800 text-slate-200 border border-slate-700 select-none shadow-md",
          sizeClasses[size],
          role && roleBorderClasses[role],
          className
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {showRoleBadge && role && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-slate-900",
            role === "citizen" && "bg-cyan-400",
            role === "verifier" && "bg-purple-400",
            role === "authority" && "bg-emerald-400"
          )}
        />
      )}
    </div>
  );
}
