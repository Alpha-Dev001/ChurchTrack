import React, { useState } from "react";
import { ChevronRight, Calendar, User, Phone, Mail, FileText, CheckCircle, HelpCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Hall } from "../types";
import { safeFetchJson } from "../lib/api";
import { bookingSchema, BookingFormData } from "../lib/schemas";
import SEO from "../components/SEO";

interface BookingRequestPageProps {
  lang?: string;
  hall: Hall;
  selectedParams: { date: string; timeSlot: string; duration?: string; guests: number };
  onNavigate: (view: string, params?: any) => void;
  onSubmitSuccess: (bookingDetails: any) => void;
}

// Translations dictionary for BookingRequestPage
const tBooking: Record<string, any> = {
  EN: {
    home: "Home",
    halls: "Halls",
    bookingRequest: "Booking Request",
    fillDetails: "Fill in your details to submit a booking request.",
    yourInfo: "Your Information",
    fullName: "Full Name *",
    enterName: "Enter full name",
    phone: "Phone Number *",
    email: "Email Address *",
    eventInfo: "Event Information",
    eventType: "Event Type *",
    wedding: "Wedding",
    conference: "Conference",
    meeting: "Meeting",
    seminar: "Seminar",
    celebration: "Celebration",
    numGuests: "Number of Guests *",
    addNotes: "Additional Notes (Optional)",
    notesPlaceholder: "Tell us about your event...",
    summary: "Booking Summary",
    hallName: "Hall Name:",
    date: "Date:",
    timeSlot: "Time Slot:",
    duration: "Duration:",
    basePrice: "Base Price:",
    paymentMethod: "Payment Method",
    bankTransfer: "Bank Transfer",
    momo: "Mobile Money",
    card: "Card",
    agreeTo: "I agree to the Terms & Conditions and Privacy Policy.",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    submitBtn: "Submit Booking Request",
    submittingBtn: "Submitting request...",
    needHelp: "Need Help?",
    helpDesc: "Contact parish office at +250 781 234 567 or email info@sallehub.rw for rapid support.",
    fillFieldsError: "Please fill out all required fields correctly.",
    agreeError: "You must accept the Terms & Conditions and Privacy Policy to proceed.",
    submitError: "Failed to submit request. Please check overlapping approved reservations."
  },
  FR: {
    home: "Accueil",
    halls: "Salles",
    bookingRequest: "Demande de Réservation",
    fillDetails: "Saisissez vos coordonnées pour soumettre votre demande.",
    yourInfo: "Vos Informations",
    fullName: "Nom complet *",
    enterName: "Entrez votre nom complet",
    phone: "Numéro de téléphone *",
    email: "Adresse e-mail *",
    eventInfo: "Informations sur l'Événement",
    eventType: "Type d'événement *",
    wedding: "Mariage",
    conference: "Conférence",
    meeting: "Réunion",
    seminar: "Séminaire",
    celebration: "Célébration",
    numGuests: "Nombre d'invités *",
    addNotes: "Notes supplémentaires (Optionnel)",
    notesPlaceholder: "Parlez-nous de votre événement...",
    summary: "Résumé de la Réservation",
    hallName: "Nom de la salle :",
    date: "Date :",
    timeSlot: "Créneau horaire :",
    duration: "Durée :",
    basePrice: "Prix de base :",
    paymentMethod: "Mode de paiement",
    bankTransfer: "Virement bancaire",
    momo: "Mobile Money",
    card: "Carte",
    agreeTo: "J'accepte les Conditions Générales et la Politique de Confidentialité.",
    terms: "Conditions Générales",
    privacy: "Politique de Confidentialité",
    submitBtn: "Soumettre la Demande",
    submittingBtn: "Envoi en cours...",
    needHelp: "Besoin d'aide ?",
    helpDesc: "Contactez le secrétariat paroissial au +250 781 234 567 ou par courriel à info@sallehub.rw pour une assistance rapide.",
    fillFieldsError: "Veuillez remplir correctement tous les champs obligatoires.",
    agreeError: "Vous devez accepter les Conditions Générales et la Politique de Confidentialité pour continuer.",
    submitError: "Échec de l'envoi de la demande. Veuillez vérifier s'il n'y a pas de conflit d'horaire."
  },
  RW: {
    home: "Ahabanza",
    halls: "Ibyumba",
    bookingRequest: "Ubusabe bwo Gukodesha",
    fillDetails: "Uzuza amakuru yawe ngo wohereze ubusabe bwo gukodesha.",
    yourInfo: "Amakuru yawe",
    fullName: "Amazina Yose *",
    enterName: "Andika amazina yose",
    phone: "Numero ya Terefone *",
    email: "Imeri (Email) *",
    eventInfo: "Amakuru y'Igikorwa",
    eventType: "Ubwoko bw'Igikorwa *",
    wedding: "Ubukwe",
    conference: "Inama",
    meeting: "Inama y'Umuryango",
    seminar: "Amahugurwa",
    celebration: "Ibirori",
    numGuests: "Umubare w'Abatumirwa *",
    addNotes: "Andi makuru (Ubyishakiye)",
    notesPlaceholder: "Andika ibyerekeye igikorwa cyawe...",
    summary: "Incamake y'Ubusabe",
    hallName: "Izina ry'Icyumba:",
    date: "Itariki:",
    timeSlot: "Amasaha:",
    duration: "Igihe:",
    basePrice: "Ikiguzi fatizo:",
    paymentMethod: "Uburyo bwo Kwishyura",
    bankTransfer: "Kuri Konti ya Banki",
    momo: "Mobile Money (MoMo)",
    card: "Ikarita ya Banki (Card)",
    agreeTo: "Nemeye Amategeko n'Amabwiriza hamwe n'Ibanga ryo Kubika Amakuru.",
    terms: "Amategeko n'Amabwiriza",
    privacy: "Ibigendanye n'Ibanga",
    submitBtn: "Ohereza Ubusabe bwo Gukodesha",
    submittingBtn: "Ubusabe buri koherezwa...",
    needHelp: "Ukeneye Ubufasha?",
    helpDesc: "Vugana na paruwasi kuri +250 781 234 567 cyangwa imeri info@sallehub.rw ngo uhabwe ubufasha vuba.",
    fillFieldsError: "Nyamuneka uzuza neza imyanya yose isabwa.",
    agreeError: "Ugomba kwemera Amategeko n'Amabwiriza ngo ukomeze.",
    submitError: "Kwirinda overlapping, ubusabe bwanze. Nyamuneka reba niba nta yindi gahunda ihari."
  }
};

