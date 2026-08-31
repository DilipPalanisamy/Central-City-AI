"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CivicIssue } from "@/types";
import { useCivicStore } from "@/lib/mockStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import {
  CheckCircle2,
  AlertTriangle,
  Camera,
  UploadCloud,
  Clock,
  Wrench,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  Send,
  Building2,
  Users,
  Award,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export interface CitizenResolutionVerificationProps {
  issue: CivicIssue;
  onVerificationComplete?: () => void;
}

const SAMPLE_DISPUTE_PHOTOS = [
  {
    id: "dispute_uneven",
    name: "Uneven Patch & Sharp Edges",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    reason: "Asphalt patch is 3cm lower than road level and creates a violent tyre bump.",
  },
  {
    id: "dispute_flicker",
    name: "Lights Still Dark at Night",
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80",
    reason: "2 out of 8 streetlights are completely off after 8 PM.",
  },
  {
    id: "dispute_leak",
    name: "Subsurface Seepage Persisting",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    reason: "Water is still gushing from beneath the freshly laid sidewalk pavers.",
  },
];

export function CitizenResolutionVerification({
  issue,
  onVerificationComplete,
}: CitizenResolutionVerificationProps) {
  const { addToast } = useCivicStore();

  // Verification step state:
  // "initial" -> user sees Problem Resolved & Before/After proof, asks "Is the problem actually fixed?"
  // "confirmed_fixed" -> user clicked YES, FIXED
  // "dispute_form" -> user clicked NO, STILL EXISTS, filling Upload New Evidence + What is still wrong
  // "reopened_success" -> user submitted reopening request
  const [verificationState, setVerificationState] = useState<
    "initial" | "confirmed_fixed" | "dispute_form" | "reopened_success"
  >("initial");

  const [disputeImageUrl, setDisputeImageUrl] = useState<string>(
    SAMPLE_DISPUTE_PHOTOS[0].url
  );
  const [selectedDisputeSampleId, setSelectedDisputeSampleId] = useState(
    SAMPLE_DISPUTE_PHOTOS[0].id
  );
  const [whatIsWrongNotes, setWhatIsWrongNotes] = useState(
    "The road patch has an uneven depression and sharp edges. Vehicles and cyclists are still swerving abruptly into incoming traffic."
  );
  const [selectedReasons, setSelectedReasons] = useState<string[]>([
    "Substandard compaction / uneven surface",
    "Hazard still presents danger to traffic",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle YES, FIXED
  const handleConfirmFixed = () => {
    setVerificationState("confirmed_fixed");
    addToast(
      "Resolution Ratified (+25 Karma)",
      "Thank you for confirming resolution! Public consensus ledger updated.",
      "success"
    );
    if (onVerificationComplete) onVerificationComplete();
  };

  // Handle NO, STILL EXISTS
  const handleSelectNo = () => {
    setVerificationState("dispute_form");
  };

  // Handle Dispute Sample Selector
  const handleSelectDisputeSample = (sample: typeof SAMPLE_DISPUTE_PHOTOS[0]) => {
    setSelectedDisputeSampleId(sample.id);
    setDisputeImageUrl(sample.url);
    setWhatIsWrongNotes(sample.reason);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedDisputeSampleId("custom");
      setDisputeImageUrl(url);
    }
  };

  // Handle Submit Reopening Request
  const handleSubmitReopening = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setVerificationState("reopened_success");
      addToast(
        "Work Order Reopened (+30 Karma)",
        `Dispute registered. ${issue.trackingNumber} reopened for mandatory municipal re-inspection!`,
        "warning"
      );
    }, 500);
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  return (
    <div className="rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-300">
      {/* ─────────────────────────────────────────────────────────────
          STATE 1: INITIAL RESOLUTION REVIEW
          Shows: PROBLEM RESOLVED, Before image, After image,
          Resolution details, and asks "Is the problem actually fixed?"
      ───────────────────────────────────────────────────────────── */}
      {verificationState === "initial" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-emerald-glow">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Municipal Resolution Sign-Off</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              PROBLEM RESOLVED
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              The assigned municipal field department has completed repairs and submitted photo verification proof to the civic ledger.
            </p>
          </div>

          {/* Before Image vs After Image Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Image */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Before (Citizen Reported Defect)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Initial State</span>
              </div>

              <div className="relative h-48 sm:h-60 rounded-2xl overflow-hidden bg-slate-900 border-2 border-rose-500/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.media.primaryImageUrl}
                  alt="Before defect"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                  Initial Hazard
                </span>
              </div>
            </div>

            {/* After Image */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  After (Official Resolution Proof)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">
                  Repaired On-Site
                </span>
              </div>

              <div className="relative h-48 sm:h-60 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/50 shadow-emerald-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    issue.media.resolvedImageUrl ||
                    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80"
                  }
                  alt="After repaired proof"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Resolution Proof Photo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Resolution Details Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Official Resolution Details
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                Resolved in 13.2 Hours (Within 24h SLA)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Action Taken:</span>
                <p className="text-white font-medium mt-0.5">
                  {issue.requiredAction?.intervention ||
                    "Full asphalt excavation, sub-base compaction, and hot-mix asphalt seal with heavy roller finish."}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Resolved By:</span>
                <p className="text-cyan-300 font-medium mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {issue.departmentAssigned?.assignedOfficer || "Technician Leo Rossi"} (
                    {issue.departmentAssigned?.name || "City Response Team"})
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Verification Call to Action: "Is the problem actually fixed?" */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-500/30 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
                Community Verification Protocol
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                &quot;Is the problem actually fixed?&quot;
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your physical verification holds municipal departments accountable and finalizes closure on the public ledger.
              </p>
            </div>

            {/* The 2 Core Decision Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              {/* BUTTON 1: YES, FIXED */}
              <Button
                type="button"
                variant="glow"
                size="lg"
                onClick={handleConfirmFixed}
                className="w-full text-xs sm:text-sm font-black uppercase tracking-wider py-4 bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-glow"
                leftIcon={<CheckCircle2 className="w-5 h-5 text-slate-950" />}
              >
                YES, FIXED (+25 Karma)
              </Button>

              {/* BUTTON 2: NO, STILL EXISTS */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSelectNo}
                className="w-full text-xs sm:text-sm font-black uppercase tracking-wider py-4 border-rose-500/50 hover:bg-rose-950/40 text-rose-300 hover:text-white"
                leftIcon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
              >
                NO, STILL EXISTS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STATE 2: CONFIRMED FIXED (YES, FIXED)
      ───────────────────────────────────────────────────────────── */}
      {verificationState === "confirmed_fixed" && (
        <div className="space-y-6 text-center animate-in zoom-in-95 duration-400 max-w-xl mx-auto py-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-emerald-glow">
              <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="emerald" size="md">
              Community Consensus Ratified
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Resolution Confirmed & Finalized!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Thank you for verifying! Your confirmation has been stamped on the public civic ledger.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">Civic Karma Rewarded:</span>
            <span className="text-cyan-400 font-mono font-black text-sm">+25 Karma Added</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setVerificationState("initial")}
            >
              Re-Inspect Before & After Proof
            </Button>
            <Link href="/citizen">
              <Button variant="glow" size="md">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STATE 3: DISPUTE & REOPENING FORM (When user selects NO, STILL EXISTS)
          Shows: Upload New Evidence, What is still wrong?, Submit Reopening Request
      ───────────────────────────────────────────────────────────── */}
      {verificationState === "dispute_form" && (
        <form onSubmit={handleSubmitReopening} className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black shadow-rose-glow">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Flag Resolution Dispute</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dispute Resolution & Reopen Work Order
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              Provide photographic proof and describe why the hazard is still defective. This will trigger mandatory municipal re-inspection.
            </p>
          </div>

          {/* 1. UPLOAD NEW EVIDENCE */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-400" />
                <span>1. Upload New Evidence (Current Photo)</span>
              </span>

              <label className="cursor-pointer text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomUpload}
                />
              </label>
            </div>

            {/* Current Evidence Preview */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={disputeImageUrl}
                alt="New evidence capture"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                New Disputed Evidence Photo
              </span>
            </div>

            {/* Quick Sample Dispute Photo Selectors */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Or select simulated on-site dispute scenario:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_DISPUTE_PHOTOS.map((sample) => {
                  const isSelected = selectedDisputeSampleId === sample.id;
                  return (
                    <button
                      type="button"
                      key={sample.id}
                      onClick={() => handleSelectDisputeSample(sample)}
                      className={`p-2 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                        isSelected
                          ? "bg-rose-950/60 border-rose-500/50 text-white shadow-rose-glow"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-12 h-10 object-cover rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] block truncate text-white">
                          {sample.name}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {sample.reason}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. WHAT IS STILL WRONG? */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>2. What is still wrong? (Describe Remaining Defect)</span>
              </label>
              <Textarea
                value={whatIsWrongNotes}
                onChange={(e) => setWhatIsWrongNotes(e.target.value)}
                placeholder="Explain why the repair is inadequate, missing components, or still unsafe..."
                rows={3}
                required
              />
            </div>

            {/* Quick Reason Checkbox Tags */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Select Key Defect Factors:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  "Substandard compaction / uneven surface",
                  "Hazard still presents danger to traffic",
                  "Streetlight / signal circuit still failing at night",
                  "Debris or temporary warning crude barricade left behind",
                ].map((reason) => {
                  const isChecked = selectedReasons.includes(reason);
                  return (
                    <button
                      type="button"
                      key={reason}
                      onClick={() => toggleReason(reason)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        isChecked
                          ? "bg-rose-950/60 border-rose-500/50 text-white"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? "bg-rose-500 border-rose-400 text-slate-950" : "border-slate-700"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{reason}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. SUBMIT REOPENING REQUEST BUTTON */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setVerificationState("initial")}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to Before & After Proof
            </button>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              disabled={isSubmitting}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto text-xs sm:text-sm font-black uppercase tracking-wider px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white shadow-rose-glow"
            >
              {isSubmitting ? "Broadcasting Dispute..." : "Submit Reopening Request (+30 Karma)"}
            </Button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STATE 4: REOPENED SUCCESS RECEIPT
      ───────────────────────────────────────────────────────────── */}
      {verificationState === "reopened_success" && (
        <div className="space-y-6 text-center animate-in zoom-in-95 duration-400 max-w-xl mx-auto py-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-rose-glow">
              <RotateCcw className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="rose" size="md">
              Work Order Reopened & Disputed
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Reopening Request Registered!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your photo evidence and dispute notes have been logged on the public civic ledger. Municipal Field Command and Quality Control have been officially notified for mandatory re-inspection.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-cyan-400 font-bold">{issue.trackingNumber}</span>
              <Badge variant="amber" size="sm">Audit Reopened</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Citizen Dispute: </strong>
              {whatIsWrongNotes}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span>Target: Municipal Quality Control</span>
              <span className="text-amber-400 font-bold">+30 Vigilance Karma Awarded</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/community">
              <Button variant="outline" size="md">
                View Community Ledger
              </Button>
            </Link>
            <Link href="/citizen">
              <Button variant="glow" size="md">
                Return to Citizen Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
