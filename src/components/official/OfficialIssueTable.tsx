"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CivicIssue } from "@/types";
import { useCivicStore } from "@/lib/mockStore";
import { SeverityPill } from "@/components/civic/SeverityPill";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime, getCategoryMeta, getStatusMeta } from "@/lib/utils";
import {
  Search,
  Filter,
  Truck,
  CheckCircle2,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  MapPin,
  Eye,
  RotateCcw,
} from "lucide-react";

export interface OfficialIssueTableProps {
  issues: CivicIssue[];
  onDispatch: (issue: CivicIssue) => void;
  onInspect: (issue: CivicIssue) => void;
}

export function OfficialIssueTable({
  issues,
  onDispatch,
  onInspect,
}: OfficialIssueTableProps) {
  const { resolveIssue } = useCivicStore();
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = issues.filter((iss) => {
    if (statusFilter !== "all" && iss.status !== statusFilter) return false;
    if (tableSearch.trim() !== "") {
      const q = tableSearch.toLowerCase();
      const matchTitle = iss.title.toLowerCase().includes(q);
      const matchRef = iss.trackingNumber.toLowerCase().includes(q);
      const matchWard = iss.location.ward.toLowerCase().includes(q);
      const matchAddress = iss.location.address.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchWard && !matchAddress) return false;
    }
    return true;
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Municipal Incident Work Orders
          </h3>
          <span className="text-[11px] text-slate-400">
            {filtered.length} active civic issues under jurisdiction
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Filter by tracking ID or street..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="ai_analyzed">AI Analyzed</option>
            <option value="community_verified">Community Verified</option>
            <option value="authority_dispatched">Authority Dispatched</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <th className="pb-3 px-3">Tracking ID</th>
              <th className="pb-3 px-3">Hazard Details</th>
              <th className="pb-3 px-3">Severity & AI</th>
              <th className="pb-3 px-3">Affected Citizens</th>
              <th className="pb-3 px-3">Status / SLA</th>
              <th className="pb-3 px-3 text-right">Command Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((issue) => {
              const categoryMeta = getCategoryMeta(issue.category);
              const statusMeta = getStatusMeta(issue.status);

              return (
                <tr
                  key={issue.id}
                  className="hover:bg-slate-900/60 transition-colors group"
                >
                  {/* Tracking ID */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {issue.trackingNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                      {formatRelativeTime(issue.reportedAt)}
                    </span>
                  </td>

                  {/* Hazard Title & Location */}
                  <td className="py-3 px-3 max-w-xs">
                    <Link
                      href={`/official/${issue.id}`}
                      className="font-bold text-white hover:text-cyan-300 transition-colors block truncate leading-tight"
                    >
                      {issue.title}
                    </Link>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{issue.location.address} • {issue.location.ward}</span>
                    </span>
                  </td>

                  {/* Severity & AI */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SeverityPill severity={issue.severity} size="sm" />
                    <span className="text-[10px] text-cyan-300 font-mono block mt-1">
                      AI Conf: {Math.round(issue.aiAnalysis.confidence * 100)}%
                    </span>
                  </td>

                  {/* Affected Citizens */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-purple-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>{issue.affectedCount} Joined</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Threshold: {issue.affectedThreshold}
                    </span>
                  </td>

                  {/* Status & SLA */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
                    >
                      {statusMeta.label}
                    </span>
                    {issue.departmentAssigned && (
                      <span className="text-[10px] text-indigo-300 font-mono block mt-1">
                        SLA: {issue.departmentAssigned.slaHours}h target
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onInspect(issue)}
                        title="Inspect"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {issue.status !== "resolved" ? (
                        <>
                          <Button
                            size="sm"
                            variant="glow"
                            onClick={() => onDispatch(issue)}
                            className="text-[11px] py-1 px-2.5"
                            leftIcon={<Truck className="w-3 h-3" />}
                          >
                            Dispatch
                          </Button>

                          <button
                            type="button"
                            onClick={() => resolveIssue(issue.id)}
                            title="Mark Resolved"
                            className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
