"use client";

import React, { useState } from "react";
import { CivicIssue } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Layers,
  Crosshair,
  Truck,
  Wrench,
  Sparkles,
  ExternalLink,
  Shield,
  Eye,
} from "lucide-react";

export interface OfficialIssueMapProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
  onQuickDispatch: (issue: CivicIssue) => void;
}

export function OfficialIssueMap({
  issues,
  onSelectIssue,
  onQuickDispatch,
}: OfficialIssueMapProps) {
  const [activePinId, setActivePinId] = useState<string>(issues[0]?.id || "iss_8942");

  const selectedIssue = issues.find((i) => i.id === activePinId) || issues[0];

  // Simulated GPS Pin Positions on vector grid
  const pinCoordinates: Record<string, { top: number; left: number }> = {
    iss_8942: { top: 46, left: 48 }, // Market St
    iss_8943: { top: 32, left: 68 }, // Pine St
    iss_8944: { top: 72, left: 74 }, // Valencia St
    iss_8945: { top: 62, left: 34 }, // 24th St
    iss_8946: { top: 52, left: 24 }, // Castro St
    iss_8947: { top: 80, left: 55 }, // Pier 70
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-glass space-y-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Municipal Geospatial Command & Field Dispatch
            </h3>
            <span className="text-[11px] text-slate-400">
              Live telemetry tracking across Wards 14, 12, 07 & 04
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Critical Hazard
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            High Priority
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <Truck className="w-3 h-3 text-indigo-400" />
            Field Crew Unit
          </span>
        </div>
      </div>

      {/* Main Vector Grid Canvas */}
      <div className="relative h-80 sm:h-96 w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group">
        {/* Dark Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />

        {/* Vector Grid Topology & Roads */}
        <svg
          className="absolute inset-0 w-full h-full stroke-slate-800/80 stroke-[2] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="30%" x2="100%" y2="30%" strokeDasharray="6 6" />
          <line x1="0" y1="65%" x2="100%" y2="65%" strokeDasharray="4 4" />
          <line x1="45%" y1="0" x2="45%" y2="100%" />
          <line x1="72%" y1="0" x2="72%" y2="100%" strokeDasharray="6 6" />
          <circle cx="48%" cy="46%" r="90" fill="rgba(6, 182, 212, 0.04)" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" />
          <circle cx="68%" cy="32%" r="70" fill="rgba(244, 63, 94, 0.04)" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="1.5" />
        </svg>

        {/* Ward Area Boundary Labels */}
        <span className="absolute top-4 left-6 text-[10px] font-mono text-slate-600 font-bold uppercase pointer-events-none">
          Sector A • Ward 12 (Old Town)
        </span>
        <span className="absolute bottom-6 left-6 text-[10px] font-mono text-slate-600 font-bold uppercase pointer-events-none">
          Sector B • Ward 04 (Bayfront)
        </span>
        <span className="absolute top-4 right-8 text-[10px] font-mono text-cyan-500/40 font-bold uppercase pointer-events-none">
          Sector C • Ward 14 (Metro Central)
        </span>

        {/* Radar Sweep Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/10 animate-ping pointer-events-none" />

        {/* Municipal Crew Vehicle Units in Field */}
        <div style={{ top: "42%", left: "44%" }} className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="px-2 py-0.5 rounded-md bg-indigo-950/90 border border-indigo-500/50 text-[9px] font-mono text-indigo-300 flex items-center gap-1 shadow-lg">
            <Truck className="w-3 h-3 text-indigo-400" />
            <span>Truck #14 (En Route)</span>
          </div>
        </div>

        {/* Interactive Incident Pins */}
        {issues.map((issue) => {
          const coords = pinCoordinates[issue.id] || { top: 50, left: 50 };
          const isSelected = activePinId === issue.id;
          const isCritical = issue.severity === "critical";

          return (
            <button
              key={issue.id}
              type="button"
              onClick={() => setActivePinId(issue.id)}
              style={{ top: `${coords.top}%`, left: `${coords.left}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-300 focus:outline-none ${
                isSelected ? "scale-125 z-40" : "hover:scale-110 opacity-90"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isCritical && (
                  <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-rose-400 opacity-75" />
                )}

                <div
                  className={`w-7 h-7 rounded-2xl flex items-center justify-center font-black text-[10px] border-2 shadow-xl ${
                    isCritical
                      ? "bg-gradient-to-tr from-rose-600 to-amber-500 text-white border-white shadow-rose-500/40"
                      : "bg-slate-900 text-cyan-300 border-cyan-400 shadow-cyan-glow"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}

        {/* Floating Selected Incident Popover Card */}
        {selectedIssue && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-40 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                {selectedIssue.trackingNumber}
              </span>
              <Badge
                variant={selectedIssue.severity === "critical" ? "rose" : "amber"}
                size="sm"
              >
                {selectedIssue.severity.toUpperCase()} PRIORITY
              </Badge>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {selectedIssue.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {selectedIssue.location.address} • {selectedIssue.location.ward}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">
                Affected: <strong className="text-white">{selectedIssue.affectedCount}</strong> citizens
              </span>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectIssue(selectedIssue)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Inspect
                </Button>

                <Button
                  size="sm"
                  variant="glow"
                  onClick={() => onQuickDispatch(selectedIssue)}
                  leftIcon={<Wrench className="w-3.5 h-3.5" />}
                >
                  Dispatch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
