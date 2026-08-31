"use client";

import React from "react";
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
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 04: Problem Details &amp; Action</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Problem Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Describe the defect and specify the necessary municipal intervention.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Field 1: "What is the problem?" */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white">
            What is the problem? <span className="text-cyan-400">*</span>
          </label>
          <textarea
            rows={4}
            value={data.problemDescription}
            onChange={(e) =>
              onChange({ ...data, problemDescription: e.target.value })
            }
            placeholder="Describe what is wrong..."
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-850 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 leading-relaxed"
          />
        </div>

        {/* Field 2: "What needs to be done?" */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white">
            What needs to be done? <span className="text-cyan-400">*</span>
          </label>
          <textarea
            rows={3}
            value={data.requiredAction}
            onChange={(e) =>
              onChange({ ...data, requiredAction: e.target.value })
            }
            placeholder="Repair the damaged road surface and fill the potholes."
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-850 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 leading-relaxed"
          />
        </div>

        {/* Optional Fields Container */}
        <div className="space-y-4 pt-2 border-t border-slate-850">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optional Context Details</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Landmark */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Landmark
              </label>
              <input
                type="text"
                value={data.landmark || ""}
                onChange={(e) =>
                  onChange({ ...data, landmark: e.target.value })
                }
                placeholder="e.g. Near Avinashipalayam Main Bus Stop"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Additional information
              </label>
              <input
                type="text"
                value={data.additionalInfo || ""}
                onChange={(e) =>
                  onChange({ ...data, additionalInfo: e.target.value })
                }
                placeholder="e.g. Water collects in crater after rain"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
          >
            Back
          </Button>

          <Button
            variant="glow"
            size="md"
            onClick={onContinue}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  );
}
