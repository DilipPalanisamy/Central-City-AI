"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useCivicStore } from "@/lib/mockStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  CheckCheck,
  Filter,
  Trash2,
  Inbox,
  Flame,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
  } = useCivicStore();

  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "escalations" | "work" | "disputes"
  >("all");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "unread") return !n.isRead;
      if (activeTab === "escalations")
        return n.type === "threshold_reached" || n.type === "issue_escalated";
      if (activeTab === "work")
        return (
          n.type === "official_started_work" || n.type === "report_submitted" || n.type === "citizen_joined"
        );
      if (activeTab === "disputes")
        return (
          n.type === "issue_resolved" ||
          n.type === "resolution_disputed" ||
          n.type === "issue_reopened"
        );
      return true;
    });
  }, [notifications, activeTab]);

  const escalationsCount = useMemo(
    () =>
      notifications.filter(
        (n) => n.type === "threshold_reached" || n.type === "issue_escalated"
      ).length,
    [notifications]
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Bell className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Notification Center
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Real-time civic alerts on report submissions, threshold crossings, crew dispatches, and resolutions.
              </p>
            </div>

            {/* Quick Status Stats */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                Unread: <strong className="text-cyan-400">{unreadNotificationsCount}</strong>
              </span>
              <span className="text-xs px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 font-mono">
                Escalations: <strong>{escalationsCount}</strong>
              </span>
            </div>
          </div>

          {/* Filter Tabs Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Alerts", count: notifications.length },
                { id: "unread", label: "Unread", count: unreadNotificationsCount },
                { id: "escalations", label: "Threshold & Escalations", count: escalationsCount },
                { id: "work", label: "Work & Dispatch" },
                { id: "disputes", label: "Resolutions & Disputes" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-cyan-glow"
                        : "bg-slate-900/60 border border-transparent text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? "bg-cyan-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action: Mark All Read */}
            {unreadNotificationsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllNotificationsAsRead}
                leftIcon={<CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                className="shrink-0 w-full md:w-auto"
              >
                Mark All as Read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
              ))
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Notifications in this View</h3>
                <p className="text-xs text-slate-400">
                  You are all caught up! New alerts will trigger here as municipal tickets progress.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
