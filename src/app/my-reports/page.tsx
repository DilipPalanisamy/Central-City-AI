"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CitizenMyReports } from "@/components/citizen/CitizenMyReports";
import { CitizenResolvedShowcase } from "@/components/citizen/CitizenResolvedShowcase";
import { ReportModal } from "@/components/landing/ReportModal";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Layers, PlusCircle, Sparkles, User } from "lucide-react";
import Link from "next/link";

export default function MyReportsPage() {
  const { user } = useAuth();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        {/* Unified Top Navbar */}
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Badge variant="cyan" size="sm" dot>
                  Google Reporter History
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {user?.displayName || "Google Citizen"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                My Civic Reports &amp; Ledger
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Track all complaints submitted under your verified Google account and monitor government repair progress.
              </p>
            </div>

            <Link href="/report">
              <Button
                variant="glow"
                size="md"
                className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider px-6 py-3.5 shadow-cyan-glow"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Submit New Report
              </Button>
            </Link>
          </div>

          {/* Reports and Resolved Showcase */}
          <div className="space-y-8">
            <CitizenMyReports onOpenReportModal={() => setIsReportModalOpen(true)} />
            <CitizenResolvedShowcase />
          </div>
        </main>

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
