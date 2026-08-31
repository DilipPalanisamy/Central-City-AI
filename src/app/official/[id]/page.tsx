"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCivicStore } from "@/lib/mockStore";
import { OfficialSidebar } from "@/components/official/OfficialSidebar";
import { OfficialResolutionPanel } from "@/components/official/OfficialResolutionPanel";
import { SeverityPill } from "@/components/civic/SeverityPill";
import { AIConfidenceMeter } from "@/components/civic/AIConfidenceMeter";
import { StatusStepper } from "@/components/civic/StatusStepper";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime, getCategoryMeta, getStatusMeta } from "@/lib/utils";
import {
  ArrowLeft,
  Camera,
  Sparkles,
  MapPin,
  Users,
  MessageSquare,
  Activity,
  ShieldCheck,
  Building2,
  Clock,
  Wrench,
  CheckCircle2,
  Scan,
  Send,
  Truck,
  Eye,
  AlertTriangle,
} from "lucide-react";

export default function OfficialIssueResolutionPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;

  const { issues, currentRole, notifications, unreadNotificationsCount } = useCivicStore();
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Find target issue
  const issue = useMemo(() => {
    return (
      issues.find((i) => i.id === issueId || i.trackingNumber === issueId) ||
      issues[0]
    );
  }, [issues, issueId]);

  const categoryMeta = getCategoryMeta(issue.category);
  const statusMeta = getStatusMeta(issue.status);

  // Live metrics for sidebar counts
  const metrics = useMemo(() => {
    return {
      critical: issues.filter((i) => i.severity === "critical").length,
      highPriority: issues.filter((i) => i.severity === "high").length,
      pending: issues.filter((i) => i.status === "reported" || i.status === "ai_analyzed").length,
      inProgress: issues.filter((i) => i.status === "authority_dispatched" || i.status === "in_progress").length,
      resolved: issues.filter((i) => i.status === "resolved").length,
      reopened: 2,
    };
  }, [issues]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row selection:bg-cyan-500 selection:text-slate-950">
      {/* Official Sidebar */}
      <OfficialSidebar
        activeView="issues"
        onSelectView={(view) => {
          if (view === "notifications") window.location.href = "/notifications";
          else if (view === "dashboard") router.push("/official");
          else router.push("/official");
        }}
        counts={{
          critical: metrics.critical,
          high: metrics.highPriority,
          inProgress: metrics.inProgress,
          resolved: metrics.resolved,
          reopened: metrics.reopened,
          notifications: unreadNotificationsCount,
        }}
      />

      {/* Main Resolution Workspace */}
      <main className="flex-1 max-w-7xl w-full p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2 text-xs">
            <Link
              href="/official"
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Official Operations</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Work Orders</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-mono font-bold">{issue.trackingNumber}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
            >
              {statusMeta.label}
            </span>
            <SeverityPill severity={issue.severity} size="md" />
          </div>
        </div>

        {/* Work Order Headline */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${categoryMeta.badgeBg} ${categoryMeta.badgeText}`}
            >
              {categoryMeta.label}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Work Order #{issue.trackingNumber}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Reported {formatRelativeTime(issue.reportedAt)} by {issue.reportedBy.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
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

        {/* Status Stepper */}
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass">
          <StatusStepper currentStatus={issue.status} />
        </div>

        {/* 🌟 1. THE OFFICIAL ISSUE RESOLUTION CONTROL PANEL 🌟 */}
        <OfficialResolutionPanel
          issue={issue}
          onResolvedSuccess={() => router.push("/official")}
        />

        {/* 2-Column Visual Inspection Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Citizen Evidence, AI Analysis, Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Citizen Evidence View */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Citizen Photographic Evidence
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>{showBoundingBoxes ? "Hide AI Overlays" : "Show AI Overlays"}</span>
                </button>
              </div>

              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.media.primaryImageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />

                {showBoundingBoxes && (
                  <div className="absolute inset-6 border-2 border-dashed border-cyan-400 rounded-xl bg-cyan-500/10 p-3 flex flex-col justify-between pointer-events-none">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 self-start">
                      Target: {categoryMeta.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/90 text-cyan-300 border border-cyan-500/40 self-end">
                      Confidence: {Math.round(issue.aiAnalysis.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Uploader: <strong className="text-white">{issue.reportedBy.name}</strong> (+{issue.reportedBy.civicKarma} Karma)
                </span>
                <span className="font-mono text-cyan-400">
                  GPS: {issue.location.lat}° N, {issue.location.lng}° W
                </span>
              </div>
            </div>

            {/* AI Computer Vision Analysis View */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    AI Neural Classification Scorecard
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">
                  {issue.aiAnalysis.aiModelVersion}
                </span>
              </div>

              <AIConfidenceMeter aiAnalysis={issue.aiAnalysis} />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Estimated Area / Depth
                  </span>
                  <span className="text-white font-bold font-mono">
                    ~14cm Depth • 0.42 m² Surface Crater
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Cost & SLA Estimate
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ${issue.aiAnalysis.estimatedCostMin} - ${issue.aiAnalysis.estimatedCostMax} • {issue.aiAnalysis.estimatedResolutionHours}h SLA
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
                <strong className="text-cyan-400">Root Cause Hypothesis: </strong>
                {issue.aiAnalysis.rootCauseHypothesis}
              </div>
            </div>

            {/* Problem Description */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Citizen Observations & Risk Assessment
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                {issue.description}
              </p>
            </div>
          </div>

          {/* Right Column (5 cols): Affected Citizens, Location Map Context, Community Comments, Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Affected Citizens & Quorum */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Affected Citizens & Community Quorum
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>{issue.affectedCount} Verified Residents</span>
                  </span>
                  <span className="font-mono text-purple-300">
                    Threshold: {issue.affectedThreshold}
                  </span>
                </div>

                <ProgressBar
                  value={Math.min(100, Math.round((issue.affectedCount / issue.affectedThreshold) * 100))}
                  variant="indigo"
                  size="md"
                  showPercentage={false}
                />

                <span className="text-[11px] text-emerald-400 font-bold block">
                  ✓ Escalation Quorum Met • Level 3 Mayoral Directive Active
                </span>
              </div>
            </div>

            {/* Geolocation Map Context */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Location & Sector Jurisdiction
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Street Address:</span>
                  <span className="text-white font-bold">{issue.location.address}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ward & GPS:</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {issue.location.ward} • {issue.location.zone} ({issue.location.lat}, {issue.location.lng})
                  </span>
                </div>
              </div>
            </div>

            {/* Community Comments & Notes */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Community & Verifier Notes ({issue.comments?.length || 0})
                </h3>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {issue.comments && issue.comments.length > 0 ? (
                  issue.comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{cmt.author.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatRelativeTime(cmt.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {cmt.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No community comments logged.</p>
                )}
              </div>
            </div>

            {/* Issue Timeline */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Public Ledger Timeline
                </h3>
              </div>

              <div className="space-y-2.5">
                {issue.timeline.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{evt.action}</span>
                      {evt.badge && (
                        <Badge variant="cyan" size="sm">
                          {evt.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px]">{evt.description}</p>
                    <span className="text-[10px] text-cyan-400 font-mono block">
                      By {evt.actor.name} ({evt.actor.role}) • {formatRelativeTime(evt.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
