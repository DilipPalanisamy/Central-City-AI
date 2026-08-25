"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CitizenResolutionVerification } from "@/components/civic/CitizenResolutionVerification";
import { useCivicStore } from "@/lib/mockStore";
import { ArrowLeft, CheckCircle2, Building2, MapPin } from "lucide-react";

export default function VerifyResolutionPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;
  const { issues } = useCivicStore();

  // Find target issue or default to the resolved issue iss_8945
  const issue = useMemo(() => {
    return (
      issues.find((i) => i.id === issueId || i.trackingNumber === issueId) ||
      issues.find((i) => i.status === "resolved") ||
      issues[0]
    );
  }, [issues, issueId]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/community"
            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Community Ledger</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Citizen Verification</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-mono font-bold">{issue.trackingNumber}</span>
        </div>

        {/* The Citizen Resolution Verification Suite */}
        <CitizenResolutionVerification
          issue={issue}
          onVerificationComplete={() => {}}
        />
      </main>

      <Footer />
    </div>
  );
}
