import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IssueCategory, IssueSeverity, IssueStatus, UserRole } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCategoryMeta(category: IssueCategory): {
  label: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
} {
  const meta: Record<
    IssueCategory,
    { label: string; badgeBg: string; badgeText: string; icon: string }
  > = {
    pothole: {
      label: "Road Pothole",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      badgeText: "text-amber-400",
      icon: "AlertTriangle",
    },
    water_leakage: {
      label: "Water Main Leak",
      badgeBg: "bg-cyan-500/10 border-cyan-500/20",
      badgeText: "text-cyan-400",
      icon: "Droplets",
    },
    garbage_dump: {
      label: "Illegal Waste Dump",
      badgeBg: "bg-rose-500/10 border-rose-500/20",
      badgeText: "text-rose-400",
      icon: "Trash2",
    },
    broken_streetlight: {
      label: "Streetlight Outage",
      badgeBg: "bg-yellow-500/10 border-yellow-500/20",
      badgeText: "text-yellow-400",
      icon: "LightbulbOff",
    },
    traffic_signal: {
      label: "Traffic Signal Failure",
      badgeBg: "bg-indigo-500/10 border-indigo-500/20",
      badgeText: "text-indigo-400",
      icon: "TrafficCone",
    },
    open_manhole: {
      label: "Hazardous Open Manhole",
      badgeBg: "bg-rose-600/10 border-rose-600/20",
      badgeText: "text-rose-500",
      icon: "AlertOctagon",
    },
    encroachment: {
      label: "Footpath Encroachment",
      badgeBg: "bg-purple-500/10 border-purple-500/20",
      badgeText: "text-purple-400",
      icon: "ShieldAlert",
    },
    fallen_tree: {
      label: "Fallen Tree / Branch",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
      badgeText: "text-emerald-400",
      icon: "Trees",
    },
  };

  return (
    meta[category] || {
      label: category,
      badgeBg: "bg-slate-800 border-slate-700",
      badgeText: "text-slate-300",
      icon: "HelpCircle",
    }
  );
}

export function getSeverityMeta(severity: IssueSeverity): {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  dotClass: string;
} {
  switch (severity) {
    case "critical":
      return {
        label: "Critical Danger",
        colorClass: "text-rose-400",
        bgClass: "bg-rose-950/40",
        borderClass: "border-rose-500/40",
        dotClass: "bg-rose-500 animate-ping",
      };
    case "high":
      return {
        label: "High Priority",
        colorClass: "text-amber-400",
        bgClass: "bg-amber-950/40",
        borderClass: "border-amber-500/40",
        dotClass: "bg-amber-500",
      };
    case "medium":
      return {
        label: "Moderate",
        colorClass: "text-cyan-400",
        bgClass: "bg-cyan-950/40",
        borderClass: "border-cyan-500/40",
        dotClass: "bg-cyan-500",
      };
    case "low":
    default:
      return {
        label: "Low Impact",
        colorClass: "text-slate-400",
        bgClass: "bg-slate-900/60",
        borderClass: "border-slate-700/50",
        dotClass: "bg-slate-500",
      };
  }
}

export function getStatusMeta(status: IssueStatus): {
  label: string;
  step: number;
  colorClass: string;
  bgClass: string;
} {
  switch (status) {
    case "reported":
      return {
        label: "Reported",
        step: 1,
        colorClass: "text-slate-400",
        bgClass: "bg-slate-800/80 border-slate-700",
      };
    case "ai_analyzed":
      return {
        label: "AI Analyzed",
        step: 2,
        colorClass: "text-cyan-400",
        bgClass: "bg-cyan-950/50 border-cyan-500/30",
      };
    case "community_verified":
      return {
        label: "Community Verified",
        step: 3,
        colorClass: "text-purple-400",
        bgClass: "bg-purple-950/50 border-purple-500/30",
      };
    case "authority_dispatched":
      return {
        label: "Team Dispatched",
        step: 4,
        colorClass: "text-indigo-400",
        bgClass: "bg-indigo-950/50 border-indigo-500/30",
      };
    case "in_progress":
      return {
        label: "Repair In Progress",
        step: 5,
        colorClass: "text-amber-400",
        bgClass: "bg-amber-950/50 border-amber-500/30",
      };
    case "resolved":
      return {
        label: "Resolved & Closed",
        step: 6,
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-950/50 border-emerald-500/30",
      };
    default:
      return {
        label: "Unknown",
        step: 0,
        colorClass: "text-slate-400",
        bgClass: "bg-slate-900 border-slate-800",
      };
  }
}

