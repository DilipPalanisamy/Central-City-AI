"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  AlertTriangle,
  Users,
  ShieldAlert,
  Building2,
  Clock,
  CheckCircle2,
  Flame,
  Radio,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react";

export interface AdaptiveEscalationCardProps {
  initialPriority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  initialCurrentAffected?: number;
  initialRequiredThreshold?: number;
  issueId?: string;
  departmentName?: string;
  authorityName?: string;
}

export function AdaptiveEscalationCard({
  initialPriority = "HIGH",
  initialCurrentAffected = 3,
  initialRequiredThreshold = 5,
  issueId = "CC-2026-8942",
  departmentName = "Department of Roads & Infrastructure (PWD-RDS)",
  authorityName = "Municipal Emergency Public Works Director",
}: AdaptiveEscalationCardProps) {
  const [priority, setPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">(
    initialPriority
  );
  const [currentAffected, setCurrentAffected] = useState<number>(initialCurrentAffected);
  const [requiredThreshold, setRequiredThreshold] = useState<number>(
    initialRequiredThreshold
  );

  const isThresholdReached = currentAffected >= requiredThreshold;
  const progressPercent = Math.min(100, Math.round((currentAffected / requiredThreshold) * 100));

  const handleAddAffected = () => {
    setCurrentAffected((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentAffected(3);
    setRequiredThreshold(5);
    setPriority("HIGH");
  };

  const handleSelectPresetPriority = (
    p: "CRITICAL" | "HIGH" | "MEDIUM"
  ) => {
    setPriority(p);
    if (p === "CRITICAL") {
      setRequiredThreshold(3);
      setCurrentAffected(2);
    } else if (p === "HIGH") {
      setRequiredThreshold(5);
      setCurrentAffected(3);
    } else {
      setRequiredThreshold(12);
      setCurrentAffected(7);
    }
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-950 border-2 transition-all duration-500 space-y-6 shadow-2xl overflow-hidden relative group">
      {/* Background Ambient Glow */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isThresholdReached ? "bg-rose-500/20" : "bg-cyan-500/10"
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isThresholdReached ? "text-rose-400 animate-ping" : "text-cyan-400 animate-pulse"}`} />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
              Central-City-AI Adaptive Escalation Engine
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Democratic Escalation Protocol
          </h3>
        </div>

        {/* Priority Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {(["CRITICAL", "HIGH", "MEDIUM"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleSelectPresetPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                priority === p
                  ? p === "CRITICAL"
                    ? "bg-rose-600 text-white shadow-rose-glow"
                    : p === "HIGH"
                    ? "bg-amber-500 text-slate-950 font-black shadow-amber-glow"
                    : "bg-cyan-600 text-white shadow-cyan-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Core Adaptive Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Priority Box */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Priority
          </span>
          <span
            className={`text-lg font-black font-mono block ${
              priority === "CRITICAL"
                ? "text-rose-400"
                : priority === "HIGH"
                ? "text-amber-400"
                : "text-cyan-400"
            }`}
          >
            {priority}
          </span>
        </div>

        {/* Required Affected Citizens */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Required Affected Citizens
          </span>
          <span className="text-lg font-black font-mono text-white block">
            {requiredThreshold} Citizens
          </span>
        </div>

        {/* Current Affected Citizens */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Current Affected Citizens
          </span>
          <span
            className={`text-lg font-black font-mono block ${
              isThresholdReached ? "text-emerald-400" : "text-cyan-400"
            }`}
          >
            {currentAffected} Citizens
          </span>
        </div>
      </div>

      {/* Progress Representation */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Community Escalation Progress</span>
          </span>
          <span className="font-mono text-sm font-black text-white">
            {currentAffected} / {requiredThreshold} ({progressPercent}%)
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <ProgressBar
          value={progressPercent}
          variant={isThresholdReached ? "rose" : "indigo"}
          size="lg"
          showPercentage={false}
        />

        {/* Visual Block Stepper Pattern */}
        <div className="flex items-center gap-1.5 pt-1">
          {Array.from({ length: requiredThreshold }).map((_, idx) => {
            const isFilled = idx < currentAffected;
            return (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isFilled
                    ? isThresholdReached
                      ? "bg-rose-500 shadow-rose-glow"
                      : "bg-cyan-400 shadow-cyan-glow"
                    : "bg-slate-800"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* STATE 1: WHEN THRESHOLD IS REACHED (🚨 THRESHOLD REACHED) */}
      {isThresholdReached ? (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-rose-950/90 via-slate-950 to-slate-950 border-2 border-rose-500/60 shadow-2xl space-y-5 animate-in zoom-in-95 duration-400">
          {/* Big Alert Banner */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-rose-glow shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-rose-400 tracking-tight">
                  🚨 THRESHOLD REACHED
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-500 text-rose-200 font-bold animate-pulse">
                  AUTO-DISPATCH ACTIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                &quot;This issue has been automatically escalated to the responsible authority.&quot;
              </p>
            </div>
          </div>

          {/* Detailed Escalation Telemetry Card */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-500/30 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Issue ID
                </span>
                <span className="text-white font-mono font-black text-sm">
                  {issueId}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Priority
                </span>
                <span className="text-rose-400 font-mono font-black text-sm">
                  {priority} (EMERGENCY QUEUE)
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Department
                </span>
                <span className="text-white font-bold flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{departmentName}</span>
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Authority
                </span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{authorityName}</span>
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Escalation Time
                </span>
                <span className="text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{new Date().toLocaleTimeString()} (Autonomous System Trigger)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: PRE-THRESHOLD / PROGRESS ACTIVE */
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Flame className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Needs <strong className="text-white font-mono">{requiredThreshold - currentAffected} more affected citizen signatures</strong> to trigger autonomous municipal dispatch.
            </span>
          </div>
          <Badge variant="cyan" size="sm">Quorum In Progress</Badge>
        </div>
      )}

      {/* Interactive Simulation Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="glow"
            size="md"
            onClick={handleAddAffected}
            leftIcon={<Users className="w-4 h-4" />}
            className="text-xs font-black uppercase tracking-wider"
          >
            Mark Myself Affected (+1 Impact)
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs text-slate-400 hover:text-white"
          >
            Reset Test
          </Button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">
          Simulate citizen consensus in real-time
        </span>
      </div>
    </div>
  );
}
