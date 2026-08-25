"use client";

import React from "react";
import { Check, Camera, Cpu, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReportProgressStepperProps {
  currentStep: number; // 1 to 5 (or 6 for success)
  onStepClick?: (step: number) => void;
  maxStepReached: number;
}

const STEPS = [
  { step: 1, number: "01", label: "Photo", icon: Camera },
  { step: 2, number: "02", label: "AI Analysis", icon: Cpu },
  { step: 3, number: "03", label: "Location", icon: MapPin },
  { step: 4, number: "04", label: "Details", icon: FileText },
  { step: 5, number: "05", label: "Review", icon: CheckCircle2 },
];

export function ReportProgressStepper({
  currentStep,
  onStepClick,
  maxStepReached,
}: ReportProgressStepperProps) {
  if (currentStep > 5) return null; // Don't show stepper on final success receipt

  return (
    <div className="w-full py-4 sm:py-6">
      {/* Mobile Step Indicator */}
      <div className="sm:hidden flex items-center justify-between px-2 mb-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          Step 0{currentStep} of 05
        </span>
        <span className="text-xs font-bold text-white">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>

      {/* Progress Bar Line for Desktop & Tablet */}
      <div className="relative">
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Background Track */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />

          {/* Active Gradient Line */}
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500 -z-0"
            style={{
              width: `${Math.max(
                0,
                Math.min(100, ((currentStep - 1) / (STEPS.length - 1)) * 100)
              )}%`,
            }}
          />

          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isAccessible = s.step <= maxStepReached;
            const Icon = s.icon;

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick && onStepClick(s.step)}
                className={cn(
                  "flex flex-col items-center relative z-10 group focus:outline-none transition-transform",
                  isAccessible && "cursor-pointer hover:scale-105",
                  !isAccessible && "cursor-not-allowed opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs",
                    isCompleted &&
                      "bg-slate-900 border-emerald-500 text-emerald-400 shadow-emerald-glow",
                    isCurrent &&
                      "bg-slate-900 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/20 shadow-cyan-glow scale-110",
                    !isCompleted && !isCurrent && "bg-slate-950 border-slate-800 text-slate-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="font-mono">{s.number}</span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-xs font-semibold mt-2 whitespace-nowrap transition-colors",
                    isCurrent && "text-cyan-300 font-bold",
                    isCompleted && "text-slate-300",
                    !isCompleted && !isCurrent && "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
