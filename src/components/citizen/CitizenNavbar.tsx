"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCivicStore } from "@/lib/mockStore";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import {
  Activity,
  MapPin,
  Users,
  Layers,
  Bell,
  Home,
  Menu,
  X,
  Sparkles,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export interface CitizenNavbarProps {
  onOpenReportModal?: () => void;
}

export function CitizenNavbar({ onOpenReportModal }: CitizenNavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currentUser, currentRole } = useCivicStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  const displayName = user?.displayName || currentUser.name || "Google Citizen";
  const avatarUrl =
    user?.photoURL ||
    currentUser.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=06b6d4&color=020617&bold=true`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Central-City-AI Logo */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
                Central-City<span className="text-cyan-400">-AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Top Navigation (Home, Map, Community, My Reports, Notifications) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/citizen#map-section"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map</span>
          </Link>
          <Link
            href="/community"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community</span>
          </Link>
          <Link
            href="/citizen#my-reports"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900/80 border border-slate-800 transition-colors flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>My Reports</span>
          </Link>
          <Link
            href="/notifications"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Notifications</span>
          </Link>
        </nav>

        {/* Right: Notifications, Persona, and Profile Avatar */}
        <div className="flex items-center space-x-3">
          <NotificationDropdown />

          <div className="hidden lg:block">
            <RoleSwitcher />
          </div>

          {/* Profile Avatar & Dropdown */}
          <div className="relative pl-2 border-l border-slate-800" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 p-1 rounded-2xl hover:bg-slate-900 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-cyan-500/40 shadow-cyan-glow shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-white block leading-tight max-w-[120px] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono block">
                  +{currentUser.civicKarma || 840} Karma
                </span>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-3 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-xs font-bold text-white block truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {user?.email || "Google Authenticated"}
                  </span>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1 text-sm font-semibold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              Home
            </Link>
            <Link
              href="/citizen#map-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              Map
            </Link>
            <Link
              href="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              Community
            </Link>
            <Link
              href="/citizen#my-reports"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white bg-slate-900"
            >
              My Reports
            </Link>
            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              Notifications
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <RoleSwitcher />
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
