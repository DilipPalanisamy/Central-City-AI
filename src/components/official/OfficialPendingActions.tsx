"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Clock,
  RotateCcw,
  Check,
  X,
  FileCheck,
  Shield,
} from "lucide-react";
import { useCivicStore } from "@/lib/mockStore";

export function OfficialPendingActions() {
  const { addToast } = useCivicStore();

  const pendingList = [
    {
      id: "act_1",
      title: "Approve Heavy Asphalt Milling Unit #08 for CC-2026-8942",
      type: "Dispatch Approval",
      ward: "Ward 14",
      priority: "HIGH",
      timeAgo: "15 mins ago",
      icon: Wrench,
      border: "border-cyan-500/30",
    },
    {
      id: "act_2",
      title: "Review Community Dispute on Sidewalk Pavers (CC-2026-8939)",
      type: "Audit Review",
      ward: "Ward 12",
      priority: "CRITICAL",
      timeAgo: "40 mins ago",
      icon: RotateCcw,
      border: "border-rose-500/30",
    },
    {
      id: "act_3",
      title: "Sign-off Verified Resolution Photo for 24th St Lighting (CC-2026-8945)",
      type: "Sign-Off",
      ward: "Ward 07",
      priority: "MEDIUM",
      timeAgo: "2 hours ago",
      icon: FileCheck,
      border: "border-emerald-500/30",
    },
  ];

  const handleApprove = (actionTitle: string) => {
    addToast("Action Approved", `Approved: ${actionTitle}`, "success");
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-amber-glow">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Pending Command Actions
            </h3>
            <span className="text-[11px] text-slate-400">
              Authority approvals required for municipal field execution
            </span>
          </div>
        </div>

        <Badge variant="amber" size="sm">
          3 Pending Sign-Offs
        </Badge>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {pendingList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl bg-slate-900/60 border ${item.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-white block leading-tight">
                    {item.title}
                  </span>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <span className="text-cyan-400 font-bold">{item.type}</span>
                    <span>• {item.ward}</span>
                    <span>• {item.timeAgo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApprove(item.title)}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Inspect
                </Button>
                <Button
                  size="sm"
                  variant="glow"
                  onClick={() => handleApprove(item.title)}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Authorize
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
