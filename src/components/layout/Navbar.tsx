"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCivicStore } from "@/lib/mockStore";
import { RoleSwitcher } from "./RoleSwitcher";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import {
  Activity,
  Menu,
  X,
  Sparkles,
  MapPin,
  Users,
  Layers,
  Bell,
  Home,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Globe,
} from "lucide-react";

export function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentUser, currentRole } = useCivicStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { label: "Home", href: isAuthenticated ? "/dashboard" : "/", icon: Home, matchPaths: ["/", "/dashboard", "/citizen"] },
    { label: "Map", href: "/map", icon: Globe, matchPaths: ["/map"] },
    { label: "Community", href: "/community", icon: Users, matchPaths: ["/community"] },
    { label: "My Reports", href: "/my-reports", icon: Layers, matchPaths: ["/my-reports"] },
    { label: "Notifications", href: "/notifications", icon: Bell, matchPaths: ["/notifications"] },
  ];

  const displayName = user?.displayName || "Google Citizen";
  const avatarUrl =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=06b6d4&color=020617&bold=true`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center space-x-2.5 group">
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

        {/* Center: Desktop Unified Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.matchPaths.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-900 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 font-semibold"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Persona Switcher, Notifications, Google Profile / Login */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Persona/Role Switcher (Desktop) */}
          <div className="hidden lg:block">
            <RoleSwitcher />
          </div>

          {/* Authentication State Section */}
          {isAuthenticated && user ? (
            /* Authenticated Google User Profile & Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all text-left shadow-sm group"
              >
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center justify-end gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified
                  </span>
                </div>

                <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-cyan-500/40 shadow-cyan-glow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-3 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {user.email || "Google Account"}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1 text-xs">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
                    >
                      <Home className="w-4 h-4 text-cyan-400" />
                      <span>Citizen Dashboard</span>
                    </Link>

                    <Link
                      href="/my-reports"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>My Reports</span>
                    </Link>

                    <Link
                      href="/report"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Report New Problem</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout from Google</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated: Continue with Google */
            <Link href="/login">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-sm"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Continue with Google</span>
                <span className="sm:hidden">Login</span>
              </button>
            </Link>
          )}

          {/* Get Started Button */}
          <Link href="/report">
            <Button
              variant="glow"
              size="sm"
              className="text-xs font-bold px-3.5 py-1.5 shadow-cyan-glow"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1 text-sm font-semibold">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <RoleSwitcher />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-xs font-semibold text-cyan-400">Continue with Google →</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
