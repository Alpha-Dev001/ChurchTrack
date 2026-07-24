import React, { useMemo } from "react";
import VisualCalendar from "../components/VisualCalendar";
import { useData } from "../contexts/DataContext";

interface AdminCalendarPageProps {
  lang?: string;
  onNavigate: (view: string, params?: any) => void;
}

const tCalendar: Record<string, any> = {
  EN: {
    loading: "Loading schedule calendar...",
    title: "Availability Planner",
    subtitle: "Review approved slots and schedule blocks sequentially.",
    alertMsg: "Please click on individual booking requests to configure maintenance overrides or block dates."
  },
  FR: {
    loading: "Chargement du calendrier...",
    title: "Planificateur de Disponibilité",
    subtitle: "Consultez les créneaux approuvés et gérez le calendrier.",
    alertMsg: "Veuillez cliquer sur les demandes individuelles pour configurer les maintenances ou bloquer des dates."
  },
  RW: {
    loading: "Kalendari iri gushakwa...",
    title: "Guhitamo Igihe",
    subtitle: "Genzura neza imyanya yose yemejwe n'amatariki afunze.",
    alertMsg: "Nyamuneka kanda ku busabe kugira ngo uhindure cyangwa ufunge amatariki."
  }
};

export default function AdminCalendarPage({ lang = "EN", onNavigate }: AdminCalendarPageProps) {
  const t = tCalendar[lang] || tCalendar["EN"];
  const { bookings, bookingsLoading } = useData();

  const events = useMemo(
    () =>
      bookings.map((b) => ({
        id: b.id,
        hallName: b.hallName,
        customerName: b.customerName,
        date: b.eventDate,
        timeSlot: b.timeSlot,
        eventType: b.eventType,
        status: (b.status === "Rejected" ? "Cancelled" : b.status) as
          | "Pending"
          | "Approved"
          | "Cancelled",
      })),
    [bookings]
  );

  if (bookingsLoading && events.length === 0) {
    return (
      <div className="space-y-6 animate-pulse" id="admin-calendar-skeleton">
        <div className="border-b border-navy-100 pb-5 space-y-2">
          <div className="w-48 h-6 bg-navy-200 rounded" />
          <div className="w-72 h-3 bg-navy-100 rounded" />
        </div>
        <div className="h-96 bg-navy-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans text-navy-900" id="admin-calendar-page">
      <div className="border-b border-navy-100 pb-5">
        <h2 className="text-xl font-black text-navy-950 tracking-wide">{t.title}</h2>
        <p className="text-xs text-navy-600 font-semibold mt-1">{t.subtitle}</p>
      </div>
      <VisualCalendar
        events={events}
        loading={bookingsLoading}
        onSelectEvent={(id) => onNavigate("admin-booking-details", { bookingId: id })}
      />
    </div>
  );
}
