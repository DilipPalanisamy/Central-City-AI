"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import {
  CivicIssue,
  CivicUser,
  DepartmentId,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  UserRole,
  CivicComment,
  SupportingEvidence,
  CivicNotification,
} from "@/types";
import { MOCK_ISSUES } from "@/data/mockIssues";
import { MOCK_USERS } from "@/data/mockUsers";
import { MOCK_NOTIFICATIONS } from "@/data/mockNotifications";

interface CivicStoreContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: CivicUser;
  issues: CivicIssue[];
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  filterCategory: IssueCategory | "all";
  setFilterCategory: (cat: IssueCategory | "all") => void;
  filterStatus: IssueStatus | "all";
  setFilterStatus: (status: IssueStatus | "all") => void;
  filterSeverity: IssueSeverity | "all";
  setFilterSeverity: (sev: IssueSeverity | "all") => void;
  sortBy: "affected" | "priority" | "newest" | "sla";
  setSortBy: (sort: "affected" | "priority" | "newest" | "sla") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  upvoteIssue: (issueId: string) => void;
  toggleAffected: (
    issueId: string,
    userUid?: string,
    userName?: string,
    userAvatar?: string
  ) => void;
  addComment: (issueId: string, content: string) => void;
  verifyIssue: (issueId: string, notes?: string) => void;
  dispatchDepartment: (issueId: string, deptId: DepartmentId, officerName: string) => void;
  resolveIssue: (issueId: string, resolvedImageUrl?: string) => void;
  addNewIssue: (newIssue: Partial<CivicIssue>) => CivicIssue;
  
  // Notification Management State
  notifications: CivicNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markNotificationAsUnread: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  
  toasts: { id: string; title: string; message: string; type: "success" | "info" | "warning" }[];
  dismissToast: (id: string) => void;
  addToast: (title: string, message: string, type?: "success" | "info" | "warning") => void;
}

const CivicStoreContext = createContext<CivicStoreContextType | undefined>(undefined);

