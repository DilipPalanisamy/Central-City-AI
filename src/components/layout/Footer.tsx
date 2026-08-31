"use client";

import React from "react";
import Link from "next/link";
import { Activity, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top: Brand, Tagline, and Navigation Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                Central-City<span className="text-cyan-400">-AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs italic max-w-md">
              &ldquo;See the Problem. AI Understands. Communities Verify. Authorities Resolve.&rdquo;
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Central-City-AI
            </Link>
            <Link href="/#about" className="hover:text-cyan-400 transition-colors">
              About
            </Link>
            <Link href="/#how-it-works" className="hover:text-cyan-400 transition-colors">
              How It Works
            </Link>
            <Link href="/community" className="hover:text-cyan-400 transition-colors">
              Community
            </Link>
            <a href="mailto:support@centralcity.ai" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
            <Link href="/#privacy" className="hover:text-cyan-400 transition-colors">
              Privacy
            </Link>
            <Link href="/#terms" className="hover:text-cyan-400 transition-colors">
              Terms
            </Link>
          </nav>
        </div>

        {/* Bottom Strip: Prototype details */}
        <div className="pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Central-City-AI. Production-Grade Prototype (Phase 1).</p>
          <div className="flex items-center space-x-4">
            <span>Next.js 14 • React • Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
