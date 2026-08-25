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
    name: "Normal Paved Road (No Damage)",
    category: "normal_road",
    url: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80",
    description: "Maintained clean asphalt road with no visible cracks or potholes.",
    isNormal: true,
  },
  {
    id: "sample_pothole",
    name: "Deep Road Damage",
    category: "Road Damage",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    description: "Severe crater-like road depression on transit lane.",
    isNormal: false,
  },
  {
    id: "sample_normal_water",
    name: "Normal Water Tank (No Leak)",
    category: "normal_water",
    url: "https://images.unsplash.com/photo-1517646287270-a5a9ca602eec?w=800&auto=format&fit=crop&q=80",
    description: "Standard municipal water storage in normal operational condition.",
    isNormal: true,
  },
  {
    id: "sample_water",
    name: "Water Main Seepage",
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
    description: "Multiple dark luminaires creating night pedestrian safety hazard.",
    isNormal: false,
  },
  {
    id: "sample_waste",
    name: "Illegal Waste Dump",
    category: "Garbage",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    description: "Industrial debris blocking public access and stormwater runoff.",
    isNormal: false,
  },
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // Trigger Native File Input (Gallery on mobile / Windows Explorer on desktop)
  const handleTriggerUpload = () => {
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Process Real File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate File Size (< 10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File size (${(file.size / (1024 * 1024)).toFixed(
          1
        )} MB) exceeds the 10 MB limit. Please select a smaller photo.`
      );
      return;
    }

    // 2. Validate MIME Type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage(
        "Invalid file format. Please upload a valid image file (JPEG, PNG, or WEBP)."
      );
      return;
    }

    // 3. Clear errors and create persistent local Object URL preview
    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    setSelectedFileName(file.name);
    setSelectedFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    setActiveSampleId(null);

    onImageSelected(objectUrl, undefined, file);
  };

  // Handle Preset Sample Selection
  const handleSelectSample = (sample: SamplePhotoOption) => {
    setErrorMessage(null);
    setSelectedFileName(sample.name);
    setSelectedFileSize("Verified Preset");
    setActiveSampleId(sample.id);
    onImageSelected(sample.url, sample);
  };

  // Remove Selected Photo
  const handleRemovePhoto = () => {
    setSelectedFileName(null);
    setSelectedFileSize(null);
    setActiveSampleId(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected("", undefined);
  };

  const hasPhoto = Boolean(selectedImageUrl && selectedImageUrl.trim() !== "");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        onChange={handleFileChange}
        className="hidden"
        id="citizen-gallery-input"
      />

      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 01: Evidence Capture</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Upload Photo Evidence
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Upload an image from your device gallery or choose a test case.
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Box / Image Preview Canvas */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition-all shadow-glass space-y-6">
        {!hasPhoto ? (
          /* Empty Upload State */
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner group">
              <UploadCloud className="w-10 h-10 transition-transform group-hover:scale-110 duration-200" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Select Photo from Device Gallery
              </h3>
              <p className="text-xs text-slate-400">
                Supports JPG, JPEG, PNG, WEBP files up to 10 MB
              </p>
            </div>

            {/* Upload Button */}
            <Button
              type="button"
              variant="glow"
              size="lg"
              onClick={handleTriggerUpload}
              leftIcon={<ImageIcon className="w-4 h-4" />}
              className="text-xs font-black uppercase tracking-wider px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
            >
              Upload Photo
            </Button>
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
                  onClick={handleTriggerUpload}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700 text-xs font-bold text-white hover:text-cyan-300 hover:border-cyan-500 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 rounded-xl bg-slate-950/90 border border-rose-500/40 text-rose-400 hover:bg-rose-950 hover:text-rose-200 backdrop-blur-md transition-all shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Metadata Pill */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-white font-medium truncate">
                    {selectedFileName || "evidence_photo.jpg"}
                  </span>
                </div>
                {selectedFileSize && (
                  <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">
                    {selectedFileSize}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Scenarios Grid (Normal vs Damaged) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Or choose a test scenario:</span>
          </span>
          <span className="text-[11px] text-slate-500">
            Tests Damage vs Normal detection
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PHOTOS_DATA.map((sample) => {
            const isSelected = activeSampleId === sample.id;

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-cyan-950/90 border-cyan-400 shadow-cyan-glow"
                    : "bg-slate-950/80 border-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      sample.isNormal
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-950 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {sample.isNormal ? "NORMAL / NO DAMAGE" : "CIVIC HAZARD"}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>

                <span className="text-xs font-bold text-white block truncate">
                  {sample.name}
                </span>
                <span className="text-[10px] text-slate-400 block line-clamp-1">
                  {sample.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400">
          {!hasPhoto
            ? "Select or upload a photo to proceed"
            : "Photo evidence verified and ready for AI analysis"}
        </span>

        {/* Continue Button: Disabled until a photo is selected */}
        <Button
          type="button"
          variant="glow"
          size="md"
          disabled={!hasPhoto}
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="text-xs font-black uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CONTINUE TO AI ANALYSIS →
        </Button>
      </div>
    </div>
  );
}
