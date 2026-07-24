import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, MapPin, History, Calendar, Clock, Search, ChevronRight, Clock3, AlertCircle, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Hall, Booking } from "../types";
import Pagination from "../components/Pagination";
import ConfirmDialog, { confirmDialogLabels } from "../components/ConfirmDialog";

interface AdminHallsPageProps {
  lang?: string;
  halls: Hall[];
  bookings?: Booking[];
  onNavigate?: (view: string, params?: any) => void;
  onAddHall: (hallData: any) => Promise<void>;
  onToggleHallStatus: (id: string, status: "Active" | "Inactive") => Promise<void>;
  onDeleteHall: (id: string) => Promise<void>;
}

const tHalls: Record<string, any> = {
  EN: {
    title: "Hall Management",
    subtitle: "Configure parameters, rental rates, and capacities of parish venues.",
    addBtn: "Add New Hall",
    thThumb: "Hall Thumbnail",
    thName: "Hall Name",
    thLocation: "Location",
    thCapacity: "Capacity",
    thPrice: "Price / day",
    thStatus: "Status",
    thActions: "Actions",
    guestsSuffix: "Guests",
    deleteVenue: "Delete venue",
    modalTitle: "Add New Parish Venue",
    modalSubtitle: "Complete description, rules, and capacities to register hall.",
    labelName: "Hall Name *",
    labelLoc: "Location *",
    labelDesc: "Description Details",
    labelCapacity: "Guest Capacity *",
    labelPrice: "Price / day ($) *",
    labelSize: "Dimensions / Floor Size",
    labelHours: "Working Hours *",
    labelImage: "Thumbnail Image URL",
    labelFacilities: "Facilities & Capabilities",
    submitting: "Adding...",
    submitBtn: "Save Hall",
    cancelBtn: "Cancel",
    errorRequired: "Hall Name is required.",
    activityLog: "Activity Log",
    drawerTitle: "Venue Activity Log",
    drawerSubtitle: "Comprehensive history of all past and upcoming venue bookings",
    totalBookings: "Total Bookings",
    upcoming: "Upcoming",
    past: "Past",
    totalRevenue: "Total Revenue",
    searchPlaceholder: "Search customer, event, or ID...",
    filterAll: "All",
    filterUpcoming: "Upcoming",
    filterPast: "Past",
    filterPending: "Pending",
    filterApproved: "Approved",
    noBookings: "No booking activity found",
    noBookingsSub: "There are currently no recorded bookings matching your filter for this venue.",
    viewBookingDetails: "View Details",
    guests: "Guests",
    customer: "Customer",
    event: "Event",
    amount: "Amount",
    deletedSuccess: "Hall deleted successfully",
    deletedFail: "Failed to delete hall",
    statusUpdated: "Hall status updated",
    statusFail: "Failed to update hall status",
    clickToView: "View hall details"
  },
  FR: {
    title: "Gestion des Salles",
    subtitle: "Configurez les paramètres, les tarifs de location et les capacités des salles paroissiales.",
    addBtn: "Ajouter une Salle",
    thThumb: "Aperçu de la Salle",
    thName: "Nom de la Salle",
    thLocation: "Emplacement",
    thCapacity: "Capacité",
    thPrice: "Prix / jour",
    thStatus: "Statut",
    thActions: "Actions",
    guestsSuffix: "Invités",
    deleteVenue: "Supprimer la salle",
    modalTitle: "Ajouter une Nouvelle Salle Paroissiale",
    modalSubtitle: "Complétez la description, le règlement et la capacité de la salle.",
    labelName: "Nom de la Salle *",
    labelLoc: "Emplacement *",
    labelDesc: "Détails de la description",
    labelCapacity: "Capacité (Invités) *",
    labelPrice: "Prix / jour ($) *",
    labelSize: "Dimensions / Surface",
    labelHours: "Heures d'ouverture *",
    labelImage: "URL de l'image d'aperçu",
    labelFacilities: "Équipements & Commodités",
    submitting: "Envoi...",
    submitBtn: "Enregistrer la salle",
    cancelBtn: "Annuler",
    errorRequired: "Le nom de la salle est obligatoire.",
    activityLog: "Journal d'activité",
    drawerTitle: "Journal d'Activité de la Salle",
    drawerSubtitle: "Historique complet des réservations passées et à venir",
    totalBookings: "Total Réservations",
    upcoming: "À venir",
    past: "Passées",
    totalRevenue: "Revenu Total",
    searchPlaceholder: "Rechercher client, événement, ID...",
    filterAll: "Toutes",
    filterUpcoming: "À venir",
    filterPast: "Passées",
    filterPending: "En attente",
    filterApproved: "Approuvées",
    noBookings: "Aucune activité trouvée",
    noBookingsSub: "Il n'y a actuellement aucune réservation enregistrée correspondant à votre filtre pour cette salle.",
    viewBookingDetails: "Voir détails",
    guests: "Invités",
    customer: "Client",
    event: "Événement",
    amount: "Montant",
    deletedSuccess: "Salle supprimée avec succès",
    deletedFail: "Échec de la suppression de la salle",
    statusUpdated: "Statut de la salle mis à jour",
    statusFail: "Échec de la mise à jour du statut",
    clickToView: "Voir les détails de la salle"
  },
  RW: {
    title: "Gucunga Ibyumba",
    subtitle: "Komeza amashusho, ibiciro, n'ubushobozi bw'ibyumba bya paruwasi.",
    addBtn: "Kongeramo Icyumba",
    thThumb: "Ifoto y'Icyumba",
    thName: "Izina ry'Icyumba",
    thLocation: "Aho Giherereye",
    thCapacity: "Ubushobozi",
    thPrice: "Ikiguzi / ku munsi",
    thStatus: "Imiterere",
    thActions: "Ibikorwa",
    guestsSuffix: "Abantu",
    deleteVenue: "Gusiba icyumba",
    modalTitle: "Injiza Icyumba Gishya cya Paruwasi",
    modalSubtitle: "Uzuza ibyasabwa byose kugira ngo icyumba kiyandikishe.",
    labelName: "Izina ry'Icyumba *",
    labelLoc: "Aho Giherereye *",
    labelDesc: "Ibisobanuro n'Amategeko",
    labelCapacity: "Abatumirwa Max *",
    labelPrice: "Ikiguzi / ku munsi ($) *",
    labelSize: "Ingano y'Icyumba",
    labelHours: "Amasaha yo Gukora *",
    labelImage: "Ifoto (URL)",
    labelFacilities: "Ibikoresho Bihari",
    submitting: "Kwandika...",
    submitBtn: "Bika Icyumba",
    cancelBtn: "Guhagarika",
    errorRequired: "Izina ry'icyumba rirakenewe cyane.",
    activityLog: "Raporo y'Ibyakozwe",
    drawerTitle: "Raporo y'Ibyakozwe mu Cvector",
    drawerSubtitle: "Amakuru arambuye y'abakashe mu gihe cyashize n'icya maza",
    totalBookings: "Zose Hamwe",
    upcoming: "Ibya Vuba",
    past: "Ibyashize",
    totalRevenue: "Inyungu Yose",
    searchPlaceholder: "Shakisha umukiriya, ikirori, ID...",
    filterAll: "Byose",
    filterUpcoming: "Ibya Vuba",
    filterPast: "Ibyashize",
    filterPending: "Ibitegerejwe",
    filterApproved: "Ibyemejwe",
    noBookings: "Nta bukashe bubonetse",
    noBookingsSub: "Nta bukashe burakorwa kuri iki cyumba buhuye n'ishakisha ryawe.",
    viewBookingDetails: "Reba Amakuru",
    guests: "Abantu",
    customer: "Umukiriya",
    event: "Ikirori",
    amount: "Ayahawe",
    deletedSuccess: "Icyumba cyasibwe neza",
    deletedFail: "Gusiba icyumba byanze",
    statusUpdated: "Imiterere y'icyumba yahinduwe",
    statusFail: "Guhindura imiterere byanze",
    clickToView: "Reba amakuru y'icyumba"
  }
};

