import React from "react";
import { IssueStatus } from "@/types";
import { Check, Clock, Radio, Truck, CheckCircle2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusStepperProps {
  currentStatus: IssueStatus;
  className?: string;
}

const STEPS: { status: IssueStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "reported", label: "Reported", icon: Radio },
  { status: "ai_analyzed", label: "AI Triaged", icon: Bot },
  { status: "community_verified", label: "Verified", icon: Check },
  { status: "authority_dispatched", label: "Dispatched", icon: Truck },
  { status: "in_progress", label: "In Progress", icon: Clock },
  { status: "resolved", label: "Resolved", icon: CheckCircle2 },
];

export function StatusStepper({ currentStatus, className }: StatusStepperProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className={cn("w-full py-3", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connecting Background Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />

        {/* Completed Progress Line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, (currentStepIndex / (STEPS.length - 1)) * 100)
            )}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted &&
                    "bg-slate-900 border-emerald-500 text-emerald-400 shadow-emerald-glow",
                  isCurrent &&
                    "bg-slate-900 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/20 shadow-cyan-glow scale-110",
                  isUpcoming && "bg-slate-900 border-slate-700 text-slate-500"
                )}
              >
                <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-semibold mt-1.5 whitespace-nowrap transition-colors",
                  isCurrent && "text-cyan-300 font-bold",
                  isCompleted && "text-slate-300",
                  isUpcoming && "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
