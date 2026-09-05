import React from 'react';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Church,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type { ViewParams } from '../types';
import heroParishImage from '../assets/images/parish_hero_building_1784664516350.jpg';

interface Props {
  lang?: string;
  onNavigate: (view: string, params?: ViewParams) => void;
}

const copy = {
  EN: {
    // Hero
    parish: 'EAR Remera Parish',
    heroEyebrow: 'ChurchTrack — Parish Event Platform',
    heroLine1: 'Your Parish,',
    heroLine2: 'Your Occasion,',
    heroAccent: 'Made Simple.',
    desc: 'Reserve a wedding ceremony or discover a parish hall — one clear, trusted experience built for EAR Remera Parish.',
    weddingCta: 'Book a Wedding',
    hallsCta: 'Explore Halls',
    scrollHint: 'Discover more',

    // Stats bar
    statHalls: 'Halls available',
    statSlots: 'Ceremony slots',
    statCouples: 'Couples served',
    statParish: 'Parish guided',

    // How it works
    howTitle: 'How It Works',
    howSubtitle: 'From search to confirmation in a few clear steps.',
    step1: 'Choose your service',
    step1Desc: 'Select between wedding ceremony booking or parish hall hire.',
    step2: 'Check availability',
    step2Desc: 'View open dates, time slots, and hall capacities in real time.',
    step3: 'Submit your request',
    step3Desc: 'Fill in the required details — no account creation needed.',
    step4: 'Parish confirms',
    step4Desc: 'The parish office reviews and coordinates your booking.',

    // Services
    servicesTitle: 'Two Services, One Platform',
    servicesSubtitle: 'Whether it is a sacred ceremony or a community gathering, ChurchTrack handles it.',
    weddingTitle: 'Wedding Ceremony',
    weddingDesc: 'Book a weekday slot at the Main Church Sanctuary. Choose from three ceremony times and submit both partners\u2019 details for parish review.',
    weddingFeatures: 'Mon\u2013Sat \u00b7 3 daily slots \u00b7 Parish-reviewed',
    weddingAction: 'Start wedding booking',
    hallTitle: 'Parish Hall Hire',
    hallDesc: 'Browse 18+ curated halls for receptions, conferences, meetings, celebrations, and community events. Live availability and transparent pricing.',
    hallFeatures: '18+ halls \u00b7 Live calendar \u00b7 Instant quotes',
    hallAction: 'Browse parish halls',

    // Features
    featuresTitle: 'Why ChurchTrack',
    featuresSubtitle: 'Built for the parish community — simple, transparent, and reliable.',
    feature1: 'Clear availability',
    feature1Desc: 'See the right dates and ceremony slots before you submit your request.',
    feature2: 'Parish-guided',
    feature2Desc: 'Every booking is reviewed and coordinated by the EAR Remera parish office.',
    feature3: 'No account needed',
    feature3Desc: 'Submit your request in minutes without creating an account or logging in.',
    feature4: 'Transparent pricing',
    feature4Desc: 'Know the cost upfront — parish contribution rates with no hidden fees.',

    // CTA
    ctaTitle: 'Ready to Get Started?',
    ctaDesc: 'Join the EAR Remera Parish community. Book your ceremony or reserve a hall today.',
    ctaWedding: 'Book a Wedding',
    ctaHalls: 'Explore Halls',

    // Footer
    footer: 'Serving the EAR Remera Parish community.',
  },
  FR: {
    parish: 'Paroisse EAR Remera',
    heroEyebrow: 'ChurchTrack \u2014 Plateforme d\u2019\u00e9v\u00e9nements paroissiaux',
    heroLine1: 'Votre Paroisse,',
    heroLine2: 'Votre \u00c9v\u00e9nement,',
    heroAccent: 'En Toute Simplicit\u00e9.',
    desc: 'R\u00e9servez une c\u00e9r\u00e9monie de mariage ou d\u00e9couvrez une salle paroissiale \u2014 une exp\u00e9rience claire et fiable.',
    weddingCta: 'R\u00e9server un Mariage',
    hallsCta: 'Explorer les Salles',
    scrollHint: 'D\u00e9couvrir plus',

    statHalls: 'Salles disponibles',
    statSlots: 'Cr\u00e9neaux',
    statCouples: 'Couples accompagn\u00e9s',
    statParish: 'Accompagn\u00e9 par la paroisse',

    howTitle: 'Comment \u00e7a marche',
    howSubtitle: 'De la recherche \u00e0 la confirmation en quelques \u00e9tapes claires.',
    step1: 'Choisissez votre service',
    step1Desc: 'S\u00e9lectionnez r\u00e9servation de mariage ou location de salle paroissiale.',
    step2: 'V\u00e9rifiez la disponibilit\u00e9',
    step2Desc: 'Consultez les dates, cr\u00e9neaux et capacit\u00e9s en temps r\u00e9el.',
    step3: 'Envoyez votre demande',
    step3Desc: 'Remplissez les informations requises \u2014 sans cr\u00e9er de compte.',
    step4: 'La paroisse confirme',
    step4Desc: 'Le bureau paroissial examine et coordonne votre r\u00e9servation.',

    servicesTitle: 'Deux services, une plateforme',
    servicesSubtitle: 'Qu\u2019il s\u2019agisse d\u2019une c\u00e9r\u00e9monie sacr\u00e9e ou d\u2019un rassemblement communautaire, ChurchTrack g\u00e8re tout.',
    weddingTitle: 'C\u00e9r\u00e9monie de mariage',
    weddingDesc: 'R\u00e9servez un cr\u00e9neau en semaine au Sanctuaire principal. Choisissez parmi trois horaires et soumettez les coordonn\u00e9es des deux partenaires.',
    weddingFeatures: 'Lun\u2013Sam \u00b7 3 cr\u00e9neaux/jour \u00b7 Revu par la paroisse',
    weddingAction: 'Commencer la r\u00e9servation',
    hallTitle: 'Location de salle paroissiale',
    hallDesc: 'Parcourez 18+ salles pour r\u00e9ceptions, conf\u00e9rences, r\u00e9unions et \u00e9v\u00e9nements communautaires. Disponibilit\u00e9 en direct et tarification transparente.',
    hallFeatures: '18+ salles \u00b7 Calendrier en direct \u00b7 Devis instantan\u00e9',
    hallAction: 'Parcourir les salles',

    featuresTitle: 'Pourquoi ChurchTrack',
    featuresSubtitle: 'Con\u00e7u pour la communaut\u00e9 paroissiale \u2014 simple, transparent et fiable.',
    feature1: 'Disponibilit\u00e9 claire',
    feature1Desc: 'Consultez les dates et cr\u00e9neaux avant de soumettre votre demande.',
    feature2: 'Accompagnement paroissial',
    feature2Desc: 'Chaque r\u00e9servation est examin\u00e9e et coordonn\u00e9e par le bureau paroissial.',
    feature3: 'Sans compte',
    feature3Desc: 'Soumettez votre demande en minutes sans cr\u00e9er de compte.',
    feature4: 'Tarification transparente',
    feature4Desc: 'Connaissez le co\u00fbt d\u00e8s le d\u00e9part \u2014 tarifs paroissiaux sans frais cach\u00e9s.',

    ctaTitle: 'Pr\u00eat \u00e0 commencer ?',
    ctaDesc: 'Rejoignez la communaut\u00e9 de la paroisse EAR Remera. R\u00e9servez votre cr\u00e9neau ou votre salle d\u00e8s aujourd\u2019hui.',
    ctaWedding: 'R\u00e9server un Mariage',
    ctaHalls: 'Explorer les Salles',

    footer: 'Au service de la communaut\u00e9 de la paroisse EAR Remera.',
  },
  RW: {
    parish: 'Paruwasi EAR Remera',
    heroEyebrow: 'ChurchTrack \u2014 Urubuga rw\u2019Ibirori bya Paruwasi',
    heroLine1: 'Paruwasi Yawe,',
    heroLine2: 'Igikorwa Cyawe,',
    heroAccent: 'Mu Buryo Bworoshye.',
    desc: 'Kodesha aho gukorera ubukwe cyangwa ushakishe icyumba cya paruwasi \u2014 uburyo bworoshye kandi bwizewe.',
    weddingCta: 'Kodesha Ubukwe',
    hallsCta: 'Shakisha Ibyumba',
    scrollHint: 'Reba byinshi',

    statHalls: 'Ibyumba',
    statSlots: 'Amasaha',
    statCouples: 'Abashakanye',
    statParish: 'Parish-guided',

    howTitle: 'Uburyo Bikora',
    howSubtitle: 'Kuva ku ushakisha kugera ku kwemezwa mu buryo busobanutse.',
    step1: 'Hitamo serivisi',
    step1Desc: 'Hitamo gukodesha ubukwe cyangwa icyumba cya paruwasi.',
    step2: 'Reba ububoneke',
    step2Desc: 'Raba amatariki, amasaha n\u2019ubushobozi mu gihe nyacyo.',
    step3: 'Ohereza ubusabe',
    step3Desc: 'Uzuza amakuru akenewe \u2014 nta konti isabwa.',
    step4: 'Paruwasi yemeza',
    step4Desc: 'Iburo rya parowasi risuzuma kandi ryobora ubusabe bwawe.',

    servicesTitle: 'Serivisi ebyiri, urubuga rumwe',
    servicesSubtitle: 'Niba ari isabukuru cyangwa ikoreramuryango, ChurchTrack irabishoboye.',
    weddingTitle: 'Isabukuru y\u2019ubukwe',
    weddingDesc: 'Kodesha umwanya wo mu cyumweru mu rusengero rukuru. Hitamo amasaha atatu kandi utange amakuru y\u2019abashakanye bombi.',
    weddingFeatures: 'Kuwa mbere \u2013 Gatandatu \u00b7 Amasaha 3 ku munsi \u00b7 Paruwasi isuzuma',
    weddingAction: 'Tangira gukodesha',
    hallTitle: 'Gukodesha icyumba',
    hallDesc: 'Shakisha ibyumba by\u2019amakwe, inama, amateraniro, ibirori n\u2019ibikorwa by\u2019abaturage. Ububoneke bw\u2019igihe nyacyo n\u2019ibiciro bisobanutse.',
    hallFeatures: 'Ibyumba 18+ \u00b7 Kalendari y\u2019igihe nyacyo \u00b7 Ibihembwe byoroshye',
    hallAction: 'Shakisha ibyumba',

    featuresTitle: 'Kuki ChurchTrack',
    featuresSubtitle: 'Byakorewe umuryango wa paruwasi \u2014 byoroshye, bisobanutse kandi bwizewe.',
    feature1: 'Ububoneke busobanutse',
    feature1Desc: 'Raba amatariki n\u2019amasaha mbere yo kohereza ubusabe.',
    feature2: 'Kuyoborwa na paruwasi',
    feature2Desc: 'Buri busabe busuzumwa kandi bugategurwa n\u2019ibiro bya paruwasi.',
    feature3: 'Nta konti',
    feature3Desc: 'Ohereza ubusabe mu minota mike nta konti ukoraho.',
    feature4: 'Ibiciro bisobanutse',
    feature4Desc: 'Menya igiciro mbere \u2014 ibiciro bya paruwasi nta makarang\u2019iyongerezwa.',

    ctaTitle: 'Witeguye gutangira?',
    ctaDesc: 'Jya mu mwango wa Paruwasi EAR Remera. Kodesha umwanya cyangwa icyumba uyu munsi.',
    ctaWedding: 'Kodesha Ubukwe',
    ctaHalls: 'Shakisha Ibyumba',

    footer: 'Dukorera umuryango wa Paruwasi EAR Remera.',
  },
} as const;

