"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Camera,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function CitizenCommunityActivity() {
  const activities = [
    {
      id: "act_1",
      icon: Users,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-950/60 border-purple-500/30",
      title: "Someone joined the Road Damage issue.",
      subtitle: "Avinashipalayam Transit Lane • Ward 14",
      time: "5 mins ago",
      badge: "+1 Affected",
      badgeVariant: "purple" as const,
      link: "/community/iss_8942",
    },
    {
      id: "act_2",
      icon: Camera,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-950/60 border-cyan-500/30",
      title: "Someone reported supporting evidence.",
      subtitle: "High-angle crater depth measurement uploaded",
      time: "20 mins ago",
      badge: "Evidence Added",
      badgeVariant: "cyan" as const,
      link: "/community/iss_8942",
    },
    {
      id: "act_3",
      icon: Flame,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-950/60 border-rose-500/30",
      title: "Road Damage reached 4/5 affected citizens.",
      subtitle: "Approaching autonomous emergency threshold",
      time: "45 mins ago",
      badge: "Quorum Alert",
      badgeVariant: "rose" as const,
      link: "/community/iss_8942",
    },
    {
      id: "act_4",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/60 border-emerald-500/30",
      title: "Broken Streetlight at Koduvalai verified fixed.",
      subtitle: "Photographic resolution proof ratified by 8 residents",
      time: "2 hours ago",
      badge: "Resolved",
      badgeVariant: "emerald" as const,
      link: "/community/iss_8945",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Community Activity
          </h3>
        </div>

        <Link
          href="/community"
          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>View Ledger</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3">
        {activities.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.link}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3 text-xs block group"
            >
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 truncate">
                  {item.subtitle}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                  <span>{item.time}</span>
                  <Badge variant={item.badgeVariant} size="sm">
                    {item.badge}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
