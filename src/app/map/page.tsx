"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CitizenMapPreview } from "@/components/citizen/CitizenMapPreview";
import { useCivicStore } from "@/lib/mockStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Globe, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function MapExplorerPage() {
  const { issues } = useCivicStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        {/* Unified Top Navbar */}
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Badge variant="cyan" size="sm" dot>
                  Geospatial Civic Grid
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {issues.length} Verified GPS Pins
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Live Interactive Civic Map
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Explore verified civic defects, municipal work orders, and road damage across the city with real satellite imagery.
              </p>
            </div>

            <Link href="/report">
              <Button
                variant="glow"
                size="md"
                className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider px-6 py-3.5 shadow-cyan-glow"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Report at Location
              </Button>
            </Link>
          </div>

          {/* Real World Interactive Map Component */}
          <CitizenMapPreview />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
