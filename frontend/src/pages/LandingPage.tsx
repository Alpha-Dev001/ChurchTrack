import React, { useState } from "react";
import { Search, Calendar, User, MapPin, Sparkles, Building, ShieldCheck, Clock, CheckCircle, ChevronLeft, ChevronRight, Mail, ArrowRight, Phone, Heart, Star, FileEdit } from "lucide-react";
import { Hall } from "../types";
import HallCard from "../components/HallCard";
import heroChurchBuildingImg from "../assets/images/parish_hero_building_1784664516350.jpg";
import { useData } from "../contexts/DataContext";
import { HallCardSkeleton } from "../components/Skeletons";

interface LandingPageProps {
  lang?: string;
  halls: Hall[];
  onNavigate: (view: string, params?: any) => void;
  onSearch: (filters: any) => void;
}

// Translation dictionaries for high-quality bilingual English & French
const tLanding: Record<string, any> = {
  EN: {
    heroBadge: "Smart Parish Hall Booking",
    heroTitle1: "The Perfect Hall",
    heroTitle2: "For Your Next Unforgettable Event",
    heroDesc: "Discover, book, and manage beautiful church halls for weddings, conferences, seminars, and all your special occasions.",
    btnBrowse: "Explore Halls",
    btnHowItWorks: "How It Works",
    heroStat1: "18+ curated halls",
    heroStat1Desc: "Elegant and ready-to-book spaces",
    heroStat2: "Live availability",
    heroStat2Desc: "Instantly updated across the schedule",
    heroStat3: "Trusted parish support",
    heroStat3Desc: "Guided coordination for every event",
    trustedText: "Trusted by hundreds of happy customers",
    selectDate: "Date",
    eventType: "Event Type",
    allEvents: "Select event type",
    weddingCeremony: "Wedding Ceremony",
    conferenceSeminar: "Conference / Seminar",
    meetingGathering: "Meeting / Gathering",
    educationalSeminar: "Educational Seminar",
    socialCelebration: "Social Celebration",
    guestsLimit: "Guests",
    anyCapacity: "No. of guests",
    guests100: "Up to 100 Guests",
    guests200: "Up to 200 Guests",
    guests300: "Up to 300 Guests",
    guests500: "Up to 500 Guests",
    location: "Location",
    anyLocation: "Select location",
    search: "Search Halls",
    badgeNoAccount: "Easy Booking",
    badgeNoAccountDesc: "Quick & simple process in just a few steps.",
    badgeRealTime: "Secure & Reliable",
    badgeRealTimeDesc: "Safe booking with guaranteed reliability.",
    badgeSecure: "Premium Halls",
    badgeSecureDesc: "Beautiful, spacious, and well-equipped.",
    badgeQuick: "24/7 Support",
    badgeQuickDesc: "We are here to help you anytime.",
    featuredVenues: "FEATURED HALLS",
    popularChurchHalls: "Explore Our Stunning Halls",
    featuredDesc: "Explore our most requested and meticulously maintained event venues",
    viewAllHalls: "View All Halls",
    badgePopular: "Popular",
    badgeNew: "New",
    capacityLabel: "Capacity",
    guestsSuffix: "Guests",
    dailyRateLabel: "Rate",
    viewDetails: "View Details",
    whyChooseUs: "WHY CHOOSE SALLEHUB",
    whyTitle: "Everything You Need, All in One Place",
    elegantSpaces: "Easy Booking",
    elegantSpacesDesc: "Quick and simple booking process in just a few steps.",
    modernFacilities: "Secure & Reliable",
    modernFacilitiesDesc: "Your booking is safe with us. We ensure reliability.",
    convenientLocations: "Premium Halls",
    convenientLocationsDesc: "Beautiful, spacious, and well-equipped halls for any event.",
    affordablePricing: "24/7 Support",
    affordablePricingDesc: "We're here to help you anytime you need assistance.",
    howItWorks: "HOW IT WORKS",
    howTitle: "Book Your Hall in 5 Simple Steps",
    step1Title: "Search Halls",
    step1Desc: "Find the perfect hall for your event.",
    step2Title: "Check Availability",
    step2Desc: "Choose your date and check availability.",
    step3Title: "Book Now",
    step3Desc: "Fill in your details and submit your booking.",
    step4Title: "Get Confirmation",
    step4Desc: "Receive your booking confirmation instantly.",
    step5Title: "Finalize & Enjoy",
    step5Desc: "Complete the last step and prepare for a memorable event.",
    clientsSay: "WHAT OUR CUSTOMERS SAY",
    communityVoices: "Trusted by Many, Loved by All",
    readyToBook: "READY TO BOOK?",
    ctaTitle: "Ready to Book Your Perfect Hall?",
    ctaDesc: "Join hundreds of happy customers and make your event unforgettable.",
    exploreHalls: "Explore Halls Now"
  },
  FR: {
    heroBadge: "Salles paroissiales de prestige et espaces sacrés",
    heroTitle1: "Réservez la salle idéale",
    heroTitle2: "pour les célébrations de votre vie",
    heroDesc: "Découvrez des espaces paroissiaux dignes et entièrement équipés, conçus pour les mariages, banquets, conférences, séminaires, réunions de famille et événements communautaires.",
    btnBrowse: "Parcourir les salles",
    btnHowItWorks: "Comment ça marche",
    heroStat1: "Plus de 18 salles sélectionnées",
    heroStat1Desc: "Des lieux élégants prêts à réserver",
    heroStat2: "Disponibilité en direct",
    heroStat2Desc: "Mise à jour instantanée du calendrier",
    heroStat3: "Support paroissial fiable",
    heroStat3Desc: "Coordination guidée pour chaque événement",
    selectDate: "Choisir la date",
    eventType: "Type d'événement",
    allEvents: "Tous les événements",
    weddingCeremony: "Cérémonie de mariage",
    conferenceSeminar: "Conférence / Séminaire",
    meetingGathering: "Réunion / Assemblée",
    educationalSeminar: "Séminaire éducatif",
    socialCelebration: "Célébration sociale",
    guestsLimit: "Nombre d'invités",
    anyCapacity: "Toute capacité",
    guests100: "Jusqu'à 100 invités",
    guests200: "Jusqu'à 200 invités",
    guests300: "Jusqu'à 300 invités",
    guests500: "Jusqu'à 500 invités",
    location: "Localisation",
    anyLocation: "Toute localisation",
    search: "Rechercher",
    badgeNoAccount: "Aucun compte requis",
    badgeNoAccountDesc: "Réservez sans inscription",
    badgeRealTime: "Disponibilité en direct",
    badgeRealTimeDesc: "Schedules & créneaux réels",
    badgeSecure: "Sécurisé & Transparent",
    badgeSecureDesc: "Processus de réservation sûr",
    badgeQuick: "Confirmation rapide",
    badgeQuickDesc: "Suivez votre demande facilement",
    featuredVenues: "Lieux en vedette",
    popularChurchHalls: "Salles paroissiales populaires",
    featuredDesc: "Explorez nos espaces les plus demandés et méticuleusement entretenus",
    viewAllHalls: "Voir toutes les salles",
    badgePopular: "Populaire",
    badgeNew: "Nouveau",
    capacityLabel: "Capacité",
    guestsSuffix: "Invités",
    dailyRateLabel: "Tarif journalier",
    viewDetails: "Voir les détails",
    whyChooseUs: "Pourquoi nous choisir",
    whyTitle: "Tout le nécessaire pour un événement sacré et réussi",
    elegantSpaces: "Espaces élégants",
    elegantSpacesDesc: "Des salles paroissiales dignes et soigneusement préservées, dotées de hauts plafonds voûtés, d'une lumière naturelle et d'aménagements modulables.",
    modernFacilities: "Équipements modernes",
    modernFacilitiesDesc: "Équipées de systèmes acoustiques haute fidélité, de connectivité sans fil, d'une régulation thermique dynamique et d'une alimentation de secours.",
    convenientLocations: "Localisations pratiques",
    convenientLocationsDesc: "Salles idéalement situées dans les principaux secteurs paroissiaux, avec un grand parking sécurisé pour les fidèles et les invités.",
    affordablePricing: "Tarifs abordables",
    affordablePricingDesc: "Tarifs de contribution paroissiale hautement compétitifs, avec des grilles de tarifs transparentes et sans frais cachés.",
    howItWorks: "Comment ça marche",
    howTitle: "Un parcours de réservation digne en 5 étapes simples",
    step1Title: "Parcourir",
    step1Desc: "Sélectionnez parmi notre liste de salles de prestige.",
    step2Title: "Vérifier",
    step2Desc: "Choisissez vos dates et consultez les calendriers des créneaux en direct.",
    step3Title: "Demander",
    step3Desc: "Fournissez les détails de base du coordinateur sans créer de compte.",
    step4Title: "Approbation",
    step4Desc: "Notre conseil paroissial examine et approuve votre demande de réservation.",
    step5Title: "Confirmation",
    step5Desc: "Finalisez la contribution de réservation et profitez d'un événement parfait.",
    clientsSay: "Ce que disent nos clients",
    communityVoices: "Les voix de notre communauté",
    readyToBook: "Prêt à réserver ?",
    ctaTitle: "Rendons votre événement véritablement inoubliable",
    ctaDesc: "Réservez votre salle paroissiale idéale dès aujourd'hui. Explorez les calendriers hebdomadaires en direct, examinez les équipements détaillés et finalisez votre demande de contribution de réservation en quelques minutes.",
    exploreHalls: "Explorer les Salles"
  },
  RW: {
    heroBadge: "Salo za Paruwasi n'Imyanya Ifatika",
    heroTitle1: "Kodesha Icyumba Cyiza Cyane",
    heroTitle2: "Ku Birori By'Ubuzima Bwawe",
    heroDesc: "Gura cyangwa ukodeshe ibyumba byiza bya paruwasi bikoze neza kubera ubukwe, inama, amahugurwa, ibirori by'umuryango n'ibindi bikorwa.",
    btnBrowse: "Shakisha Ibyumba",
    btnHowItWorks: "Uburyo Bikora",
    heroStat1: "Ibyumba birenga 18 by'umutekano",
    heroStat1Desc: "Imyanya myiza kandi yiteguye gukodeshwa",
    heroStat2: "Ububoneke bw'igihe nyacyo",
    heroStat2Desc: "Bihindura kalendari ako kanya",
    heroStat3: "Inkunga ya paruwasi yizewe",
    heroStat3Desc: "Guherekeza buri gikorwa neza",
    selectDate: "Hitamo Itariki",
    eventType: "Ubwoko bw'Igikorwa",
    allEvents: "Ibikorwa Byose",
    weddingCeremony: "Ubukwe",
    conferenceSeminar: "Inama / Amahugurwa",
    meetingGathering: "Inama y'Umuryango",
    educationalSeminar: "Inyigisho / Seminar",
    socialCelebration: "Ibirori / Isabukuru",
    guestsLimit: "Umubare w'Abatumirwa",
    anyCapacity: "Ubushobozi bwose",
    guests100: "Abagera kuri 100",
    guests200: "Abagera kuri 200",
    guests300: "Abagera kuri 300",
    guests500: "Abagera kuri 500",
    location: "Aho Biherereye",
    anyLocation: "Ahantu Hose",
    search: "Shakisha",
    badgeNoAccount: "Nta Konti Isabwa",
    badgeNoAccountDesc: "Kodesha utiyandikishije",
    badgeRealTime: "Kureba Ububoneke",
    badgeRealTimeDesc: "Gahunda n'amasaha biriho",
    badgeSecure: "Umutekano & Ukuri",
    badgeSecureDesc: "Uburyo bwo kwishyura bwizewe",
    badgeQuick: "Kwemerezwa vuba",
    badgeQuickDesc: "Kurikirana ubusabe bwawe",
    featuredVenues: "Ibyumba Biherutse",
    popularChurchHalls: "Ibyumba Bikunzwe Cyane",
    featuredDesc: "Reba ibyumba byacu bishakwa cyane kandi bitunganyijwe neza",
    viewAllHalls: "Reba Ibyumba Byose",
    badgePopular: "Ibyamamare",
    badgeNew: "Gishya",
    capacityLabel: "Ubushobozi",
    guestsSuffix: "Abatumirwa",
    dailyRateLabel: "Ikiguzi ku Munsi",
    viewDetails: "Reba Ibirambuye",
    whyChooseUs: "Kuki Twahitamo",
    whyTitle: "Ibyo Ukeneye Byose ngo Ibirori Bigende Neza",
    elegantSpaces: "Imyanya Myiza Cyane",
    elegantSpacesDesc: "Ibyumba bya paruwasi byiyubashe kandi bisukuye neza bifite ibikoresho byose bigezweho n'urumuri rwa kamere.",
    modernFacilities: "Ibikoresho Bigezweho",
    modernFacilitiesDesc: "Bikubiyemo ibyuma by'amajwi byiza cyane, interineti y'ihuta, ibyuma bikonjesha/bishushya n'amashanyarazi y'ingoboka.",
    convenientLocations: "Ahantu Horoheye Bose",
    convenientLocationsDesc: "Ibyumba byacu biherereye neza hafi y'imihanda minini kandi bifite parikingi nini yiringiro ku batumirwa bawe.",
    affordablePricing: "Ibiciro Bitajengetse",
    affordablePricingDesc: "Ibiciro byiza cyane bitajengetse bya paruwasi, kandi nta mafaranga y'inyongezo anyuranyije n'amategeko.",
    howItWorks: "Uburyo Bikora",
    howTitle: "Uburyo 5 bworoshye bwo gukodesha icyumba",
    step1Title: "Hitamo Icyumba",
    step1Desc: "Shakisha icyumba gikwiranye n'ibirori byawe.",
    step2Title: "Reba Niba Cyizere",
    step2Desc: "Hitamo itariki n'amasaha binyuze kuri kalendari yacu.",
    step3Title: "Ohereza Ubusabe",
    step3Desc: "Uzuza amakuru yawe y'ibanze nta konti isabwe.",
    step4Title: "Kwemera kwa Paruwasi",
    step4Desc: "Inama ya paruwasi isuzuma ikemeza ubusabe bwawe vuba.",
    step5Title: "Kwemezwa burundu",
    step5Desc: "Ishyura maze ukoreshe icyumba mu birori byawe bitagira amakemwa.",
    clientsSay: "Ibyo Abakiriya Bacu Bavuga",
    communityVoices: "Amajwi y'Abaturage Bacu",
    readyToBook: "Witeguye Gukodesha?",
    ctaTitle: "Reka Tuguhe Ibirori Bitazibagirana",
    ctaDesc: "Kodesha icyumba cya paruwasi cyiza cyane uyu munsi. Reba kalendari n'ibikoresho, hanyuma wohereze ubusabe bwawe mu minota mike.",
    exploreHalls: "Shakisha Ibyumba"
  }
};

