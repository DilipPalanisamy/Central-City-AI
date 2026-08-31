"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";

export interface CitizenMyReportsProps {
  onSelectIssue?: (issue: any) => void;
  onOpenReportModal?: () => void;
}

export function CitizenMyReports({
  onSelectIssue,
  onOpenReportModal,
}: CitizenMyReportsProps) {
  const myReports = [
    {
      id: "my_rep_1",
      title: "Road Damage",
      trackingNumber: "CC-2026-8942",
      location: "Avinashipalayam Transit Lane",
      priority: "HIGH",
      priorityVariant: "rose" as const,
      status: "In Progress",
      statusVariant: "indigo" as const,
      reportedDate: "Yesterday at 09:30 AM",
      progressPercent: 65,
      progressStage: "Field Patch Unit Deployed",
      link: "/community/iss_8942",
    },
    {
      id: "my_rep_2",
      title: "Garbage Accumulation",
      trackingNumber: "CC-2026-8944",
      location: "350 Valencia St Sports Enclosure",
      priority: "MEDIUM",
      priorityVariant: "amber" as const,
      status: "Community Support",
      statusVariant: "purple" as const,
      reportedDate: "2 days ago",
      progressPercent: 40,
      progressStage: "Building Neighborhood Quorum",
      link: "/community/iss_8944",
    },
    {
      id: "my_rep_3",
      title: "Broken Drainage",
      trackingNumber: "CC-2026-8943",
      location: "1200 Pine St, Polk Intersection",
      priority: "HIGH",
      priorityVariant: "rose" as const,
      status: "Escalated",
      statusVariant: "amber" as const,
      reportedDate: "3 days ago",
      progressPercent: 85,
      progressStage: "Mayoral Directive Issued",
      link: "/community/iss_8943",
    },
  ];

  return (
    <div id="my-reports" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Active Reports ({myReports.length})
          </h2>
          <p className="text-xs text-slate-400">
            Real-time status tracking for complaints you reported.
          </p>
        </div>

        <Link href="/report">
          <Button
            variant="glow"
            size="sm"
            onClick={onOpenReportModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            New Report
          </Button>
        </Link>
      </div>

      {/* 3 Active Reports Cards */}
      <div className="space-y-4">
        {myReports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4 transition-all hover:border-cyan-500/40 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {report.trackingNumber}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {report.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={report.priorityVariant} size="sm">
                  {report.priority} PRIORITY
                </Badge>
                <Badge variant={report.statusVariant} size="sm">
                  {report.status}
                </Badge>
              </div>
            </div>

            {/* Location & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{report.location}</span>
              </span>

              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Reported: {report.reportedDate}</span>
              </span>
            </div>

            {/* Progress Stepper Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold text-[11px]">
                  Lifecycle Progress: <strong className="text-cyan-300">{report.progressStage}</strong>
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {report.progressPercent}%
                </span>
              </div>

              <ProgressBar
                value={report.progressPercent}
                variant="cyan"
                size="sm"
                showPercentage={false}
              />
            </div>

            {/* Card Action Link */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-800/80">
              <Link
                href={report.link}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>Inspect Status & Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
