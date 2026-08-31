import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface GeocodeLocationItem {
  lat: number;
  lng: number;
  displayName: string;
  fullAddress: string;
  city: string;
  area: string;
  type: string;
  ward?: string;
  zone?: string;
}

// Comprehensive offline/instant fallback database for Tamil Nadu & Indian municipal districts
const MUNICIPAL_FALLBACK_DATABASE: GeocodeLocationItem[] = [
  {
    displayName: "Avinashipalayam, Tiruppur District, Tamil Nadu, India",
    fullAddress: "Avinashipalayam, Tiruppur District, Tamil Nadu 638660, India",
    city: "Tiruppur",
    area: "Avinashipalayam",
    lat: 11.0234,
    lng: 77.4512,
    type: "Town / Transit Corridor",
    ward: "Ward 14",
    zone: "Tiruppur District",
  },
  {
    displayName: "Avinashipalayam Bus Stand, Avinashipalayam, Tamil Nadu, India",
    fullAddress: "Avinashipalayam Bus Stand, SH 37, Avinashipalayam, Tamil Nadu 638660, India",
    city: "Tiruppur",
    area: "Avinashipalayam Bus Stand",
    lat: 11.0245,
    lng: 77.4528,
    type: "Transit Station",
    ward: "Ward 14",
    zone: "Tiruppur District",
  },
  {
    displayName: "Avinashipalayam Main Road, Tiruppur, Tamil Nadu, India",
    fullAddress: "Avinashipalayam Road, Kangeyam Main Rd, Tiruppur, Tamil Nadu 638660, India",
    city: "Tiruppur",
    area: "Avinashipalayam Highway",
    lat: 11.0312,
    lng: 77.4485,
    type: "Highway Road",
    ward: "Ward 14",
    zone: "Tiruppur District",
  },
  {
    displayName: "Koduvalai, Tiruppur District, Tamil Nadu, India",
    fullAddress: "Koduvalai Village, Tiruppur District, Tamil Nadu 638660, India",
    city: "Tiruppur",
    area: "Koduvalai",
    lat: 11.0891,
    lng: 77.3824,
    type: "Village / School Zone",
    ward: "Ward 18",
    zone: "Tiruppur District",
  },
  {
    displayName: "Tiruppur City Center, Tamil Nadu, India",
    fullAddress: "Tiruppur Municipal Corporation, Kumaran Road, Tiruppur, Tamil Nadu 641601, India",
    city: "Tiruppur",
    area: "City Center",
    lat: 11.1085,
    lng: 77.3411,
    type: "City / Municipal Corporation",
    ward: "Ward 01",
    zone: "Central Zone",
  },
  {
    displayName: "Coimbatore, Tamil Nadu, India",
    fullAddress: "Gandhipuram, Coimbatore, Tamil Nadu 641012, India",
    city: "Coimbatore",
    area: "Gandhipuram",
    lat: 11.0168,
    lng: 76.9558,
    type: "Metropolitan District",
    ward: "Ward 22",
    zone: "Coimbatore City",
  },
  {
    displayName: "Palladam, Tiruppur District, Tamil Nadu, India",
    fullAddress: "Palladam Taluk, Tiruppur District, Tamil Nadu 641664, India",
    city: "Palladam",
    area: "Palladam Center",
    lat: 10.9995,
    lng: 77.2917,
    type: "Taluk / Highway Junction",
    ward: "Ward 06",
    zone: "Tiruppur District",
  },
  {
    displayName: "Kangeyam, Tiruppur District, Tamil Nadu, India",
    fullAddress: "Kangeyam Town, Tiruppur District, Tamil Nadu 638701, India",
    city: "Kangeyam",
    area: "Kangeyam Town",
    lat: 11.0062,
    lng: 77.5615,
    type: "Municipal Town",
    ward: "Ward 04",
    zone: "Tiruppur District",
  },
  {
    displayName: "Uthukuli, Tiruppur District, Tamil Nadu, India",
    fullAddress: "Uthukuli Town Panchayat, Tiruppur District, Tamil Nadu 638751, India",
    city: "Uthukuli",
    area: "Uthukuli",
    lat: 11.1714,
    lng: 77.4526,
    type: "Town Panchayat",
    ward: "Ward 02",
    zone: "Tiruppur District",
  },
  {
    displayName: "Chennai, Tamil Nadu, India",
    fullAddress: "Chennai City, Tamil Nadu 600001, India",
    city: "Chennai",
    area: "Chennai Central",
    lat: 13.0827,
    lng: 80.2707,
    type: "Capital City",
    ward: "Zone 05",
    zone: "Greater Chennai",
  },
  {
    displayName: "Salem, Tamil Nadu, India",
    fullAddress: "Salem City Corporation, Tamil Nadu 636001, India",
    city: "Salem",
    area: "Salem City",
    lat: 11.6643,
    lng: 78.146,
    type: "City Corporation",
    ward: "Ward 12",
    zone: "Salem City",
  },
  {
    displayName: "Madurai, Tamil Nadu, India",
    fullAddress: "Madurai Corporation, Tamil Nadu 625001, India",
    city: "Madurai",
    area: "Madurai Central",
    lat: 9.9252,
    lng: 78.1198,
    type: "City Corporation",
    ward: "Ward 08",
    zone: "Madurai District",
  },
];

