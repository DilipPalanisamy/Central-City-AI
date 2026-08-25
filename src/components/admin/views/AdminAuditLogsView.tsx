"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  Shield,
  Clock,
  Key,
  Database,
  Lock,
} from "lucide-react";

export function AdminAuditLogsView() {
  const auditLogs = [
    {
      id: "log_991",
      timestamp: "2026-08-25T14:24:12Z",
      actor: "Mayor Elena Rostova (Admin)",
      action: "UPDATED_THRESHOLD_RULE",
      target: "CRITICAL_TIER_QUORUM -> 3",
      ipHash: "e4f8...b129",
      severity: "INFO",
    },
    {
      id: "log_990",
      timestamp: "2026-08-25T14:18:44Z",
      actor: "Autonomous AI Engine",
      action: "AUTO_ESCALATION_TRIGGERED",
      target: "CC-2026-8942 -> PWD-RDS",
      ipHash: "127.0.0.1 (Internal Bus)",
      severity: "CRITICAL",
    },
    {
      id: "log_989",
      timestamp: "2026-08-25T13:52:10Z",
      actor: "Eng. Marcus Vance (Authority)",
      action: "DISPATCHED_FIELD_UNIT",
      target: "TRUCK_14 -> CC-2026-8942",
      ipHash: "9a21...c881",
      severity: "INFO",
    },
    {
      id: "log_988",
      timestamp: "2026-08-25T12:30:05Z",
      actor: "Dr. Maya Patel (Verifier)",
      action: "DISPUTED_WORK_ORDER",
      target: "CC-2026-8939 -> Sidewalk Defect",
      ipHash: "3f72...aa90",
      severity: "WARN",
    },
    {
      id: "log_987",
      timestamp: "2026-08-25T11:04:19Z",
      actor: "CityVision Neural Triage",
      action: "INFERENCE_CLASSIFICATION",
      target: "CC-2026-8945 -> Streetlight (98%)",
      ipHash: "127.0.0.1 (Tensor Cluster)",
      severity: "INFO",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Immutable Civic Ledger Audit Trail
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographically signed record of all system escalations, user verifications, and policy updates.
          </p>
        </div>

        <Badge variant="cyan" size="md">
          SHA-256 Ledger Synchronized
        </Badge>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <th className="pb-3 px-3">Timestamp (UTC)</th>
              <th className="pb-3 px-3">Authorized Actor</th>
              <th className="pb-3 px-3">Action Type</th>
              <th className="pb-3 px-3">Target Payload</th>
              <th className="pb-3 px-3">Source Node / Hash</th>
              <th className="pb-3 px-3 text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3 px-3 text-white font-bold whitespace-nowrap">
                  {log.actor}
                </td>
                <td className="py-3 px-3 text-cyan-300 font-bold whitespace-nowrap">
                  {log.action}
                </td>
                <td className="py-3 px-3 text-slate-300">
                  {log.target}
                </td>
                <td className="py-3 px-3 text-slate-500 text-[10px]">
                  {log.ipHash}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <Badge
                    variant={
                      log.severity === "CRITICAL"
                        ? "rose"
                        : log.severity === "WARN"
                        ? "amber"
                        : "cyan"
                    }
                    size="sm"
                  >
                    {log.severity}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
