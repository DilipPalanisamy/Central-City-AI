"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCivicStore } from "@/lib/mockStore";
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Camera,
  ExternalLink,
  Shield,
  Eye,
  Check,
  X,
} from "lucide-react";

export function AdminDisputesView() {
  const { addToast } = useCivicStore();

  const [disputesList, setDisputesList] = useState([
    {
      id: "disp_01",
      issueId: "iss_8942",
      trackingNumber: "CC-2026-8939",
      title: "Sidewalk Paver Repair Uneven Level",
      ward: "Ward 12 (Old Town)",
      disputedBy: "Dr. Maya Patel (+2450 Karma)",
      disputeReason: "Asphalt patch is 3cm lower than surrounding pavers, creating standing water ponding and tripping risk.",
      reportedAt: "4 hours ago",
      beforeImg: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
      status: "Under Review",
    },
    {
      id: "disp_02",
      issueId: "iss_8945",
      trackingNumber: "CC-2026-8945",
      title: "Streetlight 24th St Corridor Flickering",
      ward: "Ward 07 (Sunset)",
      disputedBy: "Alex Rivera (+840 Karma)",
      disputeReason: "3 of the 8 replaced luminaires flicker aggressively after 9 PM. Feeder box relay switch may be overloaded.",
      reportedAt: "18 hours ago",
      beforeImg: "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
      status: "Under Review",
    },
  ]);

  const handleApproveDispute = (id: string, trackingNumber: string) => {
    setDisputesList((prev) => prev.filter((d) => d.id !== id));
    addToast(
      "Dispute Approved",
      `Work Order ${trackingNumber} reopened for mandatory municipal re-inspection. Dispatcher notified.`,
      "success"
    );
  };

  const handleDismissDispute = (id: string, trackingNumber: string) => {
    setDisputesList((prev) => prev.filter((d) => d.id !== id));
    addToast(
      "Dispute Dismissed",
      `Dispute on ${trackingNumber} dismissed following engineering audit sign-off.`,
      "info"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Citizen Resolution Disputes & Quality Audits ({disputesList.length})
          </h2>
          <p className="text-xs text-slate-400">
            Review community-flagged inadequate repairs before finalizing closure on public civic ledger.
          </p>
        </div>

        <Badge variant="rose" size="md">
          {disputesList.length} Action Items
        </Badge>
      </div>

      {/* Disputes Cards List */}
      <div className="space-y-4">
        {disputesList.map((disp) => (
          <div
            key={disp.id}
            className="p-6 rounded-3xl bg-slate-950 border border-rose-500/30 shadow-glass space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-xs">
                  {disp.trackingNumber}
                </span>
                <h3 className="text-sm font-bold text-white">{disp.title}</h3>
                <span className="text-xs text-slate-400">• {disp.ward}</span>
              </div>

              <span className="text-[11px] font-mono text-rose-300 font-semibold">
                Disputed {disp.reportedAt} by {disp.disputedBy}
              </span>
            </div>

            {/* Side-by-Side Photo Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-400 block">Initial Hazard Photo:</span>
                <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={disp.beforeImg} alt="Before" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-rose-400 block">Citizen Disputed Photo Evidence:</span>
                <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900 border border-rose-500/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={disp.afterImg} alt="Disputed" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Dispute Reason Card */}
            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs space-y-1">
              <span className="font-bold text-rose-300 uppercase text-[10px] block">
                Citizen Defect Observation:
              </span>
              <p className="text-slate-200 leading-relaxed">{disp.disputeReason}</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <Link
                href={`/community/${disp.issueId}`}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <span>Inspect Full Ticket</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismissDispute(disp.id, disp.trackingNumber)}
                  className="text-xs border-slate-700 text-slate-300"
                >
                  Dismiss Dispute
                </Button>

                <Button
                  size="sm"
                  variant="glow"
                  onClick={() => handleApproveDispute(disp.id, disp.trackingNumber)}
                  className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-rose-glow"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Approve Dispute & Reopen Work Order
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
