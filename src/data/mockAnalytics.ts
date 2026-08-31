import { PlatformStats, WardAnalytics } from "@/types";

export const MOCK_PLATFORM_STATS: PlatformStats = {
  totalIssuesReported: 14820,
  totalVerifiedByCommunity: 13910,
  totalResolvedByAuthorities: 12450,
  avgAiClassificationSpeedMs: 420,
  avgResolutionHours: 14.8,
  activeCommunityVerifiers: 1840,
  citizenParticipationRate: 88.4,
};

export const MOCK_WARDS_ANALYTICS: WardAnalytics[] = [
  {
    wardNumber: "Ward 04",
    wardName: "Financial District & Bayfront",
    civicHealthScore: 94,
    totalActiveIssues: 8,
    resolvedThisMonth: 142,
    criticalIssuesCount: 0,
    topCategory: "broken_streetlight",
  },
  {
    wardNumber: "Ward 07",
    wardName: "Tech Corridor & University Zone",
    civicHealthScore: 89,
    totalActiveIssues: 14,
    resolvedThisMonth: 188,
    criticalIssuesCount: 1,
    topCategory: "pothole",
  },
  {
    wardNumber: "Ward 12",
    wardName: "Old Town & Heritage Quarter",
    civicHealthScore: 76,
    totalActiveIssues: 32,
    resolvedThisMonth: 210,
    criticalIssuesCount: 4,
    topCategory: "water_leakage",
  },
  {
    wardNumber: "Ward 14",
    wardName: "Metro Central & Transit Hub",
    civicHealthScore: 82,
    totalActiveIssues: 26,
    resolvedThisMonth: 340,
    criticalIssuesCount: 2,
    topCategory: "garbage_dump",
  },
  {
    wardNumber: "Ward 19",
    wardName: "Eastside Industrial & Logistic Park",
    civicHealthScore: 71,
    totalActiveIssues: 41,
    resolvedThisMonth: 175,
    criticalIssuesCount: 5,
    topCategory: "open_manhole",
  },
];
