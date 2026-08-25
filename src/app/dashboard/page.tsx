"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { CitizenWelcome } from "@/components/citizen/CitizenWelcome";
import { CitizenReportBanner } from "@/components/citizen/CitizenReportBanner";
import { CitizenNearbyIssues } from "@/components/citizen/CitizenNearbyIssues";
import { CitizenMapPreview } from "@/components/citizen/CitizenMapPreview";
import { CitizenCommunityActivity } from "@/components/citizen/CitizenCommunityActivity";
import { CitizenMyReports } from "@/components/citizen/CitizenMyReports";
import { CitizenResolvedShowcase } from "@/components/citizen/CitizenResolvedShowcase";
import { CitizenNotifications } from "@/components/citizen/CitizenNotifications";
import { CitizenMobileBottomNav } from "@/components/citizen/CitizenMobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { ReportModal } from "@/components/landing/ReportModal";

export default function DashboardPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 pb-16 md:pb-0 font-sans">
        {/* 1. Shared Unified Top Navigation */}
        <Navbar />

        {/* Main Dashboard Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* 2. Welcome Section with Real Google User Name */}
          <CitizenWelcome />

          {/* 3. Central REPORT PROBLEM Action */}
          <CitizenReportBanner onOpenReportModal={() => setIsReportModalOpen(true)} />

          {/* 2-Column Responsive Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Nearby Issues, My Active Reports, Recently Resolved */}
            <div className="lg:col-span-7 space-y-8">
              <CitizenNearbyIssues />
              <CitizenMyReports onOpenReportModal={() => setIsReportModalOpen(true)} />
              <CitizenResolvedShowcase />
            </div>

            {/* Right Column (5 cols): Real-World Interactive Leaflet Map, Notifications, Community Activity */}
            <div className="lg:col-span-5 space-y-8">
              <CitizenMapPreview />
              <CitizenNotifications />
              <CitizenCommunityActivity />
            </div>
          </div>
        </main>

        {/* Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

        {/* Mobile Navigation */}
        <CitizenMobileBottomNav onOpenReportModal={() => setIsReportModalOpen(true)} />

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
