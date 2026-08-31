"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CivicIssue } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SeverityPill } from "@/components/civic/SeverityPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCivicStore } from "@/lib/mockStore";
import { formatRelativeTime, getCategoryMeta, getStatusMeta } from "@/lib/utils";
import {
  Users,
  MapPin,
  MessageSquare,
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  Flame,
  AlertCircle,
  Clock,
  Wrench,
  Share2,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

export interface CommunityIssueCardProps {
  issue: CivicIssue;
}

export function CommunityIssueCard({ issue }: CommunityIssueCardProps) {
  const { toggleAffected, addToast } = useCivicStore();
  const [copied, setCopied] = useState(false);
  const categoryMeta = getCategoryMeta(issue.category);
  const statusMeta = getStatusMeta(issue.status);

  const thresholdPercent = Math.min(
    100,
    Math.round((issue.affectedCount / (issue.affectedThreshold || 5)) * 100)
  );

  const isThresholdMet = issue.affectedCount >= (issue.affectedThreshold || 5);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/community/${issue.id}`);
      setCopied(true);
      addToast("Link Copied", `Issue link copied to clipboard.`, "info");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const authorName = issue.reportedBy?.name || "Verified Citizen";
  const authorAvatar =
    issue.reportedBy?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=020617&bold=true`;

  return (
    <Card
      variant="glass"
      className="p-0 border-slate-800 hover:border-cyan-500/40 hover:shadow-cyan-glow transition-all duration-300 flex flex-col justify-between overflow-hidden group bg-slate-950/90"
    >
      <div>
        {/* ================================================== */}
        {/* 1. TOP REPORTER HEADER (GOOGLE AUTH AUTHOR STRIP)  */}
        {/* ================================================== */}
        <div className="p-3.5 px-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover shrink-0 shadow-sm"
              onError={(e) => {
                // Fallback avatar if Google image fails to load
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=020617&bold=true`;
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate block">
                  {authorName}
                </span>
                <span className="inline-flex items-center text-[10px] text-cyan-400 font-mono">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                {issue.reportedBy?.isAnonymous ? "Anonymous Reporter" : "Google Verified Citizen"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono shrink-0">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{formatRelativeTime(issue.reportedAt)}</span>
          </div>
        </div>

        {/* ================================================== */}
        {/* 2. ACTUAL PERSISTENT EVIDENCE IMAGE               */}
        {/* ================================================== */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900 border-b border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.media.primaryImageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top Badges: Category + Priority Pill */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold border backdrop-blur-md ${categoryMeta.badgeBg} ${categoryMeta.badgeText}`}
            >
              {categoryMeta.label}
            </span>

            <SeverityPill severity={issue.severity} size="sm" />
          </div>

          {/* Bottom Overlay: Tracking ID */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-cyan-300 font-bold bg-slate-950/85 px-2 py-0.5 rounded border border-cyan-500/30">
              {issue.trackingNumber}
            </span>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border backdrop-blur-md ${statusMeta.bgClass} ${statusMeta.colorClass}`}
            >
              {statusMeta.label}
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* 3. CARD CONTENT & DETAILS                         */}
        {/* ================================================== */}
        <div className="p-5 space-y-4">
          {/* Location Line */}
          <div className="flex items-center text-xs text-slate-300 font-medium truncate">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mr-1.5" />
            <span className="truncate">{issue.location.address || `${issue.location.ward}, ${issue.location.zone}`}</span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <Link
              href={`/community/${issue.id}`}
              className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 block"
            >
              {issue.title}
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Requested Action Strip */}
          {issue.actionRequired && (
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-start gap-2">
              <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                  Requested Action:
                </span>
                <span className="text-slate-200 line-clamp-2">
                  {issue.actionRequired}
                </span>
              </div>
            </div>
          )}

          {/* AI Analysis Strip */}
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Triage: Verified</span>
            </div>

            <div className="flex items-center gap-1.5 text-cyan-300">
              <span>Confidence: {Math.round(issue.aiAnalysis.confidence * 100)}%</span>
            </div>

            <div className="flex items-center gap-1 text-rose-400 font-black">
              <Flame className="w-3.5 h-3.5" />
              <span>Severity: {issue.severityScore || issue.aiAnalysis.priorityScore || 82}/100</span>
            </div>
          </div>

          {/* Community Escalation Threshold Bar */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{issue.affectedCount} Citizens Affected</span>
              </span>
              <span className="text-[11px] font-mono text-purple-300">
                {isThresholdMet ? "⚡ Escalation Threshold Met!" : `${issue.affectedCount}/${issue.affectedThreshold || 5} to Escalate`}
              </span>
            </div>

            <ProgressBar
              value={thresholdPercent}
              variant={isThresholdMet ? "rose" : "indigo"}
              size="sm"
              showPercentage={false}
            />
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. CARD FOOTER: "I'M AFFECTED" & SHARE ACTIONS     */}
      {/* ================================================== */}
      <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 space-y-3">
        {/* Primary "I'M AFFECTED" Button */}
        <button
          type="button"
          onClick={() => toggleAffected(issue.id)}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 ${
            issue.hasUserMarkedAffected
              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-purple-500/30 ring-2 ring-purple-400/50"
              : "bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:border-purple-500/50"
          }`}
        >
          <Users className={`w-4 h-4 ${issue.hasUserMarkedAffected ? "animate-pulse" : "text-purple-400"}`} />
          <span>
            {issue.hasUserMarkedAffected
              ? "✓ You & " + (issue.affectedCount - 1) + " Others Marked Affected"
              : "I'M AFFECTED (+1 Escalate)"}
          </span>
        </button>

        {/* Secondary Metadata & Actions Strip */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center space-x-3">
            <Link
              href={`/community/${issue.id}#comments`}
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>{issue.commentsCount || 0} Notes</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>

          <Link
            href={`/community/${issue.id}`}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Full Case File</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
