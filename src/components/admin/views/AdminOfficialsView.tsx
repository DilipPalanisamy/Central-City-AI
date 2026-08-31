"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCivicStore } from "@/lib/mockStore";
import {
  ShieldCheck,
  Building2,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Award,
} from "lucide-react";

export function AdminOfficialsView() {
  const { addToast } = useCivicStore();
  const [searchTerm, setSearchTerm] = useState("");

  const officialsList = [
    {
      id: "off_01",
      name: "Eng. Marcus Vance",
      title: "Chief Municipal Dispatcher",
      department: "Public Works & Roads (PWD-RDS)",
      email: "m.vance@centralcity.gov",
      phone: "+1 (555) 019-2834",
      activeDispatches: 4,
      resolvedTotal: 142,
      slaCompliance: 98.4,
      status: "On Duty",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "off_02",
      name: "Technician Leo Rossi",
      title: "Senior Electrical & Grid Lead",
      department: "City Energy & Street Lighting Grid",
      email: "l.rossi@centralcity.gov",
      phone: "+1 (555) 019-5821",
      activeDispatches: 2,
      resolvedTotal: 98,
      slaCompliance: 99.1,
      status: "In Field",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "off_03",
      name: "Chief Inspector Sarah Jenkins",
      title: "Water Infrastructure Supervisor",
      department: "Department of Water & Sewerage",
      email: "s.jenkins@centralcity.gov",
      phone: "+1 (555) 019-4412",
      activeDispatches: 3,
      resolvedTotal: 114,
      slaCompliance: 94.2,
      status: "On Duty",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "off_04",
      name: "Commander David O'Connor",
      title: "Sanitation & HazMat Division Chief",
      department: "Environmental & Waste Sanitation",
      email: "d.oconnor@centralcity.gov",
      phone: "+1 (555) 019-7733",
      activeDispatches: 1,
      resolvedTotal: 86,
      slaCompliance: 91.8,
      status: "On Call",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const filtered = officialsList.filter((off) => {
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      return off.name.toLowerCase().includes(q) || off.department.toLowerCase().includes(q) || off.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Municipal Field Officers & Dispatchers ({filtered.length})
          </h2>
          <p className="text-xs text-slate-400">
            Monitor public works crew leaders, field unit assignments, and SLA turnaround scores.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search officials by name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Officials Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <th className="pb-3 px-3">Officer Name & Title</th>
              <th className="pb-3 px-3">Assigned Department</th>
              <th className="pb-3 px-3">Contact Details</th>
              <th className="pb-3 px-3">Active Crews</th>
              <th className="pb-3 px-3">SLA Compliance</th>
              <th className="pb-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((officer) => (
              <tr key={officer.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-3">
                    <Avatar name={officer.name} src={officer.avatar} role="authority" size="sm" />
                    <div>
                      <span className="font-bold text-white block">{officer.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{officer.title}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3 text-slate-300 font-semibold">
                  {officer.department}
                </td>

                <td className="py-3 px-3 text-[11px] text-slate-400 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>{officer.email}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{officer.phone}</span>
                  </div>
                </td>

                <td className="py-3 px-3 font-mono">
                  <span className="text-indigo-400 font-bold">{officer.activeDispatches} Deployed</span>
                  <span className="text-slate-500 text-[10px] block font-mono">
                    {officer.resolvedTotal} Resolved Lifetime
                  </span>
                </td>

                <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                  {officer.slaCompliance}% On-Time
                </td>

                <td className="py-3 px-3 text-right">
                  <Badge variant={officer.status === "On Duty" ? "emerald" : "cyan"} size="sm">
                    {officer.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
