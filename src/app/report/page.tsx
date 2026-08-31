"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { ReportProgressStepper } from "@/components/report/ReportProgressStepper";
import {
  Step1PhotoUpload,
  SAMPLE_PHOTOS_DATA,
  SamplePhotoOption,
} from "@/components/report/Step1PhotoUpload";
import { Step2AIAnalysis } from "@/components/report/Step2AIAnalysis";
import {
  Step3LocationMap,
  SelectedLocationData,
} from "@/components/report/Step3LocationMap";
import {
  Step4Description,
  DescriptionData,
} from "@/components/report/Step4Description";
import { Step6Review } from "@/components/report/Step6Review";
import { Step7Success } from "@/components/report/Step7Success";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCivicStore } from "@/lib/mockStore";
import { AIAnalysisResult } from "@/lib/ai/analyzeImage";
import { ArrowLeft } from "lucide-react";

export interface ReportState {
  image: File | null;
  imagePreview: string | null;
  fileName: string;
  issueType: string;
  severity: number;
  confidence: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  explanation: string;
  location: string;
  city?: string;
  area?: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  description: string;
  requiredAction: string;
  additionalInfo?: string;
}

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNewIssue, addToast } = useCivicStore();

  // Multi-step progression state (1: Photo, 2: AI Analysis, 3: Location, 4: Details, 5: Review, 6: Success)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Central Report State Object preserving all citizen data across all steps
  const [reportData, setReportData] = useState<ReportState>({
    image: null,
    imagePreview: null,
    fileName: "",
    issueType: "Road Damage",
    severity: 82,
    confidence: 91,
    priority: "CRITICAL",
    explanation: "Visible road surface deterioration and pothole damage detected.",
    location: "Avinashipalayam, Tamil Nadu",
    city: "Tiruppur",
    area: "Avinashipalayam",
    latitude: 11.0234,
    longitude: 77.4512,
    landmark: "Near Avinashipalayam Main Bus Stop",
    description:
      "A large damaged road section with significant surface deterioration and deep crater-like pothole near the transit corridor.",
    requiredAction: "Repair the damaged road surface and fill the potholes.",
    additionalInfo: "Water is collecting in the depression after rain creating poor visibility at night.",
  });

  const [submittedIssueId, setSubmittedIssueId] = useState<string>("iss_8942");
  const [submittedTrackingNumber, setSubmittedTrackingNumber] = useState<string>("CCA-2026-00124");

  // Step Navigation Handlers
  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step > maxStepReached) setMaxStepReached(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageSelected = (url: string, sampleData?: SamplePhotoOption, file?: File) => {
    setReportData((prev) => ({
      ...prev,
      image: file || null,
      imagePreview: url,
      fileName: sampleData?.name || file?.name || "evidence_photo.jpg",
      issueType: sampleData?.category && !sampleData.isNormal ? sampleData.category : prev.issueType,
      description: sampleData?.description || prev.description,
    }));
  };

  const handleAIResultsUpdated = (categoryName: string, aiResult?: AIAnalysisResult) => {
    setReportData((prev) => ({
      ...prev,
      issueType: categoryName,
      severity: aiResult?.severity ?? prev.severity,
      confidence: aiResult?.confidence ?? prev.confidence,
      priority: aiResult?.priority ?? prev.priority,
      explanation: aiResult?.explanation ?? prev.explanation,
    }));
  };

  const handleLocationUpdated = (locData: SelectedLocationData) => {
    setReportData((prev) => ({
      ...prev,
      location: locData.address,
      city: locData.city || prev.city,
      area: locData.area || prev.area,
      latitude: locData.lat,
      longitude: locData.lng,
      landmark: locData.landmark || prev.landmark,
    }));
  };

  const handleDescriptionUpdated = (descData: DescriptionData) => {
    setReportData((prev) => ({
      ...prev,
      description: descData.problemDescription,
      requiredAction: descData.requiredAction,
      landmark: descData.landmark || prev.landmark,
      additionalInfo: descData.additionalInfo || prev.additionalInfo,
    }));
  };

  const handleSubmitReport = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const trackingCode = `CCA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedTrackingNumber(trackingCode);

      // Create new issue binding authenticated Google user as creator
      const newCreatedIssue = addNewIssue({
        title: `${reportData.issueType} at ${reportData.location}`,
        description: reportData.description,
        category: reportData.issueType.toLowerCase().replace(/\s+/g, "_") as any,
        severity: (reportData.priority || "high").toLowerCase() as any,
        severityScore: reportData.severity,
        status: "ai_analyzed",
        location: {
          address: reportData.location,
          ward: "Ward 14",
          zone: "Tiruppur District",
          lat: reportData.latitude,
          lng: reportData.longitude,
          landmark: reportData.landmark,
        },
        reportedBy: {
          id: user?.uid || "google_user_1",
          name: user?.displayName || "Google Citizen",
          avatarUrl:
            user?.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Citizen")}&background=06b6d4&color=020617&bold=true`,
          isAnonymous: false,
          civicKarma: 50,
        },
        media: {
          primaryImageUrl: reportData.imagePreview || SAMPLE_PHOTOS_DATA[1].url,
        },
        aiAnalysis: {
          confidence: reportData.confidence / 100,
          detectedCategory: reportData.issueType,
          suggestedSeverity: (reportData.priority || "high").toLowerCase() as any,
          priorityScore: reportData.severity,
          rootCauseHypothesis: reportData.explanation,
          recommendedDepartment: "dept_roads",
          estimatedCostMin: 250,
          estimatedCostMax: 800,
          currency: "USD",
          estimatedResolutionHours: 8,
          aiModelVersion: "CityVision-v4.2-Pro",
        },
        actionRequired: reportData.requiredAction,
        affectedCount: 1,
        affectedThreshold: 5,
      });

      setSubmittedIssueId(newCreatedIssue.id);

      addToast(
        "Report Submitted Successfully (+50 Karma)",
        `Issue ${newCreatedIssue.trackingNumber} registered to ${user?.displayName || "Google Citizen"}.`,
        "success"
      );

      goToStep(6); // Move to Step 6 Success receipt
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        {/* 1. Navbar */}
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Top Return Link */}
          {currentStep <= 5 && (
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Dashboard</span>
              </Link>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                Google Verified Reporter
              </span>
            </div>
          )}

          {/* 5-Step Progress Stepper Indicator */}
          {currentStep <= 5 && (
            <ReportProgressStepper
              currentStep={currentStep}
              maxStepReached={maxStepReached}
              onStepClick={(step) => goToStep(step)}
            />
          )}

          {/* STEP 1: REAL PHOTO GALLERY UPLOAD */}
          {currentStep === 1 && (
            <Step1PhotoUpload
              selectedImageUrl={reportData.imagePreview}
              onImageSelected={handleImageSelected}
              onContinue={() => goToStep(2)}
            />
          )}

          {/* STEP 2: AI ANALYSIS */}
          {currentStep === 2 && (
            <Step2AIAnalysis
              imageUrl={reportData.imagePreview || SAMPLE_PHOTOS_DATA[1].url}
              fileName={reportData.fileName}
              category={reportData.issueType}
              onCategoryChange={handleAIResultsUpdated}
              onContinue={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {/* STEP 3: SATELLITE MAP WITH REAL GEOCODING SEARCH */}
          {currentStep === 3 && (
            <Step3LocationMap
              locationData={{
                address: reportData.location,
                city: reportData.city || "Tiruppur",
                area: reportData.area || "Avinashipalayam",
                ward: "Ward 14",
                zone: "Tiruppur District",
                lat: reportData.latitude,
                lng: reportData.longitude,
                landmark: reportData.landmark,
              }}
              category={reportData.issueType}
              imageUrl={reportData.imagePreview || undefined}
              onLocationChange={handleLocationUpdated}
              onContinue={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}

          {/* STEP 4: PROBLEM DETAILS & REQUIRED ACTION */}
          {currentStep === 4 && (
            <Step4Description
              data={{
                title: `${reportData.issueType} at ${reportData.location}`,
                problemDescription: reportData.description,
                requiredAction: reportData.requiredAction,
                landmark: reportData.landmark,
                additionalInfo: reportData.additionalInfo,
              }}
              onChange={handleDescriptionUpdated}
              onContinue={() => goToStep(5)}
              onBack={() => goToStep(3)}
            />
          )}

          {/* STEP 5: REVIEW REPORT */}
          {currentStep === 5 && (
            <Step6Review
              imageUrl={reportData.imagePreview || SAMPLE_PHOTOS_DATA[1].url}
              category={reportData.issueType}
              severity={reportData.severity}
              confidence={reportData.confidence}
              priority={reportData.priority}
              locationData={{
                address: reportData.location,
                ward: "Ward 14",
                zone: "Tiruppur District",
                lat: reportData.latitude,
                lng: reportData.longitude,
                landmark: reportData.landmark,
              }}
              descriptionData={{
                title: `${reportData.issueType} at ${reportData.location}`,
                problemDescription: reportData.description,
                requiredAction: reportData.requiredAction,
                landmark: reportData.landmark,
                additionalInfo: reportData.additionalInfo,
              }}
              onEditSection={(step) => goToStep(step)}
              onSubmitReport={handleSubmitReport}
              onBack={() => goToStep(4)}
              isSubmitting={isSubmitting}
            />
          )}

          {/* STEP 6 & 7: SUCCESS RECEIPT & DIRECT COMMUNITY TRANSITION */}
          {currentStep === 6 && (
            <Step7Success
              trackingNumber={submittedTrackingNumber}
              category={reportData.issueType}
              location={reportData.location}
              priority={reportData.priority}
              issueId={submittedIssueId}
              onViewCommunity={() => router.push(`/community/${submittedIssueId}`)}
              onBackDashboard={() => router.push("/dashboard")}
            />
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
