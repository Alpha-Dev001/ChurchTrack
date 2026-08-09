import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { UserCheck, Globe, Menu, X, ArrowRight } from "lucide-react";
import { navbarTranslations } from "../translations";
import type { SupportedLang } from "../types";
import SalleHubLogo from "./SalleHubLogo";

interface NavbarProps {
  currentView: string;
  lang: SupportedLang;
  adminToken: string | null;
  mobileMenuOpen: boolean;
  langDropdownOpen: boolean;
  onNavigate: (view: string) => void;
  onSetLang: (lang: SupportedLang) => void;
  onSetMobileMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onSetLangDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Navbar({
  currentView,
  lang,
  adminToken,
  mobileMenuOpen,
  langDropdownOpen,
  onNavigate,
  onSetLang,
  onSetMobileMenuOpen,
  onSetLangDropdownOpen
}: NavbarProps) {
  const tNavbar = navbarTranslations[lang] || navbarTranslations["EN"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-navy-200 transition-all shrink-0" id="public-header-navigation">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Branding Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          id="brand-logo-btn"
          aria-label="ChurchTrack Home"
        >
          <div className="p-2 bg-navy-950 text-white rounded-lg">
            <SalleHubLogo size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-black tracking-[0.18em] text-navy-950 font-serif leading-none">ChurchTrack</h1>
            <span className="text-[9px] text-navy-500 font-semibold uppercase tracking-[0.24em] leading-none block mt-0.5">Parish Services</span>
          </div>
        </Link>

        {/* Public Links */}
        <nav className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-navy-600 tracking-[0.14em] uppercase font-sans" role="navigation" aria-label="Main navigation">
          {[
            { key: "visitor-wedding-landing", label: tNavbar.weddings, id: "nav-link-weddings", path: "/weddings" },
            { key: "visitor-sallehub", label: tNavbar.halls, id: "nav-link-sallehub", path: "/sallehub" },
          ].map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`px-3.5 py-2 rounded-lg transition ${currentView === item.key ? "bg-navy-950 text-white" : "hover:text-navy-950 hover:bg-navy-50"}`}
              id={item.id}
              aria-current={currentView === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          {adminToken ? (
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-2 rounded-lg text-navy-600 hover:bg-navy-50 font-semibold flex items-center gap-1.5 transition"
              id="nav-link-admin-panel"
            >
              <UserCheck className="w-4 h-4" />
              <span>{tNavbar.adminPanel}</span>
            </Link>
          ) : (
            <Link
              to="/admin"
              className={`px-3.5 py-2 rounded-lg transition ${currentView === "admin-login" ? "bg-navy-950 text-white" : "hover:text-navy-950 hover:bg-navy-50"}`}
              id="nav-link-admin-login"
            >
              {tNavbar.adminLogin}
            </Link>
          )}
        </nav>

        {/* Actions (Language dropdown & CTA trigger) */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Dropdown */}
          <div className="relative" id="lang-dropdown-container">
            <button
              onClick={() => onSetLangDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 border border-navy-200 bg-white hover:bg-navy-50 px-2.5 py-1.5 sm:px-3 rounded-lg text-xs font-semibold text-navy-700 transition cursor-pointer min-touch"
              id="lang-switcher-btn"
              aria-label="Change language"
              aria-expanded={langDropdownOpen ? "true" : "false"}
            >
              <Globe className="w-3.5 h-3.5 text-navy-500" />
              <span>{lang === "EN" ? "EN" : lang === "FR" ? "FR" : "RW"}</span>
            </button>
            <AnimatePresence>
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => onSetLangDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-navy-200 rounded-lg z-40 py-1 overflow-hidden"
                  >
                    {[
                      { code: "EN", label: "English", flag: "🇺🇸" },
                      { code: "FR", label: "Français", flag: "🇫🇷" },
                      { code: "RW", label: "Kinyarwanda", flag: "🇷🇼" }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          onSetLang(item.code as SupportedLang);
                          onSetLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-navy-50 transition text-left cursor-pointer ${lang === item.code ? "text-navy-950 bg-navy-50" : "text-navy-700"
                          }`}
                      >
                        <span className="text-sm">{item.flag}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Booking CTA button - hidden on mobile, visible on sm and up */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/catalogue" className="border border-navy-200 hover:bg-navy-50 text-navy-950 text-[10px] font-semibold px-3 py-2.5 rounded-lg transition tracking-[0.12em] uppercase cursor-pointer">{tNavbar.bookHall}</Link>
            <Link to="/weddings/book" className="bg-navy-950 hover:bg-navy-900 text-white text-[10px] font-semibold px-3 py-2.5 rounded-lg transition tracking-[0.12em] uppercase cursor-pointer">{tNavbar.bookWedding}</Link>
          </div>

          {/* Responsive Hamburger Toggle Button */}
          <button
            onClick={() => onSetMobileMenuOpen(prev => !prev)}
            className="flex md:hidden items-center justify-center p-2.5 rounded-lg border border-navy-200 bg-white text-navy-700 transition min-touch"
            id="hamburger-menu-btn"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen ? "true" : "false"}
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-16 bg-navy-950/30 z-40 md:hidden"
              onClick={() => onSetMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 md:hidden bg-white border-b border-navy-200 z-50 overflow-hidden"
              id="mobile-navigation-drawer"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1 flex flex-col text-left">
                <Link
                  to="/"
                  onClick={() => onSetMobileMenuOpen(false)}
                  className={`px-3.5 py-3 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${currentView === "visitor-home" ? "bg-navy-950 text-white" : "text-navy-700 hover:bg-navy-50"
                    }`}
                >
                  {tNavbar.home}
                </Link>
                <Link
                  to="/weddings"
                  onClick={() => onSetMobileMenuOpen(false)}
                  className={`px-3.5 py-3 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${currentView === "visitor-wedding-landing" ? "bg-navy-950 text-white" : "text-navy-700 hover:bg-navy-50"
                    }`}
                >
                  {tNavbar.weddings}
                </Link>
                <Link
                  to="/sallehub"
                  onClick={() => onSetMobileMenuOpen(false)}
                  className={`px-3.5 py-3 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${currentView === "visitor-sallehub" ? "bg-navy-950 text-white" : "text-navy-700 hover:bg-navy-50"
                    }`}
                >
                  {tNavbar.halls}
                </Link>

                {adminToken ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => onSetMobileMenuOpen(false)}
                    className="px-3.5 py-3 rounded-lg text-xs font-semibold text-left text-navy-700 hover:bg-navy-50 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{tNavbar.adminPanel}</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin"
                    onClick={() => onSetMobileMenuOpen(false)}
                    className={`px-3.5 py-3 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${currentView === "admin-login" ? "bg-navy-950 text-white" : "text-navy-700 hover:bg-navy-50"
                      }`}
                  >
                    {tNavbar.adminLogin}
                  </Link>
                )}

                <div className="border-t border-navy-200 pt-3 mt-1 grid grid-cols-2 gap-2">
                  <Link to="/catalogue" onClick={() => onSetMobileMenuOpen(false)} className="w-full text-center border border-navy-200 hover:bg-navy-50 text-navy-950 text-[10px] font-semibold py-3 rounded-lg uppercase tracking-wider cursor-pointer transition">{tNavbar.bookHall}</Link>
                  <Link to="/weddings/book" onClick={() => onSetMobileMenuOpen(false)} className="w-full text-center bg-navy-950 hover:bg-navy-900 text-white text-[10px] font-semibold py-3 rounded-lg uppercase tracking-wider cursor-pointer transition">{tNavbar.bookWedding}</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
