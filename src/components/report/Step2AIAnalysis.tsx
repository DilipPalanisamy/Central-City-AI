"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  analyzeImage,
  calculatePriorityFromSeverity,
  calculateSLAHours,
  AIAnalysisResult,
} from "@/lib/ai/analyzeImage";
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Check,
  Edit2,
  Scan,
  ShieldCheck,
  HelpCircle,
  Info,
  XCircle,
  UploadCloud,
} from "lucide-react";

export interface Step2AIAnalysisProps {
  imageUrl: string;
  fileName?: string;
  category: string;
  onCategoryChange: (category: string, aiResult?: AIAnalysisResult) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CATEGORY_SELECTOR_OPTIONS = [
  "Road Damage",
  "Pothole",
  "Broken Streetlight",
  "Water Infrastructure",
  "Garbage",
  "Drainage",
  "Other",
];

const PROCESSING_STAGES = [
  "Image quality check",
  "Object & scene identification",
  "Assessing physical damage",
  "Calculating severity",
  "Determining civic priority",
];

export function Step2AIAnalysis({
  imageUrl,
  fileName,
  category,
  onCategoryChange,
  onContinue,
  onBack,
}: Step2AIAnalysisProps) {
  // Staggered processing animation state
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number>(0);
  const [isProcessingDone, setIsProcessingDone] = useState<boolean>(false);
  const [showCategorySelector, setShowCategorySelector] = useState<boolean>(false);

  // Dynamic AI Result State
  const [aiResult, setAiResult] = useState<AIAnalysisResult>({
    isReportable: true,
    detectedObject: "Damaged Paved Road",
    issueType: "Road Damage",
    damageDetected: true,
    severity: 82,
    confidence: 91,
    priority: "CRITICAL",
    explanation: "Visible road surface deterioration and pothole damage detected.",
    suggestedDepartment: "Department of Roads & Infrastructure",
    slaHours: 2,
    isModelConnected: false,
    serviceStatus: "FRONTEND_IMAGE_HEURISTICS",
    modelName: "CityVision-v4.2-Pro",
  });

  useEffect(() => {
    let isMounted = true;

    async function runAnalysis() {
      const result = await analyzeImage({
        imageSource: imageUrl,
        fileName: fileName,
        categoryHint: category,
      });

      if (isMounted) {
        setAiResult(result);
        onCategoryChange(result.issueType || category, result);
      }
    }

    runAnalysis();

    // Step through each stage with realistic staggered timing
    const timers = [
      setTimeout(() => isMounted && setCurrentProcessingIndex(1), 300),
      setTimeout(() => isMounted && setCurrentProcessingIndex(2), 600),
      setTimeout(() => isMounted && setCurrentProcessingIndex(3), 950),
      setTimeout(() => isMounted && setCurrentProcessingIndex(4), 1300),
      setTimeout(() => {
        if (isMounted) {
          setCurrentProcessingIndex(5);
          setIsProcessingDone(true);
        }
      }, 1650),
    ];

    return () => {
      isMounted = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [imageUrl, fileName]);

  const handleSelectCategory = (catName: string) => {
    let newSeverity = 75;
    let newExplanation = "Civic defect identified requiring municipal inspection.";

    if (catName === "Road Damage" || catName === "Pothole") {
      newSeverity = 82;
      newExplanation = "Visible road surface deterioration and pothole damage detected.";
    } else if (catName === "Water Infrastructure") {
      newSeverity = 58;
      newExplanation = "Pressurized water pipeline seepage causing localized surface flooding.";
    } else if (catName === "Garbage") {
      newSeverity = 45;
      newExplanation = "Uncontained commercial refuse and debris accumulation obstructing public access.";
    } else if (catName === "Broken Streetlight") {
      newSeverity = 64;
      newExplanation = "Damaged streetlight luminaire producing dark visibility hazards.";
    } else if (catName === "Drainage") {
      newSeverity = 72;
      newExplanation = "Blocked stormwater catch basin threatening monsoon overflow.";
    }

    const newPriority = calculatePriorityFromSeverity(newSeverity, catName);
    const newSla = calculateSLAHours(newPriority);

    const updatedResult: AIAnalysisResult = {
      ...aiResult,
      isReportable: true,
      damageDetected: true,
      issueType: catName,
      severity: newSeverity,
      priority: newPriority,
      explanation: newExplanation,
      slaHours: newSla,
    };

    setAiResult(updatedResult);
    onCategoryChange(catName, updatedResult);
    setShowCategorySelector(false);
  };

  const getPriorityBadgeVariant = (p: string | null) => {
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
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 02: AI Problem Detection &amp; Damage Triage</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          AI Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          First checking for detectable civic damage, then calculating severity and priority.
        </p>
      </div>

      {/* ================================================== */}
      {/* 1. ANIMATED PROCESSING STAGES */}
      {/* ================================================== */}
      {!isProcessingDone ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="w-full h-full rounded-full flex items-center justify-center text-cyan-400">
                <Scan className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Analyzing Evidence
            </h3>
            <p className="text-xs text-slate-400">
              Evaluating image quality, identifying objects, and checking for physical damage...
            </p>
          </div>

          {/* Animated Stages Checklist */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            {PROCESSING_STAGES.map((stage, idx) => {
              const isDone = currentProcessingIndex > idx;
              const isCurrent = currentProcessingIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isDone
                      ? "text-emerald-400"
                      : isCurrent
                      ? "text-cyan-300 animate-pulse"
                      : "text-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                        isDone
                          ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                          : isCurrent
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300"
                          : "bg-slate-950 border-slate-800 text-slate-700"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span>{stage}</span>
                  </div>

                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ✓ Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : !aiResult.damageDetected ? (
        /* ================================================== */
        /* 2. NORMAL / NO CIVIC ISSUE DETECTED (REJECTION)    */
        /* ================================================== */
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
          {/* Header Card */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  ✓ {aiResult.detectedObject.toUpperCase()} DETECTED
                </h3>
                <span className="text-[11px] text-slate-400">
                  Infrastructure Health Scan Complete
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              Damage Detected: NO
            </span>
          </div>

          {/* Photo Preview & Non-Damaged Findings */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Non-damaged evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-950/20 border-2 border-emerald-500/40 rounded-2xl flex items-center justify-center pointer-events-none">
                <span className="bg-slate-950/90 text-emerald-400 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-emerald-500/50">
                  HEALTHY CONDITION
                </span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">AI Classification:</span>
                  <span className="text-emerald-400 font-mono font-bold">{aiResult.detectedObject}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Damage Detected:</span>
                  <span className="text-emerald-400 font-mono font-black">NO (Clean / Functional)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">AI Confidence:</span>
                  <span className="text-cyan-400 font-mono font-bold">{aiResult.confidence}%</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                  <span className="font-bold text-slate-400">Assigned Priority:</span>
                  <span className="text-slate-500 font-mono">None (No Defect)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                <p className="leading-relaxed">
                  &ldquo;{aiResult.explanation}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* User Advisory Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 text-center space-y-1">
            <span className="font-bold text-white block">
              This image does not appear to contain a reportable civic problem.
            </span>
            <p className="text-slate-400 text-[11px]">
              Central-City-AI preserves municipal emergency bandwidth by verifying real structural damage before dispatching work crews.
            </p>
          </div>

          {/* Action Button: [ UPLOAD ANOTHER PHOTO ] */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              ← Back to Photo
            </Button>

            <Button
              type="button"
              variant="glow"
              size="md"
              onClick={onBack}
              leftIcon={<UploadCloud className="w-4 h-4" />}
              className="text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-emerald-glow"
            >
              UPLOAD ANOTHER PHOTO
            </Button>
          </div>
        </div>
      ) : (
        /* ================================================== */
        /* 3. ACTUAL DAMAGE DETECTED (FULL SCORECARD & GAUGE) */
        /* ================================================== */
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-6">
            {/* Header & Simulated AI Disclaimer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    AI DAMAGE ASSESSMENT COMPLETE
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Structural Defect Verified on Civic Grid
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {aiResult.isModelConnected
                    ? "Live AI Vision Endpoint Connected"
                    : "Awaiting AI Model Backend Endpoint (Client Heuristics)"}
                </span>
              </div>
            </div>

            {/* Photo Evidence with AI Bounding Box & 4 Detected Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Evidence Photo Preview */}
              <div className="md:col-span-5 relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Analyzed civic defect evidence"
                  className="w-full h-full object-cover"
                />
                {/* Neural Bounding Box Overlay */}
                <div className="absolute inset-3 border-2 border-dashed border-cyan-400 rounded-xl pointer-events-none bg-cyan-500/10 flex flex-col justify-between p-2">
                  <span className="self-start bg-cyan-950/90 text-[9px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40">
                    TARGET: {aiResult.issueType?.toUpperCase()}
                  </span>
                  <span className="self-end bg-slate-950/90 text-[9px] font-mono font-bold text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/40">
                    DAMAGE: YES
                  </span>
                </div>
              </div>

              {/* 4 Detected Information Cards */}
              <div className="md:col-span-7 grid grid-cols-2 gap-3">
                {/* Detected Issue Card */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Detected Issue:
                  </span>
                  <span className="text-base font-black text-white block truncate">
                    {aiResult.issueType}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {aiResult.suggestedDepartment}
                  </span>
                </div>

                {/* AI Severity Card */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    AI Severity:
                  </span>
                  <span className="text-base font-black text-rose-400 font-mono block">
                    {aiResult.severity} / 100
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">
                    Damage Score
                  </span>
                </div>

                {/* AI Confidence Card */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    AI Confidence:
                  </span>
                  <span className="text-base font-black text-cyan-400 font-mono block">
                    {aiResult.confidence}%
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Pattern Match
                  </span>
                </div>

                {/* Priority Card */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Priority:
                  </span>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Badge variant={getPriorityBadgeVariant(aiResult.priority) as any} size="md">
                      {aiResult.priority || "MEDIUM"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {aiResult.slaHours}h Target SLA
                  </span>
                </div>
              </div>
            </div>

            {/* Severity Gauge */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Physical Severity Meter &amp; Derived Priority</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-500/30">
                  Current: {aiResult.severity} / 100 ({aiResult.priority})
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className="text-indigo-400">LOW (0-24)</span>
                  <span className="text-cyan-400">MEDIUM (25-49)</span>
                  <span className="text-amber-400">HIGH (50-74)</span>
                  <span className="text-rose-400">CRITICAL (75-100)</span>
                </div>

                <div className="relative w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div style={{ width: "25%" }} className="bg-indigo-500/80 h-full border-r border-slate-900" />
                  <div style={{ width: "25%" }} className="bg-cyan-500/80 h-full border-r border-slate-900" />
                  <div style={{ width: "25%" }} className="bg-amber-500/80 h-full border-r border-slate-900" />
                  <div style={{ width: "25%" }} className="bg-rose-500 h-full shadow-rose-glow" />
                </div>

                <div className="relative pt-1">
                  <div
                    style={{ left: `${Math.min(95, Math.max(5, aiResult.severity || 50))}%` }}
                    className="absolute -top-1.5 -translate-x-1/2 flex flex-col items-center z-10"
                  >
                    <span className="text-rose-400 text-xs font-black">▲</span>
                    <span className="text-[10px] font-mono font-black text-white bg-rose-600 px-2 py-0.5 rounded-full shadow-rose-glow whitespace-nowrap">
                      {aiResult.severity}/100 • {aiResult.priority}
                    </span>
                  </div>
                </div>
                <div className="h-5" />
              </div>
            </div>

            {/* AI Explanation */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Reason:</span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed pl-6">
                &ldquo;{aiResult.explanation}&rdquo;
              </p>
            </div>

            {/* User Verification */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-center">
              <span className="text-xs sm:text-sm font-bold text-white block">
                Does this AI assessment look correct?
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="glow"
                  size="md"
                  onClick={onContinue}
                  leftIcon={<Check className="w-4 h-4 stroke-[3]" />}
                  className="w-full sm:w-auto text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-emerald-glow"
                >
                  YES, CONTINUE
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowCategorySelector(!showCategorySelector)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5 text-cyan-400" />}
                  className="w-full sm:w-auto text-xs font-bold border-slate-700 hover:border-slate-600"
                >
                  CHANGE ISSUE
                </Button>
              </div>

              {/* Category Selector Grid if user clicks CHANGE ISSUE */}
              {showCategorySelector && (
                <div className="pt-4 border-t border-slate-800 space-y-3 text-left animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-slate-300 block">
                    Select the actual civic problem category:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORY_SELECTOR_OPTIONS.map((catName) => {
                      const isSelected = aiResult.issueType === catName;

                      return (
                        <button
                          key={catName}
                          type="button"
                          onClick={() => handleSelectCategory(catName)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-cyan-glow"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                          }`}
                        >
                          {catName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              ← BACK
            </Button>

            <Button
              type="button"
              variant="glow"
              size="md"
              onClick={onContinue}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
            >
              CONTINUE TO LOCATION →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
