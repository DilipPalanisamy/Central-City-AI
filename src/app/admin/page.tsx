"use client";

import React, { useState } from "react";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminOverviewView } from "@/components/admin/views/AdminOverviewView";
import { AdminUsersView } from "@/components/admin/views/AdminUsersView";
import { AdminOfficialsView } from "@/components/admin/views/AdminOfficialsView";
import { AdminDepartmentsView } from "@/components/admin/views/AdminDepartmentsView";
import { AdminIssuesView } from "@/components/admin/views/AdminIssuesView";
import { AdminAIMonitoringView } from "@/components/admin/views/AdminAIMonitoringView";
import { AdminThresholdRulesView } from "@/components/admin/views/AdminThresholdRulesView";
import { AdminDisputesView } from "@/components/admin/views/AdminDisputesView";
import { AdminAnalyticsView } from "@/components/admin/views/AdminAnalyticsView";
import { AdminAuditLogsView } from "@/components/admin/views/AdminAuditLogsView";
import { AdminSettingsView } from "@/components/admin/views/AdminSettingsView";
import { useCivicStore } from "@/lib/mockStore";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldAlert,
  Sliders,
  Cpu,
  Activity,
  Users,
  Building2,
  Lock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { issues } = useCivicStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row selection:bg-purple-500 selection:text-slate-950">
      {/* 1. Admin Sidebar (11 Navigation Tabs) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        counts={{
          disputes: 2,
          issues: issues.length,
          users: 14820,
        }}
      />

      {/* Main Admin Console Area */}
      <main className="flex-1 max-w-7xl w-full p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="purple" size="sm">
                Root System Governance • Central City Platform
              </Badge>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-purple-400">
                Encrypted Session
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Administrative Command Center
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300 font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Mayor & Cabinet Access</span>
            </span>
          </div>
        </div>

        {/* Dynamic Tab Content Views */}
        {activeTab === "dashboard" && (
          <AdminOverviewView onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === "users" && <AdminUsersView />}

        {activeTab === "officials" && <AdminOfficialsView />}

        {activeTab === "departments" && <AdminDepartmentsView />}

        {activeTab === "issues" && <AdminIssuesView />}

        {activeTab === "ai_monitoring" && <AdminAIMonitoringView />}

        {/* 🌟 THRESHOLD RULES TAB (LOW, MEDIUM, HIGH, CRITICAL) 🌟 */}
        {activeTab === "threshold_rules" && <AdminThresholdRulesView />}

        {activeTab === "disputes" && <AdminDisputesView />}

        {activeTab === "analytics" && <AdminAnalyticsView />}

        {activeTab === "audit_logs" && <AdminAuditLogsView />}

        {activeTab === "settings" && <AdminSettingsView />}
      </main>
    </div>
  );
}
