"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCivicStore } from "@/lib/mockStore";
import {
  MapPin,
  Users,
  Flame,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export interface ActiveIssuesSectionProps {
  onOpenReportModal?: () => void;
}

export function ActiveIssuesSection({ onOpenReportModal }: ActiveIssuesSectionProps) {
  const { addToast } = useCivicStore();

  const [liveIssues, setLiveIssues] = useState([
    {
      id: "iss_live_1",
      title: "Road Damage",
      location: "Avinashipalayam",
      priority: "HIGH",
      priorityVariant: "rose" as const,
      currentAffected: 4,
      requiredAffected: 5,
      sla: "6 Hours SLA",
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      description: "Severe crater-like road depression on high-speed transit lane causing traffic slowdown.",
      userMarked: false,
    },
    {
      id: "iss_live_2",
      title: "Broken Streetlight",
      location: "Koduvalai",
      priority: "MEDIUM",
      priorityVariant: "amber" as const,
      currentAffected: 7,
      requiredAffected: 10,
      sla: "24 Hours SLA",
      image: "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80",
      description: "Multiple dark streetlights along school crossway creating night safety hazards.",
      userMarked: false,
    },
    {
      id: "iss_live_3",
      title: "Water Infrastructure",
      location: "Tamil Nadu",
      priority: "LOW",
      priorityVariant: "indigo" as const,
      currentAffected: 6,
      requiredAffected: 15,
      sla: "72 Hours SLA",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
      description: "Underground main line valve seepage pooling clean water along pedestrian sidewalk.",
      userMarked: false,
    },
    {
      id: "iss_live_4",
      title: "Commercial Waste Dump",
      location: "Tiruppur Central",
      priority: "HIGH",
      priorityVariant: "rose" as const,
      currentAffected: 8,
      requiredAffected: 10,
      sla: "12 Hours SLA",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
      description: "Unauthorized industrial debris blocking stormwater drain near sports complex.",
      userMarked: false,
    },
  ]);

  const handleToggle = (id: string, title: string) => {
    setLiveIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          const isNowMarked = !iss.userMarked;
          return {
            ...iss,
            userMarked: isNowMarked,
            currentAffected: isNowMarked ? iss.currentAffected + 1 : iss.currentAffected - 1,
          };
        }
        return iss;
      })
    );

    addToast(
      "Signal Recorded",
      `Your 'I'm Affected' confirmation has been added to ${title}.`,
      "success"
    );
  };

  return (
    <section id="live-issues" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Civic Telemetry</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Live Civic Issues
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Explore active neighborhood reports verified by computer vision triage and citizen quorums.
            </p>
          </div>

          <Link href="/community">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View All Community Issues
            </Button>
          </Link>
        </div>

        {/* 4 Mock Issue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {liveIssues.map((issue) => {
            const percent = Math.min(
              100,
              Math.round((issue.currentAffected / issue.requiredAffected) * 100)
            );

            return (
              <div
                key={issue.id}
                className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/40 group"
              >
                <div className="space-y-3">
                  {/* Photo Preview */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant={issue.priorityVariant} size="sm">
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white leading-tight truncate">
                      {issue.title}
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{issue.location}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>

                  {/* Affected Citizens Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-400" />
                        <span>Affected Citizens</span>
                      </span>
                      <span className="font-mono text-purple-300">
                        {issue.currentAffected} / {issue.requiredAffected} ({percent}%)
                      </span>
                    </div>

                    <ProgressBar
                      value={percent}
                      variant={issue.priorityVariant === "rose" ? "rose" : "indigo"}
                      size="sm"
                      showPercentage={false}
                    />
                  </div>
                </div>

                {/* Bottom Action: "I'M AFFECTED" */}
                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleToggle(issue.id, issue.title)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      issue.userMarked
                        ? "bg-purple-600 border-purple-400 text-white shadow-purple-glow"
                        : "bg-slate-900 hover:bg-purple-950/60 border-purple-500/30 text-purple-300 hover:text-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{issue.userMarked ? "✓ Marked Affected" : "I'm Affected"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
