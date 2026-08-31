"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import {
  Wrench,
  Building2,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from "lucide-react";

export interface RequiredActionData {
  urgencyTier: "EMERGENCY_IMMEDIATE" | "HIGH_PRIORITY_6H" | "STANDARD_24H";
  desiredIntervention: string;
  departmentTarget: string;
  requestCommunityQuorum: boolean;
  notifyOnArrival: boolean;
}

export interface Step5RequiredActionProps {
  initialData: RequiredActionData;
  suggestedDept: string;
  onActionConfirmed: (data: RequiredActionData) => void;
  onBack: () => void;
}

export function Step5RequiredAction({
  initialData,
  suggestedDept,
  onActionConfirmed,
  onBack,
}: Step5RequiredActionProps) {
  const [urgencyTier, setUrgencyTier] = useState<RequiredActionData["urgencyTier"]>(
    initialData.urgencyTier || "HIGH_PRIORITY_6H"
  );
  const [desiredIntervention, setDesiredIntervention] = useState(
    initialData.desiredIntervention || "Full Asphalt Milling, Base Compaction & Hot-Mix Patch"
  );
  const [departmentTarget, setDepartmentTarget] = useState(
    initialData.departmentTarget || suggestedDept
  );
  const [requestCommunityQuorum, setRequestCommunityQuorum] = useState(
    initialData.requestCommunityQuorum !== false
  );
  const [notifyOnArrival, setNotifyOnArrival] = useState(
    initialData.notifyOnArrival !== false
  );

  const urgencyOptions: {
    id: RequiredActionData["urgencyTier"];
    label: string;
    sla: string;
    description: string;
    badgeColor: "rose" | "amber" | "cyan";
  }[] = [
    {
      id: "EMERGENCY_IMMEDIATE",
      label: "Emergency Rapid Dispatch",
      sla: "2 - 4 Hours SLA",
      description: "Severe hazard blocking traffic, live open drops, or active water bursts.",
      badgeColor: "rose",
    },
    {
      id: "HIGH_PRIORITY_6H",
      label: "High Priority Remediation",
      sla: "6 - 8 Hours SLA",
      description: "Significant infrastructure defect impacting daily commuter safety.",
      badgeColor: "amber",
    },
    {
      id: "STANDARD_24H",
      label: "Standard Municipal Queue",
      sla: "24 Hours SLA",
      description: "Non-critical cosmetic maintenance or low-traffic area repairs.",
      badgeColor: "cyan",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActionConfirmed({
      urgencyTier,
      desiredIntervention,
      departmentTarget,
      requestCommunityQuorum,
      notifyOnArrival,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <Badge variant="emerald" size="sm">
          Step 5: Authority Action Request
        </Badge>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Specify Required Municipal Action
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Define the requested repair intervention, target department, and SLA urgency level.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Urgency SLA Tier Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Target SLA Urgency Level
          </label>
          <div className="space-y-2.5">
            {urgencyOptions.map((opt) => {
              const isSelected = urgencyTier === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setUrgencyTier(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-slate-900 border-cyan-400 shadow-cyan-glow ring-1 ring-cyan-500/30"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{opt.label}</span>
                      <Badge variant={opt.badgeColor} size="sm">
                        {opt.sla}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desired Intervention Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Requested Technical Intervention
          </label>
          <input
            type="text"
            value={desiredIntervention}
            onChange={(e) => setDesiredIntervention(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="e.g. Full Asphalt Patch & Compaction"
            required
          />
        </div>

        {/* Department Target Routing */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Assigned Municipal Department</span>
          </label>
          <select
            value={departmentTarget}
            onChange={(e) => setDepartmentTarget(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <option value="Department of Roads & Infrastructure">
              Department of Roads & Infrastructure (PWD-RDS)
            </option>
            <option value="Municipal Water Supply & Drainage Board">
              Municipal Water Supply & Drainage Board (MWSSB)
            </option>
            <option value="Solid Waste & Urban Sanitation Board">
              Solid Waste & Urban Sanitation Board (SWUSB)
            </option>
            <option value="City Energy & Street Lighting Grid">
              City Energy & Street Lighting Grid (CESG)
            </option>
            <option value="Traffic Management & Pedestrian Safety">
              Traffic Management & Pedestrian Safety (TMPS)
            </option>
          </select>
        </div>

        {/* Additional Civic Protocols Toggles */}
        <div className="space-y-2.5 pt-2">
          <div
            onClick={() => setRequestCommunityQuorum(!requestCommunityQuorum)}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 font-medium">
                Request Local Civic Guardian Consensus Validation
              </span>
            </div>
            <input
              type="checkbox"
              checked={requestCommunityQuorum}
              readOnly
              className="rounded bg-slate-900 border-slate-700 text-cyan-500"
            />
          </div>

          <div
            onClick={() => setNotifyOnArrival(!notifyOnArrival)}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center space-x-2.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">
                Send Real-Time Push Notification When Field Crew Dispatches
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyOnArrival}
              readOnly
              className="rounded bg-slate-900 border-slate-700 text-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Description
        </Button>

        <Button
          type="submit"
          variant="glow"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Review Report
        </Button>
      </div>
    </form>
  );
}
