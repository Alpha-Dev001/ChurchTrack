import React, { useMemo, useState } from "react";
import { FileText, AlertTriangle, DollarSign, Plus, ArrowRight, Settings, Heart } from "lucide-react";
import { BookingsOverviewChart, BookingStatusBreakdown, TopPerformingHalls } from "../components/Charts";
import Pagination from "../components/Pagination";

interface AdminDashboardProps {
  lang?: string;
  stats: {
    totalBookings: number;
    pendingBookings: number;
    totalRevenue: number;
    totalHalls: number;
    occupancyRate: number;
  };
  recentBookings: any[];
  notifications: any[];
  onNavigate: (view: string, params?: any) => void;
  onApproveBooking?: (id: string) => void;
  onRejectBooking?: (id: string) => void;
}

const tDashboard: Record<string, any> = {
  EN: {
    title: "Dashboard Overview",
    subtitle: "Live parish hall activity from your booking database.",
    addHall: "Add New Hall",
    settings: "Settings",
    totalBookings: "Total Bookings",
    totalBookingsDesc: "All reservation requests",
    pendingRequests: "Pending Requests",
    pendingRequestsDesc: "Awaiting your review",
    totalRevenue: "Total Revenue",
    totalRevenueDesc: "Collected paid rentals",
    totalHalls: "Total Halls",
    totalHallsDesc: "Registered venues",
    bookingsOverview: "Bookings — Last 14 Days",
    bookingsOverviewDesc: "Daily request volume from the database",
    statusTitle: "Status Mix",
    statusDesc: "Share of current booking statuses",
    recentRequests: "Recent Booking Requests",
    recentRequestsDesc: "Newest submissions requiring attention",
    viewAll: "View All",
    reviewBtn: "Review",
    noRequests: "No booking requests yet.",
    topHalls: "Top Halls",
    topHallsDesc: "Venues with the most bookings",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    emptyChart: "No booking activity in this period",
    emptyHalls: "No hall bookings yet",
    bookingsLabel: "bookings",
    statusFooter: "Based on current booking statuses.",
  },
  FR: {
    title: "Aperçu du Tableau de Bord",
    subtitle: "Activité en direct des salles paroissiales depuis la base de données.",
    addHall: "Ajouter une Salle",
    settings: "Paramètres",
    totalBookings: "Total Réservations",
    totalBookingsDesc: "Toutes les demandes",
    pendingRequests: "Demandes en Attente",
    pendingRequestsDesc: "En attente de votre examen",
    totalRevenue: "Revenu Total",
    totalRevenueDesc: "Locations payées collectées",
    totalHalls: "Total des Salles",
    totalHallsDesc: "Lieux enregistrés",
    bookingsOverview: "Réservations — 14 derniers jours",
    bookingsOverviewDesc: "Volume quotidien depuis la base de données",
    statusTitle: "Répartition des Statuts",
    statusDesc: "Part des statuts de réservation actuels",
    recentRequests: "Demandes Récentes",
    recentRequestsDesc: "Dernières soumissions à examiner",
    viewAll: "Voir Tout",
    reviewBtn: "Examiner",
    noRequests: "Aucune demande pour le moment.",
    topHalls: "Meilleures Salles",
    topHallsDesc: "Salles avec le plus de réservations",
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
    emptyChart: "Aucune activité sur cette période",
    emptyHalls: "Aucune réservation de salle",
    bookingsLabel: "réservations",
    statusFooter: "Basé sur les statuts de réservation actuels.",
  },
  RW: {
    title: "Incamake y'Ubuyobozi",
    subtitle: "Ibikorwa by'ibyumba bya paruwasi biva muri database.",
    addHall: "Kongeramo Icyumba",
    settings: "Igenamiterere",
    totalBookings: "Byose Hamwe",
    totalBookingsDesc: "Ubusabe bwose",
    pendingRequests: "Ibisabwa Guhandurwa",
    pendingRequestsDesc: "Bitegereje gusuzumwa",
    totalRevenue: "Amafaranga Yose",
    totalRevenueDesc: "Ayishyuwe y'ubukode",
    totalHalls: "Ibyumba Byose",
    totalHallsDesc: "Ibyumba byanditswe",
    bookingsOverview: "Ubusabe — Iminsi 14 ishize",
    bookingsOverviewDesc: "Umubare w'ubusabe buri munsi uva muri database",
    statusTitle: "Imiterere",
    statusDesc: "Igabanywa ry'imiterere y'ubusabe",
    recentRequests: "Ubusabe Buherutse",
    recentRequestsDesc: "Ubusabe bushya busaba kwemezwa",
    viewAll: "Reba Byose",
    reviewBtn: "Suzuma",
    noRequests: "Nta busabe buriho.",
    topHalls: "Ibyumba Bikoreshwa Cyane",
    topHallsDesc: "Ibyumba bifite ubusabe benshi",
    pending: "Bitegereje",
    approved: "Byemejwe",
    rejected: "Byanzwe",
    emptyChart: "Nta bikorwa muri iki gihe",
    emptyHalls: "Nta busabe bw'ibyumba",
    bookingsLabel: "ubusabe",
    statusFooter: "Hashingiye ku miterere y'ubusabe ubu.",
  },
};

