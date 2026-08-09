import React, { useMemo, useState } from "react";
import { Download, Search, XCircle, Eye } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { BookingTableSkeleton } from "../components/Skeletons";
import Pagination from "../components/Pagination";

interface AdminBookingsPageProps {
  lang?: string;
  bookings: any[];
  onNavigate: (view: string, params?: any) => void;
}

const tBookings: Record<string, any> = {
  EN: {
    title: "Booking Management",
    subtitle: "Review, approve, reject, and coordinate reservation requests submitted by church hall visitors.",
    exportCsv: "Export CSV",
    all: "All",
    pending: "Pending",
    approved: "Approved",
    cancelled: "Cancelled",
    searchPlaceholder: "Search by guest name or reservation code...",
    thId: "Booking ID",
    thHall: "Hall",
    thService: "Service",
    thCustomer: "Customer",
    thDateTime: "Date & Time",
    thGuests: "Guests",
    thAmount: "Amount",
    thStatus: "Status",
    thReview: "Review",
    noBookings: "No booking records found matching tab/search."
  },
  FR: {
    title: "Gestion des Réservations",
    subtitle: "Examinez, approuvez, rejetez et coordonnez les demandes de réservation soumises par les visiteurs.",
    exportCsv: "Exporter CSV",
    all: "Tout",
    pending: "En Attente",
    approved: "Approuvé",
    cancelled: "Annulé",
    searchPlaceholder: "Rechercher par nom d'invité ou code...",
    thId: "ID Réservation",
    thHall: "Salle",
    thCustomer: "Client",
    thDateTime: "Date & Heure",
    thGuests: "Invités",
    thAmount: "Montant",
    thStatus: "Statut",
    thReview: "Examiner",
    noBookings: "Aucune réservation trouvée correspondante."
  },
  RW: {
    title: "Gucunga Gukodesha",
    subtitle: "Genzura, emereza, naho unange ubusabe bwose bwo gukodesha bwoherejwe n'abakiriya.",
    exportCsv: "Sohora CSV",
    all: "Byose",
    pending: "Bitegereje",
    approved: "Byemejwe",
    cancelled: "Byahagaritswe",
    searchPlaceholder: "Shakisha ku izina ry'umukiriya cyangwa kode...",
    thId: "Kode y'Ubusabe",
    thHall: "Icyumba",
    thCustomer: "Umukiriya",
    thDateTime: "Itariki & Amasaha",
    thGuests: "Abantu",
    thAmount: "Ikiguzi",
    thStatus: "Imiterere",
    thReview: "Sura",
    noBookings: "Nta busabe bwabonetse buhuye n'ibyo mwashakishije."
  }
};

