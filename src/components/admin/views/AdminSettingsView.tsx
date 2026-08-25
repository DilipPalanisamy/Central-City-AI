"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCivicStore } from "@/lib/mockStore";
import {
  Settings,
  Save,
  Globe,
  Bell,
  Shield,
  Moon,
  Database,
  Lock,
  Sparkles,
} from "lucide-react";

export function AdminSettingsView() {
  const { addToast } = useCivicStore();
  const [platformName, setPlatformName] = useState("Central-City-AI");
  const [cityName, setCityName] = useState("Metro Central Metropolis");
  const [defaultSLA, setDefaultSLA] = useState("24");
  const [enableDuplicateDetection, setEnableDuplicateDetection] = useState(true);
  const [enableKarmaRewards, setEnableKarmaRewards] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      "Settings Saved",
      "Global platform configurations updated across all nodes.",
      "success"
    );
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Global Civic Platform Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Control platform branding, geolocation presets, dispatch automation, and AI security parameters.
          </p>
        </div>

        <Button
          type="submit"
          variant="glow"
          size="sm"
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Save Configuration
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. General Municipal Settings */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>General Platform Parameters</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Platform Name
              </label>
              <Input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Jurisdiction City / Region
              </label>
              <Input
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Default Municipal Resolution SLA (Hours)
              </label>
              <Input
                type="number"
                value={defaultSLA}
                onChange={(e) => setDefaultSLA(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 2. AI & Security Toggles */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>AI Triage & Reputation Policies</span>
          </h3>

          <div className="space-y-3">
            <div
              onClick={() => setEnableDuplicateDetection(!enableDuplicateDetection)}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-white block">Auto Duplicate Detection</span>
                <span className="text-[11px] text-slate-400">
                  Embeddings cosine similarity threshold at 90%
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  enableDuplicateDetection
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900 text-slate-500"
                }`}
              >
                {enableDuplicateDetection ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            <div
              onClick={() => setEnableKarmaRewards(!enableKarmaRewards)}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-white block">Civic Karma Gamification</span>
                <span className="text-[11px] text-slate-400">
                  Award points for reporting (+50) and verification (+25)
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  enableKarmaRewards
                    ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                    : "bg-slate-900 text-slate-500"
                }`}
              >
                {enableKarmaRewards ? "ENABLED" : "DISABLED"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
