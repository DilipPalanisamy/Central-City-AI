import React from "react";
import { AIAnalysisResult } from "@/types";
import { Sparkles, Cpu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIConfidenceMeterProps {
  aiAnalysis: AIAnalysisResult;
  compact?: boolean;
  className?: string;
}

export function AIConfidenceMeter({
  aiAnalysis,
  compact = false,
  className,
}: AIConfidenceMeterProps) {
  const percentage = Math.round(aiAnalysis.confidence * 100);

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-cyan-glow",
          className
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>AI: {percentage}% Conf</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-glass relative overflow-hidden",
        className
      )}
    >
      {/* Background glow streak */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>AI Vision Triage</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                {aiAnalysis.aiModelVersion}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Confidence Score & Priority Assessment
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-cyan-400 font-mono">
            {percentage}%
          </span>
          <span className="block text-[10px] text-slate-400 uppercase">Match Score</span>
        </div>
      </div>

      {/* Meter Bar */}
      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700/50 mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500 shadow-cyan-glow"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* AI Key Insights Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">
            Est. Resolution SLA
          </span>
          <span className="text-white font-bold font-mono">
            {aiAnalysis.estimatedResolutionHours} Hours
          </span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">
            Repair Cost Est.
          </span>
          <span className="text-emerald-400 font-bold font-mono">
            ${aiAnalysis.estimatedCostMin} - ${aiAnalysis.estimatedCostMax}
          </span>
        </div>
      </div>

      {aiAnalysis.rootCauseHypothesis && (
        <div className="mt-2.5 text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
          <span className="text-cyan-400 font-semibold">AI Hypothesis: </span>
          {aiAnalysis.rootCauseHypothesis}
        </div>
      )}
    </div>
  );
}
