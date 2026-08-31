"use client";

import React from "react";
import { CivicIssue } from "@/types";
import { Card } from "@/components/ui/Card";
import { SeverityPill } from "./SeverityPill";
import { AIConfidenceMeter } from "./AIConfidenceMeter";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  ThumbsUp,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { formatRelativeTime, getCategoryMeta, getStatusMeta } from "@/lib/utils";
import { useCivicStore } from "@/lib/mockStore";

export interface IssueCardProps {
  issue: CivicIssue;
  onSelect?: (issue: CivicIssue) => void;
  className?: string;
}

export function IssueCard({ issue, onSelect, className }: IssueCardProps) {
  const { currentRole, upvoteIssue, verifyIssue } = useCivicStore();
  const categoryMeta = getCategoryMeta(issue.category);
  const statusMeta = getStatusMeta(issue.status);

  return (
    <Card
      variant="glass"
      className={`group hover:border-cyan-500/50 hover:shadow-cyan-glow transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Card Media Preview with Overlay Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.media.primaryImageUrl}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md ${categoryMeta.badgeBg} ${categoryMeta.badgeText}`}
            >
              {categoryMeta.label}
            </span>
            <SeverityPill severity={issue.severity} size="sm" />
          </div>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-cyan-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              {issue.trackingNumber}
            </span>
            <span className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatRelativeTime(issue.reportedAt)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Status and Ward Indicator */}
          <div className="flex items-center justify-between text-xs">
            <span
              className={`px-2 py-0.5 rounded-md font-semibold border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
            >
              {statusMeta.label}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {issue.location.ward} • {issue.location.zone}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3
              onClick={() => onSelect && onSelect(issue)}
              className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 cursor-pointer"
            >
              {issue.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* AI Intelligence Micro-bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Conf: {Math.round(issue.aiAnalysis.confidence * 100)}%</span>
            </div>
            <span className="text-slate-400 font-mono">
              Est: {issue.aiAnalysis.estimatedResolutionHours}h SLA
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* Upvote Button */}
          <button
            onClick={() => upvoteIssue(issue.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              issue.hasUserUpvoted
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${issue.hasUserUpvoted ? "fill-cyan-400 text-cyan-400" : ""}`}
            />
            <span>{issue.upvotesCount}</span>
          </button>

          {/* Verifications Count */}
          <div className="flex items-center gap-1 text-xs text-purple-400 font-semibold bg-purple-950/40 border border-purple-500/30 px-2 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{issue.verifications.length}</span>
          </div>
        </div>

        {/* Action Button */}
        {currentRole === "verifier" && issue.status !== "resolved" ? (
          <Button
            size="sm"
            variant="glass"
            className="text-xs text-purple-300 border-purple-500/30 hover:border-purple-400"
            onClick={() => verifyIssue(issue.id)}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Verify
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
            onClick={() => onSelect && onSelect(issue)}
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>
    </Card>
  );
}