export default function ChurchTrackLanding({ lang = 'EN', onNavigate }: Props) {
  const t = copy[lang as keyof typeof copy] || copy.EN;

  return (
    <div className="bg-navy-50 text-navy-950" id="churchtrack-landing">

      {/* ═══════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════ */}
      <section className="relative h-[calc(100dvh-61px)] md:h-[calc(100dvh-65px)] overflow-hidden bg-navy-950 text-white">
        {/* Church background image */}
        <img
          src={heroParishImage}
          alt="EAR Remera Parish Church"
          className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        {/* Gradient: solid navy on left for text, fades to reveal image on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-navy-950/10" />

        {/* Content */}
        <div className="relative h-full mx-auto max-w-7xl px-5 sm:px-8 flex flex-col justify-center">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">

            {/* ── Left: Copy ── */}
            <div className="space-y-5 sm:space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 backdrop-blur-sm">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  {t.heroEyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-[2rem] leading-[1.08] tracking-tight sm:text-5xl md:text-[3.2rem] lg:text-6xl xl:text-[3.8rem]">
                <span className="block text-white">{t.heroLine1}</span>
                <span className="block text-white">{t.heroLine2}</span>
                <span className="block italic font-light text-white/45">{t.heroAccent}</span>
              </h1>

              {/* Description */}
              <p className="max-w-md text-[13px] sm:text-sm leading-relaxed text-white/50 md:text-[15px]">
                {t.desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => onNavigate('visitor-wedding-landing')}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3 text-[13px] sm:text-sm font-semibold text-navy-950 transition hover:bg-white/90 min-touch"
                >
                  <Heart className="h-4 w-4 text-rose-500" />
                  {t.weddingCta}
                  <ArrowRight className="h-4 w-4 text-navy-400 transition group-hover:translate-x-0.5 group-hover:text-navy-950" />
                </button>
                <button
                  onClick={() => onNavigate('visitor-sallehub')}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/[0.06] px-6 py-3 text-[13px] sm:text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 min-touch"
                >
                  <Building2 className="h-4 w-4 text-white/50" />
                  {t.hallsCta}
                  <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="" className="h-8 w-8 rounded-full border-2 border-navy-950 object-cover" referrerPolicy="no-referrer" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="" className="h-8 w-8 rounded-full border-2 border-navy-950 object-cover" referrerPolicy="no-referrer" />
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" alt="" className="h-8 w-8 rounded-full border-2 border-navy-950 object-cover" referrerPolicy="no-referrer" />
                  <div className="h-8 w-8 rounded-full border-2 border-navy-950 bg-white/15 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white/60">+</span>
                  </div>
                </div>
                <div className="text-xs leading-snug">
                  <span className="font-semibold text-white/75">200+ couples served</span>
                  <br />
                  <span className="text-white/35">with care and excellence</span>
                </div>
              </div>
            </div>

            {/* ── Right: Stat cards (desktop only) ── */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <Building2 className="h-4 w-4 text-white/35" />
                <p className="mt-3 font-serif text-2xl text-white">18+</p>
                <p className="mt-0.5 text-[11px] text-white/40">{t.statHalls}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <CalendarDays className="h-4 w-4 text-white/35" />
                <p className="mt-3 font-serif text-2xl text-white">3</p>
                <p className="mt-0.5 text-[11px] text-white/40">{t.statSlots}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <Users className="h-4 w-4 text-white/35" />
                <p className="mt-3 font-serif text-2xl text-white">200+</p>
                <p className="mt-0.5 text-[11px] text-white/40">{t.statCouples}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-white/35" />
                <p className="mt-3 font-serif text-base text-white">{t.feature2}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/35">{t.feature2Desc}</p>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-auto pb-2 pt-6 md:pt-8">
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition"
              aria-label={t.scrollHint}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">{t.scrollHint}</span>
              <div className="w-6 h-9 rounded-full border border-white/20 flex justify-center pt-2">
                <div className="w-[3px] h-[6px] rounded-full bg-white/35 animate-bounce" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-navy-50 px-5 sm:px-6 py-14 md:py-20 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 sm:mb-12 text-center">
            <p className="section-eyebrow">{t.howTitle}</p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl text-navy-950">{t.howSubtitle}</h2>
          </div>

          <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 lg:grid-cols-4">
            {/* Connector line (desktop) */}
            <div className="pointer-events-none absolute top-10 left-[12%] right-[12%] hidden h-px bg-gradient-to-r from-navy-200 via-navy-300 to-navy-200 lg:block" />

            {[
              { n: 1, icon: Search, title: t.step1, desc: t.step1Desc },
              { n: 2, icon: CalendarDays, title: t.step2, desc: t.step2Desc },
              { n: 3, icon: Sparkles, title: t.step3, desc: t.step3Desc },
              { n: 4, icon: CheckCircle2, title: t.step4, desc: t.step4Desc },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className="relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative z-10 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-950 shadow-sm mb-3 sm:mb-5 transition hover:border-navy-950 hover:bg-navy-950 hover:text-white group">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950 text-[10px] font-bold text-white ring-2 ring-navy-50 transition group-hover:bg-white group-hover:text-navy-950 group-hover:ring-navy-950">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-navy-950">{s.title}</h3>
                  <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-navy-500 max-w-[12rem] sm:max-w-[14rem]">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES AT A GLANCE
         ═══════════════════════════════════════════ */}
      <section className="bg-white border-y border-navy-200 px-5 sm:px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 sm:mb-12 max-w-2xl">
            <p className="section-eyebrow">{t.servicesTitle}</p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl text-navy-950">{t.servicesSubtitle}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Wedding card */}
            <article className="group relative rounded-xl border border-navy-200 bg-navy-50 p-7 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-white">
                <Heart className="h-5 w-5" />
              </div>
              <p className="section-eyebrow mt-6">ChurchTrack</p>
              <h3 className="mt-2 font-serif text-xl sm:text-2xl text-navy-950">{t.weddingTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-navy-600">{t.weddingDesc}</p>
              <p className="mt-3 text-xs font-medium text-navy-500">{t.weddingFeatures}</p>
              <button
                onClick={() => onNavigate('visitor-wedding-landing')}
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-navy-950 hover:text-navy-700 transition"
              >
                {t.weddingAction}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </article>

            {/* Halls card */}
            <article className="group relative rounded-xl border border-navy-200 bg-navy-50 p-7 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="section-eyebrow mt-6">SalleHub</p>
              <h3 className="mt-2 font-serif text-xl sm:text-2xl text-navy-950">{t.hallTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-navy-600">{t.hallDesc}</p>
              <p className="mt-3 text-xs font-medium text-navy-500">{t.hallFeatures}</p>
              <button
                onClick={() => onNavigate('visitor-sallehub')}
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-navy-950 hover:text-navy-700 transition"
              >
                {t.hallAction}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
         ═══════════════════════════════════════════ */}
      <section className="bg-navy-50 px-5 sm:px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 sm:mb-12 text-center">
            <p className="section-eyebrow">{t.featuresTitle}</p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl text-navy-950">{t.featuresSubtitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarDays, title: t.feature1, desc: t.feature1Desc },
              { icon: ShieldCheck, title: t.feature2, desc: t.feature2Desc },
              { icon: CheckCircle2, title: t.feature3, desc: t.feature3Desc },
              { icon: MapPin, title: t.feature4, desc: t.feature4Desc },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card-surface p-6 text-left space-y-3">
                  <div className="p-2.5 bg-navy-950 text-white rounded-lg inline-flex">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-serif text-navy-950">{f.title}</h3>
                  <p className="text-xs text-navy-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
         ═══════════════════════════════════════════ */}
      <section className="bg-navy-950 px-5 sm:px-6 py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white">{t.ctaTitle}</h2>
          <p className="text-sm leading-relaxed text-navy-300 max-w-lg mx-auto">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('visitor-wedding-landing')}
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-navy-950 transition hover:-translate-y-0.5 hover:shadow-lg min-touch"
            >
              <Heart className="h-4 w-4 text-rose-500" />
              {t.ctaWedding}
              <ArrowRight className="h-4 w-4 text-navy-400 transition group-hover:translate-x-0.5 group-hover:text-navy-700" />
            </button>
            <button
              onClick={() => onNavigate('visitor-sallehub')}
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 min-touch"
            >
              <Building2 className="h-4 w-4 text-navy-300" />
              {t.ctaHalls}
              <ArrowRight className="h-4 w-4 text-navy-400 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 sm:px-6 py-6 md:py-8 text-xs font-semibold text-navy-500">
        <Church className="h-4 w-4" /> {t.footer}
      </div>
    </div>
  );
}

/* ─── Inline sub-components ─── */


