import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { ViewName, ViewParams, SearchFilters } from "./types";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider, useData } from "./contexts/DataContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar";
import Router from "./components/Router";
import { motion } from "motion/react";
import { LogOut, Building, Compass, ListFilter, Calendar, Sliders, Home, Search, MapPin } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ConfirmDialog, { confirmDialogLabels } from "./components/ConfirmDialog";
import SalleHubLogo from "./components/SalleHubLogo";

// ====== INNER APP (uses contexts) ======
function AppInner() {
  const { lang, setLang } = useLanguage();
  const { adminToken, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    stats,
    addHall, updateHall, toggleHallStatus, deleteHall,
    approveBooking, rejectBooking,
  } = useData();

  // Protect admin routes (everything under /admin except login)
  useEffect(() => {
    const isAdminPath = location.pathname.startsWith("/admin");
    const isLoginPath = location.pathname === "/admin";
    if (isAdminPath && !isLoginPath && !isAuthenticated && !adminToken) {
      navigate("/admin", { replace: true });
    }
    if (isLoginPath && isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, isAuthenticated, adminToken, navigate]);

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [adminLangDropdownOpen, setAdminLangDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPublicBottomNav, setShowPublicBottomNav] = useState(false);

  // Map URL paths to view names
  const pathToView: Record<string, ViewName> = {
    "/": "visitor-home",
    "/catalogue": "visitor-catalogue",
    "/track": "visitor-track",
    "/halls/:hallId": "visitor-hall-details",
    "/booking": "visitor-booking",
    "/success": "visitor-success",
    "/admin": "admin-login",
    "/admin/dashboard": "admin-dashboard",
    "/admin/halls": "admin-halls",
    "/admin/halls/add": "admin-add-hall",
    "/admin/halls/:hallId": "admin-hall-details",
    "/admin/bookings": "admin-bookings",
    "/admin/bookings/:bookingId": "admin-booking-details",
    "/admin/calendar": "admin-calendar",
    "/admin/settings": "admin-settings",
  };

  // Extract view name from current path (handle dynamic routes)
  const currentView = (() => {
    // Check exact matches first
    if (pathToView[location.pathname]) {
      return pathToView[location.pathname];
    }

    // Handle dynamic routes
    if (location.pathname.startsWith("/halls/")) {
      return "visitor-hall-details";
    }
    if (location.pathname.match(/^\/admin\/halls\/[^/]+$/) && location.pathname !== "/admin/halls/add") {
      return "admin-hall-details";
    }
    if (location.pathname.startsWith("/admin/bookings/")) {
      return "admin-booking-details";
    }

    // Default to home
    return "visitor-home";
  })();

  // Extract params from URL path and search params for dynamic routes
  const viewParams: ViewParams = {};
  const searchParams = new URLSearchParams(location.search);

  // Extract dynamic params from URL path
  if (location.pathname.startsWith("/halls/")) {
    viewParams.hallId = decodeURIComponent(location.pathname.split("/")[2] || "");
  }
  if (location.pathname.match(/^\/admin\/halls\/[^/]+$/) && location.pathname !== "/admin/halls/add") {
    viewParams.hallId = decodeURIComponent(location.pathname.split("/")[3] || "");
  }
  if (location.pathname.startsWith("/admin/bookings/")) {
    const rawId = location.pathname.split("/")[3] || "";
    viewParams.bookingId = decodeURIComponent(rawId);
  }

  // Extract search params
  if (searchParams.has("hallId")) viewParams.hallId = searchParams.get("hallId") || viewParams.hallId;
  if (searchParams.has("date")) viewParams.date = searchParams.get("date") || undefined;
  if (searchParams.has("timeSlot")) viewParams.timeSlot = searchParams.get("timeSlot") || undefined;
  if (searchParams.has("duration")) viewParams.duration = searchParams.get("duration") || undefined;
  if (searchParams.has("guests")) viewParams.guests = parseInt(searchParams.get("guests") || "0");
  if (searchParams.has("searchCode")) viewParams.searchCode = searchParams.get("searchCode") || undefined;

  // Restore booking details stored after successful submission (objects cannot live in the query string)
  if (currentView === "visitor-success") {
    try {
      const raw = sessionStorage.getItem("sallehub_last_booking");
      if (raw) viewParams.booking = JSON.parse(raw);
    } catch {
      /* ignore corrupt storage */
    }
  }

  const isAdminView = currentView.startsWith("admin-") && currentView !== "admin-login";

  const handleNavigate = useCallback((view: string, params?: ViewParams) => {
    let path = Object.entries(pathToView).find(([_, v]) => v === view)?.[0] || "/";
    const nextParams: ViewParams = { ...(params || {}) };

    // Persist booking payload outside the URL (query strings cannot hold objects)
    if (view === "visitor-success" && nextParams.booking) {
      try {
        sessionStorage.setItem("sallehub_last_booking", JSON.stringify(nextParams.booking));
      } catch {
        /* ignore quota errors */
      }
      delete nextParams.booking;
    }

    // Handle dynamic routes by replacing path parameters
    if (view === "visitor-hall-details" && nextParams.hallId) {
      path = `/halls/${encodeURIComponent(nextParams.hallId)}`;
      delete nextParams.hallId;
    }
    if (view === "admin-hall-details" && nextParams.hallId) {
      path = `/admin/halls/${encodeURIComponent(nextParams.hallId)}`;
      delete nextParams.hallId;
    }
    if (view === "admin-booking-details" && nextParams.bookingId) {
      // Encode so IDs like "#BK-1020" are not treated as URL hash fragments
      path = `/admin/bookings/${encodeURIComponent(nextParams.bookingId)}`;
      delete nextParams.bookingId;
    }

    // Build URL with remaining params as query string
    const url = new URL(path, window.location.origin);
    Object.entries(nextParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && typeof value !== "object") {
        url.searchParams.set(key, String(value));
      }
    });

    navigate(url.pathname + url.search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const handleSearch = useCallback((filters: SearchFilters) => {
    // Navigate to catalogue with search filters
    handleNavigate("visitor-catalogue", filters);
  }, [handleNavigate]);

  const requestLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/");
  }, [logout, navigate]);

  const confirmLabels = confirmDialogLabels[lang] || confirmDialogLabels.EN;

  // Handle scroll to show/hide bottom navigation on public pages
  useEffect(() => {
    if (isAdminView) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.88; // Approximate hero height
      
      // Only hide bottom nav on home page when in hero section
      // Show it on all other pages or when scrolled past hero
      if (currentView === "visitor-home" && currentScrollY < heroHeight * 0.5) {
        setShowPublicBottomNav(false);
      } else {
        setShowPublicBottomNav(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdminView, currentView]);

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col font-sans text-navy-900 antialiased w-full" id="sallehub-app-container">

      {/* PUBLIC HEADER */}
      {!isAdminView && (
        <Navbar
          currentView={currentView}
          lang={lang}
          adminToken={adminToken}
          mobileMenuOpen={mobileMenuOpen}
          langDropdownOpen={langDropdownOpen}
          onNavigate={handleNavigate}
          onSetLang={setLang}
          onSetMobileMenuOpen={setMobileMenuOpen}
          onSetLangDropdownOpen={setLangDropdownOpen}
        />
      )}

      {/* ADMIN LAYOUT */}
      {isAdminView && (
        <div className="flex-1 flex flex-col md:flex-row h-screen w-full overflow-hidden bg-navy-50" id="admin-workspace-layout">
          {/* Mobile Admin Header */}
          <header className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between bg-navy-950/95 backdrop-blur-md text-white px-4 py-3 border-b border-navy-800 h-14 shadow-md" style={{ paddingTop: "env(safe-area-inset-top, 0.75rem)" }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-navy-900 text-white rounded-xl border border-navy-700/80">
                <SalleHubLogo size={16} className="text-navy-200" />
              </div>
              <h1 className="text-sm font-black font-serif tracking-wider">SalleHub</h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={requestLogout} className="text-navy-400 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-navy-800 min-touch flex items-center justify-center" title="Logout" aria-label="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Admin Sidebar */}
          <AdminSidebar
            currentView={currentView}
            lang={lang}
            sidebarCollapsed={sidebarCollapsed}
            adminLangDropdownOpen={adminLangDropdownOpen}
            stats={{ pendingBookings: stats.pendingBookings }}
            onNavigate={handleNavigate}
            onSetSidebarCollapsed={setSidebarCollapsed}
            onSetLang={setLang}
            onSetAdminLangDropdownOpen={setAdminLangDropdownOpen}
            onLogout={requestLogout}
          />

          {/* Admin Main Content */}
          <main className="flex-1 min-w-0 bg-[radial-gradient(circle_at_top_left,rgba(49,130,206,0.18),transparent_20%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] h-screen overflow-y-auto p-4 md:p-8 pt-18 md:pt-8 pb-24 md:pb-8 text-navy-900 font-sans" id="admin-main-viewport">
            <ErrorBoundary>
              <Router
                view={currentView as ViewName}
                params={viewParams}
                lang={lang}
                onNavigate={handleNavigate}
                onSearch={handleSearch}
                onAddHall={addHall}
                onUpdateHall={updateHall}
                onToggleHallStatus={toggleHallStatus}
                onDeleteHall={deleteHall}
                onApproveBooking={approveBooking}
                onRejectBooking={rejectBooking}
              />
            </ErrorBoundary>
          </main>

          {/* Mobile Bottom Nav — with safe area bottom padding */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-950 backdrop-blur-2xl border-t border-navy-700/50 text-white z-50 flex items-center justify-around px-2 shadow-[0_-8px_30px_-8px_rgba(10,25,47,0.9)] pb-safe" style={{ height: "calc(env(safe-area-inset-bottom, 0px) + 72px)" }}>
            {[
              { view: "admin-dashboard", label: "Overview", icon: Compass, path: "/admin/dashboard" },
              { view: "admin-halls", label: "Halls", icon: Building, path: "/admin/halls" },
              { view: "admin-bookings", label: "Bookings", icon: ListFilter, path: "/admin/bookings" },
              { view: "admin-calendar", label: "Schedule", icon: Calendar, path: "/admin/calendar" },
              { view: "admin-settings", label: "Settings", icon: Sliders, path: "/admin/settings" },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <Link key={item.view} to={item.path} className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center min-w-0 transition-all cursor-pointer rounded-xl mx-0.5 min-touch ${isActive ? "bg-white/15 text-white shadow-sm" : "text-navy-400 hover:text-navy-300 hover:bg-white/5"}`} aria-label={item.label}>
                  <Icon className={`w-5.5 h-5.5 mb-0.5 ${isActive ? "scale-110 text-white drop-shadow-sm" : "text-navy-400"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full px-0.5 ${isActive ? "text-white" : "text-navy-400"}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* PUBLIC ROUTER + FOOTER */}
      {!isAdminView && (
        <>
          <main className="flex-grow pt-[61px] md:pt-[65px] pb-16 md:pb-0">
            <ErrorBoundary>
              <Router
                view={currentView as ViewName}
                params={viewParams}
                lang={lang}
                onNavigate={handleNavigate}
                onSearch={handleSearch}
                onAddHall={addHall}
                onUpdateHall={updateHall}
                onToggleHallStatus={toggleHallStatus}
                onDeleteHall={deleteHall}
                onApproveBooking={approveBooking}
                onRejectBooking={rejectBooking}
              />
            </ErrorBoundary>
          </main>

          {/* PUBLIC BOTTOM NAVIGATION — Mobile only, with scroll animation */}
          <motion.nav
            initial={{ y: "100%", opacity: 0 }}
            animate={{ 
              y: showPublicBottomNav ? "0%" : "100%",
              opacity: showPublicBottomNav ? 1 : 0
            }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              mass: 0.8
            }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-950/95 backdrop-blur-2xl border-t border-navy-700/50 text-white z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-8px_30px_-8px_rgba(10,25,47,0.9)]"
            id="public-bottom-nav"
            style={{ height: "calc(env(safe-area-inset-bottom, 0px) + 64px)" }}
          >
            {[
              { view: "visitor-home", label: "Home", icon: Home, path: "/" },
              { view: "visitor-catalogue", label: "Halls", icon: Search, path: "/catalogue" },
              { view: "visitor-track", label: "Track", icon: MapPin, path: "/track" },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view || (item.view === "visitor-home" && currentView === "visitor-hall-details");
              return (
                <Link key={item.view} to={item.path} className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center min-w-0 transition-all cursor-pointer rounded-2xl mx-0.5 min-touch ${isActive ? "bg-white/15 text-white shadow-sm" : "text-navy-400 hover:text-navy-300 hover:bg-white/5"}`} aria-label={item.label}>
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "scale-110 text-white drop-shadow-sm" : "text-navy-400"}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full px-0.5 ${isActive ? "text-white" : "text-navy-400"}`}>{item.label}</span>
                </Link>
              );
            })}
            </motion.nav>

          {/* PUBLIC FOOTER — hidden on mobile since bottom nav replaces it */}
          <div className="hidden md:block">
            <Footer lang={lang} onNavigate={handleNavigate} />
          </div>
        </>
      )}

      <ConfirmDialog
        open={showLogoutConfirm}
        title={confirmLabels.logoutTitle}
        message={confirmLabels.logoutMessage}
        confirmLabel={confirmLabels.logoutConfirm}
        cancelLabel={confirmLabels.cancel}
        variant="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

// ====== ROOT APP (wraps providers) ======
export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#0a192f",
                  color: "#ebf8ff",
                  borderRadius: "1rem",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "12px 18px",
                  boxShadow: "0 20px 25px -5px rgba(10, 25, 47, 0.35)",
                  border: "1px solid rgba(190, 227, 248, 0.2)",
                  marginTop: "60px",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#0a192f",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#0a192f",
                  },
                },
              }}
            />
            <AppInner />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}