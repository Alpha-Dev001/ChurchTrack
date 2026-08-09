import React, { useState } from "react";
import { Check, Copy, Calendar, Users, Clock, Home, Search, Sparkles } from "lucide-react";
import SEO from "../components/SEO";

interface SuccessPageProps {
  lang?: string;
  bookingDetails: any; // { id, hallName, date, timeSlot, guests }
  onNavigate: (view: string, params?: any) => void;
}

// Translations dictionary for SuccessPage
const tSuccess: Record<string, any> = {
  EN: {
    title: "Booking Request Submitted!",
    subtitle: "Thank you! Your booking request has been received. We will review your slot availability and get back to you within 24 hours.",
    referenceLabel: "Booking Reference",
    copied: "Copied!",
    useCode: "Use code to track your status",
    hallLabel: "Church Hall",
    dateLabel: "Date",
    slotLabel: "Time Slot",
    guestsLabel: "Guests Limit",
    guestsSuffix: "Guests",
    whatsNext: "What's Next?",
    step1Title: "Review Request",
    step1Desc: "Our parish office checks hall schedules.",
    step2Title: "Receive Confirmation",
    step2Desc: "Receive email with approval & pay guide.",
    step3Title: "Make Payment",
    step3Desc: "Verify transaction code to secure booking.",
    step4Title: "Enjoy Event",
    step4Desc: "Hall is prepared; your event starts!",
    trackBtn: "Track Booking Status",
    homeBtn: "Back to Home"
  },
  FR: {
    title: "Demande de Réservation Soumise !",
    subtitle: "Merci ! Votre demande de réservation a été reçue. Nous allons vérifier la disponibilité de votre créneau et vous recontacter sous 24 heures.",
    referenceLabel: "Référence de Réservation",
    copied: "Copié !",
    useCode: "Utilisez ce code pour suivre votre statut",
    hallLabel: "Salle Paroissiale",
    dateLabel: "Date",
    slotLabel: "Créneau horaire",
    guestsLabel: "Nombre d'invités",
    guestsSuffix: "Invités",
    whatsNext: "Quelle est la suite ?",
    step1Title: "Examen de la demande",
    step1Desc: "Notre bureau paroissial vérifie les horaires.",
    step2Title: "Confirmation reçue",
    step2Desc: "Vous recevrez un courriel d'approbation et un guide de paiement.",
    step3Title: "Effectuer le paiement",
    step3Desc: "Vérifiez le code de transaction pour sécuriser la salle.",
    step4Title: "Profiter de l'événement",
    step4Desc: "La salle est prête, votre événement peut commencer !",
    trackBtn: "Suivre l'état de ma demande",
    homeBtn: "Retour à l'Accueil"
  },
  RW: {
    title: "Ubusabe bwo Gukodesha Bwoherejwe!",
    subtitle: "Murakoze! Ubusabe bwanyu bwakiriwe neza. Tugiye kubusuzuma hanyuma tubasubize mu masaha 24.",
    referenceLabel: "Kode y'Ubusabe",
    copied: "Byakopewe!",
    useCode: "Koresha iyi kode ukurikira ubusabe",
    hallLabel: "Icyumba cya Paruwasi",
    dateLabel: "Itariki",
    slotLabel: "Amasaha",
    guestsLabel: "Abatumirwa Max",
    guestsSuffix: "Abantu",
    whatsNext: "Niki gikurikiraho?",
    step1Title: "Gusuzuma Ubusabe",
    step1Desc: "Ibiro bya paruwasi bishinzwe kugenzura gahunda.",
    step2Title: "Kwemerezwa",
    step2Desc: "Uhabwa imeri n'amabwiriza yo kwishyura.",
    step3Title: "Kwishyura",
    step3Desc: "Kohereza kode y'ubwishyu ngo icyumba cyemerwe.",
    step4Title: "Ibirori",
    step4Desc: "Icyumba kirategurwa, ibirori bigatangira!",
    trackBtn: "Kurikirana Ubusabe",
    homeBtn: "Gusubira Ahabanza"
  }
};