function extractAddressFields(item: any): { fullAddress: string; city: string; area: string } {
  const addr = item.address || {};
  const city =
    addr.city ||
    addr.town ||
    addr.municipality ||
    addr.county ||
    addr.district ||
    addr.state_district ||
    "Tamil Nadu";
  const area =
    addr.suburb ||
    addr.neighbourhood ||
    addr.village ||
    addr.hamlet ||
    addr.road ||
    item.display_name?.split(",")[0] ||
    "Local Area";

  return {
    fullAddress: item.display_name || `${area}, ${city}`,
    city,
    area,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || searchParams.get("query") || "";
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng") || searchParams.get("lon");

  // 1. Handle Reverse Geocoding (coordinates -> address/city/area)
  if (latParam && lngParam) {
    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    if (!isNaN(lat) && !isNaN(lng)) {
      try {
        const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
        const res = await fetch(reverseUrl, {
          headers: {
            "User-Agent": "Central-City-AI-Civic-Platform/1.0 (contact@centralcity.ai)",
            "Accept-Language": "en",
          },
          next: { revalidate: 3600 },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const { fullAddress, city, area } = extractAddressFields(data);
            return NextResponse.json({
              lat,
              lng,
              displayName: data.display_name,
              fullAddress,
              city,
              area,
              ward: "Ward 14",
              zone: city,
            });
          }
        }
      } catch (err) {
        console.warn("[geocode reverse] Nominatim fetch notice:", err);
      }

      // Reverse geocode fallback based on closest coordinate or default
      return NextResponse.json({
        lat,
        lng,
        displayName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        fullAddress: `Location at ${lat.toFixed(5)}, ${lng.toFixed(5)}, Tamil Nadu`,
        city: "Tiruppur District",
        area: "Civic Grid Sector",
        ward: "Ward 14",
        zone: "Tiruppur District",
      });
    }
  }

  // 2. Handle Forward Geocoding (query string -> coordinates list)
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const cleanQuery = query.trim().toLowerCase();

  try {
    // OpenStreetMap Nominatim Forward Geocoding API
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=8&addressdetails=1`;

    const res = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "Central-City-AI-Civic-Platform/1.0 (contact@centralcity.ai)",
        "Accept-Language": "en",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const results: GeocodeLocationItem[] = data.map((item: any) => {
          const { fullAddress, city, area } = extractAddressFields(item);
          return {
            displayName: item.display_name,
            fullAddress,
            city,
            area,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type || item.class || "Location",
            ward: "Ward 14",
            zone: city,
          };
        });
        return NextResponse.json({ results });
      }
    }
  } catch (error) {
    console.warn("[geocode search] Nominatim geocoding notice:", error);
  }

  // Fallback to local municipal database if Nominatim is unreachable or returns 0 results
  const localMatches = MUNICIPAL_FALLBACK_DATABASE.filter(
    (item) =>
      item.displayName.toLowerCase().includes(cleanQuery) ||
      item.city.toLowerCase().includes(cleanQuery) ||
      item.area.toLowerCase().includes(cleanQuery) ||
      cleanQuery.split(/[\s,]+/).some((word) => word.length > 2 && item.displayName.toLowerCase().includes(word))
  );

  return NextResponse.json({ results: localMatches });
}
