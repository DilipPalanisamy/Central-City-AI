"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCivicStore } from "@/lib/mockStore";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Award,
  MoreVertical,
  CheckCircle2,
  Ban,
  UserCheck,
} from "lucide-react";

export function AdminUsersView() {
  const { addToast } = useCivicStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const mockUsersList = [
    {
      id: "usr_101",
      name: "Alex Rivera",
      email: "alex.rivera@civicnet.org",
      role: "citizen",
      ward: "Ward 14 (Metro Central)",
      karma: 840,
      reports: 12,
      verifications: 4,
      status: "Active",
      badgeTitle: "Neighborhood Sentinel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_102",
      name: "Dr. Maya Patel",
      email: "maya.patel@cityhealth.gov",
      role: "verifier",
      ward: "Ward 12 (Old Town)",
      karma: 2450,
      reports: 28,
      verifications: 64,
      status: "Active",
      badgeTitle: "Master Civic Guardian",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_103",
      name: "Samira Khan",
      email: "samira.k@neighborhood.org",
      role: "citizen",
      ward: "Ward 14 (Metro Central)",
      karma: 620,
      reports: 8,
      verifications: 2,
      status: "Active",
      badgeTitle: "Active Contributor",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_104",
      name: "Carlos Mendez",
      email: "carlos.m@bayview.net",
      role: "verifier",
      ward: "Ward 04 (Bayfront)",
      karma: 1890,
      reports: 19,
      verifications: 42,
      status: "Active",
      badgeTitle: "Senior Verifier",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_105",
      name: "Jordan Lee",
      email: "jordan.lee@citytransit.com",
      role: "citizen",
      ward: "Ward 07 (Sunset)",
      karma: 310,
      reports: 4,
      verifications: 1,
      status: "Active",
      badgeTitle: "Civic Scout",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const filtered = mockUsersList.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.ward.toLowerCase().includes(q);
    }
    return true;
  });

  const handleGrantVerifier = (name: string) => {
    addToast("Badge Granted", `Granted Certified Verifier credentials to ${name}.`, "success");
  };

  const handleSuspend = (name: string) => {
    addToast("User Suspended", `Suspended civic posting permissions for ${name}.`, "warning");
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Citizen & Verifier Directory ({filtered.length})
          </h2>
          <p className="text-xs text-slate-400">
            Manage citizen accounts, reputation weights, and certified community verifiers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search citizens by name or ward..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="citizen">Citizens</option>
            <option value="verifier">Civic Guardians</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-glass overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <th className="pb-3 px-3">Citizen / Profile</th>
              <th className="pb-3 px-3">Role & Badge</th>
              <th className="pb-3 px-3">Ward Jurisdiction</th>
              <th className="pb-3 px-3">Civic Karma</th>
              <th className="pb-3 px-3">Activity Stats</th>
              <th className="pb-3 px-3 text-right">Governance Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-3">
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    <div>
                      <span className="font-bold text-white block">{user.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3">
                  <Badge variant={user.role === "verifier" ? "purple" : "cyan"} size="sm">
                    {user.badgeTitle}
                  </Badge>
                </td>

                <td className="py-3 px-3 text-slate-300">
                  {user.ward}
                </td>

                <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                  +{user.karma} pts
                </td>

                <td className="py-3 px-3 text-[11px] text-slate-400">
                  <span>{user.reports} Reports</span> • <span>{user.verifications} Verified</span>
                </td>

                <td className="py-3 px-3 text-right space-x-2 whitespace-nowrap">
                  {user.role !== "verifier" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGrantVerifier(user.name)}
                      className="text-[11px] text-purple-300 hover:text-white"
                      leftIcon={<ShieldCheck className="w-3 h-3" />}
                    >
                      Make Verifier
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSuspend(user.name)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                    title="Suspend User"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