export function CivicStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("citizen");
  const [issues, setIssues] = useState<CivicIssue[]>(MOCK_ISSUES);
  const [notifications, setNotifications] = useState<CivicNotification[]>(MOCK_NOTIFICATIONS);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<IssueCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<IssueSeverity | "all">("all");
  const [sortBy, setSortBy] = useState<"affected" | "priority" | "newest" | "sla">("affected");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toasts, setToasts] = useState<
    { id: string; title: string; message: string; type: "success" | "info" | "warning" }[]
  >([]);

  const currentUser = MOCK_USERS[currentRole] || MOCK_USERS.citizen;

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markNotificationAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast("All Read", "All notifications marked as read.", "info");
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addToast = (
    title: string,
    message: string,
    type: "success" | "info" | "warning" = "info"
  ) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const upvoteIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const isUpvoted = iss.hasUserUpvoted;
          return {
            ...iss,
            hasUserUpvoted: !isUpvoted,
            upvotesCount: isUpvoted ? iss.upvotesCount - 1 : iss.upvotesCount + 1,
          };
        }
        return iss;
      })
    );
    addToast("Vote Recorded", "Your community vote has been registered.", "success");
  };

  // Primary Community Interaction: "I'M AFFECTED"
  const toggleAffected = (
    issueId: string,
    userUid?: string,
    userName?: string,
    userAvatar?: string
  ) => {
    const voterId = userUid || currentUser.id;
    const voterName = userName || currentUser.name;
    const voterPhoto = userAvatar || currentUser.avatarUrl;

    let actionTaken: "voted" | "unvoted" = "voted";

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const currentVoterUids = iss.voterUids || [];
          const hasVoted = currentVoterUids.includes(voterId) || (iss.hasUserMarkedAffected && currentVoterUids.length === 0);

          let nextVoterUids: string[];
          let nextCount: number;

          if (hasVoted) {
            actionTaken = "unvoted";
            nextVoterUids = currentVoterUids.filter((id) => id !== voterId);
            nextCount = Math.max(0, iss.affectedCount - 1);
          } else {
            actionTaken = "voted";
            nextVoterUids = [...currentVoterUids, voterId];
            nextCount = iss.affectedCount + 1;
          }

          const isThresholdReached = nextCount >= (iss.affectedThreshold || 5);

          return {
            ...iss,
            hasUserMarkedAffected: !hasVoted,
            voterUids: nextVoterUids,
            affectedCount: nextCount,
            // CRITICAL: We do NOT modify iss.severityScore or iss.aiAnalysis.priorityScore or iss.severity!
            timeline: hasVoted
              ? iss.timeline
              : [
                  ...iss.timeline,
                  {
                    id: `tl_aff_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    actor: {
                      name: voterName,
                      role: "citizen",
                      avatarUrl: voterPhoto,
                    },
                    action: `Citizen Endorsement (#${nextCount})`,
                    description: `${voterName} endorsed community impact for escalation.`,
                    badge: isThresholdReached ? "Escalation Quorum Met" : undefined,
                  },
                ],
          };
        }
        return iss;
      })
    );

    if (actionTaken === "voted") {
      addToast(
        "Impact Signal Registered",
        "Your '👍 I'M AFFECTED' endorsement has been added to the neighborhood escalation count.",
        "success"
      );
    } else {
      addToast(
        "Impact Signal Removed",
        "Your endorsement has been removed from this issue.",
        "info"
      );
    }
  };

  const addComment = (issueId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: CivicComment = {
      id: `cmt_${Date.now()}`,
      author: {
        name: currentUser.name,
        role: currentUser.role,
        avatarUrl: currentUser.avatarUrl,
        badgeTitle: currentUser.badgeTitle,
      },
      timestamp: new Date().toISOString(),
      content: content.trim(),
      upvotes: 1,
      isOfficialResponse: currentUser.role === "authority",
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            commentsCount: (iss.commentsCount || 0) + 1,
            comments: [...(iss.comments || []), newComment],
          };
        }
        return iss;
      })
    );

    addToast("Community Note Added", "Your observation has been posted to the public ledger.", "success");
  };

  const verifyIssue = (issueId: string, notes?: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const newVerification = {
            userId: currentUser.id,
            userName: currentUser.name,
            userBadge: currentUser.badgeTitle,
            verifiedAt: new Date().toISOString(),
            isConfirmed: true,
            notes: notes || "Physically inspected and verified community report.",
            reputationWeight: 95,
          };

          const updatedVerifications = [...iss.verifications, newVerification];
          const newStatus: IssueStatus =
            iss.status === "reported" || iss.status === "ai_analyzed"
              ? "community_verified"
              : iss.status;

          return {
            ...iss,
            status: newStatus,
            verifications: updatedVerifications,
            timeline: [
              ...iss.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: {
                  name: currentUser.name,
                  role: "verifier",
                  avatarUrl: currentUser.avatarUrl,
                },
                action: "Community Verification Added",
                description: notes || "Report authenticity verified by certified civic guardian.",
                badge: "Verified",
              },
            ],
          };
        }
        return iss;
      })
    );
    addToast(
      "Verification Recorded",
      `Thank you ${currentUser.name}! You earned +25 Civic Karma for verifying this alert.`,
      "success"
    );
  };

  const dispatchDepartment = (
    issueId: string,
    deptId: DepartmentId,
    officerName: string
  ) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "authority_dispatched",
            departmentAssigned: {
              id: deptId,
              name: "Public Works & City Response Team",
              assignedOfficer: officerName,
              slaHours: 8,
              dispatchedAt: new Date().toISOString(),
            },
            timeline: [
              ...iss.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: {
                  name: currentUser.name,
                  role: "authority",
                  avatarUrl: currentUser.avatarUrl,
                },
                action: `Field Unit Dispatched (${officerName})`,
                description: "Official municipal crew deployed with priority SLA.",
                badge: "Dispatched",
              },
            ],
          };
        }
        return iss;
      })
    );
    addToast("Field Crew Dispatched", `Crew assigned under ${officerName}. SLA timer started.`, "info");
  };

  const resolveIssue = (issueId: string, resolvedImageUrl?: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "resolved",
            media: {
              ...iss.media,
              resolvedImageUrl:
                resolvedImageUrl ||
                "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80",
            },
            timeline: [
              ...iss.timeline,
              {
                id: `tl_${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: {
                  name: currentUser.name,
                  role: "authority",
                  avatarUrl: currentUser.avatarUrl,
                },
                action: "Issue Marked as Resolved",
                description: "Field repairs completed and quality inspected. Citizen notified.",
                badge: "Resolved",
              },
            ],
          };
        }
        return iss;
      })
    );
    addToast("Issue Resolved", "Case marked resolved. Public transparency ledger updated.", "success");
  };

  const addNewIssue = (newIssueData: Partial<CivicIssue>): CivicIssue => {
    const id = `iss_${Date.now()}`;
    const trackingNumber = `CCA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const category = newIssueData.category || "road_damage";
    const severity = newIssueData.severity || "high";
    const severityScore = newIssueData.severityScore ?? (severity === "critical" ? 89 : severity === "high" ? 72 : 45);

    const issue: CivicIssue = {
      id,
      trackingNumber,
      title: newIssueData.title || "Civic Hazard Alert",
      description: newIssueData.description || "Reported via Central-City-AI Mobile Reporting Kiosk.",
      category,
      severity,
      severityScore,
      actionRequired: newIssueData.actionRequired || "Repair damaged section and restore safe public access.",
      status: "ai_analyzed",
      location: newIssueData.location || {
        lat: 11.0234,
        lng: 77.4512,
        address: "Avinashipalayam, Tamil Nadu",
        ward: "Ward 14",
        zone: "Tiruppur District",
      },
      reportedBy: newIssueData.reportedBy || {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        isAnonymous: false,
        civicKarma: currentUser.civicKarma,
      },
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media: {
        primaryImageUrl:
          newIssueData.media?.primaryImageUrl ||
          "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
      },
      aiAnalysis: {
        confidence: newIssueData.aiAnalysis?.confidence ?? 0.91,
        detectedCategory: newIssueData.aiAnalysis?.detectedCategory || category,
        suggestedSeverity: severity,
        estimatedCostMin: 250,
        estimatedCostMax: 600,
        currency: "USD",
        estimatedResolutionHours: severity === "critical" ? 2 : severity === "high" ? 6 : 24,
        rootCauseHypothesis: newIssueData.aiAnalysis?.rootCauseHypothesis || "Analyzed via Central-City-AI vision triage engine.",
        recommendedDepartment: "dept_roads",
        priorityScore: severityScore,
        aiModelVersion: "CityVision-v4.2-Pro",
      },
      verifications: [],
      upvotesCount: 1,
      hasUserUpvoted: true,
      affectedCount: 1,
      affectedThreshold: 5,
      hasUserMarkedAffected: true,
      commentsCount: 0,
      comments: [],
      supportingEvidence: [],
      timeline: [
        {
          id: `tl_${Date.now()}_1`,
          timestamp: new Date().toISOString(),
          actor: {
            name: newIssueData.reportedBy?.name || currentUser.name,
            role: "citizen",
            avatarUrl: newIssueData.reportedBy?.avatarUrl || currentUser.avatarUrl,
          },
          action: "Citizen Report Submitted",
          description: `Geo-tagged evidence photo and location registered at ${newIssueData.location?.address || "Avinashipalayam"}.`,
        },
        {
          id: `tl_${Date.now()}_2`,
          timestamp: new Date().toISOString(),
          actor: {
            name: "Central City AI Engine",
            role: "system_ai",
          },
          action: "Instant AI Vision Analysis",
          description: `Processed: ${String(category).replace("_", " ")} classified with severity ${severityScore}/100.`,
          badge: `AI ${Math.round((newIssueData.aiAnalysis?.confidence ?? 0.91) * 100)}%`,
        },
      ],
    };

    setIssues((prev) => [issue, ...prev]);

    // Also auto-append a new notification for report submitted
    const newNotif: CivicNotification = {
      id: `notif_${Date.now()}`,
      type: "report_submitted",
      title: "Report Registered on Civic Ledger",
      message: `Your hazard report ${trackingNumber} (${issue.title}) has been verified and registered.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      issueId: id,
      issueTrackingNumber: trackingNumber,
      ward: issue.location.ward,
      badgeText: "Report Submitted",
      badgeVariant: "cyan",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return issue;
  };

  return (
    <CivicStoreContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        issues,
        selectedIssueId,
        setSelectedIssueId,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        filterSeverity,
        setFilterSeverity,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        upvoteIssue,
        toggleAffected,
        addComment,
        verifyIssue,
        dispatchDepartment,
        resolveIssue,
        addNewIssue,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markNotificationAsUnread,
        markAllNotificationsAsRead,
        clearNotification,
        toasts,
        dismissToast,
        addToast,
      }}
    >
      {children}
    </CivicStoreContext.Provider>
  );
}

export function useCivicStore() {
  const context = useContext(CivicStoreContext);
  if (!context) {
    throw new Error("useCivicStore must be used within a CivicStoreProvider");
  }
  return context;
}
