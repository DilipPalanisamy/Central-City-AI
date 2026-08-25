"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCivicStore } from "@/lib/mockStore";
import {
  Sliders,
  Flame,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Zap,
} from "lucide-react";

export interface ThresholdRuleConfig {
  tier: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  label: string;
  requiredSupport: number; // Required affected citizens
  autoEscalationHours: number;
  slaTargetHours: number;
  description: string;
  badgeVariant: "indigo" | "cyan" | "amber" | "rose";
  colorText: string;
  borderColor: string;
  bgGradient: string;
}

export function AdminThresholdRulesView() {
  const { addToast } = useCivicStore();

  const [rules, setRules] = useState<ThresholdRuleConfig[]>([
    {
      tier: "LOW",
      label: "Low Priority (Minor Defect)",
      requiredSupport: 25,
      autoEscalationHours: 168, // 7 days
      slaTargetHours: 72,
      description: "Cosmetic wear, faded road markings, non-hazardous park fixture defects.",
      badgeVariant: "indigo",
      colorText: "text-indigo-400",
      borderColor: "border-indigo-500/30 hover:border-indigo-500",
      bgGradient: "bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950",
    },
    {
      tier: "MEDIUM",
      label: "Medium Priority (Moderate Hazard)",
      requiredSupport: 12,
      autoEscalationHours: 72, // 3 days
      slaTargetHours: 24,
      description: "Sidewalk paver trip hazards, illegal dumping, single streetlight outages.",
      badgeVariant: "cyan",
      colorText: "text-cyan-400",
      borderColor: "border-cyan-500/30 hover:border-cyan-500",
      bgGradient: "bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950",
    },
    {
      tier: "HIGH",
      label: "High Priority (Active Hazard)",
      requiredSupport: 5,
      autoEscalationHours: 24, // 1 day
      slaTargetHours: 6,
      description: "Deep roadway potholes on transit corridors, water main pressure leaks.",
      badgeVariant: "amber",
      colorText: "text-amber-400",
      borderColor: "border-amber-500/40 hover:border-amber-500",
      bgGradient: "bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950",
    },
    {
      tier: "CRITICAL",
      label: "Critical Priority (Life & Safety Hazard)",
      requiredSupport: 3,
      autoEscalationHours: 4, // 4 hours
      slaTargetHours: 2,
      description: "Open high-voltage electrical wires, exposed manholes, road collapses.",
      badgeVariant: "rose",
      colorText: "text-rose-400",
      borderColor: "border-rose-500/40 hover:border-rose-500 shadow-rose-glow",
      bgGradient: "bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950",
    },
  ]);

  const [aiConfidenceMultiplier, setAiConfidenceMultiplier] = useState(true);
  const [mayoralFastTrack, setMayoralFastTrack] = useState(true);

  const handleSupportChange = (tier: string, value: number) => {
    setRules((prev) =>
      prev.map((r) => (r.tier === tier ? { ...r, requiredSupport: Math.max(1, value) } : r))
    );
  };

  const handleSaveConfig = () => {
    addToast(
      "Threshold Matrix Saved",
      "Dynamic escalation threshold quorums updated across all city wards.",
      "success"
    );
  };

  const handleResetDefaults = () => {
    setRules([
      { ...rules[0], requiredSupport: 25 },
      { ...rules[1], requiredSupport: 12 },
      { ...rules[2], requiredSupport: 5 },
      { ...rules[3], requiredSupport: 3 },
    ]);
    addToast("Reset to Default", "Escalation thresholds reset to factory civic matrix.", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Autonomous Governance Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Adaptive Threshold & Democratic Escalation Rules
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Configure the required number of affected citizen signatures and SLA countdowns needed to automatically escalate complaints directly to municipal authorities.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Defaults
          </Button>
          <Button
            variant="glow"
            size="sm"
            onClick={handleSaveConfig}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            Save Rules
          </Button>
        </div>
      </div>

      {/* 4 TIER RULE CARDS: LOW, MEDIUM, HIGH, CRITICAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rules.map((rule) => {
          return (
            <div
              key={rule.tier}
              className={`p-5 rounded-3xl border ${rule.borderColor} ${rule.bgGradient} shadow-glass space-y-4 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                {/* Top Badge & Tier Name */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-black font-mono tracking-wider ${rule.colorText}`}
                  >
                    {rule.tier}
                  </span>
                  <Badge variant={rule.badgeVariant} size="sm">
                    {rule.slaTargetHours}h Target SLA
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {rule.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed min-h-[44px]">
                    {rule.description}
                  </p>
                </div>

                {/* REQUIRED SUPPORT INPUT */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Required Support:</span>
                    <span className={`font-mono text-sm font-black ${rule.colorText}`}>
                      {rule.requiredSupport} Citizens
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={rule.requiredSupport}
                    onChange={(e) =>
                      handleSupportChange(rule.tier, parseInt(e.target.value, 10))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 Citizen</span>
                    <span>50 Citizens</span>
                  </div>
                </div>
              </div>

              {/* Bottom Rule Metrics */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Auto-Escalation Window:</span>
                  <span className="font-mono text-white font-bold">
                    {rule.autoEscalationHours}h
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Quorum Trigger:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    Autonomous Dispatch
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Policy Automation Toggles */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Advanced AI & Democratic Escalation Policies</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Toggle 1 */}
          <div
            onClick={() => setAiConfidenceMultiplier(!aiConfidenceMultiplier)}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <span className="font-bold text-white block">
                AI Vision Confidence Threshold Reducer
              </span>
              <p className="text-slate-400 text-[11px]">
                When AI Computer Vision confidence exceeds 92%, automatically reduce required citizen quorum signatures by 40%.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                aiConfidenceMultiplier
                  ? "bg-cyan-500 border-cyan-400 text-slate-950"
                  : "border-slate-700"
              }`}
            >
              {aiConfidenceMultiplier && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Toggle 2 */}
          <div
            onClick={() => setMayoralFastTrack(!mayoralFastTrack)}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <span className="font-bold text-white block">
                Mayoral Level 3 Emergency Override
              </span>
              <p className="text-slate-400 text-[11px]">
                Automatically bypass quorum and immediately dispatch public works if a critical hazard is verified by 2+ certified Civic Guardians.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                mayoralFastTrack
                  ? "bg-amber-500 border-amber-400 text-slate-950"
                  : "border-slate-700"
              }`}
            >
              {mayoralFastTrack && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
