"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Search,
  Plus,
  Minus,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Loader2,
  AlertCircle,
  Navigation,
  Compass,
  Sparkles,
} from "lucide-react";
import { DuplicateDetectionCard } from "./DuplicateDetectionCard";
import { findNearbyDuplicateIssue } from "@/lib/utils";
import { useCivicStore } from "@/lib/mockStore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export interface SelectedLocationData {
  address: string;
  city?: string;
  area?: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
  landmark?: string;
}

export interface Step3LocationMapProps {
  locationData: SelectedLocationData;
  category?: string;
  imageUrl?: string;
  onLocationChange: (data: SelectedLocationData) => void;
  onContinue: () => void;
  onBack: () => void;
}

interface GeocodingResultItem {
  displayName: string;
  fullAddress: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  type?: string;
  ward?: string;
  zone?: string;
}

export function Step3LocationMap({
  locationData,
  category = "Road Damage",
  imageUrl,
  onLocationChange,
  onContinue,
  onBack,
}: Step3LocationMapProps) {
  const router = useRouter();
  const { issues, toggleAffected, addToast } = useCivicStore();
  const { user } = useAuth();
  const [dismissedDuplicateIds, setDismissedDuplicateIds] = useState<string[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  // Map Tile Style (Satellite vs Street)
  const [mapStyle, setMapStyle] = useState<"satellite" | "streets">("satellite");

  const [searchQuery, setSearchQuery] = useState(
    locationData.address || "Avinashipalayam, Tamil Nadu"
  );
  const [searchResults, setSearchResults] = useState<GeocodingResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: locationData.lat || 11.0234,
    lng: locationData.lng || 77.4512,
  });

  const [selectedLocationName, setSelectedLocationName] = useState(
    locationData.address || "Avinashipalayam, Tamil Nadu"
  );
  const [selectedCity, setSelectedCity] = useState(locationData.city || "Tiruppur");
  const [selectedArea, setSelectedArea] = useState(locationData.area || "Avinashipalayam");

  // Spatial duplicate detection within 500 meters of marker coordinates
  const duplicateMatch = useMemo(() => {
    const match = findNearbyDuplicateIssue(
      { lat: currentCoords.lat, lng: currentCoords.lng },
      category || "Road Damage",
      issues,
      500
    );
    if (match && dismissedDuplicateIds.includes(match.issue.id)) {
      return null;
    }
    return match;
  }, [currentCoords, category, issues, dismissedDuplicateIds]);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Tile Providers
  const satelliteTileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const streetTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Reverse Geocoding helper to fetch clean address when user clicks/drags pin
  const fetchAddressForCoordinates = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.fullAddress) {
          setSelectedLocationName(data.fullAddress);
          setSelectedCity(data.city || "Tiruppur District");
          setSelectedArea(data.area || "Civic Grid");

          onLocationChange({
            address: data.fullAddress,
            city: data.city || "Tiruppur District",
            area: data.area || "Civic Grid",
            ward: data.ward || "Ward 14",
            zone: data.zone || data.city || "Tiruppur District",
            lat,
            lng,
            landmark: data.displayName,
          });
          setIsReverseGeocoding(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Reverse geocode fetch error:", err);
    }

    // Fallback if reverse geocode fails
    const fallbackAddr = `Civic Point (${lat.toFixed(4)}, ${lng.toFixed(4)}), ${selectedCity}, Tamil Nadu`;
    setSelectedLocationName(fallbackAddr);
    onLocationChange({
      ...locationData,
      address: fallbackAddr,
      lat,
      lng,
    });
    setIsReverseGeocoding(false);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initLeafletMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Create Leaflet map centered on current coordinates
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
      });

      // Add Base Layer
      const activeTileUrl = mapStyle === "satellite" ? satelliteTileUrl : streetTileUrl;
      const tileLayer = L.tileLayer(activeTileUrl, {
        maxZoom: 19,
        attribution:
          mapStyle === "satellite"
            ? "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP"
            : "© OpenStreetMap contributors",
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Custom Glowing Map Pin Icon 📍
      const customPinIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #06b6d4; color: #020617; border: 2px solid #ffffff; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 19px; box-shadow: 0 0 24px rgba(6, 182, 212, 0.9), 0 4px 10px rgba(0,0,0,0.7); cursor: grab;">
              📍
            </div>
            <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; margin-top: -3px; box-shadow: 0 0 10px #06b6d4;"></div>
          </div>
        `,
        iconSize: [38, 46],
        iconAnchor: [19, 46],
      });

      // Draggable Marker
      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      // Handle marker drag completion
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        const newLat = Number(position.lat.toFixed(6));
        const newLng = Number(position.lng.toFixed(6));
        setCurrentCoords({ lat: newLat, lng: newLng });
        fetchAddressForCoordinates(newLat, newLng);
      });

      // Handle direct map click to place marker
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        const newLat = Number(lat.toFixed(6));
        const newLng = Number(lng.toFixed(6));

        marker.setLatLng([newLat, newLng]);
        setCurrentCoords({ lat: newLat, lng: newLng });
        fetchAddressForCoordinates(newLat, newLng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;
    }

    initLeafletMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Style (Satellite vs Street)
  const toggleMapStyle = async () => {
    const nextStyle = mapStyle === "satellite" ? "streets" : "satellite";
    setMapStyle(nextStyle);

    if (mapInstanceRef.current && tileLayerRef.current) {
      const L = (await import("leaflet")).default;
      mapInstanceRef.current.removeLayer(tileLayerRef.current);

      const newUrl = nextStyle === "satellite" ? satelliteTileUrl : streetTileUrl;
      const newLayer = L.tileLayer(newUrl, {
        maxZoom: 19,
        attribution:
          nextStyle === "satellite"
            ? "Tiles © Esri — Source: Esri"
            : "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newLayer;
    }
  };

  // Real Geocoding Service Function calling /api/geocode
  const performGeocodingSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          setSearchResults(data.results);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Geocoding fetch notice:", err);
    }

    setIsSearching(false);
  }, []);

  // Debounced search input handler (350ms delay)
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

  // Handle Location Selection from Search Results
  const handleSelectLocationResult = (item: GeocodingResultItem) => {
    const newLat = Number(item.lat.toFixed(6));
    const newLng = Number(item.lng.toFixed(6));
    const cleanAddr = item.fullAddress || item.displayName;

    setSelectedLocationName(cleanAddr);
    setSelectedCity(item.city || "Tiruppur");
    setSelectedArea(item.area || "Avinashipalayam");
    setSearchQuery(cleanAddr);
    setSearchResults([]);
    setHasSearched(false);
    setCurrentCoords({ lat: newLat, lng: newLng });

    // Fly map smoothly to exact geocoded coordinates & update marker
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 16, {
        duration: 1.5,
      });
      markerInstanceRef.current.setLatLng([newLat, newLng]);
    }

    onLocationChange({
      address: cleanAddr,
      city: item.city || "Tiruppur",
      area: item.area || "Avinashipalayam",
      ward: item.ward || "Ward 14",
      zone: item.zone || item.city || "Tiruppur District",
      lat: newLat,
      lng: newLng,
      landmark: item.displayName,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 03: GIS Location Map</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Where is the problem located?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Type an area in the search bar or click directly on the interactive map to place the exact pin.
        </p>
      </div>

      {/* Real Geocoding Search Bar */}
      <div className="relative z-30 space-y-1">
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search city, town, ward, or street (e.g., Avinashipalayam, Coimbatore)..."
            className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-cyan-400 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-2xl transition-all"
          />
          {isSearching && (
            <div className="flex items-center gap-1.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[11px] font-mono hidden sm:inline">Searching...</span>
            </div>
          )}
        </div>

        {/* Real Geocoding Autocomplete Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-slate-950/95 border-2 border-cyan-500/50 shadow-2xl backdrop-blur-xl space-y-1 z-40 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto">
            <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center justify-between border-b border-slate-800">
              <span>Matching Locations ({searchResults.length})</span>
              <span className="text-cyan-400 font-mono">OpenStreetMap Nominatim</span>
            </div>

            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectLocationResult(item)}
                className="w-full p-2.5 rounded-xl hover:bg-slate-900 text-left text-xs transition-colors flex items-center justify-between group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold text-white block group-hover:text-cyan-300 transition-colors truncate">
                      {item.area || item.displayName.split(",")[0]}
                    </span>
                    {item.city && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {item.city}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block pl-5">
                    {item.fullAddress || item.displayName}
                  </span>
                </div>
                <div className="shrink-0 text-right font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded-md border border-cyan-500/30">
                  <span>{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results Alert */}
        {hasSearched && !isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-slate-950/95 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 z-40">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>No matching location found for &ldquo;{searchQuery}&rdquo;. Click directly on the map to place the marker.</span>
          </div>
        )}
      </div>

      {/* Interactive Map Container */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-4">
        {/* Map Header Strip */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              {mapStyle === "satellite" ? "SATELLITE IMAGERY (ESRI)" : "STREET MAP (OSM)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMapStyle}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-750 text-[11px] font-semibold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3 h-3" />
              <span>{mapStyle === "satellite" ? "Switch to Streets" : "Switch to Satellite"}</span>
            </button>

            <Badge variant="cyan" size="sm">
              Click or Drag 📍 Pin
            </Badge>
          </div>
        </div>

        {/* Real Leaflet Map DOM Canvas */}
        <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Zoom Controls (+ / -) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-9 h-9 rounded-xl bg-slate-950/90 border border-slate-750 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-300 hover:bg-slate-900 shadow-lg transition-all"
              title="Zoom in"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-9 h-9 rounded-xl bg-slate-950/90 border border-slate-750 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-300 hover:bg-slate-900 shadow-lg transition-all"
              title="Zoom out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Reverse Geocode Loading Pill */}
          {isReverseGeocoding && (
            <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-[11px] text-cyan-300 z-20 flex items-center gap-2 shadow-cyan-glow">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Resolving address...</span>
            </div>
          )}

          {/* Map Helper Tip */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 z-20 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Tip:</span>
            <span>Click any spot on the map or drag the 📍 pin to set the exact defect location</span>
          </div>
        </div>

        {/* Selected Location & Coordinates Telemetry Display */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Selected Issue Address:
            </span>
            <span className="text-sm font-black text-white flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{selectedLocationName}</span>
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>City: <strong className="text-cyan-300">{selectedCity}</strong></span>
              <span>•</span>
              <span>Area: <strong className="text-cyan-300">{selectedArea}</strong></span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left sm:text-right font-mono space-y-0.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Exact Coordinates:
            </span>
            <div className="text-xs font-black text-cyan-400">
              <span>Lat: {currentCoords.lat.toFixed(6)}</span>
              <span className="mx-1">•</span>
              <span>Lng: {currentCoords.lng.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Quick Municipal Location Shortcuts */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick Municipal Shortcuts:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: "Avinashipalayam", city: "Tiruppur", area: "Avinashipalayam", lat: 11.0234, lng: 77.4512, type: "Transit Corridor" },
              { name: "Koduvalai", city: "Tiruppur", area: "Koduvalai", lat: 11.0891, lng: 77.3824, type: "School Zone" },
              { name: "Tiruppur City", city: "Tiruppur", area: "City Center", lat: 11.1085, lng: 77.3411, type: "Municipal Center" },
              { name: "Coimbatore", city: "Coimbatore", area: "Gandhipuram", lat: 11.0168, lng: 76.9558, type: "Metro Zone" },
            ].map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  handleSelectLocationResult({
                    displayName: `${loc.name}, ${loc.city}, Tamil Nadu, India`,
                    fullAddress: `${loc.name}, ${loc.city} District, Tamil Nadu, India`,
                    city: loc.city,
                    area: loc.area,
                    lat: loc.lat,
                    lng: loc.lng,
                    type: loc.type,
                  })
                }
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  selectedLocationName.includes(loc.name)
                    ? "bg-cyan-950/80 border-cyan-400 text-white shadow-cyan-glow"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="truncate pr-1">
                  <span className="font-bold block truncate">{loc.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{loc.type}</span>
                </div>
                {selectedLocationName.includes(loc.name) && (
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* DUPLICATE DETECTION CARD (Active when report within 500m matches category) */}
        {duplicateMatch && (
          <div className="pt-2 animate-in fade-in-50 duration-300">
            <DuplicateDetectionCard
              userReport={{
                title: `${category || "Civic Hazard"} at ${selectedLocationName}`,
                imageUrl:
                  imageUrl ||
                  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
                address: selectedLocationName,
                ward: locationData.ward,
                category: category || "Road Damage",
              }}
              existingIssue={{
                id: duplicateMatch.issue.id,
                trackingNumber: duplicateMatch.issue.trackingNumber,
                title: duplicateMatch.issue.title,
                imageUrl: duplicateMatch.issue.media?.primaryImageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
                address: duplicateMatch.issue.location?.address || selectedLocationName,
                ward: duplicateMatch.issue.location?.ward || locationData.ward,
                status: (duplicateMatch.issue.status || "reported").replace("_", " ").toUpperCase(),
                reportedBy: duplicateMatch.issue.reportedBy?.name || "Verified Citizen",
                timeAgo: "Active on ledger",
                affectedCount: duplicateMatch.issue.affectedCount || 1,
                similarityScore: duplicateMatch.similarityScore,
              }}
              onViewExisting={(issueId) => router.push(`/community/${issueId}`)}
              onJoinExisting={(issueId) => {
                toggleAffected(
                  issueId,
                  user?.uid,
                  user?.displayName || undefined,
                  user?.photoURL || undefined
                );
                addToast(
                  "Joined Existing Case (+40 Karma)",
                  "Your evidence has been attached to the existing report and escalation count updated.",
                  "success"
                );
                router.push(`/community/${issueId}`);
              }}
              onReportSeparately={() => {
                setDismissedDuplicateIds((prev) => [...prev, duplicateMatch.issue.id]);
                addToast(
                  "Continuing with Separate Report",
                  "You may proceed to add unique details and evidence for your report.",
                  "info"
                );
              }}
            />
          </div>
        )}

        {/* Navigation Buttons: [ ← Back ] and [ CONFIRM LOCATION ] */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-xs font-bold text-slate-400 hover:text-white"
          >
            ← BACK TO AI ANALYSIS
          </Button>

          <Button
            type="button"
            variant="glow"
            size="md"
            onClick={onContinue}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-xs font-black uppercase tracking-wider px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
          >
            CONFIRM LOCATION →
          </Button>
        </div>
      </div>
    </div>
  );
}
