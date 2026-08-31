"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCivicStore } from "@/lib/mockStore";
import { NotificationItem } from "./NotificationItem";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Layers,
  Inbox,
} from "lucide-react";

export function NotificationDropdown() {
  const {
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
  } = useCivicStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const previewNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
      >
        <Bell className="w-5 h-5" />

        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white font-mono text-[10px] font-black flex items-center justify-center shadow-rose-glow animate-pulse">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Civic Notifications
              </span>
              {unreadNotificationsCount > 0 && (
                <Badge variant="rose" size="sm">
                  {unreadNotificationsCount} Unread
                </Badge>
              )}
            </div>

            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* List of Recent Notifications */}
          <div className="max-h-[380px] overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-800/40">
            {previewNotifications.length > 0 ? (
              previewNotifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  compact
                  onCloseDropdown={() => setIsOpen(false)}
                />
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">All notifications cleared</p>
              </div>
            )}
          </div>

          {/* Footer with Link to Full Notification Page */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-colors py-1"
            >
              <span>View Full Notification Center ({notifications.length})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
