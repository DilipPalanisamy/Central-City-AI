"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";

export interface SelectedLocationData {
  address: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
  landmark?: string;
}

export interface Step3LocationMapProps {
  locationData: SelectedLocationData;
  onLocationChange: (data: SelectedLocationData) => void;
  onContinue: () => void;
  onBack: () => void;
}

interface GeocodingResult {
  displayName: string;
  lat: number;
  lng: number;
  type?: string;
}

export function Step3LocationMap({
  locationData,
  onLocationChange,
  onContinue,
  onBack,
}: Step3LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState(
    locationData.address || "Avinashipalayam, Tamil Nadu"
  );
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: locationData.lat || 11.0234,
    lng: locationData.lng || 77.4512,
  });
  const [selectedLocationName, setSelectedLocationName] = useState(
    locationData.address || "Avinashipalayam, Tamil Nadu"
  );

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Satellite tile provider configuration
  const mapToken = process.env.NEXT_PUBLIC_MAP_TILE_TOKEN;
  const satelliteTileUrl = mapToken
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapToken}`
    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const satelliteAttribution = mapToken
    ? "© Mapbox © OpenStreetMap"
    : "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and GIS User Community";

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

      // Create Leaflet map centered at selected problem location
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
      });

      // Add High-Resolution Satellite Tiles Layer
      L.tileLayer(satelliteTileUrl, {
        maxZoom: 19,
        attribution: satelliteAttribution,
      }).addTo(map);

      // Custom Glowing Map Pin Icon 📍
      const customPinIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #06b6d4; color: #020617; border: 2px solid #ffffff; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 19px; box-shadow: 0 0 24px rgba(6, 182, 212, 0.9), 0 4px 10px rgba(0,0,0,0.7);">
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

      // Handle marker drag
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        const newLat = Number(position.lat.toFixed(6));
        const newLng = Number(position.lng.toFixed(6));
        setCurrentCoords({ lat: newLat, lng: newLng });

        onLocationChange({
          ...locationData,
          address: selectedLocationName,
          lat: newLat,
          lng: newLng,
        });
      });

      // Handle map click to reposition marker
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        const newLat = Number(lat.toFixed(6));
        const newLng = Number(lng.toFixed(6));

        marker.setLatLng([newLat, newLng]);
        setCurrentCoords({ lat: newLat, lng: newLng });

        onLocationChange({
          ...locationData,
          address: selectedLocationName,
          lat: newLat,
          lng: newLng,
        });
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
  }, [satelliteTileUrl]);

  // Real Geocoding Service Function calling our server-side Next.js proxy
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
  const handleSelectLocationResult = (item: GeocodingResult) => {
    const parts = item.displayName.split(",");
    const cleanName = parts.length > 2 ? `${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}` : item.displayName;
    
    setSelectedLocationName(cleanName);
    setSearchQuery(cleanName);
    setSearchResults([]);
    setHasSearched(false);
    setCurrentCoords({ lat: item.lat, lng: item.lng });

    // Fly map to exact geocoded coordinates & update marker
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 16, {
        duration: 1.5,
      });
      markerInstanceRef.current.setLatLng([item.lat, item.lng]);
    }

    onLocationChange({
      ...locationData,
      address: cleanName,
      lat: Number(item.lat.toFixed(6)),
      lng: Number(item.lng.toFixed(6)),
      landmark: item.displayName,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 03: Satellite Location Triage</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Where is the problem?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Search for the problem location or click directly on the satellite map.
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
            placeholder="Search for a city, town, village, street or location..."
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
              <span>Matching Locations</span>
              <span className="text-cyan-400">{searchResults.length} Results</span>
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
                      {item.displayName.split(",")[0]}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block pl-5">
                    {item.displayName}
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
            <span>No matching locations found for &ldquo;{searchQuery}&rdquo;. Try typing city name or clicking the map.</span>
          </div>
        )}
      </div>

      {/* Interactive Satellite Map Container */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-4">
        {/* Map Header Strip */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              SATELLITE VIEW
            </span>
          </div>

          <div className="flex items-center gap-2">
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
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-9 h-9 rounded-xl bg-slate-950/90 border border-slate-750 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-300 hover:bg-slate-900 shadow-lg transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Map Tip */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 z-20 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Tip:</span>
            <span>Click any road or landmark on the satellite view to reposition the marker</span>
          </div>
        </div>

        {/* Selected Location & Coordinates Telemetry Display */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Selected Location:
            </span>
            <span className="text-sm font-black text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{selectedLocationName}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left sm:text-right font-mono space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Coordinates:
            </span>
            <div className="text-xs font-black text-cyan-400">
              <span>Lat: {currentCoords.lat.toFixed(6)}</span> • <span>Lng: {currentCoords.lng.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Quick Municipal Location Presets */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick City / Town Shortcuts:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: "Avinashipalayam", lat: 11.0234, lng: 77.4512, type: "Transit Corridor" },
              { name: "Koduvalai", lat: 11.0891, lng: 77.3824, type: "School Zone" },
              { name: "Tiruppur", lat: 11.1085, lng: 77.3411, type: "City Center" },
              { name: "Coimbatore", lat: 11.0168, lng: 76.9558, type: "Metro Zone" },
            ].map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  handleSelectLocationResult({
                    displayName: `${loc.name}, Tamil Nadu, India`,
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
            ← BACK
          </Button>

          {/* Exact Required Button: [ CONFIRM LOCATION ] */}
          <Button
            type="button"
            variant="glow"
            size="md"
            onClick={onContinue}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-xs font-black uppercase tracking-wider px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-glow"
          >
            CONFIRM LOCATION
          </Button>
        </div>
      </div>
    </div>
  );
}
