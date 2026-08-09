import React from "react";
import { Link } from "react-router-dom";
import { Building, Compass, ListFilter, Calendar, Sliders, ChevronLeft, ChevronRight, Globe, LogOut, Shield } from "lucide-react";
import { adminTranslations } from "../translations";
import type { SupportedLang } from "../types";
import SalleHubLogo from "./SalleHubLogo";

interface AdminSidebarProps {
  currentView: string;
  lang: SupportedLang;
  sidebarCollapsed: boolean;
  adminLangDropdownOpen: boolean;
  stats: { pendingBookings: number };
  onNavigate: (view: string) => void;
  onSetSidebarCollapsed: (collapsed: boolean) => void;
  onSetLang: (lang: SupportedLang) => void;
  onSetAdminLangDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onLogout: () => void;
  isSuperAdmin?: boolean;
}

export default function AdminSidebar({
  currentView,
  lang,
  sidebarCollapsed,
  adminLangDropdownOpen,
  stats,
  onNavigate,
  onSetSidebarCollapsed,
  onSetLang,
  onSetAdminLangDropdownOpen,
  onLogout,
  isSuperAdmin = false
}: AdminSidebarProps) {
  const tSidebar = adminTranslations[lang] || adminTranslations["EN"];

  const navItems = [
    ...(isSuperAdmin ? [{ view: "superadmin-dashboard", label: tSidebar.superAdmin, icon: Shield, path: "/admin/super" }] : []),
    { view: "admin-dashboard", label: tSidebar.overview, icon: Compass, path: "/admin/dashboard" },
    { view: "admin-halls", label: tSidebar.hallMgmt, icon: Building, path: "/admin/halls" },
    { view: "admin-bookings", label: tSidebar.bookingsFeed, icon: ListFilter, badge: stats.pendingBookings > 0 ? stats.pendingBookings : null, path: "/admin/bookings" },
    { view: "admin-calendar", label: tSidebar.schedule, icon: Calendar, path: "/admin/calendar" },
    { view: "admin-settings", label: tSidebar.settings, icon: Sliders, path: "/admin/settings" }
  ];

  return (
    <aside className={`hidden md:flex md:flex-col bg-navy-950 text-white border-r border-navy-800 h-screen p-5 shrink-0 transition-all duration-300 ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`}>
      {/* Top Branding Section (Pinned) */}
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 text-white rounded-lg">
                  <SalleHubLogo size={20} className="text-white" />
                </div>
                <div className="text-left animate-in fade-in duration-200">
                  <h1 className="text-base font-black tracking-[0.18em] font-serif">ChurchTrack</h1>
                  <span className="text-[8px] text-white/50 uppercase font-semibold tracking-[0.24em] block">Parish Control</span>
                </div>
              </div>
              <button
                onClick={() => onSetSidebarCollapsed(true)}
                className="flex items-center justify-center p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full animate-in fade-in duration-200">
              <div className="p-2 bg-white/10 text-white rounded-lg" title="ChurchTrack Parish Control">
                <SalleHubLogo size={20} className="text-white" />
              </div>
              <button
                onClick={() => onSetSidebarCollapsed(false)}
                className="flex items-center justify-center p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition w-8 h-8 cursor-pointer"
                title="Expand Sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu Section */}
      <div className="mt-8 flex-1 space-y-3">
        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] px-3 mb-2">
            Navigation
          </p>
        )}
        <nav className="space-y-1 text-left" id="admin-sidebar-nav" role="navigation" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <Link
                key={item.view}
                to={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition uppercase tracking-[0.14em] cursor-pointer ${sidebarCollapsed ? "md:justify-center md:px-2" : ""} ${isActive
                  ? "bg-white text-navy-950"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                id={`sidebar-link-${item.view}`}
                title={sidebarCollapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span className={sidebarCollapsed ? "md:hidden" : ""}>{item.label}</span>
                </div>
                {item.badge && !sidebarCollapsed && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isActive ? "bg-navy-100 text-navy-800" : "bg-white/10 text-white"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pinned Bottom Section */}
      <div className="shrink-0 border-t border-white/10 pt-4 mt-auto space-y-3">
        <div className={`relative flex items-center justify-between px-2 text-xs font-semibold text-white/50 ${sidebarCollapsed ? "md:flex-col md:items-center md:gap-2" : ""}`} id="admin-lang-dropdown-container">
          <span className={sidebarCollapsed ? "md:hidden" : "text-white/50 text-[11px]"}>Language</span>
          <button
            onClick={() => onSetAdminLangDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white/80 transition cursor-pointer"
            aria-label="Change language"
            aria-expanded={adminLangDropdownOpen ? "true" : "false"}
          >
            <Globe className="w-3 h-3" />
            <span>{lang}</span>
          </button>
          {adminLangDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => onSetAdminLangDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-36 bg-navy-900 border border-navy-800 rounded-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {[
                  { code: "EN", label: "English", flag: "🇺🇸" },
                  { code: "FR", label: "Français", flag: "🇫🇷" },
                  { code: "RW", label: "Kinyarwanda", flag: "🇷🇼" }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onSetLang(item.code as SupportedLang);
                      onSetAdminLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-navy-800 transition text-left cursor-pointer ${lang === item.code ? "text-white bg-navy-800" : "text-white/70"
                      }`}
                  >
                    <span className="text-sm">{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className={sidebarCollapsed ? "md:hidden" : ""}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
