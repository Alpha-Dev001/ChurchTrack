import React, { useState, useEffect } from "react";
import { Check, X, ShieldAlert, ArrowLeft, User, Phone, Mail, Sparkles } from "lucide-react";
import { bookingApiPath, safeFetchJson } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import ConfirmDialog, { confirmDialogLabels } from "../components/ConfirmDialog";
import toast from "react-hot-toast";
import { BookingDetailsSkeleton } from "../components/Skeletons";

interface AdminBookingDetailsPageProps {
  lang?: string;
  bookingId: string;
  onNavigate: (view: string, params?: any) => void;
  onApproveBooking: (id: string) => Promise<void>;
  onRejectBooking: (id: string) => Promise<void>;
}

const tDetails: Record<string, any> = {
  EN: {
    errorTitle: "Details Error",
    backBtn: "Back to Bookings",
    title: "Review Booking Request",
    actionTitle: "Review Actions",
    actionDesc: "Approving or rejecting updates the calendar slot immediately.",
    approveBtn: "Approve Request",
    rejectBtn: "Reject Request",
    customerTitle: "Customer details",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    eventTitle: "Event details",
    hallLabel: "Hall Selected",
    typeLabel: "Event Type",
    dateLabel: "Date",
    slotLabel: "Time Slot",
    guestsLabel: "Guest Count",
    guestsSuffix: "Guests",
    paymentLabel: "Payment Method",
    amountLabel: "Amount",
    notesLabel: "Additional Notes",
    approvedSuccess: "Request Approved",
    approvedDesc: "The calendar slot is blocked. The customer has been notified.",
    rejectedSuccess: "Request Rejected",
    rejectedDesc: "The slot remains open. The customer is notified of the rejection.",
    aiTitle: "Coordinator Notes",
    aiSub: "Quick booking brief",
    aiBtn: "Generate Brief",
    aiRegen: "Regenerate brief",
    aiPlaceholder: "Generate a short summary of capacity, schedule, and coordination notes for this booking.",
    aiOffline: "AI assistant is temporarily offline. Review capacity against guest count and confirm no schedule conflict before approving.",
    progressTitle: "Activity Progress",
    progressSubmitted: "Submitted",
    progressReview: "Under Review",
    progressDecision: "Decision",
    missingId: "No booking selected. Return to the bookings list.",
  },
  FR: {
    errorTitle: "Erreur de détails",
    backBtn: "Retour aux réservations",
    title: "Examiner la demande",
    actionTitle: "Actions de revue",
    actionDesc: "Approuver ou rejeter met à jour le créneau immédiatement.",
    approveBtn: "Approuver",
    rejectBtn: "Rejeter",
    customerTitle: "Coordonnées du client",
    fullName: "Nom complet",
    phone: "Téléphone",
    email: "E-mail",
    eventTitle: "Détails de l'événement",
    hallLabel: "Salle sélectionnée",
    typeLabel: "Type d'événement",
    dateLabel: "Date",
    slotLabel: "Créneau",
    guestsLabel: "Nombre d'invités",
    guestsSuffix: "Invités",
    paymentLabel: "Mode de paiement",
    amountLabel: "Montant",
    notesLabel: "Notes supplémentaires",
    approvedSuccess: "Demande approuvée",
    approvedDesc: "Le créneau est bloqué. Le client a été notifié.",
    rejectedSuccess: "Demande rejetée",
    rejectedDesc: "Le créneau reste ouvert. Le client est informé.",
    aiTitle: "Notes du coordinateur",
    aiSub: "Synthèse rapide",
    aiBtn: "Générer la synthèse",
    aiRegen: "Régénérer",
    aiPlaceholder: "Générez un résumé court de la capacité, du planning et des notes.",
    aiOffline: "L'assistant IA est hors ligne. Vérifiez la capacité et les conflits d'horaire avant d'approuver.",
    progressTitle: "Progression",
    progressSubmitted: "Soumis",
    progressReview: "En examen",
    progressDecision: "Décision",
    missingId: "Aucune réservation sélectionnée. Retournez à la liste.",
  },
  RW: {
    errorTitle: "Ikibazo cy'amakuru",
    backBtn: "Subira ku busabe",
    title: "Suzuma ubusabe",
    actionTitle: "Ibyemezo",
    actionDesc: "Kwemera cyangwa kwanga bihindura gahunda ako kanya.",
    approveBtn: "Emera",
    rejectBtn: "Anga",
    customerTitle: "Amakuru y'umukiriya",
    fullName: "Amazina yose",
    phone: "Telefone",
    email: "Imeri",
    eventTitle: "Amakuru y'igikorwa",
    hallLabel: "Icyumba",
    typeLabel: "Ubwoko",
    dateLabel: "Itariki",
    slotLabel: "Amasaha",
    guestsLabel: "Abatumirwa",
    guestsSuffix: "Abantu",
    paymentLabel: "Uburyo bwo kwishyura",
    amountLabel: "Amafaranga",
    notesLabel: "Andi makuru",
    approvedSuccess: "Byemejwe",
    approvedDesc: "Gahunda yafunzwe. Umukiriya menyeshejwe.",
    rejectedSuccess: "Byanzwe",
    rejectedDesc: "Umwanya urakinguye. Umukiriya menyeshejwe.",
    aiTitle: "Inyandiko z'umuhuzabikorwa",
    aiSub: "Incamake yihuse",
    aiBtn: "Kora incamake",
    aiRegen: "Ongera ukore",
    aiPlaceholder: "Kora incamake y'ubushobozi, gahunda n'inyandiko.",
    aiOffline: "Umufasha wa IA ntabwo ari gukora. Reba ubushobozi n'amahitamo mbere yo kwemera.",
    progressTitle: "Aho bigeze",
    progressSubmitted: "Byoherejwe",
    progressReview: "Biri gusuzumwa",
    progressDecision: "Icyemezo",
    missingId: "Nta busabe bwahiswemo. Subira ku rutonde.",
  },
};

