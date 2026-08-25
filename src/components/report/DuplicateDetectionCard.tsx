"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Layers,
  Sparkles,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CopyCheck,
  Share2,
} from "lucide-react";

export interface DuplicateDetectionCardProps {
  userReport: {
    title: string;
    imageUrl: string;
    address: string;
    ward: string;
    category: string;
  };
  existingIssue?: {
    id: string;
    trackingNumber: string;
    title: string;
    imageUrl: string;
    address: string;
    ward: string;
    status: string;
    reportedBy: string;
    timeAgo: string;
    affectedCount: number;
    similarityScore: number; // e.g. 94
  };
  onViewExisting: (issueId: string) => void;
  onJoinExisting: (issueId: string) => void;
  onReportSeparately: () => void;
}

export function DuplicateDetectionCard({
  userReport,
  existingIssue = {
    id: "iss_8942",
    trackingNumber: "CC-2026-8942",
    title: "Deep Hazardous Pothole on High-Speed Transit Lane",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    address: "842 Market St, Near 5th Ave Transit Crossing",
    ward: "Ward 14",
    status: "Field Crew Dispatched (SLA: 6h)",
    reportedBy: "Alex Rivera",
    timeAgo: "2 hours ago",
    affectedCount: 142,
    similarityScore: 94,
  },
  onViewExisting,
  onJoinExisting,
  onReportSeparately,
}: DuplicateDetectionCardProps) {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    setIsJoining(true);
    setTimeout(() => {
      onJoinExisting(existingIssue.id);
    }, 400);
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
      {/* Top Banner: Possible Existing Issue Found */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-black shadow-amber-glow">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Spatial & Vision Deduplication Engine</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Possible Existing Issue Found
        </h2>

        <p className="text-xs sm:text-sm text-slate-300">
          Our AI spatial scanner detected an active civic report within 15 meters that closely matches your photo and location.
        </p>
      </div>

      {/* High-Impact Similarity Index Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/60 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Confidence Similarity:
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {existingIssue.similarityScore}% Match
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Based on computer vision tensor vectors (94%), GPS proximity (12m distance), and category match.
          </p>
        </div>

        <div className="w-full sm:w-48 space-y-1">
          <ProgressBar
            value={existingIssue.similarityScore}
            variant="amber"
            size="md"
            showPercentage={false}
          />
          <span className="text-[10px] font-mono text-amber-300/80 block text-right font-bold">
            High Confidence Match
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison: Your Report vs Existing Issue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Your New Report */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Your New Report
            </span>
            <Badge variant="cyan" size="sm">Pending Submission</Badge>
          </div>

          <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userReport.imageUrl}
              alt="Your report"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-white truncate">{userReport.title}</h4>
            <p className="text-slate-400 text-[11px] flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{userReport.address}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Existing Active Issue on Civic Ledger */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border-2 border-amber-500/40 shadow-glass space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Active Incident On Ledger
            </span>
            <span className="text-[11px] font-mono text-cyan-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/30">
              {existingIssue.trackingNumber}
            </span>
          </div>

          <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950 border border-amber-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={existingIssue.imageUrl}
              alt="Existing incident"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-semibold border border-amber-500/30">
              {existingIssue.status}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-white truncate">{existingIssue.title}</h4>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <strong className="text-white">{existingIssue.affectedCount}</strong> Citizens Joined
              </span>
              <span>Reported {existingIssue.timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white block">
            Central-City-AI Transparency Guarantee:
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Your report is <strong className="text-white">never silently ignored or rejected</strong>. Joining the existing issue attaches your photo as certified supporting evidence, adds your vote toward emergency escalation, and awards you full Civic Karma.
          </p>
        </div>
      </div>

      {/* 3 Core Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Button 1: Join Existing Issue (Recommended Primary Action) */}
          <Button
            type="button"
            variant="glow"
            size="lg"
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full text-xs sm:text-sm font-black uppercase tracking-wider py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 shadow-purple-glow"
            leftIcon={<Users className="w-4 h-4" />}
          >
            {isJoining ? "Joining Case..." : "Join Existing Issue (+40 Karma)"}
          </Button>

          {/* Button 2: View Existing Issue */}
          <Link href={`/community/${existingIssue.id}`} className="w-full">
            <Button
              type="button"
              variant="glass"
              size="lg"
              className="w-full text-xs sm:text-sm font-bold py-3.5 border-slate-700 hover:border-cyan-400"
              leftIcon={<ExternalLink className="w-4 h-4 text-cyan-400" />}
            >
              View Existing Issue
            </Button>
          </Link>
        </div>

        {/* Button 3: Report Separately */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onReportSeparately}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 underline decoration-slate-600 hover:decoration-slate-400 transition-colors py-1 px-3"
          >
            My issue is different — Report Separately as New Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
