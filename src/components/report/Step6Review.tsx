"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SelectedLocationData } from "./Step3LocationMap";
import { DescriptionData } from "./Step4Description";
import {
  Camera,
  Cpu,
  MapPin,
  FileText,
  Wrench,
  Edit2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Globe,
  Info,
} from "lucide-react";

export interface Step6ReviewProps {
  imageUrl: string;
  category: string;
  severity?: number;
  confidence?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  locationData: SelectedLocationData;
  descriptionData: DescriptionData;
  onEditSection: (stepNumber: number) => void;
  onSubmitReport: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function Step6Review({
  imageUrl,
  category = "Road Damage",
  severity = 82,
  confidence = 91,
  priority = "CRITICAL",
  locationData,
  descriptionData,
  onEditSection,
  onSubmitReport,
  onBack,
  isSubmitting = false,
}: Step6ReviewProps) {
  const getPriorityVariant = (p: string) => {
    switch (p) {
      case "CRITICAL":
        return "rose";
      case "HIGH":
        return "amber";
      case "MEDIUM":
        return "indigo";
      default:
        return "cyan";
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 05: Pre-Submission Review</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Review Civic Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Verify evidence photo, AI damage triage, map coordinates, and required repair action before broadcasting.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. PHOTO SECTION */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                PHOTO EVIDENCE
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(1)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-36 w-full sm:w-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Uploaded evidence"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 w-full">
              <span className="font-bold text-white block">Verified Visual Capture</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                This exact image is preserved and will be published directly in the community verification feed and municipal dispatch queue.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Persistent Image Data Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI ANALYSIS SECTION */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                AI DAMAGE VERDICT &amp; TRIAGE
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(2)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-850">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Detected Issue
              </span>
              <span className="font-bold text-white text-sm truncate block">{category}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-850">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                AI Severity Score
              </span>
              <span className="font-mono font-black text-rose-400 text-sm">{severity} / 100</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-850">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                AI Confidence
              </span>
              <span className="font-mono font-black text-cyan-400 text-sm">{confidence}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-850">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Priority Tier
              </span>
              <Badge variant={getPriorityVariant(priority) as any} size="sm">
                {priority} PRIORITY
              </Badge>
            </div>
          </div>
        </div>

        {/* 3. LOCATION SECTION */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                SELECTED GIS LOCATION
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(3)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-sm font-bold text-white block">
                {locationData.address || "Avinashipalayam, Tamil Nadu"}
              </span>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>Coordinates: {locationData.lat?.toFixed(6) || "11.023400"}, {locationData.lng?.toFixed(6) || "77.451200"}</span>
                {locationData.city && <span>• City: {locationData.city}</span>}
              </div>
            </div>

            <Badge variant="cyan" size="sm">
              Map Pin Placed
            </Badge>
          </div>
        </div>

        {/* 4. PROBLEM DESCRIPTION SECTION */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                PROBLEM DESCRIPTION
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(4)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
            {descriptionData.problemDescription ||
              "Severe road damage with crater depression and risk to commuter traffic."}
          </p>
        </div>

        {/* 5. REQUIRED ACTION SECTION */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                SPECIFIC REQUIRED ACTION
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(4)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-900"
            >
              <Edit2 className="w-3 h-3" />
              <span>EDIT</span>
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
            {descriptionData.requiredAction ||
              "Repair the damaged road surface and fill the potholes."}
          </p>
        </div>
      </div>

      {/* Primary Action Button: SUBMIT REPORT */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-xs font-bold text-slate-400 hover:text-white"
        >
          ← BACK
        </Button>

        <Button
          type="button"
          variant="glow"
          size="lg"
          isLoading={isSubmitting}
          onClick={onSubmitReport}
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
          className="w-full sm:w-auto text-xs sm:text-sm font-black uppercase tracking-wider px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
        >
          {isSubmitting ? "BROADCASTING REPORT..." : "SUBMIT REPORT →"}
        </Button>
      </div>
    </div>
  );
}