export function getRoleMeta(role: UserRole): {
  title: string;
  badge: string;
  tagline: string;
  color: string;
} {
  switch (role) {
    case "citizen":
      return {
        title: "Citizen Reporter",
        badge: "Active Resident",
        tagline: "Spotting and reporting issues in your neighborhood",
        color: "from-cyan-500 to-blue-600",
      };
    case "verifier":
      return {
        title: "Community Verifier",
        badge: "Civic Guardian Lv.4",
        tagline: "Verifying civic alerts to prevent spam & escalate urgent needs",
        color: "from-purple-500 to-pink-600",
      };
    case "authority":
      return {
        title: "Municipal Authority",
        badge: "Public Works Ops",
        tagline: "Dispatching field teams, managing city SLAs and resolving issues",
        color: "from-emerald-500 to-teal-600",
      };
  }
}

/**
 * Calculates the great-circle distance between two GPS coordinates in meters using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's mean radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Compares two category strings to determine if they match the same civic domain.
 */
export function isSameCivicCategory(cat1: string, cat2: string): boolean {
  if (!cat1 || !cat2) return false;
  const normalize = (c: string) =>
    c.toLowerCase().replace(/[^a-z0-9]/g, "");

  const c1 = normalize(cat1);
  const c2 = normalize(cat2);

  if (c1 === c2) return true;
  if ((c1.includes("road") || c1.includes("pothole") || c1.includes("damage") || c1.includes("street")) &&
      (c2.includes("road") || c2.includes("pothole") || c2.includes("damage") || c2.includes("street"))) return true;
  if (c1.includes("water") && c2.includes("water")) return true;
  if ((c1.includes("garbage") || c1.includes("waste") || c1.includes("dump")) &&
      (c2.includes("garbage") || c2.includes("waste") || c2.includes("dump"))) return true;
  if ((c1.includes("light") || c1.includes("lamp")) &&
      (c2.includes("light") || c2.includes("lamp"))) return true;
  if (c1.includes("traffic") && c2.includes("traffic")) return true;
  if (c1.includes("manhole") && c2.includes("manhole")) return true;
  if (c1.includes("tree") && c2.includes("tree")) return true;

  return false;
}

export interface DuplicateMatchResult {
  issue: any;
  distanceMeters: number;
  similarityScore: number;
}

/**
 * Checks for existing active civic reports within radius (default 500 meters) matching category.
 */
export function findNearbyDuplicateIssue(
  currentLocation: { lat: number; lng: number },
  category: string,
  issues: any[],
  maxRadiusMeters = 500
): DuplicateMatchResult | null {
  if (!currentLocation || typeof currentLocation.lat !== "number" || typeof currentLocation.lng !== "number" || !issues || issues.length === 0) {
    return null;
  }

  let closestMatch: DuplicateMatchResult | null = null;

  for (const issue of issues) {
    // Only check active (unresolved) reports
    if (issue.status === "resolved") continue;
    if (!issue.location || typeof issue.location.lat !== "number" || typeof issue.location.lng !== "number") continue;

    const distance = calculateDistanceMeters(
      currentLocation.lat,
      currentLocation.lng,
      issue.location.lat,
      issue.location.lng
    );

    const isCategoryMatch = isSameCivicCategory(category, issue.category || issue.title || "");

    if (distance <= maxRadiusMeters && isCategoryMatch) {
      // Proximity & category weighted similarity calculation (up to 96%)
      const proximityScore = Math.max(65, Math.round(98 - (distance / maxRadiusMeters) * 33));

      if (!closestMatch || distance < closestMatch.distanceMeters) {
        closestMatch = {
          issue,
          distanceMeters: distance,
          similarityScore: proximityScore,
        };
      }
    }
  }

  return closestMatch;
}