/** Local YYYY-MM-DD — avoids UTC shift from toISOString() */
function toLocalDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayLabel(isoDate: string, lang: string) {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate.slice(5);
  return d.toLocaleDateString(lang === "FR" ? "fr-FR" : lang === "RW" ? "rw-RW" : "en-GB", {
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboard({
  lang = "EN",
  stats,
  recentBookings,
  onNavigate,
}: AdminDashboardProps) {
  const t = tDashboard[lang] || tDashboard.EN;
  const [bookingsPage, setBookingsPage] = useState(1);
  const bookingsPerPage = 5;
  const totalBookingsPages = Math.max(1, Math.ceil(recentBookings.length / bookingsPerPage));

  const paginatedBookings = recentBookings.slice(
    (bookingsPage - 1) * bookingsPerPage,
    bookingsPage * bookingsPerPage
  );

  const chartData = useMemo(() => {
    const days: { date: string; amount: number; key: string }[] = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toLocalDateKey(d);
      days.push({ key, date: formatDayLabel(key, lang), amount: 0 });
    }

    const map = new Map(days.map((d) => [d.key, d]));
    recentBookings.forEach((b) => {
      const created = b.createdAt
        ? new Date(b.createdAt)
        : b.date
          ? new Date(b.date + "T12:00:00")
          : null;
      if (!created || Number.isNaN(created.getTime())) return;
      const key = toLocalDateKey(created);
      const row = map.get(key);
      if (row) row.amount += 1;
    });

    // Show every other label on dense charts for readability
    return days.map((d, idx) => ({
      date: idx % 2 === 0 || idx === days.length - 1 ? d.date : "",
      amount: d.amount,
    }));
  }, [recentBookings, lang]);

  const statusCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    recentBookings.forEach((b) => {
      if (b.status === "Pending") pending += 1;
      else if (b.status === "Approved") approved += 1;
      else if (b.status === "Rejected" || b.status === "Cancelled") rejected += 1;
    });
    return { pending, approved, rejected };
  }, [recentBookings]);

  const topHalls = useMemo(() => {
    const counts = new Map<string, number>();
    recentBookings.forEach((b) => {
      const name = b.hallName || "Unknown";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = sorted[0]?.[1] || 1;
    return sorted.map(([name, bookings]) => ({
      name,
      bookings,
      percentage: Math.round((bookings / max) * 100),
    }));
  }, [recentBookings]);

  const formattedRevenue = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(stats.totalRevenue).replace("RWF", "RWF ");

  const weddingBookings = recentBookings.filter((booking) => booking.serviceType === "ChurchTrack").length;

  const displayStats = [
    { label: t.totalBookings, val: stats.totalBookings, desc: t.totalBookingsDesc, icon: FileText },
    { label: t.pendingRequests, val: stats.pendingBookings, desc: t.pendingRequestsDesc, icon: AlertTriangle },
    { label: t.totalRevenue, val: formattedRevenue, desc: t.totalRevenueDesc, icon: DollarSign },
    { label: "Wedding bookings", val: weddingBookings, desc: "ChurchTrack ceremony requests", icon: Heart },
  ];

  return (
    <div className="space-y-8 text-left font-sans text-navy-800" id="admin-dashboard-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-200 pb-5">
        <div>
          <h1 className="page-title">{t.title}</h1>
          <p className="page-subtitle">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate("admin-add-hall")}
            className="btn-primary !py-2.5 !px-4"
            id="admin-dashboard-add-hall"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addHall}</span>
          </button>
          <button onClick={() => onNavigate("admin-settings")} className="btn-secondary !py-2.5 !px-4">
            <Settings className="w-4 h-4" />
            <span>{t.settings}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" id="admin-metrics-row">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-surface p-5 flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="section-eyebrow">{stat.label}</span>
                <span className="text-2xl font-semibold text-navy-950 block tracking-tight">{stat.val}</span>
                <span className="text-[11px] text-navy-500 font-medium block">{stat.desc}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-50 text-navy-800 border border-navy-100 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-5 flex flex-col">
          <div className="border-b border-navy-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-navy-950 tracking-wide">{t.bookingsOverview}</h3>
            <p className="text-[11px] text-navy-500 font-medium mt-0.5">{t.bookingsOverviewDesc}</p>
          </div>
          <div className="h-60">
            <BookingsOverviewChart data={chartData} emptyLabel={t.emptyChart} />
          </div>
        </div>

        <div className="card-surface p-5 flex flex-col">
          <div className="border-b border-navy-100 pb-3 mb-2">
            <h3 className="text-sm font-semibold text-navy-950 tracking-wide">{t.statusTitle}</h3>
            <p className="text-[11px] text-navy-500 font-medium mt-0.5">{t.statusDesc}</p>
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-[200px]">
            <BookingStatusBreakdown
              pending={statusCounts.pending}
              approved={statusCounts.approved}
              rejected={statusCounts.rejected}
              labels={{
                pending: t.pending,
                approved: t.approved,
                rejected: t.rejected,
                empty: t.noRequests,
              }}
              footerNote={t.statusFooter}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-navy-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-navy-950 tracking-wide">{t.recentRequests}</h3>
              <p className="text-[11px] text-navy-500 font-medium mt-0.5">{t.recentRequestsDesc}</p>
            </div>
            <button
              onClick={() => onNavigate("admin-bookings")}
              className="text-[11px] font-semibold text-navy-600 hover:text-navy-950 flex items-center gap-1 transition"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 flex-1" id="recent-requests-dashboard-feed">
            {paginatedBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 border border-navy-100 rounded-lg hover:bg-navy-50/80 transition cursor-pointer"
                onClick={() => onNavigate("admin-booking-details", { bookingId: b.id })}
              >
                <div className="space-y-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-navy-950">{b.customerName}</span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${b.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : b.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-navy-100 text-navy-600"
                        }`}
                    >
                      {b.status === "Approved"
                        ? t.approved
                        : b.status === "Pending"
                          ? t.pending
                          : t.rejected}
                    </span>
                  </div>
                  <p className="text-[11px] text-navy-500 font-medium truncate">
                    {b.hallName} · {b.date} · {b.timeSlot}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("admin-booking-details", { bookingId: b.id });
                  }}
                  className="btn-secondary !py-1.5 !px-3 !text-[10px] shrink-0"
                  id={`dashboard-btn-review-${b.id}`}
                >
                  {t.reviewBtn}
                </button>
              </div>
            ))}

            {recentBookings.length === 0 && (
              <div className="py-10 text-center">
                <span className="text-xs font-medium text-navy-400">{t.noRequests}</span>
              </div>
            )}
          </div>

          {recentBookings.length > bookingsPerPage && (
            <Pagination
              currentPage={bookingsPage}
              totalPages={totalBookingsPages}
              onPageChange={setBookingsPage}
              totalItems={recentBookings.length}
              itemsPerPage={bookingsPerPage}
              lang={lang}
            />
          )}
        </div>

        <div className="card-surface p-5 flex flex-col">
          <div className="border-b border-navy-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-navy-950 tracking-wide">{t.topHalls}</h3>
            <p className="text-[11px] text-navy-500 font-medium mt-0.5">{t.topHallsDesc}</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <TopPerformingHalls
              halls={topHalls}
              emptyLabel={t.emptyHalls}
              bookingsLabel={t.bookingsLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
