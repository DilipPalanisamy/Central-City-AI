"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCivicStore } from "@/lib/mockStore";
import {
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Eye,
  AlertTriangle,
} from "lucide-react";

export function AdminAIMonitoringView() {
  const { addToast } = useCivicStore();
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      addToast(
        "Model Calibration Complete",
        "CityVision-v4.2-Pro weights calibrated against 4,200 verified community edge cases.",
        "success"
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Computer Vision & Neural Triage Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            AI Model Telemetry & Classification Accuracy
          </h2>
          <p className="text-xs text-slate-400">
            Real-time inference latency, false-positive filters, and computer vision classification metrics.
          </p>
        </div>

        <Button
          variant="glow"
          size="sm"
          onClick={handleRetrain}
          disabled={isRetraining}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? "animate-spin" : ""}`} />}
        >
          {isRetraining ? "Calibrating Neural Weights..." : "Trigger Model Recalibration"}
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Active Vision Model
          </span>
          <span className="text-sm font-black text-white font-mono block">
            CityVision-v4.2-Pro
          </span>
          <span className="text-[10px] text-cyan-400">TensorFlow/ONNX Edge</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Avg Inference Latency
          </span>
          <span className="text-2xl font-black text-cyan-400 font-mono block">
            340ms
          </span>
          <span className="text-[10px] text-emerald-400">99.8% Sub-500ms</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Overall Accuracy
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">
            94.6%
          </span>
          <span className="text-[10px] text-slate-400">Validated by 2.4k Verifiers</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Duplicate Detection
          </span>
          <span className="text-2xl font-black text-purple-400 font-mono block">
            98.1%
          </span>
          <span className="text-[10px] text-purple-300">Geo & Image Embedding</span>
        </div>
      </div>

      {/* Category Accuracy Matrix */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Category-Specific Neural Precision
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {[
            { label: "Pothole & Surface Damage", score: 96, samples: "1.2k photos" },
            { label: "Water Pipeline Rupture & Leaks", score: 94, samples: "480 photos" },
            { label: "Streetlight & Luminaire Faults", score: 98, samples: "820 photos" },
            { label: "Illegal Waste Dumping", score: 92, samples: "610 photos" },
            { label: "Traffic Signal Failure", score: 95, samples: "340 photos" },
            { label: "Open Manholes & Hazards", score: 99, samples: "190 photos" },
          ].map((cat, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{cat.label}</span>
                <span className="font-mono text-cyan-400 font-bold">{cat.score}% Precision</span>
              </div>
              <ProgressBar value={cat.score} variant="cyan" size="sm" showPercentage={false} />
              <span className="text-[10px] text-slate-500 font-mono block text-right">
                Trained on {cat.samples}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
