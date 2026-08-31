"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityFilters } from "@/components/community/CommunityFilters";
import { CommunityIssueCard } from "@/components/community/CommunityIssueCard";
import { useCivicStore } from "@/lib/mockStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  ShieldCheck,
  Flame,
  PlusCircle,
  Sparkles,
  Layers,
  Building2,
  AlertTriangle,
} from "lucide-react";

export default function CommunityPage() {
  const {
    issues,
    filterCategory,
    filterSeverity,
    filterStatus,
    searchQuery,
    sortBy,
  } = useCivicStore();

  // Filter & Sort logic
  const filteredIssues = useMemo(() => {
    return issues
      .filter((iss) => {
        // Category filter
        if (filterCategory !== "all" && iss.category !== filterCategory) return false;
        // Severity filter
        if (filterSeverity !== "all" && iss.severity !== filterSeverity) return false;
        // Status filter
        if (filterStatus !== "all" && iss.status !== filterStatus) return false;
        // Search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchTitle = iss.title.toLowerCase().includes(q);
          const matchDesc = iss.description.toLowerCase().includes(q);
          const matchAddress = iss.location.address.toLowerCase().includes(q);
          const matchWard = iss.location.ward.toLowerCase().includes(q);
          const matchRef = iss.trackingNumber.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchAddress && !matchWard && !matchRef) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "affected") {
          return (b.affectedCount || 0) - (a.affectedCount || 0);
        }
        if (sortBy === "priority") {
          return (b.aiAnalysis.priorityScore || 0) - (a.aiAnalysis.priorityScore || 0);
        }
        if (sortBy === "newest") {
          return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        }
        if (sortBy === "sla") {
          return (a.aiAnalysis.estimatedResolutionHours || 99) - (b.aiAnalysis.estimatedResolutionHours || 99);
        }
        return 0;
      });
  }, [issues, filterCategory, filterSeverity, filterStatus, searchQuery, sortBy]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center space-x-2">
                <Badge variant="cyan" size="sm" dot>
                  Live Community Ledger
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {issues.length} Civic Reports Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Community Verification Feed
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Citizen-powered urban triage. Mark yourself as affected or submit new photographic evidence to cross autonomous escalation thresholds.
              </p>
            </div>

            {/* Action CTA: Report New Problem */}
            <div className="relative z-10 shrink-0">
              <Link href="/report">
                <Button
                  variant="glow"
                  size="md"
                  className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider px-6 py-3.5 shadow-cyan-glow"
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Report an Issue
                </Button>
              </Link>
            </div>

            {/* Background Glow */}
            <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar (4 cols): Filters & Statistics */}
            <div className="lg:col-span-4 space-y-6">
              <CommunityFilters />

              {/* Real-Time Impact Metric Card */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Democracy in Action</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                    <span className="text-slate-400">Escalated Today:</span>
                    <span className="font-mono font-bold text-amber-400">14 Issues</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                    <span className="text-slate-400">Avg Resolution Time:</span>
                    <span className="font-mono font-bold text-cyan-400">4.2 Hours</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400">Karma Distributed:</span>
                    <span className="font-mono font-bold text-emerald-400">+18,450 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Feed (8 cols): Issue Cards List */}
            <div className="lg:col-span-8 space-y-4">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-16 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">No Civic Issues Found</h3>
                    <p className="text-xs text-slate-400">
                      Try adjusting your category, severity filters, or search terms.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <CommunityIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
