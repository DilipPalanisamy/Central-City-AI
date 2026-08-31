"use client";

import React from "react";
import { CivicIssue } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SeverityPill } from "@/components/civic/SeverityPill";
import { formatRelativeTime } from "@/lib/utils";
import { useCivicStore } from "@/lib/mockStore";
import {
  AlertOctagon,
  Flame,
  Clock,
  MapPin,
  Sparkles,
  ThumbsUp,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export interface CitizenCriticalAlertsProps {
  onSelectIssue: (issue: CivicIssue) => void;
}

export function CitizenCriticalAlerts({ onSelectIssue }: CitizenCriticalAlertsProps) {
  const { issues, upvoteIssue } = useCivicStore();

  const criticalIssues = issues.filter(
    (i) => i.severity === "critical" && i.status !== "resolved"
  );

  if (criticalIssues.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Critical Emergency Hazards</span>
            <Badge variant="rose" size="sm">
              {criticalIssues.length} Immediate Attention
            </Badge>
          </h3>
        </div>
        <span className="text-xs text-rose-400 font-mono hidden sm:inline">
          High Traffic & Life-Safety Risk
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criticalIssues.slice(0, 2).map((issue) => (
          <div
            key={issue.id}
            className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950 border border-rose-500/40 shadow-rose-glow flex flex-col justify-between space-y-4 relative overflow-hidden group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-500/50">
                  {issue.trackingNumber}
                </span>
                <SeverityPill severity="critical" size="sm" />
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-rose-500/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.media.primaryImageUrl}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-1">
                  <h4
                    onClick={() => onSelectIssue(issue)}
                    className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {issue.location.address}
                </span>
                <span className="flex items-center gap-1 font-mono text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {issue.aiAnalysis.estimatedResolutionHours}h SLA
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-rose-900/40 flex items-center justify-between">
              <button
                onClick={() => upvoteIssue(issue.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  issue.hasUserUpvoted
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/50"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${issue.hasUserUpvoted ? "fill-rose-400 text-rose-400" : ""}`} />
                <span>{issue.upvotesCount} Upvotes</span>
              </button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => onSelectIssue(issue)}
                className="text-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Live Audit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
