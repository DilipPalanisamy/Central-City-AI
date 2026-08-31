"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Camera,
  UploadCloud,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface BeforeAfterEvidenceUploaderProps {
  beforeImageUrl: string;
  afterImageUrl: string | null;
  onAfterImageChange: (url: string) => void;
}

const SAMPLE_AFTER_PHOTOS = [
  {
    id: "after_pothole",
    name: "Fresh Asphalt Compacted & Roller-Finished",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80",
    category: "Road Pothole",
  },
  {
    id: "after_water",
    name: "Pipeline Sealed & Pavers Replaced",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    category: "Water Main",
  },
  {
    id: "after_waste",
    name: "HazMat Debris Cleared & Site Sanitized",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    category: "Waste Dump",
  },
  {
    id: "after_light",
    name: "All Luminaires Replaced & 100% Lux Tested",
    url: "https://images.unsplash.com/photo-1508873696983-2df57046475a?w=800&auto=format&fit=crop&q=80",
    category: "Streetlight",
  },
];

export function BeforeAfterEvidenceUploader({
  beforeImageUrl,
  afterImageUrl,
  onAfterImageChange,
}: BeforeAfterEvidenceUploaderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_AFTER_PHOTOS[0].id);

  const activeAfterImage = afterImageUrl || SAMPLE_AFTER_PHOTOS[0].url;

  const handleSelectSample = (sample: typeof SAMPLE_AFTER_PHOTOS[0]) => {
    setSelectedSampleId(sample.id);
    onAfterImageChange(sample.url);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedSampleId("custom");
      onAfterImageChange(url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>Resolution Photographic Evidence (Before & After)</span>
        </span>
        <Badge variant="cyan" size="sm">
          Civic Audit Mandate
        </Badge>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. BEFORE IMAGE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              1. Before (Citizen Capture)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Initial Defect</span>
          </div>

          <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border-2 border-rose-500/40 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeImageUrl}
              alt="Before defect"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
              Hazard Initial State
            </span>
          </div>
        </div>

        {/* 2. AFTER IMAGE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              2. After (Official Resolution Proof)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              Repaired & Verified
            </span>
          </div>

          <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/50 shadow-emerald-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeAfterImage}
              alt="After resolution proof"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-slate-950/90 text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Field Work Completed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Select Sample Resolution Proof Photo or Upload */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Select Resolution Photo Proof (Simulated):
          </span>
          <label className="cursor-pointer text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Custom Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_AFTER_PHOTOS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                type="button"
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`relative rounded-xl overflow-hidden border p-1 text-left aspect-video transition-all ${
                  isSelected
                    ? "border-emerald-400 ring-2 ring-emerald-500/30 shadow-emerald-glow"
                    : "border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-1.5">
                  <span className="text-[9px] font-bold text-white leading-tight truncate">
                    {sample.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-[9px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
