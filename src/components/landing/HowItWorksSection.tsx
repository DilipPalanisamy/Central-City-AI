"use client";

import React from "react";
import {
  Camera,
  Sparkles,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload Photo",
      icon: Camera,
      color: "text-cyan-400",
      description: "Snap or upload a photo of the civic defect. Photo-first triage ensures high evidence integrity.",
    },
    {
      number: "02",
      title: "AI Analysis",
      icon: Sparkles,
      color: "text-blue-400",
      description: "CityVision neural model classifies the hazard, calculates severity, and checks for duplicates.",
    },
    {
      number: "03",
      title: "Select Location",
      icon: MapPin,
      color: "text-indigo-400",
      description: "Pin the exact location on the vector map with automatic GPS coordinate and ward assignment.",
    },
    {
      number: "04",
      title: "Community Verification",
      icon: Users,
      color: "text-purple-400",
      description: "Local residents signal impact using 'I'm Affected' to build verified quorum support.",
    },
    {
      number: "05",
      title: "Automatic Escalation",
      icon: Zap,
      color: "text-amber-400",
      description: "When the neighborhood threshold is reached, work orders auto-escalate to authorities.",
    },
    {
      number: "06",
      title: "Government Resolution",
      icon: CheckCircle2,
      color: "text-emerald-400",
      description: "Municipal crews complete repairs within the SLA and upload before/after proof for citizen sign-off.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-300 text-xs font-semibold">
            <span>6-Stage Civic Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How Central-City-AI Works
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            A seamless, transparent loop connecting citizens, AI triage, and municipal public works.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4 transition-all duration-300 hover:scale-[1.02] hover:border-slate-700 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono text-slate-600">
                      {s.number}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${s.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
