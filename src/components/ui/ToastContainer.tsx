"use client";

import React from "react";
import { useCivicStore } from "@/lib/mockStore";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = useCivicStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-xl flex items-start space-x-3 transition-all duration-300 animate-in slide-in-from-bottom-5",
            toast.type === "success" &&
              "bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-glow",
            toast.type === "warning" &&
              "bg-slate-900/95 border-amber-500/40 text-amber-300 shadow-amber-glow",
            toast.type === "info" &&
              "bg-slate-900/95 border-cyan-500/40 text-cyan-300 shadow-cyan-glow"
          )}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
