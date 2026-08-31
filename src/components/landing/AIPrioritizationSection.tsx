"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Scan,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
} from "lucide-react";

export function AIPrioritizationSection() {
  const aiCards = [
    {
      id: "detection",
      title: "AI Issue Detection",
      badge: "Computer Vision",
      badgeVariant: "cyan" as const,
      icon: Scan,
      color: "text-cyan-400",
      border: "border-cyan-500/30 hover:border-cyan-500/60",
      description:
        "Instantly analyzes uploaded mobile photos using computer vision to detect potholes, water main leaks, streetlight faults, and illegal dumping in 340ms.",
      metrics: [
        { label: "Classification Confidence", value: "94.6%" },
        { label: "Model Architecture", value: "CityVision-v4.2" },
      ],
    },
    {
      id: "severity",
      title: "Severity & Priority",
      badge: "Dynamic Scoring",
      badgeVariant: "amber" as const,
      icon: Flame,
      color: "text-amber-400",
      border: "border-amber-500/30 hover:border-amber-500/60",
      description:
        "Scores composite civic danger on a 0-100 scale. Automatically assigns urgency tiers (LOW, MEDIUM, HIGH, CRITICAL) and sets mandated SLA resolution windows.",
      metrics: [
        { label: "High Hazard SLA", value: "6 Hours" },
        { label: "Critical Safety SLA", value: "2 Hours" },
      ],
    },
    {
      id: "duplicates",
      title: "Duplicate Detection",
      badge: "Spatial Embeddings",
      badgeVariant: "purple" as const,
      icon: Layers,
      color: "text-purple-400",
      border: "border-purple-500/30 hover:border-purple-500/60",
      description:
        "Leverages vector embeddings and GPS proximity to identify existing complaints. Allows users to join active tickets (+40 Karma) instead of creating duplicate noise.",
      metrics: [
        { label: "Similarity Precision", value: "98.1%" },
        { label: "Deduplication Radius", value: "25 Meters" },
      ],
    },
  ];

  return (
    <section id="ai-features" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Intelligent Civic Infrastructure</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            AI-Powered Triage & Detection
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            How Central-City-AI understands urban defects instantly from photos, assesses risk severity, and eliminates municipal duplicate work orders.
          </p>
        </div>

        {/* 3 AI Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className={`p-6 sm:p-8 rounded-3xl bg-slate-950 border ${card.border} shadow-glass space-y-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${card.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <Badge variant={card.badgeVariant} size="sm">
                      {card.badge}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Metric Tags */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/80">
                  {card.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {m.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
