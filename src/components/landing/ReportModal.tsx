"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCivicStore } from "@/lib/mockStore";
import { IssueCategory, IssueSeverity } from "@/types";
import { DuplicateDetectionCard } from "@/components/report/DuplicateDetectionCard";
import {
  Camera,
  Sparkles,
  MapPin,
  CheckCircle2,
  Cpu,
  AlertTriangle,
  UploadCloud,
  Check,
  Shield,
  Layers,
} from "lucide-react";
import { SeverityPill } from "../civic/SeverityPill";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PHOTOS = [
  {
    id: "sample_pothole",
    title: "Crater Pothole",
    category: "pothole" as IssueCategory,
    severity: "critical" as IssueSeverity,
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    confidence: 0.98,
    cost: "$320 - $540",
    sla: "6 Hours",
    dept: "Department of Roads & Infrastructure",
  },
  {
    id: "sample_water",
    title: "Water Main Burst",
    category: "water_leakage" as IssueCategory,
    severity: "critical" as IssueSeverity,
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    confidence: 0.95,
    cost: "$1,200 - $2,400",
    sla: "8 Hours",
    dept: "Municipal Water Supply & Drainage",
  },
  {
    id: "sample_waste",
    title: "Commercial Waste Dump",
    category: "garbage_dump" as IssueCategory,
    severity: "high" as IssueSeverity,
    url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80",
    confidence: 0.92,
    cost: "$450 - $800",
    sla: "12 Hours",
    dept: "Solid Waste & Urban Sanitation",
  },
  {
    id: "sample_light",
    title: "Blackout Streetlights",
    category: "broken_streetlight" as IssueCategory,
    severity: "medium" as IssueSeverity,
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80",
    confidence: 0.94,
    cost: "$150 - $300",
    sla: "24 Hours",
    dept: "City Energy & Lighting Grid",
  },
];

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const router = useRouter();
  const { addNewIssue, toggleAffected, addToast } = useCivicStore();

  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTOS[0]);
  const [title, setTitle] = useState(selectedPhoto.title);
  const [category, setCategory] = useState<IssueCategory>(selectedPhoto.category);
  const [severity, setSeverity] = useState<IssueSeverity>(selectedPhoto.severity);
  const [address, setAddress] = useState("842 Market St, Near 5th Ave Transit Hub, Ward 14");
  const [description, setDescription] = useState(
    "Hazardous road condition detected with immediate risk to cyclists and vehicular traffic."
  );
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);
  const [showDuplicateView, setShowDuplicateView] = useState(false);

  const handleSelectSample = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setSelectedPhoto(sample);
    setTitle(sample.title);
    setCategory(sample.category);
    setSeverity(sample.severity);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 450);
  };

  const handleTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger simulated duplicate detection check
    setShowDuplicateView(true);
  };

  const handleJoinExisting = (existingId: string) => {
    toggleAffected(existingId);
    addToast("Joined Existing Issue CC-2026-8942", "Your report merged with active ticket and +40 Karma awarded!", "success");
    setShowDuplicateView(false);
    onClose();
    router.push(`/community/${existingId}`);
  };

  const handleReportSeparately = () => {
    addNewIssue({
      title: title || "Civic Hazard Alert",
      category,
      severity,
      description,
      location: {
        lat: 37.7749,
        lng: -122.4194,
        address: address || "Market St Corridor, Metro Central",
        ward: "Ward 14",
        zone: "Metro Central",
      },
      media: {
        primaryImageUrl: selectedPhoto.url,
      },
    });

    addToast("New Ticket Created", "Your report has been logged separately on the civic ledger.", "success");
    setShowDuplicateView(false);
    onClose();
  };

  const handleClose = () => {
    setShowDuplicateView(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showDuplicateView ? "Deduplication Verification" : "Report Urban Problem"}
      description={
        showDuplicateView
          ? "Spatial & Computer Vision Deduplication Analysis"
          : "Capture or select a civic hazard to trigger real-time AI computer vision triage"
      }
      maxWidth={showDuplicateView ? "3xl" : "2xl"}
    >
      {showDuplicateView ? (
        <DuplicateDetectionCard
          userReport={{
            title: title || selectedPhoto.title,
            imageUrl: selectedPhoto.url,
            address: address,
            ward: "Ward 14",
            category: category.replace("_", " "),
          }}
          existingIssue={{
            id: "iss_8942",
            trackingNumber: "CC-2026-8942",
            title: "Deep Hazardous Pothole on High-Speed Transit Lane",
            imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
            address: "842 Market St, Near 5th Ave Transit Crossing",
            ward: "Ward 14",
            status: "Field Crew Dispatched (SLA: 6h)",
            reportedBy: "Alex Rivera",
            timeAgo: "2 hours ago",
            affectedCount: 142,
            similarityScore: 94,
          }}
          onViewExisting={(id) => {
            handleClose();
            router.push(`/community/${id}`);
          }}
          onJoinExisting={handleJoinExisting}
          onReportSeparately={handleReportSeparately}
        />
      ) : (
        <form onSubmit={handleTriggerSubmit} className="space-y-5">
          {/* Sample Photo Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Select or Capture Issue Photo (Simulated)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_PHOTOS.map((sample) => {
                const isSelected = selectedPhoto.id === sample.id;
                return (
                  <button
                    type="button"
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 text-left group aspect-video ${
                      isSelected
                        ? "border-cyan-400 ring-2 ring-cyan-500/30 shadow-cyan-glow"
                        : "border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white leading-tight">
                        {sample.title}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Vision Scan Result Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-glass relative overflow-hidden">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span>AI Computer Vision Triage Engine</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                {isScanning ? "Scanning..." : `${Math.round(selectedPhoto.confidence * 100)}% Confidence`}
              </span>
            </div>

            {isScanning ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-cyan-300 font-mono">Running Neural Hazard Classification...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Detected Category
                  </span>
                  <span className="text-white font-bold capitalize">
                    {selectedPhoto.category.replace("_", " ")}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Est. Resolution SLA
                  </span>
                  <span className="text-cyan-400 font-bold font-mono">
                    {selectedPhoto.sla}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Est. Cost Range
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {selectedPhoto.cost}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Inputs */}
          <div className="space-y-3.5">
            <Input
              label="Report Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                options={[
                  { value: "pothole", label: "Road Pothole" },
                  { value: "water_leakage", label: "Water Main Leak" },
                  { value: "garbage_dump", label: "Illegal Waste Dump" },
                  { value: "broken_streetlight", label: "Streetlight Outage" },
                  { value: "traffic_signal", label: "Traffic Signal Failure" },
                  { value: "open_manhole", label: "Hazardous Open Manhole" },
                ]}
              />

              <Select
                label="Severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                options={[
                  { value: "low", label: "Low Impact" },
                  { value: "medium", label: "Moderate" },
                  { value: "high", label: "High Priority" },
                  { value: "critical", label: "Critical Danger" },
                ]}
              />
            </div>

            <Input
              label="Geolocation / Landmark"
              leftIcon={<MapPin className="w-4 h-4 text-cyan-400" />}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Textarea
              label="Observation Notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Spatial deduplication enabled</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Submit & Dispatch
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
