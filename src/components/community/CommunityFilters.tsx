"use client";

import React from "react";
import { useCivicStore } from "@/lib/mockStore";
import { IssueCategory, IssueSeverity, IssueStatus } from "@/types";
import { Search, Filter, ArrowUpDown, X, Sparkles, Users } from "lucide-react";

export function CommunityFilters() {
  const {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterSeverity,
    setFilterSeverity,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
  } = useCivicStore();

  const categories: { id: IssueCategory | "all"; label: string }[] = [
    { id: "all", label: "All Categories" },
    { id: "pothole", label: "Potholes & Roads" },
    { id: "water_leakage", label: "Water & Leaks" },
    { id: "garbage_dump", label: "Waste Dumping" },
    { id: "broken_streetlight", label: "Streetlights" },
    { id: "traffic_signal", label: "Traffic Signals" },
    { id: "open_manhole", label: "Open Manholes" },
  ];

  const severities: { id: IssueSeverity | "all"; label: string }[] = [
    { id: "all", label: "All Severities" },
    { id: "critical", label: "Critical" },
    { id: "high", label: "High" },
    { id: "medium", label: "Medium" },
  ];

  const hasActiveFilters =
    filterCategory !== "all" ||
    filterSeverity !== "all" ||
    filterStatus !== "all" ||
    searchQuery !== "";

  const handleReset = () => {
    setFilterCategory("all");
    setFilterSeverity("all");
    setFilterStatus("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass">
      {/* Top Row: Search Input & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by neighborhood, keyword (e.g. crater, pipeline), or tracking ID (CC-2026-8942)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-cyan-400 hidden sm:block shrink-0" />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "affected" | "priority" | "newest" | "sla")
            }
            className="w-full sm:w-auto rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <option value="affected">Sort: Most Affected Citizens (Escalation)</option>
            <option value="priority">Sort: Highest AI Priority Score</option>
            <option value="newest">Sort: Newest Reports First</option>
            <option value="sla">Sort: Urgent SLA Countdown</option>
          </select>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-cyan-glow"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Severity Filters & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            Severity Filter:
          </span>
          <div className="flex items-center gap-1">
            {severities.map((sev) => {
              const isSelected = filterSeverity === sev.id;
              return (
                <button
                  key={sev.id}
                  onClick={() => setFilterSeverity(sev.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    isSelected
                      ? sev.id === "critical"
                        ? "bg-rose-950 text-rose-300 border border-rose-500/50"
                        : "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sev.label}
                </button>
              );
            })}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
