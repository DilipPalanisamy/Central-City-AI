"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { CivicIssue } from "@/types";
import { useCivicStore } from "@/lib/mockStore";
import {
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  Shield,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: CivicIssue | null;
}

export function DispatchModal({ isOpen, onClose, issue }: DispatchModalProps) {
  const { dispatchDepartment } = useCivicStore();
  const [selectedCrew, setSelectedCrew] = useState("Truck #14 (Heavy Asphalt Patch Unit)");
  const [assignedOfficer, setAssignedOfficer] = useState("Chief Eng. Marcus Vance");
  const [slaHours, setSlaHours] = useState("6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!issue) return null;

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      dispatchDepartment(issue.id, "dept_roads", `${assignedOfficer} - ${selectedCrew}`);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Authorize Municipal Field Dispatch"
      description={`Work Order for ${issue.trackingNumber} • ${issue.location.address}`}
      maxWidth="xl"
    >
      <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
        {/* Incident Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-cyan-400 font-bold">{issue.trackingNumber}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
              {issue.severity.toUpperCase()} PRIORITY
            </span>
          </div>
          <h4 className="text-sm font-bold text-white leading-tight">{issue.title}</h4>
          <p className="text-slate-400">{issue.location.address} • {issue.location.ward}</p>
        </div>

        {/* Dispatch Configuration Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">
              Assigned Field Crew Unit
            </label>
            <select
              value={selectedCrew}
              onChange={(e) => setSelectedCrew(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="Truck #14 (Heavy Asphalt Patch Unit)">
                Truck #14 (Heavy Asphalt Patch Unit) - Available
              </option>
              <option value="Unit 3B (Hydraulic Excavator Crew)">
                Unit 3B (Hydraulic Excavator Crew) - 10m away
              </option>
              <option value="Sanitation HazMat Sweeper Unit #07">
                Sanitation HazMat Sweeper Unit #07 - Standby
              </option>
              <option value="Grid Power Bucket Truck #22">
                Grid Power Bucket Truck #22 - Available
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Command Dispatcher
              </label>
              <input
                type="text"
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3 py-2"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Target Resolution SLA
              </label>
              <select
                value={slaHours}
                onChange={(e) => setSlaHours(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3 py-2"
              >
                <option value="4">Emergency: 4 Hours</option>
                <option value="6">High Priority: 6 Hours</option>
                <option value="12">Standard: 12 Hours</option>
                <option value="24">Standard: 24 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="glow"
            size="md"
            disabled={isSubmitting}
            leftIcon={<Truck className="w-4 h-4" />}
          >
            {isSubmitting ? "Deploying Unit..." : "Confirm & Deploy Field Unit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