export default function SuccessPage({ lang = "EN", bookingDetails, onNavigate }: SuccessPageProps) {
  const [copied, setCopied] = useState(false);

  const t = tSuccess[lang] || tSuccess["EN"];

  const seoData = {
    EN: {
      title: "Booking Confirmed - ChurchTrack",
      description: "Your booking request has been submitted successfully. Use your booking reference to track the status of your reservation.",
      keywords: "booking confirmed, booking reference, parish hall booking, reservation submitted",
      lang: "en"
    },
    FR: {
      title: "Réservation Confirmée - ChurchTrack",
      description: "Votre demande de réservation a été soumise avec succès. Utilisez votre référence pour suivre le statut.",
      keywords: "réservation confirmée, référence réservation, salle paroissiale, demande soumise",
      lang: "fr"
    },
    RW: {
      title: "Gukodesha Byemejwe - ChurchTrack",
      description: "Ubusabe bwo gukodesha bwoherejwe neza. Koresha kode yawe ukurikira aho ubusabe bgeze.",
      keywords: "gukodesha, kode y'ubusabe, icyumba cya paruwasi, ubusabe bwoherejwe",
      lang: "rw"
    }
  };

  const currentSeo = seoData[lang as keyof typeof seoData] || seoData.EN;

  const bookingId = bookingDetails?.id || "#BK-1025";
  const hallName = bookingDetails?.hallName || "Grace Hall";
  const date = bookingDetails?.date || "2024-05-20";
  const timeSlot = bookingDetails?.timeSlot || "10:00 AM - 02:00 PM";
  const guests = bookingDetails?.guests || 300;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonical="https://sallehub.vercel.app/success"
        lang={currentSeo.lang}
        noindex={true}
      />
      <div className="font-sans text-navy-800 text-center py-16 px-4 max-w-2xl mx-auto space-y-8 animate-fade-in" id="success-page-root">
        {/* Green Check Icon */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-2 font-sans">
            <h1 className="text-2xl md:text-3.5xl font-serif font-normal text-navy-900 tracking-tight">{t.title}</h1>
            <p className="text-navy-500 text-xs md:text-sm font-light max-w-md mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Booking Reference Box */}
        <div className="bg-white rounded-3xl border border-navy-200/80 shadow-lg p-6 space-y-5 text-left font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-100 pb-4 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.referenceLabel}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-black text-navy-900" id="success-reference-code">{bookingId}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-navy-50 border border-navy-200 rounded-lg text-navy-500 hover:text-navy-800 transition shadow-sm cursor-pointer"
                  id="btn-copy-success-ref"
                  title="Copy reference code"
                >
                  {copied ? <span className="text-[9px] font-extrabold text-emerald-500 uppercase px-1">{t.copied}</span> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-xs text-navy-500 font-bold flex items-center gap-1.5 bg-navy-50 px-3 py-1.5 rounded-xl border border-navy-200/40">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{t.useCode}</span>
            </div>
          </div>

          {/* Selected parameters */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-navy-600">
            <div className="space-y-1">
              <span className="text-navy-400 block font-bold uppercase tracking-wider text-[9px]">{t.hallLabel}</span>
              <span className="text-navy-900 font-extrabold">{hallName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-navy-400 block font-bold uppercase tracking-wider text-[9px]">{t.dateLabel}</span>
              <span className="text-navy-900 font-extrabold">{date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-navy-400 block font-bold uppercase tracking-wider text-[9px]">{t.slotLabel}</span>
              <span className="text-navy-900 font-extrabold">{timeSlot}</span>
            </div>
            <div className="space-y-1">
              <span className="text-navy-400 block font-bold uppercase tracking-wider text-[9px]">{t.guestsLabel}</span>
              <span className="text-navy-900 font-extrabold">{guests} {t.guestsSuffix}</span>
            </div>
          </div>
        </div>

        {/* What's Next Progress Timeline */}
        <div className="bg-navy-50 rounded-3xl border border-navy-200/80 p-6 space-y-6 text-left font-sans">
          <h3 className="text-xs font-black uppercase text-navy-400 tracking-wider">{t.whatsNext}</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: 1, title: t.step1Title, desc: t.step1Desc, active: true },
              { step: 2, title: t.step2Title, desc: t.step2Desc, active: false },
              { step: 3, title: t.step3Title, desc: t.step3Desc, active: false },
              { step: 4, title: t.step4Title, desc: t.step4Desc, active: false }
            ].map((item, i) => (
              <div key={i} className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${item.active ? "bg-navy-900 text-white" : "bg-navy-200 text-navy-500"
                    }`}>
                    {item.step}
                  </div>
                  <h4 className={`text-xs font-black tracking-wide ${item.active ? "text-navy-950" : "text-navy-400"}`}>{item.title}</h4>
                </div>
                <p className="text-[10px] text-navy-400 leading-relaxed font-light pl-8">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 font-sans">
          <button
            onClick={() => onNavigate("visitor-track", { searchCode: bookingId })}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-extrabold uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            id="success-track-status-btn"
          >
            <Search className="w-4 h-4" />
            <span>{t.trackBtn}</span>
          </button>

          <button
            onClick={() => onNavigate("visitor-home")}
            className="bg-white hover:bg-navy-50 border border-navy-300 text-navy-900 text-xs font-extrabold uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            id="success-back-home-btn"
          >
            <Home className="w-4 h-4" />
            <span>{t.homeBtn}</span>
          </button>
        </div>
      </div>
    </>
  );
}
