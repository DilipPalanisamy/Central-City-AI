"use client";

import React from "react";
import Link from "next/link";
import { CivicNotification } from "@/types";
import { useCivicStore } from "@/lib/mockStore";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  Camera,
  Users,
  Flame,
  Zap,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  MapPin,
} from "lucide-react";

export interface NotificationItemProps {
  notification: CivicNotification;
  compact?: boolean;
  onCloseDropdown?: () => void;
}

export function NotificationItem({
  notification,
  compact = false,
  onCloseDropdown,
}: NotificationItemProps) {
  const { markNotificationAsRead, markNotificationAsUnread, clearNotification } = useCivicStore();

  const getIconAndColor = () => {
    switch (notification.type) {
      case "report_submitted":
        return {
          icon: Camera,
          bg: "bg-cyan-950/80 border-cyan-500/40 text-cyan-400",
          glow: "shadow-cyan-glow",
        };
      case "citizen_joined":
        return {
          icon: Users,
          bg: "bg-purple-950/80 border-purple-500/40 text-purple-400",
          glow: "shadow-purple-glow",
        };
      case "threshold_reached":
        return {
          icon: Flame,
          bg: "bg-rose-950/80 border-rose-500/40 text-rose-400",
          glow: "shadow-rose-glow",
        };
      case "issue_escalated":
        return {
          icon: Zap,
          bg: "bg-amber-950/80 border-amber-500/40 text-amber-400",
          glow: "shadow-amber-glow",
        };
      case "official_started_work":
        return {
          icon: Wrench,
          bg: "bg-indigo-950/80 border-indigo-500/40 text-indigo-400",
          glow: "shadow-cyan-glow",
        };
      case "issue_resolved":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-400",
          glow: "shadow-emerald-glow",
        };
      case "resolution_disputed":
        return {
          icon: AlertTriangle,
          bg: "bg-rose-950/80 border-rose-500/40 text-rose-400",
          glow: "shadow-rose-glow",
        };
      case "issue_reopened":
        return {
          icon: RotateCcw,
          bg: "bg-amber-950/80 border-amber-500/40 text-amber-400",
          glow: "shadow-amber-glow",
        };
      default:
        return {
          icon: Clock,
          bg: "bg-slate-900 border-slate-700 text-slate-300",
          glow: "",
        };
    }
  };

  const { icon: Icon, bg, glow } = getIconAndColor();

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 relative group flex items-start gap-3.5 ${
        notification.isRead
          ? "bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100"
          : "bg-slate-900/90 border-cyan-500/40 shadow-glass"
      }`}
    >
      {/* Read / Unread Visual Indicator Bar */}
      {!notification.isRead && (
        <span className="absolute left-1 top-4 bottom-4 w-1 bg-cyan-400 rounded-full shadow-cyan-glow" />
      )}

      {/* Type Icon Orb */}
      <div
        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bg} ${glow}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-bold ${
                notification.isRead ? "text-slate-200" : "text-white font-black"
              }`}
            >
              {notification.title}
            </span>

            <Badge variant={notification.badgeVariant} size="sm">
              {notification.badgeText}
            </Badge>
          </div>

          <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
          {notification.message}
        </p>

        {/* Action and Link Strip */}
        <div className="flex items-center justify-between pt-1.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Link
              href={`/community/${notification.issueId}`}
              onClick={onCloseDropdown}
              className="text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors"
            >
              <span>{notification.issueTrackingNumber}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              • {notification.ward}
            </span>
          </div>

          {/* Quick Actions (Toggle Read & Delete) */}
          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (notification.isRead) {
                  markNotificationAsUnread(notification.id);
                } else {
                  markNotificationAsRead(notification.id);
                }
              }}
              title={notification.isRead ? "Mark as unread" : "Mark as read"}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {notification.isRead ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearNotification(notification.id);
              }}
              title="Dismiss"
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
