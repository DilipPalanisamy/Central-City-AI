"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  Flame,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Clock,
  ArrowRight,
} from "lucide-react";

export function CitizenNotifications() {
  const notifItems = [
    {
      id: "n1",
      icon: Flame,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-950/60 border-rose-500/30",
      text: "Your road damage report has reached the escalation threshold.",
      time: "10 mins ago",
      badge: "Escalated",
      variant: "rose" as const,
      link: "/community/iss_8942",
    },
    {
      id: "n2",
      icon: Wrench,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-950/60 border-indigo-500/30",
      text: "An official has started work on your reported issue.",
      time: "1 hour ago",
      badge: "In Progress",
      variant: "indigo" as const,
      link: "/community/iss_8942",
    },
    {
      id: "n3",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/60 border-emerald-500/30",
      text: "Your supported issue has been resolved.",
      time: "3 hours ago",
      badge: "Resolved",
      variant: "emerald" as const,
      link: "/verify-resolution/iss_8945",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Notifications
          </h3>
        </div>

        <Badge variant="amber" size="sm">
          3 New
        </Badge>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.link}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3 text-xs block group"
            >
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                  <span>{item.time}</span>
                  <Badge variant={item.variant} size="sm">
                    {item.badge}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* VIEW ALL NOTIFICATIONS Button */}
      <div className="pt-2 border-t border-slate-800/80">
        <Link href="/notifications">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold justify-center"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            VIEW ALL NOTIFICATIONS
          </Button>
        </Link>
      </div>
    </div>
  );
}
