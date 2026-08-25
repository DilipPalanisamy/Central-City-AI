"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Check,
  Users,
  MapPin,
  Flame,
  ArrowRight,
  Home,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export interface Step7SuccessProps {
  trackingNumber: string;
  category: string;
  location: string;
  priority: string;
  onViewCommunity?: () => void;
  onBackDashboard?: () => void;
}

export function Step7Success({
  trackingNumber = "CCA-2026-00124",
  category = "Road Damage",
  location = "Avinashipalayam",
  priority = "HIGH",
  onViewCommunity,
  onBackDashboard,
}: Step7SuccessProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300 text-center">
      {/* Top Radiant Success Icon: ✓ */}
      <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
        <div className="w-full h-full rounded-3xl bg-slate-950 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
          <Check className="w-12 h-12 stroke-[3]" />
        </div>
      </div>

      {/* Exact Heading & Message */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Report Submitted Successfully
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your evidence has been recorded and the issue is now being prepared for community verification.
        </p>
      </div>

      {/* Telemetry Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-glass text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Civic Ticket Receipt
          </span>
          <Badge variant="emerald" size="sm">
            +50 Karma Earned
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Report ID */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Report ID:
            </span>
            <span className="text-sm font-black text-cyan-400 font-mono">
              {trackingNumber || "CCA-2026-00124"}
            </span>
          </div>

          {/* Priority */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Priority:
            </span>
            <span className="text-sm font-black text-amber-400 font-mono">
              {priority || "HIGH"}
            </span>
          </div>

          {/* Location */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Location:
            </span>
            <span className="text-xs font-bold text-white truncate block">
              {location || "Avinashipalayam"}
            </span>
          </div>

          {/* Status */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Status:
            </span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
              COMMUNITY VERIFICATION
            </span>
          </div>
        </div>

        {/* Next Step Info */}
        <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-center gap-2.5 text-xs text-purple-200">
          <Users className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Nearby neighbors will now be alerted to confirm collective impact via <strong>&ldquo;I&apos;m Affected&rdquo;</strong> signatures.
          </span>
        </div>
      </div>

      {/* 2 Primary Action Buttons: [ VIEW COMMUNITY ISSUE ] and [ BACK TO DASHBOARD ] */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {/* [ VIEW COMMUNITY ISSUE ] */}
        <Link href="/community/iss_8942" className="w-full sm:w-auto">
          <Button
            type="button"
            variant="glow"
            size="md"
            onClick={onViewCommunity}
            className="w-full sm:w-auto text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 shadow-purple-glow"
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            VIEW COMMUNITY ISSUE
          </Button>
        </Link>

        {/* [ BACK TO DASHBOARD ] */}
        <Link href="/citizen" className="w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onBackDashboard}
            className="w-full sm:w-auto text-xs font-bold border-slate-700 hover:border-slate-600"
            leftIcon={<Home className="w-4 h-4" />}
          >
            BACK TO DASHBOARD
          </Button>
        </Link>
      </div>
    </div>
  );
}