export default function AdminBookingsPage({ lang = "EN", bookings, onNavigate }: AdminBookingsPageProps) {
  const t = tBookings[lang] || tBookings["EN"];
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Cancelled">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState<"All" | "SalleHub" | "ChurchTrack">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { bookingsLoading } = useData();

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Tab check — "Cancelled" tab includes Rejected
      if (activeTab === "Cancelled") {
        if (b.status !== "Cancelled" && b.status !== "Rejected") return false;
      } else if (activeTab !== "All" && b.status !== activeTab) {
        return false;
      }

      if (serviceFilter !== "All" && (b.serviceType || "SalleHub") !== serviceFilter) return false;

      // Text search
      if (searchTerm) {
        const s = searchTerm.trim().toLowerCase();
        const matches =
          (b.id && b.id.toLowerCase().includes(s)) ||
          (b.refCode && b.refCode.toLowerCase().includes(s)) ||
          (b.code && b.code.toLowerCase().includes(s)) ||
          (b.customerName && b.customerName.toLowerCase().includes(s)) ||
          (b.guestName && b.guestName.toLowerCase().includes(s)) ||
          (b.customerEmail && b.customerEmail.toLowerCase().includes(s)) ||
          (b.customerPhone && b.customerPhone.toLowerCase().includes(s)) ||
          (b.hallName && b.hallName.toLowerCase().includes(s)) ||
          (b.eventType && b.eventType.toLowerCase().includes(s));
        if (!matches) return false;
      }

      return true;
    });
  }, [bookings, activeTab, searchTerm, serviceFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, serviceFilter]);

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;

    const headers = ["Booking ID", "Hall Name", "Customer Name", "Customer Phone", "Customer Email", "Event Type", "Date", "Time Slot", "Guests", "Price ($)", "Status"];

    const rows = filteredBookings.map(b => [
      b.id || "",
      b.hallName || "",
      b.customerName || "",
      b.customerPhone || "",
      b.customerEmail || "",
      b.eventType || "",
      b.date || "",
      b.timeSlot || "",
      b.guests || "",
      b.amount ?? b.price ?? "",
      b.status || ""
    ]);

    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left font-sans text-navy-800" id="admin-bookings-page">
      {/* Page Header */}
      <div className="border-b border-navy-200/70 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-navy-900 tracking-wide">{t.title}</h2>
          <p className="text-xs text-navy-500 font-semibold mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredBookings.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[linear-gradient(135deg,#0a192f,#112240)] hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-[0_16px_35px_-18px_rgba(15,23,42,0.9)] transition cursor-pointer self-start md:self-auto"
          id="admin-export-csv-btn"
          title="Download CSV report of currently filtered bookings"
        >
          <Download className="w-4 h-4 text-navy-300" />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      {/* Tab filter and Search row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex border border-navy-200/80 p-1 rounded-2xl bg-white/85 backdrop-blur-md shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)] self-start">
          {([
            { id: "All", label: t.all },
            { id: "Pending", label: t.pending },
            { id: "Approved", label: t.approved },
            { id: "Cancelled", label: t.cancelled }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${activeTab === tab.id
                ? "bg-navy-950 text-white shadow-sm"
                : "text-navy-500 hover:text-navy-800 hover:bg-navy-50"
                }`}
              id={`bookings-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value as typeof serviceFilter)} className="rounded-2xl border border-navy-200 bg-white px-3 py-2.5 text-xs font-bold text-navy-700">
          <option value="All">Service: All</option><option value="SalleHub">SalleHub</option><option value="ChurchTrack">Weddings</option>
        </select>
        {/* Search Bar for Guest Name or Reservation Code */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white/85 backdrop-blur-md border border-navy-200 rounded-2xl text-xs font-bold text-navy-800 placeholder:text-navy-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.55)] transition"
            id="bookings-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-navy-400 hover:text-navy-600 p-0.5 rounded-full transition cursor-pointer"
              title="Clear search"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Data Table block — cards on mobile, table on desktop */}
      {bookingsLoading && bookings.length === 0 ? (
        <BookingTableSkeleton rows={8} />
      ) : (
        <div className="bg-white/85 backdrop-blur-md border border-navy-200/80 rounded-lg shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] overflow-hidden">
          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-navy-100">
            {paginatedBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigate("admin-booking-details", { bookingId: b.id })}
                className="p-4 hover:bg-navy-50/50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-black text-navy-900 text-sm truncate">{b.id}</p>
                    <p className="font-bold text-navy-800 text-xs mt-0.5">{b.serviceType === "ChurchTrack" ? "♥ Wedding" : b.hallName}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border flex-shrink-0 ${b.status === "Approved"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : b.status === "Pending"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-navy-50 border-navy-200 text-navy-600"
                    }`}>
                    {b.status === "Approved" ? t.approved : b.status === "Pending" ? t.pending : t.cancelled}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-semibold text-navy-600 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-navy-400 font-bold w-16 flex-shrink-0">{t.thCustomer}:</span>
                    <span className="text-navy-900 truncate">{b.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-navy-400 font-bold w-16 flex-shrink-0">{t.thDateTime}:</span>
                    <span className="text-navy-900">{b.date} <span className="text-navy-400 font-normal">{b.timeSlot}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-navy-400 font-bold w-16 flex-shrink-0">{t.thGuests}:</span>
                    <span className="text-navy-900">{b.guests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-navy-400 font-bold w-16 flex-shrink-0">{t.thAmount}:</span>
                    <span className="text-navy-900 font-bold">
                      {new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(Number(b.amount ?? b.price ?? 0))}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("admin-booking-details", { bookingId: b.id });
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-navy-50 hover:bg-navy-100 border border-navy-200 text-navy-700 rounded-lg transition cursor-pointer text-xs font-bold"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t.thReview}</span>
                </button>
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="p-10 text-center opacity-40 font-bold text-navy-400 text-xs uppercase tracking-wider">
                {t.noBookings}
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs font-semibold text-navy-600" id="admin-bookings-table">
              <thead>
                <tr className="bg-navy-50 border-b border-navy-200 text-[10px] text-navy-400 font-black uppercase tracking-wider">
                  <th className="p-4">{t.thId}</th>
                  <th className="p-4">{t.thHall}</th>
                  <th className="p-4">{t.thService}</th>
                  <th className="p-4">{t.thCustomer}</th>
                  <th className="p-4">{t.thDateTime}</th>
                  <th className="p-4 text-center">{t.thGuests}</th>
                  <th className="p-4 text-center">{t.thAmount}</th>
                  <th className="p-4 text-center">{t.thStatus}</th>
                  <th className="p-4 text-center">{t.thReview}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {paginatedBookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => onNavigate("admin-booking-details", { bookingId: b.id })}
                    className="hover:bg-navy-50/50 transition cursor-pointer"
                  >
                    <td className="p-4 font-black text-navy-900">{b.id}</td>
                    <td className="p-4 font-bold text-navy-800">{b.hallName}</td>
                    <td className="p-4"><span className={b.serviceType === "ChurchTrack" ? "font-bold text-rose-700" : "text-navy-600"}>{b.serviceType === "ChurchTrack" ? "Wedding" : "SalleHub"}</span></td>
                    <td className="p-4">
                      <div>
                        <p className="font-extrabold text-navy-950">{b.customerName}</p>
                        <p className="text-[10px] text-navy-400 font-bold mt-0.5">{b.customerPhone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-extrabold text-navy-900">{b.date}</p>
                        <p className="text-[10px] text-navy-400 font-bold mt-0.5">{b.timeSlot}</p>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-navy-700">{b.guests}</td>
                    <td className="p-4 text-center font-semibold text-navy-950">
                      RWF {Number(b.amount ?? b.price ?? 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded border inline-block ${b.status === "Approved"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : b.status === "Pending"
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-navy-50 border-navy-200 text-navy-600"
                        }`}>
                        {b.status === "Approved" ? t.approved : b.status === "Pending" ? t.pending : t.cancelled}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate("admin-booking-details", { bookingId: b.id });
                        }}
                        className="p-1.5 hover:bg-navy-50 border border-navy-200 text-navy-600 rounded-lg transition shadow-sm cursor-pointer inline-flex items-center"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center opacity-40 font-bold text-navy-400 text-xs uppercase tracking-wider">
                      {t.noBookings}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredBookings.length > itemsPerPage && (
            <div className="p-4 border-t border-navy-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredBookings.length}
                itemsPerPage={itemsPerPage}
                lang={lang}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