function formatAmount(amount?: number) {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export default function AdminBookingDetailsPage({
  lang = "EN",
  bookingId,
  onNavigate,
  onApproveBooking,
  onRejectBooking,
}: AdminBookingDetailsPageProps) {
  const t = tDetails[lang] || tDetails.EN;
  const c = confirmDialogLabels[lang] || confirmDialogLabels.EN;
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const { adminToken } = useAuth();
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchBooking = async () => {
    if (!bookingId) {
      setLoading(false);
      setErrorMsg(t.missingId);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await safeFetchJson(bookingApiPath(bookingId), {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      setBooking(data);
    } catch (err: any) {
      setBooking(null);
      setErrorMsg(err.message || "Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId, adminToken]);

  const generateAISummary = async () => {
    if (!booking) return;
    setLoadingAI(true);
    try {
      const data = await safeFetchJson("/api/ai/booking-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking }),
      });
      setAiSummary(data.summary || t.aiOffline);
    } catch {
      const offline = [
        `${booking.customerName} · ${booking.eventType}`,
        `${booking.hallName} · ${booking.date} · ${booking.timeSlot}`,
        `${booking.guests} guests · ${formatAmount(booking.amount)} · ${booking.paymentMethod || "—"}`,
        t.aiOffline,
      ].join("\n");
      setAiSummary(offline);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApprove = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await onApproveBooking(booking.id);
      await fetchBooking();
      setConfirmAction(null);
      toast.success(t.approvedSuccess);
    } catch (err: any) {
      const msg = err.message || "Failed to approve booking.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await onRejectBooking(booking.id);
      await fetchBooking();
      setConfirmAction(null);
      toast.success(t.rejectedSuccess);
    } catch (err: any) {
      const msg = err.message || "Failed to reject booking.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <BookingDetailsSkeleton />;

  if (errorMsg && !booking) {
    return (
      <div className="py-16 text-center space-y-4 font-sans" id="booking-details-error">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mx-auto border border-red-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-navy-950">{t.errorTitle}</h4>
          <p className="text-xs text-navy-500 font-medium">{errorMsg}</p>
        </div>
        <button onClick={() => onNavigate("admin-bookings")} className="btn-primary">
          {t.backBtn}
        </button>
      </div>
    );
  }

  if (!booking) return null;

  const isClosed = booking.status === "Rejected" || booking.status === "Cancelled";
  const isWedding = booking.serviceType === "ChurchTrack";

  return (
    <div className="space-y-6 text-left font-sans text-navy-800" id="admin-booking-details-page">
      <div className="flex items-center gap-3 border-b border-navy-200 pb-5">
        <button
          onClick={() => onNavigate("admin-bookings")}
          className="p-2 border border-navy-200 hover:bg-navy-50 rounded-lg transition text-navy-700 cursor-pointer"
          aria-label={t.backBtn}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="section-eyebrow">ID: {booking.id}</span>
          <h2 className="page-title mt-0.5">{t.title}</h2>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card-surface p-5 space-y-4">
            <div className="flex justify-between items-start gap-3 border-b border-navy-100 pb-3">
              <div>
                <h3 className="section-eyebrow">{t.actionTitle}</h3>
                <p className="text-xs font-medium text-navy-600 mt-1">{t.actionDesc}</p>
              </div>
              <span
                className={`text-[9px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded border shrink-0 ${booking.status === "Approved"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : booking.status === "Pending"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-navy-50 border-navy-200 text-navy-600"
                  }`}
              >
                {booking.status}
              </span>
            </div>

            {booking.status === "Pending" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setConfirmAction("approve")}
                  disabled={actionLoading}
                  className="btn-primary flex-1 disabled:opacity-50"
                  id="btn-admin-approve"
                >
                  {actionLoading && confirmAction === "approve" ? (
                    <span className="inline-block h-3.5 w-24 bg-white/30 rounded animate-pulse" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.approveBtn}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setConfirmAction("reject")}
                  disabled={actionLoading}
                  className="btn-secondary flex-1 disabled:opacity-50"
                  id="btn-admin-reject"
                >
                  <X className="w-4 h-4 text-red-500" />
                  <span>{t.rejectBtn}</span>
                </button>
              </div>
            )}

            {booking.status === "Approved" && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-900 text-xs font-semibold flex gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{t.approvedSuccess}</p>
                  <p className="text-[11px] text-navy-600 font-medium mt-1">{t.approvedDesc}</p>
                </div>
              </div>
            )}

            {isClosed && (
              <div className="bg-navy-50 border border-navy-200 p-4 rounded-lg text-navy-900 text-xs font-semibold flex gap-2.5">
                <X className="w-5 h-5 text-navy-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{t.rejectedSuccess}</p>
                  <p className="text-[11px] text-navy-600 font-medium mt-1">{t.rejectedDesc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="card-surface p-5 space-y-4">
            <h3 className="section-eyebrow border-b border-navy-100 pb-2.5">{t.eventTitle}</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {!isWedding && <div>
                <span className="section-eyebrow">{t.hallLabel}</span>
                <span className="text-navy-950 font-semibold text-sm block mt-1">{booking.hallName}</span>
              </div>}
              {isWedding && <>
                <div><span className="section-eyebrow">Bride</span><span className="text-rose-900 font-semibold text-sm block mt-1">{booking.brideName || "—"}</span><span className="mt-1 block text-xs text-navy-500">{booking.brideEmail || "—"}</span><span className="block text-xs text-navy-500">{booking.bridePhone || "—"}</span></div>
                <div><span className="section-eyebrow">Groom</span><span className="text-rose-900 font-semibold text-sm block mt-1">{booking.groomName || "—"}</span><span className="mt-1 block text-xs text-navy-500">{booking.groomEmail || "—"}</span><span className="block text-xs text-navy-500">{booking.groomPhone || "—"}</span></div>
              </>}
              <div>
                <span className="section-eyebrow">{t.typeLabel}</span>
                <span className="text-navy-950 font-semibold text-sm block mt-1">{booking.eventType}</span>
              </div>
              <div>
                <span className="section-eyebrow">{t.dateLabel}</span>
                <span className="text-navy-900 font-semibold block mt-1">{booking.date}</span>
              </div>
              <div>
                <span className="section-eyebrow">{t.slotLabel}</span>
                <span className="text-navy-900 font-semibold block mt-1">{booking.timeSlot}</span>
              </div>
              <div>
                <span className="section-eyebrow">{t.guestsLabel}</span>
                <span className="text-navy-900 font-semibold block mt-1">
                  {booking.guests} {t.guestsSuffix}
                </span>
              </div>
              <div>
                <span className="section-eyebrow">{t.paymentLabel}</span>
                <span className="text-navy-900 font-semibold block mt-1">{booking.paymentMethod || "—"}</span>
              </div>
              <div>
                <span className="section-eyebrow">{t.amountLabel}</span>
                <span className="text-navy-900 font-semibold block mt-1">{formatAmount(booking.amount)}</span>
              </div>
            </div>

            {booking.additionalNotes && (
              <div className="pt-3 border-t border-navy-100 space-y-1">
                <span className="section-eyebrow">{t.notesLabel}</span>
                <p className="text-xs text-navy-600 bg-navy-50 p-3 rounded-lg border border-navy-100 font-medium leading-relaxed">
                  {booking.additionalNotes}
                </p>
              </div>
            )}
          </div>

          <div className="card-surface p-5 space-y-4">
            <h3 className="section-eyebrow border-b border-navy-100 pb-2.5">{t.customerTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex gap-2">
                <User className="w-4 h-4 text-navy-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="section-eyebrow">{t.fullName}</span>
                  <span className="text-navy-900 font-semibold block mt-1">{booking.customerName}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Phone className="w-4 h-4 text-navy-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="section-eyebrow">{t.phone}</span>
                  <span className="text-navy-900 font-semibold block mt-1">{booking.customerPhone || "—"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Mail className="w-4 h-4 text-navy-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="section-eyebrow">{t.email}</span>
                  <span className="text-navy-900 font-semibold block mt-1 truncate">{booking.customerEmail || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-navy-950 text-white rounded-lg border border-navy-800 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-navy-800 pb-3">
              <div className="p-2 bg-navy-900 rounded-lg text-navy-200 border border-navy-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide">{t.aiTitle}</h3>
                <p className="text-[10px] text-navy-400">{t.aiSub}</p>
              </div>
            </div>

            {aiSummary ? (
              <div className="space-y-3">
                <p className="text-xs text-navy-300 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                <button
                  onClick={generateAISummary}
                  disabled={loadingAI}
                  className="text-[10px] text-navy-400 hover:text-navy-200 underline font-semibold"
                >
                  {t.aiRegen}
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-1">
                <p className="text-xs text-navy-400 leading-relaxed">{t.aiPlaceholder}</p>
                <button
                  onClick={generateAISummary}
                  disabled={loadingAI}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-navy-100 border border-navy-700 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  id="btn-generate-ai-brief"
                >
                  {loadingAI ? (
                    <span className="inline-block h-3.5 w-24 bg-white/20 rounded animate-pulse" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t.aiBtn}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="card-surface p-5 space-y-4">
            <h3 className="section-eyebrow border-b border-navy-100 pb-2.5">{t.progressTitle}</h3>
            <div className="relative pl-5 border-l border-navy-100 space-y-5 text-xs">
              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 bg-navy-900 rounded-full border border-white" />
                <p className="font-semibold text-navy-950">{t.progressSubmitted}</p>
                <p className="text-[10px] text-navy-400 mt-0.5">{booking.date}</p>
              </div>
              <div className="relative">
                <span
                  className={`absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full border border-white ${booking.status === "Pending" ? "bg-amber-500" : "bg-navy-900"
                    }`}
                />
                <p className="font-semibold text-navy-950">{t.progressReview}</p>
              </div>
              <div className="relative">
                <span
                  className={`absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full border border-white ${booking.status !== "Pending" ? "bg-navy-900" : "bg-navy-200"
                    }`}
                />
                <p className={`font-semibold ${booking.status !== "Pending" ? "text-navy-950" : "text-navy-400"}`}>
                  {t.progressDecision}
                </p>
                {booking.status !== "Pending" && (
                  <p className="text-[10px] text-navy-500 mt-0.5">{booking.status}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction === "approve"}
        title={c.approveTitle}
        message={c.approveMessage}
        confirmLabel={c.approveConfirm}
        cancelLabel={c.cancel}
        variant="default"
        loading={actionLoading}
        onConfirm={handleApprove}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === "reject"}
        title={c.rejectTitle}
        message={c.rejectMessage}
        confirmLabel={c.rejectConfirm}
        cancelLabel={c.cancel}
        variant="danger"
        loading={actionLoading}
        onConfirm={handleReject}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
