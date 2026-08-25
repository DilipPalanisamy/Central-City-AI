"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  MapPin,
  Users,
  Flame,
  Clock,
  ArrowRight,
  ExternalLink,
  Eye,
} from "lucide-react";

export interface CitizenNearbyIssuesProps {
  onSelectIssue?: (issue: any) => void;
}

export function CitizenNearbyIssues({ onSelectIssue }: CitizenNearbyIssuesProps) {
  const nearbyIssues = [
    {
      id: "iss_nearby_1",
      category: "ROAD DAMAGE",
      location: "Avinashipalayam",
      priority: "HIGH",
      priorityVariant: "rose" as const,
      severityScore: "89/100",
      severityVal: 89,
      affectedCount: "4/5",
      affectedCurrent: 4,
      affectedTotal: 5,
      status: "Awaiting Escalation",
      statusVariant: "amber" as const,
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      link: "/community/iss_8942",
    },
    {
      id: "iss_nearby_2",
      category: "BROKEN STREETLIGHT",
      location: "Koduvalai",
      priority: "MEDIUM",
      priorityVariant: "amber" as const,
      severityScore: "61/100",
      severityVal: 61,
      affectedCount: "7/10",
      affectedCurrent: 7,
      affectedTotal: 10,
      status: "Community Support",
      statusVariant: "purple" as const,
      image: "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80",
      link: "/community/iss_8945",
    },
    {
      id: "iss_nearby_3",
      category: "WATER INFRASTRUCTURE",
      location: "Tamil Nadu",
      priority: "LOW",
      priorityVariant: "indigo" as const,
      severityScore: "38/100",
      severityVal: 38,
      affectedCount: "6/15",
      affectedCurrent: 6,
      affectedTotal: 15,
      status: "Monitoring",
      statusVariant: "cyan" as const,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
      link: "/community/iss_8943",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Active Issues Near You
          </h2>
          <p className="text-xs text-slate-400">
            Neighborhood hazards within 5 km verified by citizen consensus.
          </p>
        </div>

        <Link href="/community">
          <span className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Mock Issue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {nearbyIssues.map((issue) => {
          const percent = Math.round(
            (issue.affectedCurrent / issue.affectedTotal) * 100
          );

          return (
            <div
              key={issue.id}
              className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass flex flex-col justify-between space-y-4 transition-all hover:scale-[1.02] hover:border-slate-700 group"
            >
              <div className="space-y-3">
                {/* Evidence Image Placeholder */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.image}
                    alt={issue.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <Badge variant={issue.priorityVariant} size="sm">
                      {issue.priority}
                    </Badge>
                  </div>
                </div>

                {/* Category & Location */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white tracking-wide">
                      {issue.category}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      Sev: {issue.severityScore}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{issue.location}</span>
                  </span>
                </div>

                {/* Affected Count Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span>Affected: {issue.affectedCount}</span>
                    </span>
                    <Badge variant={issue.statusVariant} size="sm">
                      {issue.status}
                    </Badge>
                  </div>

                  <ProgressBar
                    value={percent}
                    variant={issue.priorityVariant === "rose" ? "rose" : "indigo"}
                    size="sm"
                    showPercentage={false}
                  />
                </div>
              </div>

              {/* VIEW ISSUE Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <Link href={issue.link}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold justify-center"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    VIEW ISSUE
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
