import { NextRequest, NextResponse } from "next/server";

// Comprehensive offline/instant fallback database for Tamil Nadu & Indian cities/towns
const MUNICIPAL_FALLBACK_DATABASE = [
  {
    displayName: "Avinashipalayam, Tiruppur District, Tamil Nadu, India",
    lat: 11.0234,
    lng: 77.4512,
    type: "Town / Transit Corridor",
  },
  {
    displayName: "Avinashipalayam Bus Stand, Avinashipalayam, Tamil Nadu, India",
    lat: 11.0245,
    lng: 77.4528,
    type: "Transit Station",
  },
  {
    displayName: "Avinashipalayam Road, Tiruppur, Tamil Nadu, India",
    lat: 11.0312,
    lng: 77.4485,
    type: "Highway Road",
  },
  {
    displayName: "Koduvalai, Tiruppur District, Tamil Nadu, India",
    lat: 11.0891,
    lng: 77.3824,
    type: "Village / School Zone",
  },
  {
    displayName: "Tiruppur, Tamil Nadu, India",
    lat: 11.1085,
    lng: 77.3411,
    type: "City / Municipal Corporation",
  },
  {
    displayName: "Coimbatore, Tamil Nadu, India",
    lat: 11.0168,
    lng: 76.9558,
    type: "Metropolitan District",
  },
  {
    displayName: "Palladam, Tiruppur District, Tamil Nadu, India",
    lat: 10.9995,
    lng: 77.2917,
    type: "Taluk / Highway Junction",
  },
  {
    displayName: "Kangeyam, Tiruppur District, Tamil Nadu, India",
    lat: 11.0062,
    lng: 77.5615,
    type: "Municipal Town",
  },
  {
    displayName: "Uthukuli, Tiruppur District, Tamil Nadu, India",
    lat: 11.1714,
    lng: 77.4526,
    type: "Town Panchayat",
  },
  {
    displayName: "Dharapuram, Tiruppur District, Tamil Nadu, India",
    lat: 10.7301,
    lng: 77.5255,
    type: "Municipality",
  },
  {
    displayName: "Chennai, Tamil Nadu, India",
    lat: 13.0827,
    lng: 80.2707,
    type: "Capital City",
  },
  {
    displayName: "Salem, Tamil Nadu, India",
    lat: 11.6643,
    lng: 78.146,
    type: "City Corporation",
  },
  {
    displayName: "Madurai, Tamil Nadu, India",
    lat: 9.9252,
    lng: 78.1198,
    type: "City Corporation",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const cleanQuery = query.trim().toLowerCase();

  try {
    // Call OpenStreetMap Nominatim with proper headers from Next.js server-side proxy
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=8&addressdetails=1`;

    const res = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "Central-City-AI-Civic-Platform/1.0 (contact@centralcity.ai)",
        "Accept-Language": "en",
      },
      next: { revalidate: 3600 }, // Cache geocode responses for 1 hour
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const results = data.map((item: any) => ({
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type || item.class || "Location",
        }));
        return NextResponse.json({ results });
      }
    }
  } catch (error) {
    console.warn("External Nominatim geocoding proxy notice:", error);
  }

  // Fallback to local municipal database if Nominatim returns empty or is unreachable
  const localMatches = MUNICIPAL_FALLBACK_DATABASE.filter(
    (item) =>
      item.displayName.toLowerCase().includes(cleanQuery) ||
      cleanQuery.split(" ").some((word) => item.displayName.toLowerCase().includes(word))
  );

  return NextResponse.json({ results: localMatches });
}
