"use client";

import React, { useState } from "react";
import { CivicIssue } from "@/types";
import { useCivicStore } from "@/lib/mockStore";
import { BeforeAfterEvidenceUploader } from "./BeforeAfterEvidenceUploader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Wrench,
  CheckCircle2,
  Clock,
  Play,
  RotateCw,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export interface OfficialResolutionPanelProps {
  issue: CivicIssue;
  onResolvedSuccess?: () => void;
}

export function OfficialResolutionPanel({
  issue,
  onResolvedSuccess,
}: OfficialResolutionPanelProps) {
  const { resolveIssue, currentRole, addToast } = useCivicStore();

  // Resolution workflow state
  const [workStatus, setWorkStatus] = useState<
    "not_started" | "in_progress" | "evidence_ready" | "resolved"
  >(issue.status === "resolved" ? "resolved" : issue.status === "in_progress" ? "in_progress" : "not_started");

  const [progressPercent, setProgressPercent] = useState<number>(
    issue.status === "resolved" ? 100 : issue.status === "in_progress" ? 60 : 15
  );

  const [afterImage, setAfterImage] = useState<string | null>(
    issue.media.resolvedImageUrl ||
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80"
  );

  const [actionTaken, setActionTaken] = useState(
    "Full 14cm crater excavation, sub-base compaction, hot-mix asphalt application, and heavy-duty steel roller compaction."
  );

  const [resolutionNotes, setResolutionNotes] = useState(
    "Site inspected by Municipal Field Engineer Marcus Vance. Road surface level tolerance within 2mm. Smooth transition restored for high-speed transit lane."
  );

  const [isResolving, setIsResolving] = useState(false);

  // ACTION 1: START WORK
  const handleStartWork = () => {
    setWorkStatus("in_progress");
    setProgressPercent(35);
    addToast(
      "Field Work Started",
      `Work order for ${issue.trackingNumber} is now officially IN PROGRESS. Field crew timer active.`,
      "info"
    );
  };

  // ACTION 2: UPDATE PROGRESS
  const handleUpdateProgress = (newPercent: number) => {
    setProgressPercent(newPercent);
    if (newPercent >= 80) {
      setWorkStatus("evidence_ready");
    }
    addToast(
      "Progress Updated",
      `Work progress updated to ${newPercent}%. Field crew logs saved.`,
      "success"
    );
  };

  // ACTION 4: MARK RESOLVED (UI ONLY)
  const handleMarkResolved = () => {
    setIsResolving(true);
    setTimeout(() => {
      resolveIssue(issue.id, afterImage || undefined);
      setWorkStatus("resolved");
      setProgressPercent(100);
      setIsResolving(false);
      if (onResolvedSuccess) onResolvedSuccess();
    }, 500);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl space-y-6">
      {/* Official Command Authority Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 block">
              Official Command Console
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              Issue Resolution & Closure Protocol
            </h3>
          </div>
        </div>

        <Badge variant={workStatus === "resolved" ? "emerald" : "indigo"} size="md">
          {workStatus === "resolved"
            ? "STATUS: RESOLVED & VERIFIED"
            : workStatus === "in_progress"
            ? "STATUS: FIELD WORK IN PROGRESS"
            : "STATUS: READY FOR WORK"}
        </Badge>
      </div>

      {/* 4 Official Command Action Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* 1. START WORK */}
        <Button
          type="button"
          variant={workStatus === "in_progress" ? "glass" : "glow"}
          size="md"
          onClick={handleStartWork}
          disabled={workStatus === "resolved"}
          leftIcon={<Play className="w-4 h-4 text-cyan-400" />}
          className="text-xs font-bold uppercase tracking-wider py-3"
        >
          1. Start Work
        </Button>

        {/* 2. UPDATE PROGRESS */}
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => handleUpdateProgress(Math.min(90, progressPercent + 25))}
          disabled={workStatus === "resolved"}
          leftIcon={<RotateCw className="w-4 h-4 text-indigo-400" />}
          className="text-xs font-bold uppercase tracking-wider py-3"
        >
          2. Update Progress
        </Button>

        {/* 3. UPLOAD RESOLUTION EVIDENCE */}
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => setWorkStatus("evidence_ready")}
          leftIcon={<UploadCloud className="w-4 h-4 text-amber-400" />}
          className="text-xs font-bold uppercase tracking-wider py-3"
        >
          3. Upload Evidence
        </Button>

        {/* 4. MARK RESOLVED (PRIMARY ACTION) */}
        <Button
          type="button"
          variant="glow"
          size="md"
          onClick={handleMarkResolved}
          disabled={isResolving || workStatus === "resolved"}
          leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          className="text-xs font-black uppercase tracking-wider py-3 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-glow"
        >
          {isResolving ? "Finalizing..." : "4. Mark Resolved"}
        </Button>
      </div>

      {/* Progress Track Gauge */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Field Repair Progress</span>
          </span>
          <span className="font-mono text-emerald-400 font-black">
            {progressPercent}% Completed
          </span>
        </div>

        <ProgressBar
          value={progressPercent}
          variant={progressPercent === 100 ? "emerald" : "indigo"}
          size="md"
          showPercentage={false}
        />
      </div>

      {/* Resolution Photographic Evidence Section: BEFORE & AFTER */}
      <BeforeAfterEvidenceUploader
        beforeImageUrl={issue.media.primaryImageUrl}
        afterImageUrl={afterImage}
        onAfterImageChange={(url) => setAfterImage(url)}
      />

      {/* Official Intervention Details Form */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        {/* Action Taken */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>Action Taken (Technical Remediation Summary)</span>
          </label>
          <Input
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            placeholder="e.g. Excavated sub-base, applied hot asphalt mix, and roller compacted"
            required
          />
        </div>

        {/* Resolution Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Resolution Notes (Quality & Safety Sign-Off)</span>
          </label>
          <Textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Document quality inspection, safety clearance, and post-repair observations..."
            rows={3}
            required
          />
        </div>
      </div>

      {/* Big MARK RESOLVED Action Footer */}
      {workStatus !== "resolved" ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-300 space-y-0.5">
            <span className="font-bold text-white block">
              Ready to Close Ticket {issue.trackingNumber}?
            </span>
            <p className="text-slate-400 text-[11px]">
              Marking resolved updates the public ledger, triggers citizen notification, and logs SLA turnaround.
            </p>
          </div>

          <Button
            type="button"
            variant="glow"
            size="lg"
            onClick={handleMarkResolved}
            disabled={isResolving}
            leftIcon={<CheckCircle2 className="w-5 h-5 text-slate-950" />}
            className="text-xs sm:text-sm font-black uppercase tracking-wider px-8 py-3.5 bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-emerald-glow"
          >
            {isResolving ? "Broadcasting Resolution..." : "Mark Issue Resolved"}
          </Button>
        </div>
      ) : (
        /* Resolved State Banner */
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center space-x-3 text-xs text-emerald-200">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white block">
              Work Order Successfully Resolved & Logged on Civic Ledger
            </span>
            <span className="text-[11px] text-emerald-300">
              Resolved by Eng. Marcus Vance (PWD-RDS) • Resolution proof published for community consensus.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
