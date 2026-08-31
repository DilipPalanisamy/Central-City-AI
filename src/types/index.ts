export type UserRole = "citizen" | "verifier" | "authority";

export type IssueCategory =
  | "pothole"
  | "road_damage"
  | "water_leakage"
  | "garbage_dump"
  | "broken_streetlight"
  | "traffic_signal"
  | "open_manhole"
  | "encroachment"
  | "fallen_tree"
  | string;

export type IssueSeverity = "low" | "medium" | "high" | "critical";

export type IssueStatus =
  | "reported"
  | "ai_analyzed"
  | "community_verified"
  | "authority_dispatched"
  | "in_progress"
  | "resolved";

export type DepartmentId =
  | "dept_roads"
  | "dept_water"
  | "dept_sanitation"
  | "dept_electricity"
  | "dept_traffic";

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  ward: string;
  zone: string;
  landmark?: string;
}

export interface AIAnalysisResult {
  confidence: number; // e.g. 0.94
  detectedCategory: IssueCategory;
  suggestedSeverity: IssueSeverity;
  estimatedCostMin: number;
  estimatedCostMax: number;
  currency: string;
  estimatedResolutionHours: number;
  objectBoundingBoxes?: {
    label: string;
    score: number;
    box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
  }[];
  damageDimensions?: {
    estimatedAreaSqMeters?: number;
    depthCm?: number;
  };
  rootCauseHypothesis: string;
  recommendedDepartment: DepartmentId;
  priorityScore: number; // 0 - 100
  aiModelVersion: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    role: UserRole | "system_ai";
    avatarUrl?: string;
  };
  action: string;
  description: string;
  mediaUrl?: string;
  badge?: string;
}

export interface CommunityVerification {
  userId: string;
  userName: string;
  userBadge: string;
  verifiedAt: string;
  isConfirmed: boolean;
  notes?: string;
  reputationWeight: number;
}

export interface CivicComment {
  id: string;
  author: {
    name: string;
    role: UserRole;
    avatarUrl: string;
    badgeTitle: string;
  };
  timestamp: string;
  content: string;
  upvotes: number;
  isOfficialResponse?: boolean;
}

export interface SupportingEvidence {
  id: string;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
  telemetryData?: {
    sensorType: string;
    reading: string;
  };
}

export interface CivicIssue {
  id: string;
  trackingNumber: string; // e.g. "CC-2026-8942"
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  location: GeoLocation;
  reportedBy: {
    id: string;
    name: string;
    avatarUrl: string;
    isAnonymous: boolean;
    civicKarma: number;
  };
  reportedAt: string;
  updatedAt: string;
  media: {
    primaryImageUrl: string;
    additionalImages?: string[];
    annotatedImageUrl?: string;
    resolvedImageUrl?: string;
  };
  aiAnalysis: AIAnalysisResult;
  verifications: CommunityVerification[];
  upvotesCount: number;
  hasUserUpvoted?: boolean;
  
  // Community Impact Interaction
  affectedCount: number;
  affectedThreshold: number; // e.g. 150 citizens to trigger mayoral auto-escalation
  hasUserMarkedAffected?: boolean;
  voterUids?: string[];
  
  commentsCount: number;
  comments: CivicComment[];
  supportingEvidence: SupportingEvidence[];
  
  requiredAction?: {
    intervention: string;
    departmentTarget: string;
    urgencyTier: string;
  };
  actionRequired?: string;
  severityScore?: number;

  departmentAssigned?: {
    id: DepartmentId;
    name: string;
    assignedOfficer?: string;
    slaHours: number;
    dispatchedAt?: string;
  };
  timeline: TimelineEvent[];
}

export interface CivicDepartment {
  id: DepartmentId;
  name: string;
  shortCode: string;
  iconName: string;
  activeWorkforce: number;
  totalResolvedIssues: number;
  avgResolutionTimeHours: number;
  slaComplianceRate: number;
  currentBacklog: number;
  budgetAllocated: string;
}

export interface CivicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  ward: string;
  civicKarma: number;
  totalReportsSubmitted: number;
  totalVerifications: number;
  badgeTitle: string;
}

export interface WardAnalytics {
  wardNumber: string;
  wardName: string;
  civicHealthScore: number; // 0 - 100
  totalActiveIssues: number;
  resolvedThisMonth: number;
  criticalIssuesCount: number;
  topCategory: IssueCategory;
}

export interface PlatformStats {
  totalIssuesReported: number;
  totalVerifiedByCommunity: number;
  totalResolvedByAuthorities: number;
  avgAiClassificationSpeedMs: number;
  avgResolutionHours: number;
  activeCommunityVerifiers: number;
  citizenParticipationRate: number;
}

export type NotificationType =
  | "report_submitted"
  | "citizen_joined"
  | "threshold_reached"
  | "issue_escalated"
  | "official_started_work"
  | "issue_resolved"
  | "resolution_disputed"
  | "issue_reopened";

export interface CivicNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  issueId: string;
  issueTrackingNumber: string;
  ward: string;
  badgeText: string;
  badgeVariant: "cyan" | "emerald" | "rose" | "amber" | "purple" | "indigo";
  metadata?: {
    actorName?: string;
    affectedCount?: number;
    departmentName?: string;
    slaHours?: number;
    disputeReason?: string;
  };
}
