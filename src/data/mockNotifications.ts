import { CivicNotification } from "@/types";

export const MOCK_NOTIFICATIONS: CivicNotification[] = [
  {
    id: "notif_01",
    type: "report_submitted",
    title: "Report Registered on Civic Ledger",
    message: "Your hazard report for Deep Hazardous Pothole (CC-2026-8942) was validated by computer vision triage with 94% neural classification match.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    isRead: false,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8942",
    ward: "Ward 14",
    badgeText: "Report Submitted",
    badgeVariant: "cyan",
    metadata: {
      actorName: "AI Vision Triage",
      departmentName: "Department of Roads & Infrastructure",
    },
  },
  {
    id: "notif_02",
    type: "citizen_joined",
    title: "Citizens Joined Your Reported Issue",
    message: "Samira Khan and 14 other neighbors marked themselves as directly affected by the hazard on Market St. Escalation priority increased.",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    isRead: false,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8942",
    ward: "Ward 14",
    badgeText: "Citizen Joined",
    badgeVariant: "purple",
    metadata: {
      affectedCount: 15,
      actorName: "Samira Khan",
    },
  },
  {
    id: "notif_03",
    type: "threshold_reached",
    title: "🚨 Democratic Threshold Reached",
    message: "Issue CC-2026-8942 has met the 5-citizen adaptive threshold quorum for fast-track municipal dispatch.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    isRead: false,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8942",
    ward: "Ward 14",
    badgeText: "Threshold Reached",
    badgeVariant: "rose",
    metadata: {
      affectedCount: 5,
    },
  },
  {
    id: "notif_04",
    type: "issue_escalated",
    title: "Issue Escalated to Authority Command",
    message: "Autonomous Level 3 Mayoral Directive triggered. Priority upgraded to HIGH with a mandated 6-hour emergency resolution window.",
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 1.25 hours ago
    isRead: false,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8942",
    ward: "Ward 14",
    badgeText: "Issue Escalated",
    badgeVariant: "amber",
    metadata: {
      departmentName: "Department of Roads & Infrastructure",
      slaHours: 6,
    },
  },
  {
    id: "notif_05",
    type: "official_started_work",
    title: "Official Started Field Repairs",
    message: "Public Works Asphalt Patch Truck #14 (Chief Eng. Marcus Vance) arrived on site. Milling and compaction in progress.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: true,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8942",
    ward: "Ward 14",
    badgeText: "Official Started Work",
    badgeVariant: "indigo",
    metadata: {
      actorName: "Eng. Marcus Vance",
      departmentName: "PWD-RDS Field Unit #14",
    },
  },
  {
    id: "notif_06",
    type: "issue_resolved",
    title: "Issue Marked as Resolved",
    message: "24th Street Corridor Streetlight Outage (CC-2026-8945) has been officially restored. All 8 LED luminaires tested and resolution photo verified.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: true,
    issueId: "iss_8945",
    issueTrackingNumber: "CC-2026-8945",
    ward: "Ward 07",
    badgeText: "Issue Resolved",
    badgeVariant: "emerald",
    metadata: {
      actorName: "Technician Leo Rossi",
      departmentName: "City Energy & Street Lighting Grid",
    },
  },
  {
    id: "notif_07",
    type: "resolution_disputed",
    title: "Resolution Disputed by Community",
    message: "2 verified Civic Guardians flagged that asphalt patch on CC-2026-8939 was uneven and required additional sub-base seal.",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    isRead: true,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8939",
    ward: "Ward 14",
    badgeText: "Resolution Disputed",
    badgeVariant: "rose",
    metadata: {
      actorName: "Dr. Maya Patel",
      disputeReason: "Uneven asphalt compaction creating water ponding.",
    },
  },
  {
    id: "notif_08",
    type: "issue_reopened",
    title: "Issue Reopened for Inspection",
    message: "Municipal Quality Control verified community dispute and reopened work order CC-2026-8939 for mandatory re-compaction.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    issueId: "iss_8942",
    issueTrackingNumber: "CC-2026-8939",
    ward: "Ward 14",
    badgeText: "Issue Reopened",
    badgeVariant: "amber",
    metadata: {
      departmentName: "Municipal Quality & Audit Bureau",
    },
  },
];
