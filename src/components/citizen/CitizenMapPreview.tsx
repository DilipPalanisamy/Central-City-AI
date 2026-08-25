"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useCivicStore } from "@/lib/mockStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Search,
  Plus,
  Minus,
  Layers,
  Sparkles,
  ExternalLink,
  Flame,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";

export interface CitizenMapPreviewProps {
  onSelectIssue?: (issue: any) => void;
}

interface GeocodingResult {
  displayName: string;
  lat: number;
  lng: number;
  type?: string;
}

export function CitizenMapPreview({ onSelectIssue }: CitizenMapPreviewProps) {
  const { issues } = useCivicStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerGroupRef = useRef<any>(null);

  const [activeFilter, setActiveFilter] = useState<
    "all" | "critical" | "high" | "medium" | "low" | "resolved"
  >("all");

  const [mapMode, setMapMode] = useState<"satellite" | "streets">("satellite");
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Default coordinate center (Avinashipalayam / Tiruppur district, Tamil Nadu)
  const defaultCenter = { lat: 11.0234, lng: 77.4512 };

  // Satellite and Street Tile URLs
  const satelliteTileUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const streetsTileUrl =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Filtered issues list
  const filteredIssues = issues.filter((iss) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "resolved") return iss.status === "resolved";
    return iss.severity === activeFilter;
  });

  // Initialize Real Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Base Layer
      const currentTileUrl = mapMode === "satellite" ? satelliteTileUrl : streetsTileUrl;
      L.tileLayer(currentTileUrl, {
        maxZoom: 19,
      }).addTo(map);

      // Create LayerGroup for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Select initial default issue
      if (issues.length > 0) {
        setSelectedIssue(issues[0]);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode]);

  // Update Markers on filtered issues or map instance change
  useEffect(() => {
    async function updateMarkers() {
      if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
      const L = (await import("leaflet")).default;

      markersLayerGroupRef.current.clearLayers();

      filteredIssues.forEach((issue) => {
        const lat = issue.location?.lat || defaultCenter.lat;
        const lng = issue.location?.lng || defaultCenter.lng;

        // Color coding based on priority / severity
        let colorHex = "#ef4444"; // Red for Critical
        let label = "CRITICAL";
        let shadowColor = "rgba(239, 68, 68, 0.8)";

        if (issue.status === "resolved") {
          colorHex = "#06b6d4"; // Cyan for Resolved
          label = "RESOLVED";
          shadowColor = "rgba(6, 182, 212, 0.8)";
        } else if (issue.severity === "critical") {
          colorHex = "#ef4444";
          label = "CRITICAL";
          shadowColor = "rgba(239, 68, 68, 0.8)";
        } else if (issue.severity === "high") {
          colorHex = "#f97316"; // Orange for High
          label = "HIGH";
          shadowColor = "rgba(249, 115, 22, 0.8)";
        } else if (issue.severity === "medium") {
          colorHex = "#eab308"; // Yellow for Medium
          label = "MEDIUM";
          shadowColor = "rgba(234, 179, 8, 0.8)";
        } else {
          colorHex = "#10b981"; // Green for Low
          label = "LOW";
          shadowColor = "rgba(16, 185, 129, 0.8)";
        }

        const customMarkerIcon = L.divIcon({
          className: "real-world-issue-marker",
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
              <div style="background: ${colorHex}; color: #ffffff; font-weight: 900; font-size: 10px; padding: 2px 7px; border-radius: 9999px; border: 1.5px solid #ffffff; box-shadow: 0 0 16px ${shadowColor}, 0 2px 6px rgba(0,0,0,0.8); white-space: nowrap; font-family: monospace; letter-spacing: 0.5px;">
                ${label}
              </div>
              <div style="width: 10px; height: 10px; background: ${colorHex}; border: 2px solid #ffffff; border-radius: 50%; margin-top: -2px; box-shadow: 0 0 8px ${colorHex};"></div>
            </div>
          `,
          iconSize: [60, 36],
          iconAnchor: [30, 36],
        });

        const marker = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(
          markersLayerGroupRef.current
        );

        marker.on("click", () => {
          setSelectedIssue(issue);
          if (onSelectIssue) onSelectIssue(issue);
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 });
        });
      });
    }

    updateMarkers();
  }, [filteredIssues, mapMode]);

  // Real Geocoding Search handler (OpenStreetMap Nominatim via /api/geocode)
  const performGeocodingSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          setSearchResults(data.results);
        }
      }
    } catch (e) {
      console.warn("Map search fetch notice:", e);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      performGeocodingSearch(val);
    }, 350);
  };

  const handleSelectSearchResult = (result: GeocodingResult) => {
    setSearchQuery(result.displayName.split(",")[0]);
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([result.lat, result.lng], 15, {
        duration: 1.5,
      });
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass space-y-4">
      {/* Header with Title & Layer Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Real-World Interactive Civic Map
            </h3>
            <span className="text-[11px] text-slate-400">
              Live Geographic Coordinates &amp; Real Road Hazards
            </span>
          </div>
        </div>

        {/* Satellite vs Streets Layer Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setMapMode("satellite")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              mapMode === "satellite"
                ? "bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-cyan-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapMode("streets")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              mapMode === "streets"
                ? "bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-cyan-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Streets
          </button>
        </div>
      </div>

      {/* Real Map Search Bar */}
      <div className="relative z-30 space-y-1">
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search city, town, street or location (e.g. Coimbatore, Tiruppur, Avinashipalayam)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-inner"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl space-y-1 z-40 max-h-52 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full p-2 rounded-xl hover:bg-slate-900 text-left text-xs transition-colors flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-white block group-hover:text-cyan-300 truncate">
                    {item.displayName.split(",")[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {item.displayName}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-cyan-400 shrink-0">
                  {item.lat.toFixed(3)}, {item.lng.toFixed(3)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6 Priority Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {[
          { id: "all", label: "All Active", count: issues.length },
          { id: "critical", label: "Critical", count: issues.filter((i) => i.severity === "critical").length, color: "text-rose-400" },
          { id: "high", label: "High", count: issues.filter((i) => i.severity === "high").length, color: "text-amber-400" },
          { id: "medium", label: "Medium", count: issues.filter((i) => i.severity === "medium").length, color: "text-yellow-400" },
          { id: "low", label: "Low", count: issues.filter((i) => i.severity === "low").length, color: "text-emerald-400" },
          { id: "resolved", label: "Resolved", count: issues.filter((i) => i.status === "resolved").length, color: "text-cyan-400" },
        ].map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-cyan-glow"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isActive ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Real Leaflet Map DOM Canvas */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Map Zoom Controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-lg bg-slate-950/90 border border-slate-700 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-300 hover:bg-slate-900 shadow-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-lg bg-slate-950/90 border border-slate-700 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-300 hover:bg-slate-900 shadow-lg transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Tip */}
        <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300 z-20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Click any marker to inspect civic defect details</span>
        </div>
      </div>

      {/* Selected Marker Information Card */}
      {selectedIssue && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {selectedIssue.title}
                </span>
                <Badge
                  variant={
                    selectedIssue.status === "resolved"
                      ? "cyan"
                      : selectedIssue.severity === "critical"
                      ? "rose"
                      : selectedIssue.severity === "high"
                      ? "amber"
                      : "indigo"
                  }
                  size="sm"
                >
                  {selectedIssue.status === "resolved" ? "RESOLVED" : `${selectedIssue.severity?.toUpperCase()} PRIORITY`}
                </Badge>
              </div>

              <span className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{selectedIssue.location?.address || "Avinashipalayam, Tamil Nadu"}</span>
              </span>
            </div>

            <Link href={`/community/${selectedIssue.id}`}>
              <Button
                variant="glow"
                size="sm"
                className="text-xs font-bold px-3 py-1.5 shadow-cyan-glow shrink-0"
                rightIcon={<ExternalLink className="w-3 h-3" />}
              >
                View Issue
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800/80">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">
                Severity:
              </span>
              <span className="font-mono font-black text-rose-400">
                {selectedIssue.severityScore || selectedIssue.aiAnalysis?.priorityScore || 82} / 100
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">
                Affected:
              </span>
              <span className="font-mono font-black text-cyan-400">
                {selectedIssue.affectedCount || 4} / {selectedIssue.affectedThreshold || 5}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">
                Status:
              </span>
              <span className="font-mono font-bold text-emerald-400 truncate block">
                {selectedIssue.status === "resolved" ? "Fixed" : "Active Ledger"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
