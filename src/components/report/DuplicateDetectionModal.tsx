"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { DuplicateDetectionCard, DuplicateDetectionCardProps } from "./DuplicateDetectionCard";

export interface DuplicateDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userReport: DuplicateDetectionCardProps["userReport"];
  existingIssue?: DuplicateDetectionCardProps["existingIssue"];
  onViewExisting: (issueId: string) => void;
  onJoinExisting: (issueId: string) => void;
  onReportSeparately: () => void;
}

export function DuplicateDetectionModal({
  isOpen,
  onClose,
  userReport,
  existingIssue,
  onViewExisting,
  onJoinExisting,
  onReportSeparately,
}: DuplicateDetectionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
    >
      <DuplicateDetectionCard
        userReport={userReport}
        existingIssue={existingIssue}
        onViewExisting={(id) => {
          onClose();
          onViewExisting(id);
        }}
        onJoinExisting={(id) => {
          onClose();
          onJoinExisting(id);
        }}
        onReportSeparately={() => {
          onClose();
          onReportSeparately();
        }}
      />
    </Modal>
  );
}
