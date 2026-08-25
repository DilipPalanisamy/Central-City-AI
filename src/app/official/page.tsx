"use client";

import React, { useState, useMemo } from "react";
import { OfficialSidebar, OfficialViewFilter } from "@/components/official/OfficialSidebar";
import { OfficialDashboardCards } from "@/components/official/OfficialDashboardCards";
import { OfficialPriorityChart } from "@/components/official/OfficialPriorityChart";
import { OfficialIssueMap } from "@/components/official/OfficialIssueMap";
import { OfficialRecentEscalations } from "@/components/official/OfficialRecentEscalations";
import { OfficialPendingActions } from "@/components/official/OfficialPendingActions";
import { OfficialIssueTable } from "@/components/official/OfficialIssueTable";
import { DispatchModal } from "@/components/official/DispatchModal";
import { Modal } from "@/components/ui/Modal";
import { StatusStepper } from "@/components/civic/StatusStepper";
import { AIConfidenceMeter } from "@/components/civic/AIConfidenceMeter";
import { SeverityPill } from "@/components/civic/SeverityPill";
import { useCivicStore } from "@/lib/mockStore";
import { CivicIssue } from "@/types";
import {
  Building2,
  Users,
  Shield,
  Activity,
  Sparkles,
  Bell,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function OfficialDashboardPage() {
  const { issues, notifications, unreadNotificationsCount } = useCivicStore();
  const [activeView, setActiveView] = useState<OfficialViewFilter>("dashboard");
  const [dispatchModalIssue, setDispatchModalIssue] = useState<CivicIssue | null>(null);
  const [inspectModalIssue, setInspectModalIssue] = useState<CivicIssue | null>(null);

  // Compute live metrics
  const metrics = useMemo(() => {
    return {
      critical: issues.filter((i) => i.severity === "critical").length,
      highPriority: issues.filter((i) => i.severity === "high").length,
      pending: issues.filter((i) => i.status === "reported" || i.status === "ai_analyzed").length,
      inProgress: issues.filter((i) => i.status === "authority_dispatched" || i.status === "in_progress").length,
      resolved: issues.filter((i) => i.status === "resolved").length,
      reopened: 2, // simulated community disputes
    };
  }, [issues]);

  // Filter issues based on active view if a specific sidebar filter is chosen
  const displayedIssues = useMemo(() => {
    if (activeView === "critical") return issues.filter((i) => i.severity === "critical");
    if (activeView === "high_priority") return issues.filter((i) => i.severity === "high");
    if (activeView === "in_progress") return issues.filter((i) => i.status === "in_progress" || i.status === "authority_dispatched");
    if (activeView === "resolved") return issues.filter((i) => i.status === "resolved");
    return issues;
  }, [issues, activeView]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Official Sidebar (10 Navigation Items) */}
      <OfficialSidebar
        activeView={activeView}
        onSelectView={(view) => {
          if (view === "notifications") {
            window.location.href = "/notifications";
          } else {
            setActiveView(view);
          }
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

      {/* Main Command Console Content */}
      <main className="flex-1 max-w-7xl w-full p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="cyan" size="sm">
                Municipal Command System • Level 3 Access
              </Badge>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-cyan-400">
                Connected to City Vision v4.2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Authority Operations Center
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-semibold">City Grid: Online</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("issues")}
              leftIcon={<Activity className="w-3.5 h-3.5 text-cyan-400" />}
            >
              All Work Orders
            </Button>
          </div>
        </div>

        {/* 2. Dashboard Cards (Critical, High, Pending, In Progress, Resolved, Reopened) */}
        <OfficialDashboardCards
          metrics={metrics}
          onSelectCategoryFilter={(filterId) => {
            if (filterId === "critical") setActiveView("critical");
            else if (filterId === "high_priority") setActiveView("high_priority");
            else if (filterId === "in_progress") setActiveView("in_progress");
            else if (filterId === "resolved") setActiveView("resolved");
            else setActiveView("issues");
          }}
        />

        {/* 3. Priority Chart (Matrix) */}
        <OfficialPriorityChart />

        {/* 4. Issue Map (Municipal Geospatial Preview) */}
        <OfficialIssueMap
          issues={issues}
          onSelectIssue={(issue) => setInspectModalIssue(issue)}
          onQuickDispatch={(issue) => setDispatchModalIssue(issue)}
        />

        {/* 2-Column Section: Recent Escalations & Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 5. Recent Escalations (6 cols) */}
          <div className="lg:col-span-6">
            <OfficialRecentEscalations
              issues={issues}
              onDispatch={(issue) => setDispatchModalIssue(issue)}
            />
          </div>

          {/* 6. Pending Actions (6 cols) */}
          <div className="lg:col-span-6">
            <OfficialPendingActions />
          </div>
        </div>

        {/* 7. Issue Table (Full Municipal Incident Table) */}
        <OfficialIssueTable
          issues={displayedIssues}
          onDispatch={(issue) => setDispatchModalIssue(issue)}
          onInspect={(issue) => setInspectModalIssue(issue)}
        />
      </main>

      {/* Field Crew Dispatch Modal */}
      <DispatchModal
        isOpen={Boolean(dispatchModalIssue)}
        onClose={() => setDispatchModalIssue(null)}
        issue={dispatchModalIssue}
      />

      {/* Inspect Issue Modal */}
      {inspectModalIssue && (
        <Modal
          isOpen={Boolean(inspectModalIssue)}
          onClose={() => setInspectModalIssue(null)}
          title={inspectModalIssue.title}
          description={`Reference: ${inspectModalIssue.trackingNumber} • ${inspectModalIssue.location.address}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            <StatusStepper currentStatus={inspectModalIssue.status} />

            <div className="relative rounded-2xl overflow-hidden h-56 w-full bg-slate-950 border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={inspectModalIssue.media.primaryImageUrl}
                alt={inspectModalIssue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <SeverityPill severity={inspectModalIssue.severity} />
              </div>
            </div>

            <AIConfidenceMeter aiAnalysis={inspectModalIssue.aiAnalysis} />

            <div className="space-y-1">
              <span className="font-bold text-white uppercase text-[10px]">Description:</span>
              <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {inspectModalIssue.description}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectModalIssue(null)}
              >
                Close Audit
              </Button>

              <Button
                variant="glow"
                size="sm"
                onClick={() => {
                  const target = inspectModalIssue;
                  setInspectModalIssue(null);
                  setDispatchModalIssue(target);
                }}
              >
                Authorize Dispatch
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
