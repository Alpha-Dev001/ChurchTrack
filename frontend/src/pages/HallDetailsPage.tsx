import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, CheckCircle2, Phone, Mail, ShieldCheck, Building } from "lucide-react";
import { Hall, SystemSettings } from "../types";
import toast from "react-hot-toast";
import { useData } from "../contexts/DataContext";
import { HallDetailsSkeleton } from "../components/Skeletons";
import { safeFetchJson } from "../lib/api";
import {
  parseWorkingHours,
  buildTimeOptions,
  formatMinutesToDisplay,
  formatTimeSlot,
  formatDurationLabel,
} from "../lib/timeUtils";
import SEO from "../components/SEO";

interface HallDetailsPageProps {
  lang?: string;
  hall: Hall;
  onNavigate: (view: string, params?: any) => void;
}

const tDetails: Record<string, any> = {
  EN: {
    home: "Home",
    halls: "Halls",
    availableDays: "Open daily",
    capacityLabel: "Capacity",
    capacityDesc: "Seat capacity",
    sizeLabel: "Hall Size",
    sizeDesc: "Total floor area",
    hoursLabel: "Working Hours",
    hoursDesc: "Daily availability",
    priceLabel: "Starting Price",
    priceDesc: "Base venue rental",
    guestsSuffix: "Guests",
    facilitiesTitle: "Facilities & Amenities",
    aboutTitle: "About This Hall",
    baseRental: "Base Rental",
    dayRate: " / day",
    realTime: "Real-time availability check",
    noReg: "No account required",
    selectDateTime: "Select Date & Time",
    btnBook: "Continue to Booking",
    contactTitle: "Contact Parish",
    contactHours: "Mon – Sat: 8:00 AM – 5:00 PM",
    selectSlotAlert: "Please choose a valid start and end time within the hall hours.",
    startTime: "Start time",
    endTime: "End time",
    durationLabel: "Duration",
    openHoursHint: "Choose any period within",
    invalidRange: "End time must be after start time.",
    outsideHours: "Selected times must be within the hall working hours.",
  },
  FR: {
    home: "Accueil",
    halls: "Salles",
    availableDays: "Ouvert tous les jours",
    capacityLabel: "Capacité",
    capacityDesc: "Places assises",
    sizeLabel: "Taille de la salle",
    sizeDesc: "Surface totale",
    hoursLabel: "Heures d'ouverture",
    hoursDesc: "Disponibilité quotidienne",
    priceLabel: "Prix de départ",
    priceDesc: "Location de base",
    guestsSuffix: "Invités",
    facilitiesTitle: "Équipements & Commodités",
    aboutTitle: "À propos de cette salle",
    baseRental: "Location de base",
    dayRate: " / jour",
    realTime: "Vérification en temps réel",
    noReg: "Aucun compte requis",
    selectDateTime: "Choisir la date et l'heure",
    btnBook: "Continuer la réservation",
    contactTitle: "Contacter la paroisse",
    contactHours: "Lun – Sam : 8h00 – 17h00",
    selectSlotAlert: "Veuillez choisir une heure de début et de fin valides.",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    durationLabel: "Durée",
    openHoursHint: "Choisissez une période entre",
    invalidRange: "L'heure de fin doit être après l'heure de début.",
    outsideHours: "Les horaires choisis doivent être dans les heures d'ouverture.",
  },
  RW: {
    home: "Ahabanza",
    halls: "Ibyumba",
    availableDays: "Bifungura buri munsi",
    capacityLabel: "Ubushobozi",
    capacityDesc: "Intego y'abantu",
    sizeLabel: "Ingano y'Icyumba",
    sizeDesc: "Ubuso bwose",
    hoursLabel: "Amasaha yo Gukora",
    hoursDesc: "Buri munsi",
    priceLabel: "Ikiguzi fatizo",
    priceDesc: "Igiciro cy'ibanze",
    guestsSuffix: "Abatumirwa",
    facilitiesTitle: "Ibikoresho & Serivisi",
    aboutTitle: "Ibyerekeye Icyumba",
    baseRental: "Ikiguzi cy'Ibanze",
    dayRate: " / munsi",
    realTime: "Reba ububoneke ako kanya",
    noReg: "Nta konti isabwa",
    selectDateTime: "Hitamo Itariki n'Amasaha",
    btnBook: "Komeza Ukodeshe",
    contactTitle: "Vugana na Paruwasi",
    contactHours: "Kuwa Mbere – Kuwa Gatandatu: 8:00 – 17:00",
    selectSlotAlert: "Hitamo isaha yo gutangira n'iyo kurangiza.",
    startTime: "Isaha yo gutangira",
    endTime: "Isaha yo kurangiza",
    durationLabel: "Igihe",
    openHoursHint: "Hitamo igihe kiri hagati ya",
    invalidRange: "Isaha yo kurangiza igomba kuba inyuma y'iyo gutangira.",
    outsideHours: "Amasaha wahisemo agomba kuba mu masaha yo gukora.",
  },
};

