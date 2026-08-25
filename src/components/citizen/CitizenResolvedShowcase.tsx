"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  MapPin,
  Clock,
  Building2,
  Check,
  ArrowRight,
} from "lucide-react";

export interface CitizenResolvedShowcaseProps {
  onSelectIssue?: (issue: any) => void;
}

export function CitizenResolvedShowcase({ onSelectIssue }: CitizenResolvedShowcaseProps) {
  const resolvedIssues = [
    {
      id: "iss_res_1",
      issue: "Broken Streetlight Corridor",
      location: "Koduvalai, 24th St Intersection",
      resolvedBy: "Technician Leo Rossi (City Energy Grid)",
      resolvedDate: "Today at 02:15 PM",
      beforeImg: "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
      link: "/verify-resolution/iss_8945",
    },
    {
      id: "iss_res_2",
      issue: "Sidewalk Water Main Leak",
      location: "Tamil Nadu Crossing, Near Main Market",
      resolvedBy: "Public Works Crew #08 (PWD-RDS)",
      resolvedDate: "Yesterday at 04:30 PM",
      beforeImg: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80",
      link: "/verify-resolution/iss_8942",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Recently Resolved
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Repairs completed by authorities with photographic verification proof.
          </p>
        </div>

        <Badge variant="emerald" size="sm">
          92% On-Time SLA
        </Badge>
      </div>

      {/* Resolved Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resolvedIssues.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-glass space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Before & After Images Placeholders */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">
                    Before Repair
                  </span>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-rose-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.beforeImg}
                      alt="Before repair"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    After Proof
                  </span>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/40 shadow-emerald-glow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.afterImg}
                      alt="After resolution proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {item.issue}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    ✓ Resolved
                  </span>
                </div>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{item.location}</span>
                </span>
              </div>

              {/* Authority and Date Details */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Resolved by: <strong className="text-white">{item.resolvedBy}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Resolved date: {item.resolvedDate}</span>
                </div>
              </div>
            </div>

            {/* VIEW RESOLUTION Button */}
            <div className="pt-2 border-t border-slate-800/80">
              <Link href={item.link}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold justify-center border-emerald-500/40 text-emerald-300 hover:text-white"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  VIEW RESOLUTION
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
