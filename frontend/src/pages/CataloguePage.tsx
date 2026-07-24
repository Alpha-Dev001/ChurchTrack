import React, { useState, useMemo } from "react";
import { ChevronLeft, HelpCircle, Search } from "lucide-react";
import { Hall } from "../types";
import HallCard from "../components/HallCard";
import { useData } from "../contexts/DataContext";
import { HallCardSkeleton } from "../components/Skeletons";
import SEO from "../components/SEO";

interface CataloguePageProps {
  lang?: string;
  halls: Hall[];
  initialFilters?: any;
  onNavigate: (view: string, params?: any) => void;
}

// Full English/French dictionary for the halls catalogue
const tCatalogue: Record<string, any> = {
  EN: {
    directory: "SalleHub Directory",
    ourChurchHalls: "Our Church Halls",
    bannerDesc: "Browse, compare, and reserve from our carefully curated catalog of elegant parish venues and community event spaces.",
    hallsCount: "Halls Available",
    backHome: "Back to Home",
    searchPlaceholder: "Search halls by name, location...",
    noHallsFound: "No Halls Available",
    noHallsDesc: "There are no halls in the database yet. Please check back later.",
    noResults: "No halls match your search",
    noResultsDesc: "Try a different search term.",
  },
  FR: {
    directory: "Annuaire SalleHub",
    ourChurchHalls: "Nos Salles Paroissiales",
    bannerDesc: "Parcourez, comparez et réservez parmi notre catalogue soigneusement sélectionné de salles paroissiales élégantes et d'espaces communautaires.",
    hallsCount: "Salles Disponibles",
    backHome: "Retour à l'Accueil",
    searchPlaceholder: "Rechercher une salle par nom, lieu...",
    noHallsFound: "Aucune Salle Disponible",
    noHallsDesc: "Il n'y a pas encore de salles dans la base de données. Veuillez revenir plus tard.",
    noResults: "Aucune salle ne correspond à votre recherche",
    noResultsDesc: "Essayez un autre terme de recherche.",
  },
  RW: {
    directory: "Urutonde rwa SalleHub",
    ourChurchHalls: "Ibyumba byacu bya Paruwasi",
    bannerDesc: "Shakisha, ngereranya, hanyuma ukodeshe ibyumba byiza bya paruwasi binyuze ku rutonde rwacu rukurikiranwa neza.",
    hallsCount: "Ibyumba Bihari",
    backHome: "Subira Ahabanza",
    searchPlaceholder: "Shakisha icyumba ku izina, aho giherereye...",
    noHallsFound: "Nta Cyumba Kihari",
    noHallsDesc: "Nta byumba byanditswe muri database. Ongera ugaruke nyuma.",
    noResults: "Nta cyumba gihuye n'ibyo ushaka",
    noResultsDesc: "Gerageza undi mubare w'ibyo ushaka.",
  }
};

export default function CataloguePage({ lang = "EN", halls, onNavigate }: CataloguePageProps) {
  const { hallsLoading } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const t = tCatalogue[lang] || tCatalogue["EN"];

  const seoData = {
    EN: {
      title: "Browse Church Halls - SalleHub",
      description: "Browse our complete catalog of premium parish halls. Find the perfect venue for weddings, conferences, seminars, and special events.",
      keywords: "church halls, parish venues, event spaces, wedding halls, conference rooms, seminar venues, hall directory",
      lang: "en"
    },
    FR: {
      title: "Parcourir les Salles d'Église - SalleHub",
      description: "Parcourez notre catalogue complet de salles paroissiales premium. Trouvez le lieu parfait pour mariages, conférences, séminaires et événements.",
      keywords: "salles d'église, salles paroissiales, lieux d'événements, salles de mariage, salles de conférence",
      lang: "fr"
    },
    RW: {
      title: "Shakisha Ibyumba bya Paruwasi - SalleHub",
      description: "Reba urutonde rw'ibyumba byiza bya paruwasi. Shakisha icyumba gikwiranye n'ibirori byawe by'ubukwe, inama n'amahugurwa.",
      keywords: "ibyumba bya paruwasi, ahantu y'ibirori, icyumba cy'ubukwe, icyumba cy'inama",
      lang: "rw"
    }
  };

  const currentSeo = seoData[lang as keyof typeof seoData] || seoData.EN;

  const filteredHalls = useMemo(() => {
    if (!searchTerm.trim()) return halls;
    const s = searchTerm.toLowerCase();
    return halls.filter(hall =>
      hall.name.toLowerCase().includes(s) ||
      hall.location.toLowerCase().includes(s) ||
      (hall.description && hall.description.toLowerCase().includes(s))
    );
  }, [halls, searchTerm]);

  return (
    <>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonical="https://sallehub.vercel.app/catalogue"
        lang={currentSeo.lang}
      />
      <div className="font-sans text-navy-800" id="catalogue-page-root">
        {/* Top Banner Header */}
      <section className="relative bg-navy-950 text-white py-12 px-4 overflow-hidden border-b border-navy-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
            alt="header"
            className="w-full h-full object-cover opacity-20 blur-[1px]"
          />
          <div className="absolute inset-0 bg-navy-950/80"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-left space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy-400 font-sans">{t.directory}</span>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight">{t.ourChurchHalls}</h1>
          <p className="text-navy-300 text-xs md:text-base max-w-xl font-sans font-light">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Main Catalog View Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back to Home + Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-100 pb-4 gap-4 text-left">
          <div>
            <button
              onClick={() => onNavigate("visitor-home")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-500 hover:text-navy-900 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {t.backHome}
            </button>
            <p className="text-navy-900 text-lg font-bold tracking-wide mt-1">
              {filteredHalls.length} {t.hallsCount}
            </p>
          </div>
        </div>

        {/* Search Bar — full width on mobile, more prominent */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 md:py-2.5 rounded-xl border-2 md:border border-navy-300 md:border-navy-200 bg-white text-sm font-medium text-navy-800 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 transition shadow-sm"
            autoFocus={window.innerWidth < 768}
          />
        </div>

        {/* Halls Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" id="catalogue-halls-grid">
            {hallsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <HallCardSkeleton key={i} />)
            ) : filteredHalls.length > 0 ? (
              filteredHalls.map(hall => (
                <HallCard
                  key={hall.id}
                  hall={hall}
                  lang={lang}
                  onNavigate={onNavigate}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center space-y-4" id="catalogue-no-results">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto text-navy-400 border border-navy-200">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-navy-800">
                    {searchTerm ? t.noResults : t.noHallsFound}
                  </h4>
                  <p className="text-xs text-navy-400 font-semibold max-w-xs mx-auto">
                    {searchTerm ? t.noResultsDesc : t.noHallsDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
      </div>
      </div>
    </>
  );
}
