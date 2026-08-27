"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ActiveIssuesSection } from "@/components/landing/ActiveIssuesSection";
import { AIPrioritizationSection } from "@/components/landing/AIPrioritizationSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CommunityVerificationSection } from "@/components/landing/CommunityVerificationSection";
import { SmartEscalationSection } from "@/components/landing/SmartEscalationSection";
import { GovernmentAccountabilitySection } from "@/components/landing/GovernmentAccountabilitySection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { ExplanationSection } from "@/components/landing/ExplanationSection";
import { CTASection } from "@/components/landing/CTASection";
import { ReportModal } from "@/components/landing/ReportModal";

export default function LandingHomePage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Prominent Report Button */}
        <HeroSection onOpenReportModal={() => setIsReportModalOpen(true)} />

        {/* 2. Live Civic Telemetry & Active Issues */}
        <ActiveIssuesSection onOpenReportModal={() => setIsReportModalOpen(true)} />

        {/* 3. AI Computer Vision & Triage */}
        <AIPrioritizationSection />

        {/* 4. 6-Stage How It Works Flow */}
        <HowItWorksSection />

        {/* 5. Community Quorum & Democratic "I'm Affected" Verification */}
        <CommunityVerificationSection />

        {/* 6. Smart Escalation Pipeline */}
        <SmartEscalationSection />

        {/* 7. Government Accountability & Before/After Proof */}
        <GovernmentAccountabilitySection />

        {/* 8. Citywide Statistics */}
        <StatisticsSection />

        {/* 9. Mission & Platform Pillars */}
        <ExplanationSection />

        {/* 10. Call to Action */}
        <CTASection onOpenReportModal={() => setIsReportModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Quick Report & AI Vision Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
