import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Brain,
  ShieldCheck,
  Building2,
  Zap,
  Lock,
  Compass,
  ArrowRight,
} from "lucide-react";

export function ExplanationSection() {
  const pillars = [
    {
      title: "Eliminating Bureaucratic Friction",
      description:
        "Traditional civic grievance systems take weeks to manually route emails. Central-City-AI's automated neural routing dispatches actionable repair work orders to the right field crew in under 2 minutes.",
      icon: Zap,
      badge: "Zero Delays",
      badgeColor: "cyan" as const,
    },
    {
      title: "Consensus-Powered Truth",
      description:
        "By harnessing localized community verification, we prevent false alerts, spam, and photo misuse while ensuring genuinely hazardous problems get immediate community upvotes and municipal fast-tracking.",
      icon: ShieldCheck,
      badge: "Anti-Spam Ledger",
      badgeColor: "purple" as const,
    },
    {
      title: "Uncompromising Accountability",
      description:
        "Every municipal department operates against transparent SLA resolution countdown timers with public photographic evidence required before any ticket can be officially closed.",
      icon: Building2,
      badge: "Public SLA Audit",
      badgeColor: "emerald" as const,
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="cyan" size="sm">
            Platform Mission
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            What is Central-City-AI?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Central-City-AI is an autonomous civic infrastructure platform bridging resident reporting, computer vision damage triage, localized community consensus, and municipal authority work-order execution into one high-velocity ecosystem.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                className="p-6 sm:p-7 space-y-4 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={pillar.badgeColor} size="sm">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-cyan-400 gap-1">
                  <span>Learn how it operates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
