import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

export function Tabs({
  items,
  activeTab,
  onChange,
  variant = "pill",
  className,
}: TabsProps) {
  if (variant === "underline") {
    return (
      <div
        className={cn(
          "flex space-x-6 border-b border-slate-800 overflow-x-auto scrollbar-none",
          className
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium transition-all duration-200 relative whitespace-nowrap flex items-center gap-2",
                isActive
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-mono",
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-cyan-glow" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex p-1 gap-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md overflow-x-auto scrollbar-none",
        className
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
              isActive
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                  isActive
                    ? "bg-cyan-500/30 text-cyan-200"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
