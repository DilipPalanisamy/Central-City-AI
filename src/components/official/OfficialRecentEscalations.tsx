"use client";

import React from "react";
import Link from "next/link";
import { CivicIssue } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Flame,
  ShieldAlert,
  Users,
  Clock,
  ArrowRight,
  Truck,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";

export interface OfficialRecentEscalationsProps {
  issues: CivicIssue[];
  onDispatch: (issue: CivicIssue) => void;
}

export function OfficialRecentEscalations({
  issues,
  onDispatch,
}: OfficialRecentEscalationsProps) {
  // Filter top critical/high escalated issues
  const escalatedIssues = issues
    .filter((i) => i.severity === "critical" || (i.affectedCount || 0) >= 5)
    .slice(0, 3);

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-rose-500/30 shadow-glass space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-rose-glow animate-pulse">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Emergency Escalations
            </h3>
            <span className="text-[11px] text-slate-400">
              Community threshold quorum met • Mayoral fast-track active
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse">
          {escalatedIssues.length} Active Directives
        </span>
      </div>

      {/* Escalation Cards */}
      <div className="space-y-3">
        {escalatedIssues.map((issue) => (
          <div
            key={issue.id}
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 space-y-3 transition-all hover:border-rose-500/60"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {issue.trackingNumber}
                </span>
                <Badge variant="rose" size="sm">
                  🚨 THRESHOLD REACHED
                </Badge>
              </div>

              <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>SLA: 6 Hours Active</span>
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {issue.title}
              </h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{issue.location.address} • {issue.location.ward}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-purple-300 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  <strong className="text-white font-bold">{issue.affectedCount}</strong> Citizens Joined Quorum
                </span>
              </span>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/community/${issue.id}`}
                  className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  View Details
                </Link>

                <Button
                  size="sm"
                  variant="glow"
                  onClick={() => onDispatch(issue)}
                  className="text-xs font-bold"
                  leftIcon={<Truck className="w-3.5 h-3.5" />}
                >
                  Authorize Field Dispatch
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
