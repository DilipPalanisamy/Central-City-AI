"use client";

import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Camera,
  UploadCloud,
  RefreshCw,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  ImageIcon,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export interface SamplePhotoOption {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
  isNormal?: boolean;
}

export const SAMPLE_PHOTOS_DATA: SamplePhotoOption[] = [
  {
    id: "sample_normal_road",
    name: "Good Paved Road (No Damage)",
    category: "Road & Pavement",
    url: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80",
    description: "Well-maintained asphalt road in good structural condition with no potholes.",
    isNormal: true,
  },
  {
    id: "sample_pothole",
    name: "Severe Road Pothole",
    category: "Road Damage",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    description: "Deep crater-like road depression on active transit lane.",
    isNormal: false,
  },
  {
    id: "sample_water",
    name: "Water Pipeline Leak",
    category: "Water Infrastructure",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    description: "Pressurized underground pipeline rupture flooding sidewalk.",
    isNormal: false,
  },
  {
    id: "sample_light",
    name: "Broken Streetlight",
    category: "Broken Streetlight",
    url: "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=800&auto=format&fit=crop&q=80",
    description: "Faulty dark luminaire creating night pedestrian safety hazard.",
    isNormal: false,
  },
  {
    id: "sample_waste",
    name: "Illegal Waste Dump",
    category: "Garbage",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    description: "Uncontained industrial debris blocking public corridor.",
    isNormal: false,
  },
];

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic", "image/heif"];

export interface Step1PhotoUploadProps {
  selectedImageUrl: string | null;
  onImageSelected: (url: string, sampleData?: SamplePhotoOption, file?: File) => void;
  onContinue: () => void;
}

export function Step1PhotoUpload({
  selectedImageUrl,
  onImageSelected,
  onContinue,
}: Step1PhotoUploadProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // Trigger Native Gallery File Input
  const handleTriggerGallery = () => {
    setErrorMessage(null);
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
      galleryInputRef.current.click();
    }
  };

  // Trigger Native Camera Input (Mobile capture)
  const handleTriggerCamera = () => {
    setErrorMessage(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
      cameraInputRef.current.click();
    }
  };

  // Convert File to Base64 / Data URL to ensure universal compatibility
  const processSelectedFile = (file: File) => {
    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File size (${(file.size / (1024 * 1024)).toFixed(
          1
        )} MB) exceeds the 12 MB limit. Please select a smaller photo.`
      );
      return;
    }

    // 2. Validate MIME Type
    const fileType = file.type.toLowerCase();
    const isValidType = ALLOWED_IMAGE_TYPES.some((t) => fileType.includes(t.replace("image/", "")) || fileType === t);
    if (!isValidType && fileType.length > 0 && !fileType.startsWith("image/")) {
      setErrorMessage("Invalid file format. Please upload a valid image (JPEG, PNG, WEBP).");
      return;
    }

    setErrorMessage(null);
    setSelectedFileName(file.name);
    setSelectedFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    setActiveSampleId(null);

    // Read as Base64 Data URL so it is fully self-contained across components & APIs
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      onImageSelected(base64Url, undefined, file);
    };
    reader.onerror = () => {
      // Fallback to object URL if FileReader fails
      const objectUrl = URL.createObjectURL(file);
      onImageSelected(objectUrl, undefined, file);
    };
    reader.readAsDataURL(file);
  };

  // Handle Input Changes
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Handle Sample Selection
  const handleSelectSample = (sample: SamplePhotoOption) => {
    setErrorMessage(null);
    setSelectedFileName(sample.name);
    setSelectedFileSize("Verified Preset Sample");
    setActiveSampleId(sample.id);
    onImageSelected(sample.url, sample);
  };

  // Remove Selected Photo
  const handleRemovePhoto = () => {
    setSelectedFileName(null);
    setSelectedFileSize(null);
    setActiveSampleId(null);
    setErrorMessage(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    onImageSelected("", undefined);
  };

  const hasPhoto = Boolean(selectedImageUrl && selectedImageUrl.trim() !== "");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Hidden Native File Inputs */}
      {/* 1. Standard Gallery / File Picker */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        id="citizen-gallery-input"
      />

      {/* 2. Direct Mobile Camera Capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        id="citizen-camera-input"
      />

      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 01: Photo Evidence Capture</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Upload Photo Evidence
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Capture or upload clear photo evidence of the municipal issue. Location coordinates will be selected in Step 3.
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload Box / Image Preview Canvas */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition-all shadow-glass space-y-6">
        {!hasPhoto ? (
          /* Empty Upload State */
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner group">
              <UploadCloud className="w-10 h-10 transition-transform group-hover:scale-110 duration-200" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Upload Civic Evidence Photo
              </h3>
              <p className="text-xs text-slate-400">
                Supports JPG, JPEG, PNG, WEBP images up to 12 MB
              </p>
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Button
                type="button"
                variant="glow"
                size="lg"
                onClick={handleTriggerGallery}
                leftIcon={<ImageIcon className="w-4 h-4" />}
                className="w-full sm:w-auto text-xs font-black uppercase tracking-wider px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
              >
                Choose from Gallery
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleTriggerCamera}
                leftIcon={<Smartphone className="w-4 h-4 text-cyan-400" />}
                className="w-full sm:w-auto text-xs font-bold border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white px-6 py-3.5"
              >
                Take Camera Photo
              </Button>
            </div>
          </div>
        ) : (
          /* Selected Image Preview State */
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImageUrl!}
                alt="Selected evidence preview"
                className="w-full h-full object-cover"
              />

              {/* Top Controls Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerGallery}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700 text-xs font-bold text-white hover:text-cyan-300 hover:border-cyan-500 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/90 border border-rose-700 text-xs font-bold text-rose-300 hover:text-rose-100 hover:border-rose-500 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Bottom Image Info Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">
                    {selectedFileName || "evidence_photo.jpg"}
                  </span>
                  {selectedFileSize && (
                    <span className="text-slate-500">({selectedFileSize})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Photo ready for Gemini Vision AI analysis
              </span>

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                Clear Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Verification Samples */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Or Choose a Verified Test Scenario</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Includes Clean &amp; Damaged cases
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SAMPLE_PHOTOS_DATA.map((sample) => {
            const isSelected = activeSampleId === sample.id;

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-cyan-950/80 border-cyan-400 shadow-cyan-glow"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="h-16 rounded-xl overflow-hidden mb-2 bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {sample.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {sample.isNormal ? "Clean State" : sample.category}
                </div>

                {sample.isNormal && (
                  <span className="absolute top-2 right-2 text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    GOOD
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400 hidden sm:inline">
          {hasPhoto ? "Photo selected. Ready for AI inspection." : "Select a photo to proceed."}
        </span>

        <Button
          type="button"
          variant="glow"
          size="md"
          disabled={!hasPhoto}
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className={`w-full sm:w-auto text-xs font-black uppercase tracking-wider px-8 py-3 transition-all ${
            hasPhoto
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
              : "opacity-40 cursor-not-allowed bg-slate-800"
          }`}
        >
          CONTINUE TO AI ANALYSIS →
        </Button>
      </div>
    </div>
  );
}