export default function AdminHallsPage({
  lang = "EN",
  halls,
  bookings: propBookings,
  onNavigate,
  onAddHall,
  onToggleHallStatus,
  onDeleteHall
}: AdminHallsPageProps) {
  const t = tHalls[lang] || tHalls["EN"];
  const c = confirmDialogLabels[lang] || confirmDialogLabels.EN;
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hallToDelete, setHallToDelete] = useState<Hall | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Activity Log Drawer State
  const [selectedHallForLog, setSelectedHallForLog] = useState<Hall | null>(null);
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logFilterStatus, setLogFilterStatus] = useState<string>("All");
  const [allBookings, setAllBookings] = useState<Booking[]>(propBookings || []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Synchronize bookings from shared admin data context
  useEffect(() => {
    if (propBookings) {
      setAllBookings(propBookings);
    }
  }, [propBookings]);

  // Add Hall Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Kacyiru, Kigali");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(250);
  const [price, setPrice] = useState(200);
  const [size, setSize] = useState("18m x 12m");
  const [workingHours, setWorkingHours] = useState("08:00 AM - 08:00 PM");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
  ]);

  // Facilities Checklist
  const defaultFacilitiesList = [
    "Air Conditioning", "Sound System", "Microphones", "Wi-Fi", "Projector", "Stage", "Restrooms", "Tables & Chairs", "Kitchen"
  ];
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    "Sound System", "Microphones", "Restrooms", "Tables & Chairs"
  ]);

  const handleFacilityToggle = (fac: string) => {
    setSelectedFacilities(prev =>
      prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
    );
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(t.errorRequired);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await onAddHall({
        name,
        location,
        description,
        capacity: Number(capacity),
        price: Number(price),
        size,
        workingHours,
        images,
        facilities: selectedFacilities,
        status: "Active"
      });

      // Clear Form & Close
      setName("");
      setDescription("");
      setShowAddModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create hall. Please check configuration.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to filter venue bookings for selected hall log drawer
  const todayStr = new Date().toISOString().split("T")[0];

  const venueBookings = selectedHallForLog
    ? allBookings.filter(b => {
      const matchesHall =
        b.hallId === selectedHallForLog.id ||
        (b.hallName && b.hallName.toLowerCase() === selectedHallForLog.name.toLowerCase());
      return matchesHall;
    })
    : [];

  const totalVenueCount = venueBookings.length;
  const upcomingVenueCount = venueBookings.filter(b => b.eventDate >= todayStr).length;
  const pastVenueCount = venueBookings.filter(b => b.eventDate < todayStr).length;
  const totalVenueRevenue = venueBookings
    .filter(b => b.status === "Approved" || b.paymentStatus === "Paid")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const filteredVenueBookings = venueBookings.filter(b => {
    // Search query filter
    const query = logSearchQuery.toLowerCase().trim();
    if (query) {
      const matchName = b.customerName?.toLowerCase().includes(query);
      const matchEvent = b.eventType?.toLowerCase().includes(query);
      const matchId = b.id?.toLowerCase().includes(query);
      const matchEmail = b.customerEmail?.toLowerCase().includes(query);
      if (!matchName && !matchEvent && !matchId && !matchEmail) return false;
    }

    // Status / Time filter
    if (logFilterStatus === "Upcoming") {
      return b.eventDate >= todayStr;
    }
    if (logFilterStatus === "Past") {
      return b.eventDate < todayStr;
    }
    if (logFilterStatus === "Pending") {
      return b.status === "Pending";
    }
    if (logFilterStatus === "Approved") {
      return b.status === "Approved";
    }

    return true;
  });

  // Pagination for halls
  const totalPages = Math.ceil(halls.length / itemsPerPage);
  const paginatedHalls = halls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 text-left font-sans text-navy-800" id="admin-halls-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-black text-navy-900 tracking-wide">{t.title}</h2>
          <p className="text-xs text-navy-500 font-semibold mt-1">{t.subtitle}</p>
        </div>

        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate("admin-add-hall");
            } else {
              setShowAddModal(true);
            }
          }}
          className="flex items-center gap-1.5 bg-navy-950 hover:bg-navy-800 text-white text-xs font-black px-4 py-2.5 rounded-lg shadow-md transition cursor-pointer"
          id="btn-trigger-add-hall"
        >
          <Plus className="w-4 h-4" />
          {t.addBtn}
        </button>
      </div>

      {/* Main Table List — cards on mobile, table on desktop */}
      <div className="bg-white border border-navy-200/80 rounded-lg shadow-sm overflow-hidden">
        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-navy-100">
          {paginatedHalls.map((hall) => {
            const hallBookingCount = allBookings.filter(
              b => b.hallId === hall.id || b.hallName?.toLowerCase() === hall.name?.toLowerCase()
            ).length;

            return (
              <div
                key={hall.id}
                onClick={() => onNavigate?.("admin-hall-details", { hallId: hall.id })}
                className="p-4 hover:bg-navy-50/50 transition cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img src={hall.images[0]} alt={hall.name} className="w-16 h-12 object-cover rounded-lg border border-navy-200 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-navy-900 text-sm truncate">{hall.name}</p>
                    <p className="text-navy-400 font-bold text-xs mt-0.5 truncate">{hall.location}</p>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const nextStatus = hall.status === "Active" ? "Inactive" : "Active";
                      try {
                        await onToggleHallStatus(hall.id, nextStatus);
                        toast.success(`${t.statusUpdated}: ${nextStatus}`);
                      } catch (err: any) {
                        toast.error(err.message || t.statusFail);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition cursor-pointer flex-shrink-0 ${hall.status === "Active"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-red-50 border-red-200 text-red-500"
                      }`}
                    id={`btn-toggle-status-${hall.id}`}
                  >
                    {hall.status}
                  </button>
                </div>

                <div className="space-y-2 text-xs font-semibold text-navy-600 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-navy-400 font-bold w-16 flex-shrink-0">{t.thCapacity}:</span>
                    <span className="text-navy-900">{hall.capacity} {t.guestsSuffix}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-navy-400 font-bold w-16 flex-shrink-0">{t.thPrice}:</span>
                    <span className="text-navy-900 font-bold">RWF {Number(hall.price).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHallForLog(hall);
                      setLogSearchQuery("");
                      setLogFilterStatus("All");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-navy-50 hover:bg-navy-100 text-navy-700 border border-navy-200 rounded-lg transition cursor-pointer text-xs font-bold"
                    id={`btn-activity-log-${hall.id}`}
                    title={t.activityLog}
                  >
                    <History className="w-4 h-4" />
                    <span>{t.activityLog}</span>
                    <span className="px-1.5 py-0.5 bg-navy-200/60 text-navy-900 rounded-full text-[10px] font-black">
                      {hallBookingCount}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHallToDelete(hall);
                    }}
                    className="p-2.5 hover:bg-red-50 text-navy-400 hover:text-red-500 border border-navy-200 rounded-lg transition cursor-pointer"
                    id={`btn-delete-hall-${hall.id}`}
                    title={t.deleteVenue}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {halls.length === 0 && (
            <div className="p-10 text-center opacity-40 font-bold text-navy-400 text-xs uppercase tracking-wider">
              No halls found
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-navy-600" id="admin-halls-table">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-200 text-[10px] text-navy-400 font-black uppercase tracking-wider">
                <th className="p-4">{t.thThumb}</th>
                <th className="p-4">{t.thName}</th>
                <th className="p-4">{t.thLocation}</th>
                <th className="p-4 text-center">{t.thCapacity}</th>
                <th className="p-4 text-center">{t.thPrice}</th>
                <th className="p-4 text-center">{t.thStatus}</th>
                <th className="p-4 text-center">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {paginatedHalls.map((hall) => {
                const hallBookingCount = allBookings.filter(
                  b => b.hallId === hall.id || b.hallName?.toLowerCase() === hall.name?.toLowerCase()
                ).length;

                return (
                  <tr
                    key={hall.id}
                    className="hover:bg-navy-50/50 transition cursor-pointer"
                    onClick={() => onNavigate?.("admin-hall-details", { hallId: hall.id })}
                    title={t.clickToView}
                  >
                    <td className="p-4">
                      <img src={hall.images[0]} alt={hall.name} className="w-14 h-10 object-cover rounded-lg border border-navy-200" />
                    </td>
                    <td className="p-4 font-black text-navy-950">{hall.name}</td>
                    <td className="p-4 text-navy-400 font-bold">{hall.location}</td>
                    <td className="p-4 text-center font-extrabold text-navy-800">{hall.capacity} {t.guestsSuffix}</td>
                    <td className="p-4 text-center font-black text-navy-950">${hall.price}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const nextStatus = hall.status === "Active" ? "Inactive" : "Active";
                          try {
                            await onToggleHallStatus(hall.id, nextStatus);
                            toast.success(`${t.statusUpdated}: ${nextStatus}`);
                          } catch (err: any) {
                            toast.error(err.message || t.statusFail);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition cursor-pointer ${hall.status === "Active"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                          : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                          }`}
                        id={`btn-toggle-status-${hall.id}`}
                      >
                        {hall.status}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHallForLog(hall);
                            setLogSearchQuery("");
                            setLogFilterStatus("All");
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 border border-navy-200/80 rounded-lg text-[11px] font-black transition shadow-sm cursor-pointer"
                          id={`btn-activity-log-${hall.id}`}
                          title={t.activityLog}
                        >
                          <History className="w-3.5 h-3.5 text-navy-600" />
                          <span>{t.activityLog}</span>
                          <span className="ml-0.5 px-1.5 py-0.2 bg-navy-200/60 text-navy-900 rounded-full text-[10px]">
                            {hallBookingCount}
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setHallToDelete(hall);
                          }}
                          className="p-1.5 hover:bg-red-50 text-navy-400 hover:text-red-500 rounded-lg border border-navy-200/50 hover:border-red-200 transition shadow-sm cursor-pointer"
                          id={`btn-delete-hall-${hall.id}`}
                          title={t.deleteVenue}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {halls.length > itemsPerPage && (
          <div className="p-4 border-t border-navy-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={halls.length}
              itemsPerPage={itemsPerPage}
              lang={lang}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!hallToDelete}
        title={c.deleteTitle}
        message={hallToDelete ? `${c.deleteMessage} (${hallToDelete.name})` : c.deleteMessage}
        confirmLabel={c.deleteConfirm}
        cancelLabel={c.cancel}
        variant="danger"
        loading={deleting}
        onConfirm={async () => {
          if (!hallToDelete) return;
          setDeleting(true);
          try {
            await onDeleteHall(hallToDelete.id);
            toast.success(t.deletedSuccess);
            setHallToDelete(null);
          } catch (err: any) {
            toast.error(err.message || t.deletedFail);
          } finally {
            setDeleting(false);
          }
        }}
        onCancel={() => setHallToDelete(null)}
      />

      {/* ACTIVITY LOG SIDE DRAWER (Slide-over) */}
      {selectedHallForLog && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedHallForLog(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-xl bg-white shadow-2xl border-l border-navy-200/80 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 bg-navy-950 text-white border-b border-navy-800 flex items-start justify-between relative shrink-0">
                <div className="flex items-start gap-3">
                  <img
                    src={selectedHallForLog.images[0]}
                    alt={selectedHallForLog.name}
                    className="w-14 h-14 object-cover rounded-2xl border-2 border-navy-800 shadow-md shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-navy-500/20 text-navy-400 border border-navy-500/30 px-2 py-0.5 rounded-full">
                        {t.drawerTitle}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white tracking-wide mt-1">
                      {selectedHallForLog.name}
                    </h3>
                    <p className="text-xs text-navy-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-navy-500" />
                      <span>{selectedHallForLog.location}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHallForLog(null)}
                  className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-xl transition cursor-pointer"
                  id="btn-close-activity-drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Venue Summary Stat Cards */}
              <div className="grid grid-cols-4 gap-2 p-4 bg-navy-50 border-b border-navy-200/80 shrink-0 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-navy-200/60 shadow-2xs">
                  <p className="text-[10px] font-bold text-navy-400 uppercase tracking-tight">{t.totalBookings}</p>
                  <p className="text-base font-black text-navy-900 mt-0.5">{totalVenueCount}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-navy-200/60 shadow-2xs">
                  <p className="text-[10px] font-bold text-navy-600 uppercase tracking-tight">{t.upcoming}</p>
                  <p className="text-base font-black text-navy-950 mt-0.5">{upcomingVenueCount}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-navy-200/60 shadow-2xs">
                  <p className="text-[10px] font-bold text-navy-500 uppercase tracking-tight">{t.past}</p>
                  <p className="text-base font-black text-navy-700 mt-0.5">{pastVenueCount}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-navy-200/60 shadow-2xs">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">{t.totalRevenue}</p>
                  <p className="text-base font-black text-emerald-950 mt-0.5">RWF {Number(totalVenueRevenue).toLocaleString()}</p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="p-4 border-b border-navy-100 bg-white space-y-3 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={e => setLogSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-950 focus:bg-white transition"
                    id="input-search-hall-log"
                  />
                  {logSearchQuery && (
                    <button
                      onClick={() => setLogSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: "All", label: t.filterAll },
                    { id: "Upcoming", label: t.filterUpcoming },
                    { id: "Past", label: t.filterPast },
                    { id: "Pending", label: t.filterPending },
                    { id: "Approved", label: t.filterApproved }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setLogFilterStatus(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${logFilterStatus === tab.id
                        ? "bg-navy-900 text-white shadow-xs"
                        : "bg-navy-100 text-navy-600 hover:bg-navy-200"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Timeline Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-navy-50/50">
                {filteredVenueBookings.length === 0 ? (
                  <div className="py-12 px-4 text-center bg-white border border-navy-200/80 rounded-2xl shadow-xs space-y-3">
                    <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mx-auto text-navy-400">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-navy-800">{t.noBookings}</h4>
                      <p className="text-xs text-navy-400 font-medium max-w-xs mx-auto mt-1">
                        {t.noBookingsSub}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredVenueBookings.map(b => {
                    const isUpcoming = b.eventDate >= todayStr;
                    const isPending = b.status === "Pending";
                    const isApproved = b.status === "Approved";
                    const isRejected = b.status === "Rejected";

                    return (
                      <div
                        key={b.id}
                        className="bg-white border border-navy-200/90 hover:border-navy-300 rounded-2xl p-4 shadow-2xs hover:shadow-md transition space-y-3 text-left"
                      >
                        {/* Booking Header: ID, Date, Upcoming/Past Pill, Status Badge */}
                        <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-navy-900 font-mono">
                              #{b.id}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isUpcoming
                                ? "bg-navy-50 text-navy-700 border border-navy-200"
                                : "bg-navy-100 text-navy-500 border border-navy-200"
                                }`}
                            >
                              {isUpcoming ? t.upcoming : t.past}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isApproved
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isPending
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : isRejected
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-navy-100 text-navy-600 border-navy-200"
                              }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        {/* Booking Body Details */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">{t.customer}</p>
                            <p className="font-extrabold text-navy-900 mt-0.5 truncate">{b.customerName}</p>
                            <p className="text-[11px] text-navy-500 truncate">{b.customerPhone}</p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">{t.event}</p>
                            <p className="font-extrabold text-navy-900 mt-0.5 truncate">{b.eventType || "Event"}</p>
                            <p className="text-[11px] text-navy-500 flex items-center gap-1">
                              <Users className="w-3 h-3 text-navy-400" />
                              <span>{b.guests} {t.guests}</span>
                            </p>
                          </div>
                        </div>

                        {/* Date & Time slot banner */}
                        <div className="bg-navy-50 rounded-xl p-2.5 border border-navy-100 flex items-center justify-between text-xs font-semibold text-navy-700">
                          <div className="flex items-center gap-1.5 text-navy-800 font-bold">
                            <Calendar className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                            <span>{b.eventDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-navy-500 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                            <span>{b.timeSlot || "Full Day"}</span>
                          </div>
                        </div>

                        {/* Footer: Amount & View Details Link */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-navy-400">{t.amount}:</span>
                            <span className="text-sm font-black text-navy-950">RWF {Number(b.totalAmount || 0).toLocaleString()}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${b.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                              {b.paymentStatus || "Pending"}
                            </span>
                          </div>

                          {onNavigate && (
                            <button
                              onClick={() => {
                                setSelectedHallForLog(null);
                                onNavigate("admin-booking-details", { bookingId: b.id });
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-navy-600 hover:text-navy-800 hover:underline transition cursor-pointer"
                            >
                              <span>{t.viewBookingDetails}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Hall Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-navy-200/80 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black tracking-wide">{t.modalTitle}</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-navy-400 hover:text-white hover:bg-navy-800 p-1 rounded-lg transition"
                id="modal-close-add-hall"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="bg-red-50 border-y border-red-200 text-red-800 p-3 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.labelName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Celebration Hall"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-navy-950 focus:bg-white"
                    id="add-input-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.labelLoc}</label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-navy-950 focus:bg-white"
                  >
                    <option value="Kacyiru, Kigali">Kacyiru, Kigali</option>
                    <option value="Remera, Kigali">Remera, Kigali</option>
                    <option value="Nyamirambo, Kigali">Nyamirambo, Kigali</option>
                    <option value="Kicukiro, Kigali">Kicukiro, Kigali</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.labelHours}</label>
                  <input
                    type="text"
                    required
                    value={workingHours}
                    onChange={e => setWorkingHours(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-navy-950 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.labelCapacity}</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-navy-950 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.labelPrice}</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-navy-950 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.labelDesc}</label>
                  <textarea
                    placeholder="Enter detailed description..."
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-navy-950 focus:bg-white"
                  />
                </div>
              </div>

              {/* Facilities check list */}
              <div className="space-y-2 border-t border-navy-100 pt-4 text-left">
                <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider block">{t.labelFacilities}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {defaultFacilitiesList.map(fac => (
                    <label key={fac} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(fac)}
                        onChange={() => handleFacilityToggle(fac)}
                        className="rounded text-navy-950 focus:ring-navy-950 border-navy-300 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-navy-600 group-hover:text-navy-900 transition">
                        {fac}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action btns */}
              <div className="flex justify-end gap-2 border-t border-navy-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold border border-navy-200 hover:bg-navy-50 text-navy-700 rounded-xl transition"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-navy-950 hover:bg-navy-800 text-white text-xs font-black uppercase tracking-wider px-5 py-2 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                  id="add-hall-save-btn"
                >
                  {loading ? t.submitting : t.submitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

