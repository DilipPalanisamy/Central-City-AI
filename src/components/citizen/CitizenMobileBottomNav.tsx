"use client";

import React from "react";
import Link from "next/link";
import { Home, MapPin, Camera, Users, User, Sparkles } from "lucide-react";

export function CitizenMobileBottomNav({
  onOpenReportModal,
}: {
  onOpenReportModal?: () => void;
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-2xl px-4 py-2 flex items-center justify-around shadow-2xl">
      {/* 1. Home */}
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-slate-400 hover:text-white p-1"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Home</span>
      </Link>

      {/* 2. Map */}
      <Link
        href="/citizen#map-section"
        className="flex flex-col items-center justify-center text-slate-400 hover:text-cyan-400 p-1"
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Map</span>
      </Link>

      {/* 3. REPORT (Center Elevated Glowing Button) */}
      <div className="-mt-6">
        <Link href="/report" onClick={onOpenReportModal}>
          <button
            type="button"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex flex-col items-center justify-center text-slate-950 font-black shadow-cyan-glow border-2 border-slate-950 active:scale-95 transition-transform"
          >
            <Camera className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-950">
              Report
            </span>
          </button>
        </Link>
      </div>

      {/* 4. Community */}
      <Link
        href="/community"
        className="flex flex-col items-center justify-center text-slate-400 hover:text-purple-400 p-1"
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Community</span>
      </Link>

      {/* 5. Profile */}
      <Link
        href="/citizen"
        className="flex flex-col items-center justify-center text-cyan-400 p-1"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Profile</span>
      </Link>
    </div>
  );
}
