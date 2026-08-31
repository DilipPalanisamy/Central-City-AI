"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Building2,
  Truck,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export function AdminDepartmentsView() {
  const departments = [
    {
      id: "dept_roads",
      name: "Department of Roads & Infrastructure",
      shortCode: "PWD-RDS",
      director: "Chief Eng. Marcus Vance",
      budget: "$14.2M",
      workforce: 64,
      fleets: 18,
      activeBacklog: 18,
      resolvedMonth: 94,
      slaRate: 96.4,
      variant: "cyan" as const,
    },
    {
      id: "dept_water",
      name: "Water Supply & Sewerage Bureau",
      shortCode: "WTR-SEW",
      director: "Inspector Sarah Jenkins",
      budget: "$9.8M",
      workforce: 42,
      fleets: 12,
      activeBacklog: 11,
      resolvedMonth: 62,
      slaRate: 92.1,
      variant: "indigo" as const,
    },
    {
      id: "dept_power",
      name: "City Energy & Street Lighting Grid",
      shortCode: "ENG-LGT",
      director: "Technician Leo Rossi",
      budget: "$6.5M",
      workforce: 28,
      fleets: 8,
      activeBacklog: 8,
      resolvedMonth: 88,
      slaRate: 99.1,
      variant: "emerald" as const,
    },
    {
      id: "dept_sanitation",
      name: "Environmental Sanitation & Waste Division",
      shortCode: "ENV-SAN",
      director: "Commander David O'Connor",
      budget: "$8.1M",
      workforce: 36,
      fleets: 14,
      activeBacklog: 6,
      resolvedMonth: 45,
      slaRate: 89.8,
      variant: "amber" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Municipal Agency Directory & Resource Allocation
          </h2>
          <p className="text-xs text-slate-400">
            Overview of department workforce, annual civic infrastructure budgets, and SLA compliance.
          </p>
        </div>

        <Badge variant="purple" size="md">
          8 Municipal Bureaus Active
        </Badge>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {dept.shortCode}
                  </span>
                  <h3 className="text-sm font-black text-white leading-tight">
                    {dept.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Director: {dept.director}
                  </span>
                </div>
              </div>

              <Badge variant={dept.variant} size="sm">
                {dept.slaRate}% SLA
              </Badge>
            </div>

            {/* SLA Progress Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>On-Time SLA Resolution Rate</span>
                <span className="font-mono text-white font-bold">{dept.slaRate}%</span>
              </div>
              <ProgressBar value={dept.slaRate} variant={dept.variant} size="sm" showPercentage={false} />
            </div>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">
                  Workforce
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {dept.workforce} Staff • {dept.fleets} Trucks
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">
                  Budget
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {dept.budget}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">
                  Backlog
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {dept.activeBacklog} Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
