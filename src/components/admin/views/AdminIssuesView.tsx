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
  Eye,
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Trash2,
  MapPin,
  Users,
} from "lucide-react";

export function AdminIssuesView() {
  const { issues, resolveIssue, addToast } = useCivicStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = issues.filter((iss) => {
    if (categoryFilter !== "all" && iss.category !== categoryFilter) return false;
    if (severityFilter !== "all" && iss.severity !== severityFilter) return false;
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      return (
        iss.title.toLowerCase().includes(q) ||
        iss.trackingNumber.toLowerCase().includes(q) ||
        iss.location.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleForceEscalate = (trackingNumber: string) => {
    addToast(
      "Mayoral Force Escalation",
      `Issue ${trackingNumber} escalated to Emergency Priority with immediate field dispatch.`,
      "warning"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Master Civic Incident Ledger ({filtered.length})
          </h2>
          <p className="text-xs text-slate-400">
            Administrative overview of all complaints across all city sectors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracking ID or title..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Potholes</option>
            <option value="water_leak">Water Leaks</option>
            <option value="waste_dump">Waste Dumps</option>
            <option value="streetlight">Streetlights</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <th className="pb-3 px-3">Tracking ID</th>
              <th className="pb-3 px-3">Hazard Details</th>
              <th className="pb-3 px-3">Severity & AI</th>
              <th className="pb-3 px-3">Affected Citizens</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((issue) => {
              const statusMeta = getStatusMeta(issue.status);

              return (
                <tr key={issue.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {issue.trackingNumber}
                    </span>
                  </td>

                  <td className="py-3 px-3 max-w-xs">
                    <Link
                      href={`/community/${issue.id}`}
                      className="font-bold text-white hover:text-cyan-300 block truncate"
                    >
                      {issue.title}
                    </Link>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {issue.location.address} • {issue.location.ward}
                    </span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <SeverityPill severity={issue.severity} size="sm" />
                    <span className="text-[10px] text-cyan-300 font-mono block mt-0.5">
                      Conf: {Math.round(issue.aiAnalysis.confidence * 100)}%
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <span className="text-purple-300 font-bold">{issue.affectedCount} Joined</span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Threshold: {issue.affectedThreshold}
                    </span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      href={`/official/${issue.id}`}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 inline-block align-middle"
                      title="Inspect & Resolve"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {issue.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleForceEscalate(issue.trackingNumber)}
                        className="text-[11px] border-amber-500/40 text-amber-300 hover:text-white"
                      >
                        Force Escalate
                      </Button>
                    )}
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
