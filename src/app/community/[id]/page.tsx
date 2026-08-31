"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCivicStore } from "@/lib/mockStore";
import { SeverityPill } from "@/components/civic/SeverityPill";
import { AIConfidenceMeter } from "@/components/civic/AIConfidenceMeter";
import { StatusStepper } from "@/components/civic/StatusStepper";
import { AdaptiveEscalationCard } from "@/components/civic/AdaptiveEscalationCard";
import { CitizenResolutionVerification } from "@/components/civic/CitizenResolutionVerification";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { formatRelativeTime, getCategoryMeta, getStatusMeta } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  MapPin,
  Sparkles,
  Camera,
  MessageSquare,
  Clock,
  Building2,
  Wrench,
  ShieldCheck,
  Flame,
  Send,
  CheckCircle2,
  Layers,
  Activity,
  AlertTriangle,
  FileCheck,
  Share2,
  Scan,
} from "lucide-react";

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;

  const { issues, toggleAffected, addComment, currentUser } = useCivicStore();
  const { user } = useAuth();
  const [commentInput, setCommentInput] = useState("");
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Find issue by id or trackingNumber
  const issue = useMemo(() => {
    return (
      issues.find((i) => i.id === issueId || i.trackingNumber === issueId) ||
      issues[0]
    );
  }, [issues, issueId]);

  const isUserVoted = Boolean(
    (user?.uid && issue.voterUids?.includes(user.uid)) ||
    (issue.hasUserMarkedAffected && (!issue.voterUids || issue.voterUids.length === 0))
  );

  const categoryMeta = getCategoryMeta(issue.category);
  const statusMeta = getStatusMeta(issue.status);

  const thresholdPercent = Math.min(
    100,
    Math.round((issue.affectedCount / issue.affectedThreshold) * 100)
  );

  const isThresholdMet = issue.affectedCount >= issue.affectedThreshold;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(issue.id, commentInput);
    setCommentInput("");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumbs & Back Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs">
            <Link
              href="/community"
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Community Issues</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{issue.location.ward}</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-mono font-bold">{issue.trackingNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
            >
              {statusMeta.label}
            </span>
            <SeverityPill severity={issue.severity} size="md" />
          </div>
        </div>

        {/* Issue Title & Headline Banner */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${categoryMeta.badgeBg} ${categoryMeta.badgeText}`}
            >
              {categoryMeta.label}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Ref: {issue.trackingNumber}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Reported {formatRelativeTime(issue.reportedAt)} by {issue.reportedBy.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {issue.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {issue.location.address} • {issue.location.ward} ({issue.location.zone})
              {issue.location.landmark && ` • Landmark: ${issue.location.landmark}`}
            </span>
          </p>
        </div>

        {/* 6-Stage Lifecycle Status Stepper */}
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass">
          <StatusStepper currentStatus={issue.status} />
        </div>

        {/* 🌟 CITIZEN RESOLUTION VERIFICATION SUITE (Active on Resolved Issues) 🌟 */}
        {issue.status === "resolved" && (
          <CitizenResolutionVerification issue={issue} />
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Evidence Image, AI Analysis, Description, Supporting Evidence */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Evidence Image with Bounding Box Overlay Toggle */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl space-y-3 p-4">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.media.primaryImageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />

                {/* Simulated Computer Vision Bounding Box Overlay */}
                {showBoundingBoxes && (
                  <div className="absolute inset-8 border-2 border-dashed border-cyan-400 rounded-2xl bg-cyan-500/10 p-3 flex flex-col justify-between pointer-events-none animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 shadow-md">
                        AI Object: {categoryMeta.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/90 text-cyan-300 border border-cyan-500/40">
                        Match: {Math.round(issue.aiAnalysis.confidence * 100)}%
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                      <span>Neural Severity Score:</span>
                      <span className="text-rose-400 font-mono font-bold">
                        {issue.aiAnalysis.priorityScore}/100
                      </span>
                    </div>
                  </div>
                )}

                {/* Resolved Image Overlay if Resolved */}
                {issue.status === "resolved" && issue.media.resolvedImageUrl && (
                  <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 shadow-lg">
                    ✓ Verified Resolution Photo Available
                  </div>
                )}
              </div>

              {/* Image Controls */}
              <div className="flex items-center justify-between px-2 pt-1 text-xs">
                <span className="text-slate-400 font-mono">
                  GPS Geotag: {issue.location.lat}° N, {issue.location.lng}° W
                </span>

                <button
                  type="button"
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>{showBoundingBoxes ? "Hide AI Bounding Box" : "Show AI Bounding Box"}</span>
                </button>
              </div>
            </div>

            {/* 2. AI Intelligence Scorecard */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    AI Computer Vision Neural Triage
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">
                  Model: {issue.aiAnalysis.aiModelVersion}
                </span>
              </div>

              <AIConfidenceMeter aiAnalysis={issue.aiAnalysis} />

              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
                <strong className="text-cyan-400">Root Cause Hypothesis: </strong>
                {issue.aiAnalysis.rootCauseHypothesis}
              </div>
            </div>

            {/* 3. Description & Requested Action */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Detailed Problem Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
                  {issue.description}
                </p>
              </div>

              {issue.actionRequired && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                    <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Requested Municipal Action</span>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed bg-cyan-950/20 p-4 rounded-2xl border border-cyan-500/30">
                    {issue.actionRequired}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Supporting Evidence Gallery */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Supporting Community Evidence ({issue.supportingEvidence?.length || 1})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(issue.supportingEvidence && issue.supportingEvidence.length > 0
                  ? issue.supportingEvidence
                  : [
                      {
                        id: "ev_def",
                        imageUrl: issue.media.primaryImageUrl,
                        caption: "Primary incident capture from mobile reporting kiosk",
                        uploadedAt: issue.reportedAt,
                        uploadedBy: issue.reportedBy.name,
                      },
                    ]
                ).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2"
                  >
                    <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ev.imageUrl}
                        alt={ev.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white leading-tight">
                        {ev.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>By {ev.uploadedBy}</span>
                        <span>{formatRelativeTime(ev.uploadedAt)}</span>
                      </div>
                      {ev.telemetryData && (
                        <div className="text-[10px] bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-cyan-300 font-mono">
                          {ev.telemetryData.sensorType}: {ev.telemetryData.reading}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Comments & Community Notes */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Community Notes & Verifier Discussions ({issue.comments?.length || 0})
                  </h3>
                </div>
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handlePostComment} className="space-y-2.5">
                <Textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add an observation, traffic impact update, or on-site photo note..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="glow"
                    size="sm"
                    disabled={!commentInput.trim()}
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Post Community Note
                  </Button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3 pt-2">
                {issue.comments && issue.comments.length > 0 ? (
                  issue.comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className={`p-4 rounded-2xl border space-y-2 text-xs ${
                        cmt.isOfficialResponse
                          ? "bg-cyan-950/40 border-cyan-500/40 shadow-cyan-glow"
                          : "bg-slate-900/60 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmt.author.avatarUrl}
                            alt={cmt.author.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-white block">
                              {cmt.author.name}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {cmt.author.badgeTitle}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatRelativeTime(cmt.timestamp)}
                        </span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{cmt.content}</p>

                      {cmt.isOfficialResponse && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Official Authority Response</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No community notes yet. Be the first to add an observation!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): "I'M AFFECTED" Primary Action, Escalation Quorum, Required Action, Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* 🌟 1. PRIMARY INTERACTION: "I'M AFFECTED" CARD 🌟 */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/80 via-slate-950 to-slate-950 border-2 border-purple-500/40 shadow-2xl space-y-5">
              <div className="space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-300">
                  Democratic Quorum Escalation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Are You Affected By This Hazard?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Marking yourself as affected signals municipal dispatch and fast-tracks the issue when the ward threshold is reached.
                </p>
              </div>

              {/* Big "👍 I'M AFFECTED" Button */}
              <button
                type="button"
                onClick={() =>
                  toggleAffected(
                    issue.id,
                    user?.uid,
                    user?.displayName || undefined,
                    user?.photoURL || undefined
                  )
                }
                className={`w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl active:scale-98 ${
                  isUserVoted
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white ring-4 ring-purple-500/30 shadow-purple-glow"
                    : "bg-slate-900 hover:bg-slate-800 text-white border-2 border-purple-500/50 hover:border-purple-400 shadow-glass"
                }`}
              >
                <span className="text-xl">👍</span>
                <span>
                  {isUserVoted
                    ? "✓ You Endorsed (Impact Registered)"
                    : "👍 I'M AFFECTED (+1 Escalate)"}
                </span>
              </button>

              {/* Threshold Progress Gauge */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-purple-400" />
                    <span>{issue.affectedCount} Verified Residents</span>
                  </span>
                  <span className="font-mono text-purple-300">
                    {thresholdPercent}% ({issue.affectedCount}/{issue.affectedThreshold})
                  </span>
                </div>

                <ProgressBar
                  value={thresholdPercent}
                  variant={isThresholdMet ? "rose" : "indigo"}
                  size="md"
                  showPercentage={false}
                />

                <p className="text-[11px] text-slate-400 pt-1">
                  {isThresholdMet
                    ? "🔥 Quorum reached! Mayoral Emergency Protocol activated."
                    : `${issue.affectedThreshold - issue.affectedCount} more affected residents needed to trigger Fast-Track Dispatch.`}
                </p>
              </div>
            </div>

            {/* 🌟 Adaptive Threshold & Autonomous Escalation Matrix 🌟 */}
            <AdaptiveEscalationCard
              initialPriority={issue.severity === "critical" ? "CRITICAL" : issue.severity === "high" ? "HIGH" : "MEDIUM"}
              initialCurrentAffected={3}
              initialRequiredThreshold={5}
              issueId={issue.trackingNumber}
              departmentName={issue.departmentAssigned?.name || "Department of Roads & Infrastructure"}
              authorityName="Municipal Emergency Public Works Director"
            />

            {/* 2. Required Municipal Action Card */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Required Municipal Action
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Target Municipal Department
                  </span>
                  <span className="text-white font-bold text-sm">
                    {issue.departmentAssigned?.name ||
                      issue.requiredAction?.departmentTarget ||
                      "Department of Roads & Infrastructure"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Mandated SLA Urgency
                  </span>
                  <span className="text-amber-400 font-mono font-bold">
                    {issue.requiredAction?.urgencyTier?.replace(/_/g, " ") || "HIGH PRIORITY (6h SLA)"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Requested Technical Intervention
                  </span>
                  <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed mt-1">
                    {issue.requiredAction?.intervention ||
                      "Full Asphalt Milling, Base Compaction & Hot-Mix Patch"}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Civic Audit Timeline */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Public Ledger Audit Timeline
                </h3>
              </div>

              <div className="space-y-3">
                {issue.timeline.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{evt.action}</span>
                      {evt.badge && (
                        <Badge variant="cyan" size="sm">
                          {evt.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 pt-1">
                      <span>By {evt.actor.name} ({evt.actor.role})</span>
                      <span className="text-slate-500">{formatRelativeTime(evt.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
    </ProtectedRoute>
  );
}