export default function LandingPage({ lang = "EN", halls, onNavigate, onSearch }: LandingPageProps) {
  const { hallsLoading } = useData();
  const [testimonialIdx, setTestimonialIdx] = useState(1); // Default center slide active

  const activeHalls = halls.filter(h => h.status === "Active");
  const featuredHalls = activeHalls.length >= 4 ? activeHalls.slice(0, 4) : halls.slice(0, 4);

  const testimonials = [
    {
      text: lang === "EN"
        ? "Grace Hall was perfect for our wedding! The space was beautiful, clean, and the acoustics were excellent. Highly recommend SalleHub!"
        : lang === "FR"
          ? "La salle Grace Hall était parfaite pour notre mariage ! L'espace était magnifique, propre et l'acoustique excellente. Je recommande vivement SalleHub !"
          : "Grace Hall yari nziza cyane ku bukwe bwacu! Umwanya wari mwiza, usukuye kandi amajwi yari meza cyane. Turagushishikariza gukoresha SalleHub!",
      author: "Sarah & John",
      role: lang === "EN" ? "Wedding Ceremony" : lang === "FR" ? "Cérémonie de mariage" : "Ibirori by'Ubukwe",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
    },
    {
      text: lang === "EN"
        ? "We hosted our annual conference at Victory Hall. Everything was organized perfectly. Great facilities and a very professional team."
        : lang === "FR"
          ? "Nous avons organisé notre conférence annuelle à Victory Hall. Tout était parfaitement orchestré. Excellents équipements et équipe très professionnelle."
          : "Twakoreye inama yacu ngarukamwaka muri Victory Hall. Buri kintu cyari giteguye neza cyane. Ibikoresho byiza n'ikipe y'ababizobereye.",
      author: "David K.",
      role: lang === "EN" ? "Conference Organizer" : lang === "FR" ? "Organisateur de conférence" : "Umutegurabikorwa w'Inama",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    {
      text: lang === "EN"
        ? "The booking process was so easy and quick. Got confirmation within a day. Amazing experience!"
        : lang === "FR"
          ? "Le processus de réservation a été simple et rapide. J'ai reçu la confirmation en une journée. Une expérience formidable !"
          : "Gukodesha byari byoroshye kandi byihuse cyane. Twabonye igisubizo mu munsi umwe gusa. Ni ibitangaza!",
      author: "Marie Grace",
      role: lang === "EN" ? "Birthday Celebration" : lang === "FR" ? "Célébration d'anniversaire" : "Ibirori by'Isabukuru",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    }
  ];

  const t = tLanding[lang] || tLanding["EN"];

  return (
    <div className="font-sans text-navy-900" id="landing-page-root">
      {/* Hero Section — brand-first dark blue + white */}
      <section className="relative min-h-[calc(100vh-64px)] bg-navy-950 text-white flex flex-col justify-center overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src={heroChurchBuildingImg}
            alt="Parish Church Building"
            className="w-full h-full object-cover opacity-35 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-navy-950/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7 my-auto">
          <p className="font-serif text-4xl md:text-6xl tracking-tight text-white">
            SalleHub
          </p>

          <h1 className="text-2xl md:text-4xl font-serif font-normal tracking-tight text-white/90 max-w-3xl mx-auto leading-snug">
            {t.heroTitle1}{" "}
            <span className="italic font-light text-white">{t.heroTitle2}</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans font-light">
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("visitor-catalogue")}
              className="btn-primary bg-white text-navy-950 hover:bg-navy-50"
              id="hero-explore-btn"
            >
              <span>{t.btnBrowse}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-ghost"
            >
              {t.btnHowItWorks}
            </button>
          </div>
        </div>
      </section>

      {/* Popular Halls Segment */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-navy-200 pb-6 gap-4">
          <div className="space-y-2 text-left">
            <span className="section-eyebrow block">{t.featuredVenues}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-navy-950 tracking-tight leading-none">{t.popularChurchHalls}</h2>
            <p className="text-sm text-navy-600 font-sans font-light">{t.featuredDesc}</p>
          </div>
          <button
            onClick={() => onNavigate("visitor-catalogue")}
            className="btn-secondary self-start md:self-auto"
            id="view-all-halls-top-btn"
          >
            {t.viewAllHalls}
          </button>
        </div>

        {/* Grid of 4 featured halls (2 per row on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" id="popular-halls-grid">
          {hallsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <HallCardSkeleton key={i} />)
          ) : (
            featuredHalls.map((hall) => (
              <HallCard
                key={hall.id}
                hall={hall}
                lang={lang}
                onNavigate={onNavigate}
              />
            ))
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-navy-50 border-y border-navy-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="section-eyebrow block">{t.whyChooseUs}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-navy-950 tracking-tight">{t.whyTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building, title: t.elegantSpaces, desc: t.elegantSpacesDesc },
              { icon: ShieldCheck, title: t.modernFacilities, desc: t.modernFacilitiesDesc },
              { icon: MapPin, title: t.convenientLocations, desc: t.convenientLocationsDesc },
              { icon: CheckCircle, title: t.affordablePricing, desc: t.affordablePricingDesc }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-surface p-7 text-left space-y-4">
                  <div className="p-2.5 bg-navy-950 text-white rounded-lg inline-flex">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-serif font-normal text-navy-950">{feature.title}</h3>
                  <p className="text-xs text-navy-600 font-sans font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Process Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-center scroll-mt-24">
        <div className="space-y-3">
          <span className="section-eyebrow block">{t.howItWorks}</span>
          <h2 className="text-3xl md:text-4.5xl font-serif font-normal text-navy-900 tracking-tight">{t.howTitle}</h2>
        </div>

        <div className="relative">
          {/* Desktop horizontal connector */}
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-navy-300 to-transparent lg:block"
            aria-hidden
          />

          <ol className="grid grid-cols-1 gap-0 sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-none lg:grid-cols-5 lg:gap-4 xl:gap-6">
            {[
              { num: 1, title: t.step1Title, desc: t.step1Desc, icon: Search },
              { num: 2, title: t.step2Title, desc: t.step2Desc, icon: Calendar },
              { num: 3, title: t.step3Title, desc: t.step3Desc, icon: FileEdit },
              { num: 4, title: t.step4Title, desc: t.step4Desc, icon: CheckCircle },
              { num: 5, title: t.step5Title, desc: t.step5Desc, icon: Sparkles },
            ].map((step, idx, arr) => {
              const Icon = step.icon;
              const isLast = idx === arr.length - 1;
              return (
                <li key={step.num} className="group relative flex gap-4 text-left lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                  {/* Mobile / tablet vertical connector */}
                  {!isLast && (
                    <div
                      className="absolute bottom-0 left-[1.375rem] top-14 w-px bg-gradient-to-b from-navy-300 via-navy-200 to-transparent lg:hidden"
                      aria-hidden
                    />
                  )}

                  <div className="relative z-10 flex shrink-0 flex-col items-center">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-900 shadow-[0_0_0_6px_#ffffff] transition duration-300 group-hover:border-navy-900 group-hover:bg-navy-950 group-hover:text-white lg:mx-auto lg:mb-5">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950 font-serif text-[10px] font-normal text-white ring-2 ring-white transition group-hover:bg-white group-hover:text-navy-950 group-hover:ring-navy-950">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2 border-b border-navy-100 pb-8 pt-1 transition duration-300 group-hover:border-navy-200 lg:rounded-lg lg:border lg:border-navy-200 lg:bg-white lg:px-4 lg:pb-6 lg:pt-5 lg:shadow-sm lg:group-hover:-translate-y-1 lg:group-hover:border-navy-300 lg:group-hover:shadow-md">
                    <h3 className="text-sm font-semibold tracking-wide text-navy-900 font-sans">
                      {step.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-navy-500 font-sans font-light lg:mx-auto lg:max-w-[11.5rem]">
                      {step.desc}
                    </p>
                  </div>

                  {/* Desktop step arrow between nodes */}
                  {!isLast && (
                    <span
                      className="pointer-events-none absolute -right-2 top-[2.4rem] z-20 hidden text-navy-300 lg:block xl:-right-3"
                      aria-hidden
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy-50 border-t border-navy-200 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="section-eyebrow block">{t.clientsSay}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-navy-950 tracking-tight">{t.communityVoices}</h2>
          </div>

          <div className="relative flex flex-col md:flex-row justify-center items-center gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className={`max-w-md p-6 rounded-lg border transition-colors duration-300 text-left flex flex-col justify-between gap-6 relative h-60 ${idx === testimonialIdx
                  ? "bg-navy-950 text-white border-navy-950 z-10"
                  : "bg-white text-navy-800 border-navy-200"
                  }`}
              >
                <p className={`text-xs font-sans font-light leading-relaxed italic ${idx === testimonialIdx ? "text-white/75" : "text-navy-500"}`}>
                  "{test.text}"
                </p>

                <div className="flex items-center gap-3.5 mt-auto">
                  <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full object-cover border border-navy-200 select-none pointer-events-none" />
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide font-sans">{test.author}</h4>
                    <p className={`text-[10px] ${idx === testimonialIdx ? "text-white/60 font-semibold" : "text-navy-400"} font-sans uppercase tracking-widest mt-0.5`}>{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 pt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? "bg-navy-950 w-6" : "bg-navy-300"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action bottom block */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="bg-navy-950 text-white rounded-lg p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-left">
            <span className="section-eyebrow text-white/50 block">{t.readyToBook}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-white leading-tight">{t.ctaTitle}</h2>
            <p className="text-white/65 text-xs md:text-sm leading-relaxed font-sans font-light">
              {t.ctaDesc}
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate("visitor-catalogue")}
              className="btn-primary bg-white text-navy-950 hover:bg-navy-50"
              id="cta-explore-btn"
            >
              <span>{t.exploreHalls}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