function formatPrice(price: number) {
  const value = price >= 1000 ? price : price * 1000;
  return new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(value);
}

export default function HallDetailsPage({ lang = "EN", hall, onNavigate }: HallDetailsPageProps) {
  const { hallsLoading } = useData();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [selectedServiceType, setSelectedServiceType] = useState<'SalleHub' | 'ChurchTrack'>('SalleHub');
  const [errorText, setErrorText] = useState("");
  const [continuing, setContinuing] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const seoData = {
    EN: {
      title: `${hall.name} - Book This Hall | ChurchTrack`,
      description: `Book ${hall.name} located in ${hall.location}. Capacity: ${hall.capacity} guests. Perfect for weddings, conferences, and special events. View details and check availability.`,
      keywords: `${hall.name}, ${hall.location}, parish hall, church venue, wedding venue, event space, hall booking`,
      lang: "en"
    },
    FR: {
      title: `${hall.name} - Réserver cette salle | ChurchTrack`,
      description: `Réservez ${hall.name} situé à ${hall.location}. Capacité: ${hall.capacity} invités. Parfait pour mariages, conférences et événements spéciaux.`,
      keywords: `${hall.name}, ${hall.location}, salle paroissiale, lieu de mariage, espace événementiel, réservation`,
      lang: "fr"
    },
    RW: {
      title: `${hall.name} - Kodesha Icyumba | ChurchTrack`,
      description: `Kodesha ${hall.name} iri mu ${hall.location}. Ubushobozi: ${hall.capacity} abatumirwa. Nziza ku bw'ubukwe, inama n'ibirori by'umuryango.`,
      keywords: `${hall.name}, ${hall.location}, icyumba cya paruwasi, ahantu y'ibirori, gukodesha`,
      lang: "rw"
    }
  };

  const currentSeo = seoData[lang as keyof typeof seoData] || seoData.EN;

  useEffect(() => {
    safeFetchJson<SystemSettings>('/api/settings')
      .then(data => setSettings(data))
      .catch(() => { /* keep defaults */ });
  }, []);

  const hours = useMemo(() => parseWorkingHours(hall?.workingHours), [hall?.workingHours]);
  const startOptions = useMemo(
    () => buildTimeOptions(hours.openMinutes, hours.closeMinutes, 30, false),
    [hours]
  );

  const [startMinutes, setStartMinutes] = useState(() => hours.openMinutes);
  const endOptions = useMemo(() => {
    const minEnd = startMinutes + 30;
    return buildTimeOptions(minEnd, hours.closeMinutes, 30, true).filter((t) => t > startMinutes);
  }, [startMinutes, hours.closeMinutes]);

  const [endMinutes, setEndMinutes] = useState(() => Math.min(hours.openMinutes + 60, hours.closeMinutes));

  useEffect(() => {
    setStartMinutes(hours.openMinutes);
    setEndMinutes(Math.min(hours.openMinutes + 60, hours.closeMinutes));
  }, [hours.openMinutes, hours.closeMinutes]);

  useEffect(() => {
    if (endMinutes <= startMinutes) {
      const next = endOptions[0] ?? Math.min(startMinutes + 60, hours.closeMinutes);
      if (next > startMinutes) setEndMinutes(next);
    }
  }, [startMinutes, endOptions, endMinutes, hours.closeMinutes]);

  const durationLabel = formatDurationLabel(startMinutes, endMinutes, lang);
  const t = tDetails[lang] || tDetails.EN;

  if (hallsLoading || !hall) {
    return <HallDetailsSkeleton />;
  }

  const handleContinueBooking = () => {
    if (endMinutes <= startMinutes) {
      setErrorText(t.invalidRange);
      toast.error(t.invalidRange);
      return;
    }
    if (startMinutes < hours.openMinutes || endMinutes > hours.closeMinutes) {
      setErrorText(t.outsideHours);
      toast.error(t.outsideHours);
      return;
    }
    if (!selectedDate) {
      setErrorText(t.selectSlotAlert);
      toast.error(t.selectSlotAlert);
      return;
    }
    setErrorText("");
    setContinuing(true);
    onNavigate("visitor-booking", {
      hallId: hall.id,
      date: selectedDate,
      timeSlot: formatTimeSlot(startMinutes, endMinutes),
      duration: durationLabel,
      guests: hall.capacity,
      serviceType: selectedServiceType,
    });
  };

  const images = hall.images?.length ? hall.images : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"];

  return (
    <React.Fragment>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonical={`https://sallehub.vercel.app/halls/${hall.id}`}
        lang={currentSeo.lang}
        structuredData={{
          "@type": "WebPage",
          "name": hall.name,
          "description": hall.description,
          "url": `https://sallehub.vercel.app/halls/${hall.id}`
        }}
      />
      <div className="font-sans text-navy-800" id="hall-details-page-root">
        <section className="bg-navy-50 border-b border-navy-200 py-3.5 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs font-medium text-navy-500">
            <button onClick={() => onNavigate("visitor-home")} className="hover:text-navy-900 cursor-pointer">
              {t.home}
            </button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => onNavigate("visitor-catalogue")} className="hover:text-navy-900 cursor-pointer">
              {t.halls}
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-navy-950 font-semibold">{hall.name}</span>
          </div>
        </section>

        <div className="max-w-5xl mx-auto py-6 md:py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Mobile: Booking card appears right after image gallery, before description */}
          <div className="md:col-span-2 space-y-6 md:space-y-8 text-left">
            {/* Hall Name — appears on top of image */}
            <div className="space-y-2">
              <p className="section-eyebrow flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {t.availableDays}
              </p>
              <h1 className="text-3xl md:text-4xl font-serif font-normal text-navy-950 leading-snug">{hall.name}</h1>
              <p className="text-sm text-navy-500 font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-navy-400" />
                {hall.location}
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative h-56 md:h-96 bg-navy-100 rounded-lg overflow-hidden border border-navy-200">
                <img
                  src={images[activeImgIdx]}
                  alt={hall.name}
                  className="w-full h-full object-cover select-none"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-navy-900 rounded-lg border border-navy-200 transition cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-navy-900 rounded-lg border border-navy-200 transition cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`w-20 h-14 rounded overflow-hidden border flex-shrink-0 transition cursor-pointer ${idx === activeImgIdx ? "border-navy-900" : "border-navy-200 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Booking Card — appears right after gallery on mobile */}
            <div className="md:hidden card-surface p-5 space-y-5 shadow-sm">
              <div className="flex justify-between items-baseline">
                <span className="section-eyebrow">{t.baseRental}</span>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-navy-950">RWF {formatPrice(hall.price)}</span>
                  <span className="text-xs text-navy-500 font-medium">{t.dayRate}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-navy-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-medium text-navy-600">
                  <Clock className="w-4 h-4 text-navy-700" />
                  <span>{t.realTime}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-navy-600">
                  <ShieldCheck className="w-4 h-4 text-navy-700" />
                  <span>{t.noReg}</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-navy-100 pt-4">
                <h4 className="section-eyebrow">{t.selectDateTime}</h4>
                <p className="text-[11px] text-navy-500 font-medium">
                  {t.openHoursHint} {hall.workingHours || hours.label}
                </p>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayIso}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field !py-2.5 !text-xs font-semibold"
                  id="details-date-picker-mobile"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="section-eyebrow" htmlFor="details-start-time-mobile">
                      {t.startTime}
                    </label>
                    <select
                      id="details-start-time-mobile"
                      value={startMinutes}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setStartMinutes(next);
                        if (endMinutes <= next) {
                          const candidate = Math.min(next + 60, hours.closeMinutes);
                          setEndMinutes(candidate > next ? candidate : next + 30);
                        }
                      }}
                      className="input-field !py-2.5 !text-xs font-semibold"
                    >
                      {startOptions.map((mins) => (
                        <option key={mins} value={mins}>
                          {formatMinutesToDisplay(mins)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="section-eyebrow" htmlFor="details-end-time-mobile">
                      {t.endTime}
                    </label>
                    <select
                      id="details-end-time-mobile"
                      value={endMinutes}
                      onChange={(e) => setEndMinutes(Number(e.target.value))}
                      className="input-field !py-2.5 !text-xs font-semibold"
                    >
                      {(endOptions.length > 0 ? endOptions : [Math.min(startMinutes + 30, hours.closeMinutes)]).map(
                        (mins) => (
                          <option key={mins} value={mins}>
                            {formatMinutesToDisplay(mins)}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-navy-50 border border-navy-100 px-3 py-2.5">
                  <span className="section-eyebrow">{t.durationLabel}</span>
                  <span className="text-xs font-semibold text-navy-950">{durationLabel}</span>
                </div>
                <p className="text-[11px] font-medium text-navy-600">{formatTimeSlot(startMinutes, endMinutes)}</p>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('SalleHub')}
                    className={`py-2 text-[11px] font-semibold rounded-xl border ${selectedServiceType === 'SalleHub'
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50'} transition`}
                  >
                    SalleHub
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('ChurchTrack')}
                    className={`py-2 text-[11px] font-semibold rounded-xl border ${selectedServiceType === 'ChurchTrack'
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50'} transition`}
                  >
                    ChurchTrack Wedding
                  </button>
                </div>

                {selectedServiceType === 'ChurchTrack' && (
                  <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-950">
                    ChurchTrack wedding requests are submitted using ChurchTrack service rules. Please select a 12:00 PM, 02:00 PM, or 04:00 PM slot and avoid Sundays.
                  </div>
                )}

                {errorText && <p className="text-red-600 text-xs font-semibold">{errorText}</p>}

                <button
                  onClick={handleContinueBooking}
                  disabled={continuing}
                  className="btn-primary w-full disabled:opacity-60"
                  id="details-continue-booking-btn-mobile"
                >
                  {continuing ? (
                    <span className="inline-block h-3.5 w-28 bg-white/30 rounded animate-pulse" />
                  ) : (
                    t.btnBook
                  )}
                </button>
              </div>
            </div>
            {/* END md:hidden mobile booking card */}

            {/* Stats, Facilities & About — shown on all screen sizes */}
            <div className="space-y-5">
              <div className="border-b border-navy-100 pb-2"></div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t.capacityLabel, val: `${hall.capacity} ${t.guestsSuffix}`, desc: t.capacityDesc },
                  { label: t.sizeLabel, val: hall.size || "—", desc: t.sizeDesc },
                  { label: t.hoursLabel, val: hall.workingHours || hours.label, desc: t.hoursDesc },
                  { label: t.priceLabel, val: `RWF ${formatPrice(hall.price)}`, desc: t.priceDesc },
                ].map((tag) => (
                  <div key={tag.label} className="card-surface p-4 text-left">
                    <span className="section-eyebrow">{tag.label}</span>
                    <span className="text-sm font-semibold text-navy-950 block mt-1.5">{tag.val}</span>
                    <span className="text-[11px] text-navy-500 block mt-0.5 font-medium">{tag.desc}</span>
                  </div>
                ))}
              </div>

              {hall.facilities?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-navy-950 border-b border-navy-100 pb-2">{t.facilitiesTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hall.facilities.map((fac) => (
                      <div
                        key={fac}
                        className="flex items-center gap-2 px-3 py-2.5 border border-navy-100 rounded-lg text-xs font-medium text-navy-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-navy-700 flex-shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-navy-950 border-b border-navy-100 pb-2">{t.aboutTitle}</h3>
                <p className="text-navy-600 text-sm leading-relaxed font-medium">{hall.description}</p>
              </div>
            </div>

            <div className="hidden md:block space-y-5 md:sticky md:top-24 self-start">
              <div className="card-surface p-5 space-y-5 shadow-sm">
                <div className="flex justify-between items-baseline">
                  <span className="section-eyebrow">{t.baseRental}</span>
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-navy-950">RWF {formatPrice(hall.price)}</span>
                    <span className="text-xs text-navy-500 font-medium">{t.dayRate}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-navy-100 pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-navy-600">
                    <Clock className="w-4 h-4 text-navy-700" />
                    <span>{t.realTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-navy-600">
                    <ShieldCheck className="w-4 h-4 text-navy-700" />
                    <span>{t.noReg}</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-navy-100 pt-4">
                  <h4 className="section-eyebrow">{t.selectDateTime}</h4>
                  <p className="text-[11px] text-navy-500 font-medium">
                    {t.openHoursHint} {hall.workingHours || hours.label}
                  </p>
                  <input
                    type="date"
                    value={selectedDate}
                    min={todayIso}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field !py-2.5 !text-xs font-semibold"
                    id="details-date-picker"
                  />

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="section-eyebrow" htmlFor="details-start-time">
                        {t.startTime}
                      </label>
                      <select
                        id="details-start-time"
                        value={startMinutes}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          setStartMinutes(next);
                          if (endMinutes <= next) {
                            const candidate = Math.min(next + 60, hours.closeMinutes);
                            setEndMinutes(candidate > next ? candidate : next + 30);
                          }
                        }}
                        className="input-field !py-3 md:!py-2.5 !text-xs font-semibold"
                      >
                        {startOptions.map((mins) => (
                          <option key={mins} value={mins}>
                            {formatMinutesToDisplay(mins)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="section-eyebrow" htmlFor="details-end-time">
                        {t.endTime}
                      </label>
                      <select
                        id="details-end-time"
                        value={endMinutes}
                        onChange={(e) => setEndMinutes(Number(e.target.value))}
                        className="input-field !py-3 md:!py-2.5 !text-xs font-semibold"
                      >
                        {(endOptions.length > 0 ? endOptions : [Math.min(startMinutes + 30, hours.closeMinutes)]).map(
                          (mins) => (
                            <option key={mins} value={mins}>
                              {formatMinutesToDisplay(mins)}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-navy-50 border border-navy-100 px-3 py-2.5">
                    <span className="section-eyebrow">{t.durationLabel}</span>
                    <span className="text-xs font-semibold text-navy-950">{durationLabel}</span>
                  </div>
                  <p className="text-[11px] font-medium text-navy-600">{formatTimeSlot(startMinutes, endMinutes)}</p>
                </div>

                {errorText && <p className="text-red-600 text-xs font-semibold">{errorText}</p>}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('SalleHub')}
                    className={`py-2 text-[11px] font-semibold rounded-xl border ${selectedServiceType === 'SalleHub'
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50'} transition`}
                  >
                    SalleHub
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('ChurchTrack')}
                    className={`py-2 text-[11px] font-semibold rounded-xl border ${selectedServiceType === 'ChurchTrack'
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50'} transition`}
                  >
                    ChurchTrack Wedding
                  </button>
                </div>

                <button
                  onClick={handleContinueBooking}
                  disabled={continuing}
                  className="btn-primary w-full disabled:opacity-60"
                  id="details-continue-booking-btn"
                >
                  {continuing ? (
                    <span className="inline-block h-3.5 w-28 bg-white/30 rounded animate-pulse" />
                  ) : (
                    t.btnBook
                  )}
                </button>
              </div>

              <div className="card-surface bg-navy-50 p-5 space-y-4">
                <h3 className="section-eyebrow">{t.contactTitle}</h3>
                <div className="space-y-2.5 text-xs font-medium text-navy-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-navy-400" />
                    <span>{settings?.siteName || "ChurchTrack"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-navy-400" />
                    <span>{settings?.address || "Kigali, Rwanda"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-navy-400" />
                    <span>{settings?.phone || "+250 788 000 000"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-navy-400" />
                    <span>{settings?.email || "info@sallehub.rw"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-navy-400" />
                    <span>{settings?.workingHours || t.contactHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