export default function BookingRequestPage({ lang = "EN", hall, selectedParams, onNavigate, onSubmitSuccess }: BookingRequestPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const t = tBooking[lang] || tBooking["EN"];

  const seoData = {
    EN: {
      title: `Book ${hall.name} - SalleHub`,
      description: `Complete your booking request for ${hall.name}. Easy online reservation for ${hall.location}. Capacity: ${hall.capacity} guests.`,
      keywords: `${hall.name}, booking request, parish hall booking, reserve hall, ${hall.location}`,
      lang: "en"
    },
    FR: {
      title: `Réserver ${hall.name} - SalleHub`,
      description: `Complétez votre demande de réservation pour ${hall.name}. Réservation en ligne facile pour ${hall.location}.`,
      keywords: `${hall.name}, demande de réservation, salle paroissiale, réserver, ${hall.location}`,
      lang: "fr"
    },
    RW: {
      title: `Gukodesha ${hall.name} - SalleHub`,
      description: `Uzuza ubusabe bwo gukodesha ${hall.name}. Gukodesha mu buryo bworoshye ${hall.location}.`,
      keywords: `${hall.name}, ubusabe, gukodesha, icyumba, ${hall.location}`,
      lang: "rw"
    }
  };

  const currentSeo = seoData[lang as keyof typeof seoData] || seoData.EN;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      eventType: "Wedding",
      guests: selectedParams.guests || hall.capacity,
      notes: "",
      paymentMethod: "Bank Transfer",
      agreed: false
    }
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const isAgreed = watch("agreed");

  const getPaymentMethodTranslated = (method: string) => {
    if (lang === "FR") {
      if (method === "Bank Transfer") return "Virement";
      if (method === "Mobile Money") return "MoMo";
      if (method === "Card") return "Carte";
    }
    if (lang === "RW") {
      if (method === "Bank Transfer") return "Kuri Konti ya Banki";
      if (method === "Mobile Money") return "Mobile Money (MoMo)";
      if (method === "Card") return "Ikarita ya Banki";
    }
    return method;
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const responseData = await safeFetchJson("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hallId: hall.id,
          customerName: data.fullName,
          customerEmail: data.email,
          customerPhone: data.phone,
          date: selectedParams.date,
          timeSlot: selectedParams.timeSlot,
          duration: selectedParams.duration || "1 Hour",
          guests: Number(data.guests),
          eventType: data.eventType,
          additionalNotes: data.notes || "",
          paymentMethod: data.paymentMethod
        })
      });

      toast.success(lang === "FR" ? "Demande de réservation envoyée avec succès !" : lang === "RW" ? "Ubusabe bwo gukodesha bwoherejwe neza!" : "Booking request submitted successfully!");
      onSubmitSuccess(responseData);
    } catch (err: any) {
      const msg = err.message || t.submitError;
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonical={`https://sallehub.vercel.app/halls/${hall.id}`}
        lang={currentSeo.lang}
        noindex={true}
      />
      <div className="font-sans text-navy-800 text-left" id="booking-request-page-root">
        {/* Breadcrumbs */}
      <section className="bg-navy-50 border-b border-navy-200/60 py-3.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs font-semibold text-navy-500 font-sans">
          <button onClick={() => onNavigate("visitor-home")} className="hover:text-navy-900 cursor-pointer">{t.home}</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => onNavigate("visitor-catalogue")} className="hover:text-navy-900 cursor-pointer">{t.halls}</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => onNavigate("visitor-hall-details", { hallId: hall.id })} className="hover:text-navy-900 cursor-pointer">{hall.name}</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy-950 font-bold">{t.bookingRequest}</span>
        </div>
      </section>

      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => onNavigate("visitor-hall-details", { hallId: hall.id })}
            className="p-2 border border-navy-200 hover:bg-navy-50 rounded-xl transition shadow-sm text-navy-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="font-sans">
            <h1 className="text-2xl md:text-3xl font-serif font-normal text-navy-900 tracking-tight leading-tight">{t.bookingRequest}</h1>
            <p className="text-xs text-navy-400 font-semibold mt-0.5">{t.fillDetails}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Form blocks */}
          <div className="md:col-span-2 space-y-6 font-sans">

            {/* Your Information */}
            <div className="bg-white rounded-2xl border border-navy-200/80 p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-navy-900 border-b border-navy-100 pb-2.5 uppercase tracking-wider">{t.yourInfo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide">{t.fullName}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder={t.enterName}
                      {...register("fullName")}
                      className={`w-full pl-9 pr-4 py-2.5 bg-navy-50 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white text-navy-800 transition ${errors.fullName ? "border-red-400 focus:ring-red-500/20 bg-red-50/30" : "border-navy-200 focus:ring-navy-900"}`}
                      id="booking-input-name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.fullName.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide">{t.phone}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="e.g. +250 781 234 567"
                      {...register("phone")}
                      className={`w-full pl-9 pr-4 py-2.5 bg-navy-50 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white text-navy-800 transition ${errors.phone ? "border-red-400 focus:ring-red-500/20 bg-red-50/30" : "border-navy-200 focus:ring-navy-900"}`}
                      id="booking-input-phone"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phone.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide">{t.email}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="e.g. alicejohnson@email.com"
                      {...register("email")}
                      className={`w-full pl-9 pr-4 py-2.5 bg-navy-50 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white text-navy-800 transition ${errors.email ? "border-red-400 focus:ring-red-500/20 bg-red-50/30" : "border-navy-200 focus:ring-navy-900"}`}
                      id="booking-input-email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div className="bg-white rounded-2xl border border-navy-200/80 p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-navy-900 border-b border-navy-100 pb-2.5 uppercase tracking-wider">{t.eventInfo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide">{t.eventType}</label>
                  <select
                    {...register("eventType")}
                    className="w-full px-3 py-2.5 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white text-navy-800 cursor-pointer"
                    id="booking-select-type"
                  >
                    <option value="Wedding">{t.wedding}</option>
                    <option value="Conference">{t.conference}</option>
                    <option value="Meeting">{t.meeting}</option>
                    <option value="Seminar">{t.seminar}</option>
                    <option value="Celebration">{t.celebration}</option>
                  </select>
                  {errors.eventType && (
                    <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.eventType.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide">{t.numGuests}</label>
                  <input
                    type="number"
                    min="1"
                    max={hall.capacity + 100}
                    {...register("guests")}
                    className={`w-full px-3 py-2.5 bg-navy-50 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white text-navy-800 transition ${errors.guests ? "border-red-400 focus:ring-red-500/20 bg-red-50/30" : "border-navy-200 focus:ring-navy-900"}`}
                    id="booking-input-guests"
                  />
                  {errors.guests && (
                    <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.guests.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide">{t.addNotes}</label>
                  <textarea
                    placeholder={t.notesPlaceholder}
                    rows={4}
                    {...register("notes")}
                    className="w-full px-3 py-2.5 bg-navy-50 border border-navy-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white text-navy-800"
                    id="booking-input-notes"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-navy-200 shadow-xl p-5 space-y-5">
              <h3 className="text-sm font-extrabold text-navy-900 border-b border-navy-100 pb-2.5 uppercase tracking-wider text-left font-sans">{t.summary}</h3>

              {/* Info Details */}
              <div className="space-y-3.5 text-xs text-navy-600 font-semibold border-b border-navy-100 pb-4 font-sans">
                <div className="flex justify-between">
                  <span className="text-navy-400">{t.hallName}</span>
                  <span className="text-navy-900 font-extrabold">{hall.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">{t.date}</span>
                  <span className="text-navy-900 font-extrabold">{selectedParams.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">{t.timeSlot}</span>
                  <span className="text-navy-900 font-extrabold">{selectedParams.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">{t.duration}</span>
                  <span className="text-navy-900 font-extrabold">{selectedParams.duration || "1 Hour"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">{t.basePrice}</span>
                  <span className="text-slate-955 font-black">RWF {new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(hall.price >= 1000 ? hall.price : hall.price * 1000)}</span>
                </div>
              </div>

              {/* Payment Select */}
              <div className="space-y-2 font-sans">
                <label className="text-[10px] font-black text-navy-400 uppercase tracking-wide block text-left">{t.paymentMethod}</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Bank Transfer", "Mobile Money", "Card"].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setValue("paymentMethod", m)}
                      className={`py-2 px-1 text-[10px] font-extrabold rounded-xl border transition cursor-pointer ${selectedPaymentMethod === m
                          ? "bg-navy-900 border-navy-900 text-white shadow-sm"
                          : "bg-white border-navy-200 text-navy-600 hover:bg-navy-50"
                        }`}
                      id={`booking-pay-method-${m.replace(" ", "")}`}
                    >
                      {getPaymentMethodTranslated(m)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2 font-sans">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-navy-500">
                  <input
                    type="checkbox"
                    {...register("agreed")}
                    className="mt-0.5 rounded text-navy-950 focus:ring-navy-950 border-navy-300 w-4 h-4 cursor-pointer"
                    id="booking-checkbox-terms"
                  />
                  <span>
                    {lang === "EN" ? (
                      <>I agree to the <span className="text-navy-800 underline">Terms & Conditions</span> and <span className="text-navy-800 underline">Privacy Policy</span>.</>
                    ) : lang === "FR" ? (
                      <>J'accepte les <span className="text-navy-800 underline">Conditions Générales</span> et la <span className="text-navy-800 underline">Politique de Confidentialité</span>.</>
                    ) : (
                      <>Nemera <span className="text-navy-800 underline">Amategeko n'Amabwiriza</span> n'<span className="text-navy-800 underline">Politiki y'Ibanga</span>.</>
                    )}
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.agreed.message}</span>
                  </p>
                )}
              </div>

              {/* Submit trigger */}
              <div className="pt-2 font-sans">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-black uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center disabled:opacity-50 cursor-pointer"
                  id="booking-submit-btn"
                >
                  {submitting ? t.submittingBtn : t.submitBtn}
                </button>
              </div>
            </div>

            {/* Help Widget */}
            <div className="bg-navy-50 rounded-2xl border border-navy-200/80 p-5 text-xs font-bold text-navy-500 space-y-2 flex gap-3 font-sans text-left">
              <HelpCircle className="w-5 h-5 text-navy-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-navy-800 font-extrabold">{t.needHelp}</p>
                <p className="text-[11px] leading-relaxed font-light mt-1 text-navy-500">
                  {t.helpDesc}
                </p>
              </div>
            </div>
          </div>

        </form>
      </div>
      </div>
    </>
  );
}
