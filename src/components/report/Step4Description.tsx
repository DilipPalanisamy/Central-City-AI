"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  Wrench,
  MapPin,
  Info,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export interface DescriptionData {
  title: string;
  problemDescription: string;
  requiredAction: string;
  landmark?: string;
  additionalInfo?: string;
}

export interface Step4DescriptionProps {
  data: DescriptionData;
  onChange: (data: DescriptionData) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step4Description({
  data,
  onChange,
  onContinue,
  onBack,
}: Step4DescriptionProps) {
  const [touched, setTouched] = useState(false);

  const isProblemValid = Boolean(data.problemDescription && data.problemDescription.trim().length >= 5);
  const isActionValid = Boolean(data.requiredAction && data.requiredAction.trim().length >= 3);
  const isFormValid = isProblemValid && isActionValid;

  const handleContinue = () => {
    setTouched(true);
    if (isFormValid) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 04: Problem Details &amp; Required Action</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Describe the Civic Problem
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Specify what is physically damaged and the exact municipal intervention needed.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Field 1: "What is the problem?" */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>What is the problem?</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {data.problemDescription?.length || 0} chars
            </span>
          </div>

          <textarea
            rows={4}
            value={data.problemDescription}
            onChange={(e) =>
              onChange({ ...data, problemDescription: e.target.value })
            }
            placeholder="Describe what is broken, hazardous, or in need of maintenance..."
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 leading-relaxed transition-all"
          />
          {touched && !isProblemValid && (
            <span className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Please provide a brief description of the issue (minimum 5 characters).
            </span>
          )}
        </div>

        {/* Field 2: "What needs to be done?" (Required Action) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>What needs to be done? (Required Action)</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {data.requiredAction?.length || 0} chars
            </span>
          </div>

          <textarea
            rows={3}
            value={data.requiredAction}
            onChange={(e) =>
              onChange({ ...data, requiredAction: e.target.value })
            }
            placeholder="e.g. Repair damaged asphalt surface, fill potholes, replace luminaire bulb, clear storm drain..."
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 leading-relaxed transition-all"
          />
          {touched && !isActionValid && (
            <span className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Please specify the required action or repair.
            </span>
          )}
        </div>

        {/* Optional Fields Container */}
        <div className="space-y-4 pt-4 border-t border-slate-850">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optional Context Details</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Landmark */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Landmark or Nearby Junction
              </label>
              <input
                type="text"
                value={data.landmark || ""}
                onChange={(e) =>
                  onChange({ ...data, landmark: e.target.value })
                }
                placeholder="e.g. Near Avinashipalayam Main Bus Stop"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Additional Notes
              </label>
              <input
                type="text"
                value={data.additionalInfo || ""}
                onChange={(e) =>
                  onChange({ ...data, additionalInfo: e.target.value })
                }
                placeholder="e.g. Water collects in crater after rain"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-xs font-bold text-slate-400 hover:text-white"
          >
            ← BACK TO LOCATION
          </Button>

          <Button
            variant="glow"
            size="md"
            onClick={handleContinue}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
          >
            CONTINUE TO REVIEW →
          </Button>
        </div>
      </div>
    </div>
  );
}
