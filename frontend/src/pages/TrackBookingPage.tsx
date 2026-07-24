import React, { useState, useEffect } from "react";
import { Search, HelpCircle, Info, User, Calendar, Clock, Users, Mail, Hash, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { safeFetchJson } from "../lib/api";
import { trackBookingSchema, TrackBookingFormData } from "../lib/schemas";
import { TrackBookingSkeleton } from "../components/Skeletons";
import SEO from "../components/SEO";

interface TrackBookingPageProps {
  lang?: string;
  initialCode?: string;
  onNavigate: (view: string, params?: any) => void;
}

const tTrack: Record<string, any> = {
  EN: {
    eyebrow: "Live verification",
    title: "Track Your Booking",
    desc: "Search by booking reference, email address, or full name to see your assigned reservation and progress.",
    placeholder: "Reference, email, or full name",
    btnTrack: "Track Status",
    invalidCodeError: "No booking found for that search. Check your spelling and try again.",
    genericError: "Could not look up your booking. Please try again.",
    statusLabel: "Booking Status",
    dateLabel: "Date",
    slotLabel: "Time Slot",
    guestsLabel: "Guests",
    guestsSuffix: "Guests",
    typeLabel: "Event Type",
    timelineTitle: "Booking Progress",
    guideTitle: "Parish Guide",
    pendingStatus: "Pending",
    pendingDesc: "Your request is being reviewed for schedule conflicts.",
    approvedStatus: "Approved",
    approvedDesc: "Your slot is secured. Check email for payment details.",
    verifiedStatus: "Rejected / Cancelled",
    verifiedDesc: "This request was declined. Contact the parish office for options.",
    noResults: "Enter a booking reference, email, or name to begin.",
    resultsTitle: "Matching bookings",
    selectHint: "Select a booking to view progress",
    refLabel: "Reference",
    guestLabel: "Guest",
    emptyTitle: "Find your reservation",
    emptyDesc: "Use any of these details from your confirmation email to pull up live status.",
    tipRefTitle: "Booking reference",
    tipRefDesc: "The code sent after you submit a request (for example SH-2041).",
    tipEmailTitle: "Email address",
    tipEmailDesc: "The email you used when requesting the hall.",
    tipNameTitle: "Full name",
    tipNameDesc: "The guest name on the booking, spelled as submitted.",
  },
  FR: {
    eyebrow: "Suivi en direct",
    title: "Suivre Votre Réservation",
    desc: "Recherchez par référence, e-mail ou nom complet pour voir votre réservation et sa progression.",
    placeholder: "Référence, e-mail ou nom complet",
    btnTrack: "Suivre l'état",
    invalidCodeError: "Aucune réservation trouvée. Vérifiez l'orthographe et réessayez.",
    genericError: "Impossible de localiser la réservation. Veuillez réessayer.",
    statusLabel: "Statut de la demande",
    dateLabel: "Date",
    slotLabel: "Créneau horaire",
    guestsLabel: "Invités",
    guestsSuffix: "Invités",
    typeLabel: "Type d'événement",
    timelineTitle: "Progression de la demande",
    guideTitle: "Guide paroissial",
    pendingStatus: "En attente",
    pendingDesc: "Votre demande est en cours d'examen pour éviter les conflits d'horaire.",
    approvedStatus: "Approuvé",
    approvedDesc: "Votre créneau est sécurisé. Vérifiez vos e-mails pour le paiement.",
    verifiedStatus: "Rejeté / Annulé",
    verifiedDesc: "Cette demande a été refusée. Contactez le bureau paroissial.",
    noResults: "Entrez une référence, un e-mail ou un nom pour commencer.",
    resultsTitle: "Réservations correspondantes",
    selectHint: "Sélectionnez une réservation pour voir la progression",
    refLabel: "Référence",
    guestLabel: "Invité",
    emptyTitle: "Retrouvez votre réservation",
    emptyDesc: "Utilisez l'un de ces éléments de votre e-mail de confirmation pour voir le statut en direct.",
    tipRefTitle: "Référence de réservation",
    tipRefDesc: "Le code envoyé après votre demande (par exemple SH-2041).",
    tipEmailTitle: "Adresse e-mail",
    tipEmailDesc: "L'e-mail utilisé lors de la demande de salle.",
    tipNameTitle: "Nom complet",
    tipNameDesc: "Le nom de l'invité sur la réservation, tel qu'indiqué.",
  },
  RW: {
    eyebrow: "Gukurikirana ubusabe",
    title: "Kurikirana Ubusabe Bwawe",
    desc: "Shakisha ukoresheje kode, imeri, cyangwa amazina yose urebe ubusabe n'aho bugeze.",
    placeholder: "Kode, imeri, cyangwa amazina",
    btnTrack: "Reba aho Bugeze",
    invalidCodeError: "Nta busabe bwabonetse. Genzura neza hanyuma ugerageze.",
    genericError: "Ntitwabashije kubona ubusabe. Ongera ugerageze.",
    statusLabel: "Aho Ubusabe Bugeze",
    dateLabel: "Itariki",
    slotLabel: "Amasaha",
    guestsLabel: "Abatumirwa",
    guestsSuffix: "Abantu",
    typeLabel: "Igikorwa",
    timelineTitle: "Aho Ubusabe Bugeze",
    guideTitle: "Inyigisho za Paruwasi",
    pendingStatus: "Bitegereje",
    pendingDesc: "Ubusabe buri gusuzumwa ngo hirindwe double booking.",
    approvedStatus: "Byemejwe",
    approvedDesc: "Icyumba cyateganyijwe. Reba imeri yawe ubone amabwiriza yo kwishyura.",
    verifiedStatus: "Byanzwe / Byahagaritswe",
    verifiedDesc: "Ubu busabe bwanze. Vugana n'ibiro bya paruwasi.",
    noResults: "Andika kode, imeri, cyangwa amazina kugira ngo utangire.",
    resultsTitle: "Ubusabe bwabonetse",
    selectHint: "Hitamo ubusabe urebe aho bugeze",
    refLabel: "Kode",
    guestLabel: "Umukiriya",
    emptyTitle: "Shakisha ubusabe bwawe",
    emptyDesc: "Koresha kimwe muri ibi bivuye mu imeri yawe yo kwemeza kugira ngo urebe aho bugeze.",
    tipRefTitle: "Kode y'ubusabe",
    tipRefDesc: "Kode woherejwe nyuma yo kohereza ubusabe (urugero SH-2041).",
    tipEmailTitle: "Aderesi ya imeri",
    tipEmailDesc: "Imeri wakoresheje usaba icyumba.",
    tipNameTitle: "Amazina yose",
    tipNameDesc: "Amazina y'umukiriya ku busabe, nkuko byanditswe.",
  },
};

export default function TrackBookingPage({ lang = "EN", initialCode = "" }: TrackBookingPageProps) {
  const [results, setResults] = useState<any[]>([]);
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const t = tTrack[lang] || tTrack.EN;

  const seoData = {
    EN: {
      title: "Track Your Booking - SalleHub",
      description: "Track your parish hall booking status. Enter your booking reference to see real-time updates on your reservation.",
      keywords: "track booking, booking status, parish hall booking, reservation tracker, booking reference",
      lang: "en"
    },
    FR: {
      title: "Suivre Votre Réservation - SalleHub",
      description: "Suivez le statut de votre réservation de salle paroissiale. Entrez votre référence pour voir les mises à jour en temps réel.",
      keywords: "suivi réservation, statut réservation, salle paroissiale, tracker réservation, référence",
      lang: "fr"
    },
    RW: {
      title: "Kurikirana Ubusabe Bwawe - SalleHub",
      description: "Reba aho ubusabe bwawe bwo kukodesha icyumba bgeze. Andika kode yawe ubone amakuru y'igihe nyacyo.",
      keywords: "kurikirana ubusabe, aho ubusabe bgeze, kukodesha icyumba, kode y'ubusabe",
      lang: "rw"
    }
  };

  const currentSeo = seoData[lang as keyof typeof seoData] || seoData.EN;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrackBookingFormData>({
    resolver: zodResolver(trackBookingSchema),
    defaultValues: { code: initialCode },
  });

  const getTimelineStepTitle = (title: string) => {
    if (lang === "FR") {
      const lower = title.toLowerCase();
      if (lower.includes("submitted") || lower.includes("request")) return "Demande soumise";
      if (lower.includes("review") || lower.includes("office")) return "Examen de la paroisse";
      if (lower.includes("approve") || lower.includes("accepted")) return "Demande approuvée";
      if (lower.includes("reject")) return "Demande rejetée";
      if (lower.includes("payment") || lower.includes("verify")) return "Paiement validé";
      if (lower.includes("confirm")) return "Réservation confirmée";
    }
    if (lang === "RW") {
      const lower = title.toLowerCase();
      if (lower.includes("submitted") || lower.includes("request")) return "Ubusabe bwoherejwe";
      if (lower.includes("review") || lower.includes("office")) return "Isesengura rya paruwasi";
      if (lower.includes("approve") || lower.includes("accepted")) return "Byemejwe na paruwasi";
      if (lower.includes("reject")) return "Ubusabe bwanze";
      if (lower.includes("payment") || lower.includes("verify")) return "Ubwishyure bwemejwe";
      if (lower.includes("confirm")) return "Byemejwe burundu";
    }
    return title;
  };

  const getTimelineStepDesc = (desc: string) => {
    if (lang === "FR") {
      const lower = desc.toLowerCase();
      if (lower.includes("received") || lower.includes("under review")) return "Votre demande a été enregistrée et est en cours d'examen.";
      if (lower.includes("approved")) return "La paroisse a approuvé votre créneau.";
      if (lower.includes("rejected")) return "La paroisse a rejeté votre demande.";
    }
    if (lang === "RW") {
      const lower = desc.toLowerCase();
      if (lower.includes("received") || lower.includes("under review")) return "Ubusabe bwakiriwe kandi buri gusuzumwa.";
      if (lower.includes("approved")) return "Paruwasi yemeje igihe cyanyu.";
      if (lower.includes("rejected")) return "Paruwasi yanze ubusabe bwanyu.";
    }
    return desc;
  };

  const getEventTypeTranslated = (type: string) => {
    if (lang === "FR") {
      if (type === "Wedding") return "Mariage";
      if (type === "Conference") return "Conférence";
      if (type === "Meeting") return "Réunion";
      if (type === "Seminar") return "Séminaire";
      if (type === "Celebration") return "Célébration";
    }
    if (lang === "RW") {
      if (type === "Wedding") return "Ubukwe";
      if (type === "Conference") return "Inama";
      if (type === "Meeting") return "Inama y'umuryango";
      if (type === "Seminar") return "Amahugurwa";
      if (type === "Celebration") return "Ibirori";
    }
    return type;
  };

  const statusClass = (status: string) => {
    if (status === "Approved") return "bg-emerald-50 text-emerald-700";
    if (status === "Pending") return "bg-amber-50 text-amber-700";
    return "bg-navy-100 text-navy-600";
  };

  const statusLabel = (status: string) => {
    if (status === "Approved") return t.approvedStatus;
    if (status === "Pending") return t.pendingStatus;
    return t.verifiedStatus;
  };

  const fetchBookings = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setSearched(true);
    setBooking(null);
    setResults([]);

    try {
      const data = await safeFetchJson<{ results: any[] }>(
        `/api/bookings/track/search?q=${encodeURIComponent(query.trim())}`
      );
      const list = Array.isArray(data?.results) ? data.results : [];
      if (list.length === 0) {
        setErrorMsg(t.invalidCodeError);
        toast.error(t.invalidCodeError);
        return;
      }
      setResults(list);
      setBooking(list[0]);
    } catch (err: any) {
      setErrorMsg(err.message || t.genericError);
      toast.error(err.message || t.genericError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      setValue("code", initialCode);
      fetchBookings(initialCode);
    }
  }, [initialCode, setValue]);

  const onTrackSubmit = (data: TrackBookingFormData) => {
    fetchBookings(data.code);
  };

  return (
    <div className="font-sans text-navy-800 text-left" id="track-booking-root">
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonical="https://sallehub.vercel.app/track"
        lang={currentSeo.lang}
      />
      <section className="relative bg-navy-950 text-white py-12 px-4 overflow-hidden border-b border-navy-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-navy-950/80" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto space-y-3">
          <span className="section-eyebrow text-navy-400">{t.eyebrow}</span>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight">{t.title}</h1>
          <p className="text-navy-300 text-sm md:text-base max-w-xl font-light">{t.desc}</p>
        </div>
      </section>

      <div className="py-12 px-4 max-w-5xl mx-auto space-y-8">
        <div className="card-surface p-5 shadow-sm max-w-xl">
          <form onSubmit={handleSubmit(onTrackSubmit)} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder={t.placeholder}
                {...register("code")}
                className={`w-full pl-9 pr-4 py-2.5 bg-navy-50 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 text-navy-800 ${
                  errors.code ? "border-red-400 focus:ring-red-500/20" : "border-navy-200 focus:ring-navy-900/20"
                }`}
                id="track-reference-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary !py-2.5 disabled:opacity-50"
              id="track-submit-btn"
            >
              {loading ? (
                <span className="inline-block h-3.5 w-20 bg-white/30 rounded animate-pulse" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.btnTrack}</span>
                </>
              )}
            </button>
          </form>

          {(errorMsg || errors.code) && (
            <p className="text-red-600 text-[11px] font-semibold mt-3 flex items-center gap-1.5" id="track-error-message">
              <Info className="w-4 h-4 text-red-500" />
              <span>{errors.code?.message || errorMsg}</span>
            </p>
          )}
        </div>

        {loading && <TrackBookingSkeleton />}

        {!loading && !searched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 card-surface p-6 space-y-5 shadow-sm">
              <div>
                <h2 className="text-lg font-serif text-navy-950 tracking-tight">{t.emptyTitle}</h2>
                <p className="text-[12px] text-navy-500 font-medium mt-1.5 leading-relaxed max-w-lg">{t.emptyDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 p-4 rounded-lg bg-navy-50 border border-navy-100">
                  <div className="w-8 h-8 rounded-lg bg-white border border-navy-200 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-navy-700" />
                  </div>
                  <p className="text-xs font-semibold text-navy-950">{t.tipRefTitle}</p>
                  <p className="text-[11px] text-navy-500 font-medium leading-relaxed">{t.tipRefDesc}</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-navy-50 border border-navy-100">
                  <div className="w-8 h-8 rounded-lg bg-white border border-navy-200 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-navy-700" />
                  </div>
                  <p className="text-xs font-semibold text-navy-950">{t.tipEmailTitle}</p>
                  <p className="text-[11px] text-navy-500 font-medium leading-relaxed">{t.tipEmailDesc}</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-navy-50 border border-navy-100">
                  <div className="w-8 h-8 rounded-lg bg-white border border-navy-200 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-navy-700" />
                  </div>
                  <p className="text-xs font-semibold text-navy-950">{t.tipNameTitle}</p>
                  <p className="text-[11px] text-navy-500 font-medium leading-relaxed">{t.tipNameDesc}</p>
                </div>
              </div>
            </div>

            <div className="card-surface bg-navy-50 p-5 space-y-4">
              <h3 className="section-eyebrow flex items-center gap-2 border-b border-navy-200 pb-2.5">
                <HelpCircle className="w-4 h-4 text-navy-600" />
                {t.guideTitle}
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-navy-900 uppercase text-[10px] tracking-wide mb-1">{t.pendingStatus}</p>
                  <p className="text-navy-500 font-medium text-[11px] leading-relaxed">{t.pendingDesc}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900 uppercase text-[10px] tracking-wide mb-1">{t.approvedStatus}</p>
                  <p className="text-navy-500 font-medium text-[11px] leading-relaxed">{t.approvedDesc}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900 uppercase text-[10px] tracking-wide mb-1">{t.verifiedStatus}</p>
                  <p className="text-navy-500 font-medium text-[11px] leading-relaxed">{t.verifiedDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && searched && results.length > 1 && (
          <div className="card-surface p-5 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-navy-950">{t.resultsTitle}</h3>
              <p className="text-[11px] text-navy-500 font-medium mt-0.5">{t.selectHint}</p>
            </div>
            <div className="space-y-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBooking(item)}
                  className={`w-full text-left p-3.5 rounded-lg border transition cursor-pointer ${
                    booking?.id === item.id
                      ? "border-navy-900 bg-navy-50"
                      : "border-navy-100 hover:bg-navy-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-navy-950 truncate">{item.hallName}</p>
                      <p className="text-[11px] text-navy-500 font-medium mt-0.5">
                        {t.refLabel}: {item.id} · {item.customerName} · {item.date}
                      </p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && searched && booking && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="track-results-container">
            <div className="md:col-span-2 space-y-6">
              <div className="card-surface p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start gap-3 border-b border-navy-100 pb-3">
                  <div className="min-w-0">
                    <span className="section-eyebrow">{t.statusLabel}</span>
                    <p className="text-base font-semibold text-navy-950 mt-1">{booking.hallName}</p>
                    <p className="text-[11px] text-navy-500 font-medium mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {t.guestLabel}: {booking.customerName} · {booking.id}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded shrink-0 ${statusClass(booking.status)}`}>
                    {statusLabel(booking.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="section-eyebrow flex items-center gap-1"><Calendar className="w-3 h-3" />{t.dateLabel}</span>
                    <span className="text-navy-950 font-semibold block mt-1">{booking.date}</span>
                  </div>
                  <div>
                    <span className="section-eyebrow flex items-center gap-1"><Clock className="w-3 h-3" />{t.slotLabel}</span>
                    <span className="text-navy-950 font-semibold block mt-1">{booking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="section-eyebrow flex items-center gap-1"><Users className="w-3 h-3" />{t.guestsLabel}</span>
                    <span className="text-navy-950 font-semibold block mt-1">{booking.guests} {t.guestsSuffix}</span>
                  </div>
                  <div>
                    <span className="section-eyebrow">{t.typeLabel}</span>
                    <span className="text-navy-950 font-semibold block mt-1">{getEventTypeTranslated(booking.eventType)}</span>
                  </div>
                </div>
              </div>

              <div className="card-surface p-5 space-y-6 shadow-sm">
                <h3 className="text-sm font-semibold text-navy-950 border-b border-navy-100 pb-2.5">{t.timelineTitle}</h3>
                <div className="relative pl-6 border-l border-navy-200 ml-2 space-y-5">
                  {(booking.timeline || []).map((step: any, idx: number) => {
                    const isLast = idx === (booking.timeline?.length || 0) - 1;
                    return (
                      <div key={idx} className="relative">
                        <span
                          className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                            isLast
                              ? booking.status === "Approved"
                                ? "border-emerald-600 bg-emerald-600"
                                : booking.status === "Pending"
                                  ? "border-amber-500 bg-amber-500"
                                  : "border-navy-400 bg-navy-400"
                              : "border-navy-300"
                          }`}
                        />
                        <div className="space-y-1 bg-navy-50 p-3.5 rounded-lg border border-navy-100">
                          <div className="flex justify-between items-baseline gap-2 flex-wrap">
                            <h4 className="text-xs font-semibold text-navy-950">{getTimelineStepTitle(step.title)}</h4>
                            <span className="text-[10px] font-medium text-navy-400">{step.date}</span>
                          </div>
                          <p className="text-[11px] text-navy-500 leading-relaxed">{getTimelineStepDesc(step.description)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {(!booking.timeline || booking.timeline.length === 0) && (
                    <p className="text-xs text-navy-400 font-medium">—</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card-surface bg-navy-50 p-5 space-y-4">
              <h3 className="section-eyebrow flex items-center gap-2 border-b border-navy-200 pb-2.5">
                <HelpCircle className="w-4 h-4 text-navy-600" />
                {t.guideTitle}
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-navy-900 uppercase text-[10px] tracking-wide mb-1">{t.pendingStatus}</p>
                  <p className="text-navy-500 font-medium text-[11px] leading-relaxed">{t.pendingDesc}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900 uppercase text-[10px] tracking-wide mb-1">{t.approvedStatus}</p>
                  <p className="text-navy-500 font-medium text-[11px] leading-relaxed">{t.approvedDesc}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900 uppercase text-[10px] tracking-wide mb-1">{t.verifiedStatus}</p>
                  <p className="text-navy-500 font-medium text-[11px] leading-relaxed">{t.verifiedDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {searched && !booking && !loading && !errorMsg && (
          <div className="py-12 text-center">
            <p className="text-xs text-navy-400 font-medium">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
