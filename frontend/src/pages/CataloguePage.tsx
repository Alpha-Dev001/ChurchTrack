import React, { useState, useMemo } from "react";
import { Search, MapPin, Users, DollarSign, ArrowUpDown, SlidersHorizontal, ArrowRight, Tag, HelpCircle } from "lucide-react";
import { Hall } from "../types";
import HallCard from "../components/HallCard";
import { useData } from "../contexts/DataContext";
import { HallCardSkeleton } from "../components/Skeletons";

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
    filterHalls: "Filter Halls",
    clearAll: "Clear All",
    searchLabel: "Search",
    searchPlaceholder: "Search halls...",
    locationLabel: "Location",
    eventTypeLabel: "Event Type",
    maxCapacityLabel: "Max Capacity",
    guests1000: "1000+ Guests",
    guestsCount: "Guests",
    maxPriceLabel: "Max Price",
    dayRate: "/ day",
    hallsFound: "Halls Found",
    liveResults: "Live results matching active parameters",
    sortByLabel: "Sort by:",
    sortPopular: "Popularity / Default",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortCapacityDesc: "Capacity: Large first",
    badgeMaintenance: "Maintenance",
    badgePopular: "Popular",
    capacityCard: "Capacity",
    priceCard: "Price (from)",
    viewDetails: "View Details",
    noHallsFound: "No Halls Found",
    noHallsDesc: "Try clearing some filters or searching for another keyword.",
    resetFilters: "Reset Filters",
    wedding: "Wedding",
    conference: "Conference",
    meeting: "Meeting",
    seminar: "Seminar",
    celebration: "Celebration"
  },
  FR: {
    directory: "Annuaire SalleHub",
    ourChurchHalls: "Nos Salles Paroissiales",
    bannerDesc: "Parcourez, comparez et réservez parmi notre catalogue soigneusement sélectionné de salles paroissiales élégantes et d'espaces communautaires.",
    filterHalls: "Filtrer les Salles",
    clearAll: "Effacer tout",
    searchLabel: "Recherche",
    searchPlaceholder: "Rechercher des salles...",
    locationLabel: "Localisation",
    eventTypeLabel: "Type d'événement",
    maxCapacityLabel: "Capacité Max",
    guests1000: "1000+ Invités",
    guestsCount: "Invités",
    maxPriceLabel: "Prix Max",
    dayRate: "/ jour",
    hallsFound: "Salles Trouvées",
    liveResults: "Résultats en direct correspondant aux critères actifs",
    sortByLabel: "Trier par :",
    sortPopular: "Popularité / Défaut",
    sortPriceAsc: "Prix : du moins cher au plus cher",
    sortPriceDesc: "Prix : du plus cher au moins cher",
    sortCapacityDesc: "Capacité : Grandes salles d'abord",
    badgeMaintenance: "Maintenance",
    badgePopular: "Populaire",
    capacityCard: "Capacité",
    priceCard: "Prix (à partir de)",
    viewDetails: "Voir les détails",
    noHallsFound: "Aucune Salle Trouvée",
    noHallsDesc: "Essayez d'effacer certains filtres ou de chercher un autre mot-clé.",
    resetFilters: "Réinitialiser les Filtres",
    wedding: "Mariage",
    conference: "Conférence",
    meeting: "Réunion",
    seminar: "Séminaire",
    celebration: "Célébration"
  },
  RW: {
    directory: "Urutonde rwa SalleHub",
    ourChurchHalls: "Ibyumba byacu bya Paruwasi",
    bannerDesc: "Shakisha, ngereranya, hanyuma ukodeshe ibyumba byiza bya paruwasi binyuze ku rutonde rwacu rukurikiranwa neza.",
    filterHalls: "Gungura Ibyumba",
    clearAll: "Gufuta Byose",
    searchLabel: "Shakisha",
    searchPlaceholder: "Shakisha icyumba...",
    locationLabel: "Aho Giherereye",
    eventTypeLabel: "Igikorwa",
    maxCapacityLabel: "Abantu Max",
    guests1000: "Abantu 1000+",
    guestsCount: "Abantu",
    maxPriceLabel: "Ikiguzi Max",
    dayRate: "/ munsi",
    hallsFound: "Ibyumba Bibonetse",
    liveResults: "Ibisubizo bihuye n'ibyo wahisemo",
    sortByLabel: "Gushyira ku murongo:",
    sortPopular: "Ibyamamare / Bisanzwe",
    sortPriceAsc: "Ibiciro: Uhereye ku bito",
    sortPriceDesc: "Ibiciro: Uhereye ku binini",
    sortCapacityDesc: "Ubushobozi: Uhereye ku binini",
    badgeMaintenance: "Gusanwa",
    badgePopular: "Ibyamamare",
    capacityCard: "Ubushobozi",
    priceCard: "Ikiguzi (gihereye)",
    viewDetails: "Reba Ibirambuye",
    noHallsFound: "Nta Cyumba Bibonetse",
    noHallsDesc: "Gufuta ibyo wahisemo hanyuma wongere ugerageze.",
    resetFilters: "Gusubiza ku Ntangiriro",
    wedding: "Ubukwe",
    conference: "Inama",
    meeting: "Inama y'Umuryango",
    seminar: "Amahugurwa",
    celebration: "Ibirori"
  }
};

export default function CataloguePage({ lang = "EN", halls, initialFilters, onNavigate }: CataloguePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialFilters?.location && initialFilters.location !== "All" ? [initialFilters.location] : []
  );
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(
    initialFilters?.type && initialFilters.type !== "All" ? [initialFilters.type] : []
  );
  const [maxCapacity, setMaxCapacity] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "capacity-desc">("popular");

  // Get list of unique locations & event types
  const locationsList = ["Kacyiru", "Remera", "Nyamirambo", "Kicukiro", "Gisenyi", "Kimihurura", "Gikondo"];
  const eventTypesList = ["Wedding", "Conference", "Meeting", "Seminar", "Celebration"];

  const handleLocationToggle = (loc: string) => {
    setSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const handleEventTypeToggle = (type: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedLocations([]);
    setSelectedEventTypes([]);
    setMaxCapacity(1000);
    setMaxPrice(1000);
    setSortBy("popular");
  };

  const getEventTypeName = (type: string) => {
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
      if (type === "Meeting") return "Inama y'Umuryango";
      if (type === "Seminar") return "Amahugurwa";
      if (type === "Celebration") return "Ibirori";
    }
    return type;
  };

  // Perform live filtering
  const filteredHalls = useMemo(() => {
    return halls
      .filter(hall => {
        // Text Search (Name, location, description)
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          const matchesText =
            hall.name.toLowerCase().includes(s) ||
            hall.location.toLowerCase().includes(s) ||
            hall.description.toLowerCase().includes(s);
          if (!matchesText) return false;
        }

        // Location check
        if (selectedLocations.length > 0) {
          const matchesLoc = selectedLocations.some(loc =>
            hall.location.toLowerCase().includes(loc.toLowerCase())
          );
          if (!matchesLoc) return false;
        }

        // Capacity Slider
        if (hall.capacity > maxCapacity) return false;

        // Price Slider
        if (hall.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "capacity-desc") return b.capacity - a.capacity;
        return 0; // Default popularity
      });
  }, [halls, searchTerm, selectedLocations, selectedEventTypes, maxCapacity, maxPrice, sortBy]);

  const { hallsLoading } = useData();
  const t = tCatalogue[lang] || tCatalogue["EN"];

  return (
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
        {/* List Headers & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-100 pb-4 gap-4 text-left">
          <div>
            <p className="text-navy-900 text-lg font-bold tracking-wide">
              {filteredHalls.length} {t.hallsFound}
            </p>
            <p className="text-navy-400 text-xs font-semibold">{t.liveResults}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-navy-400 font-bold flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{t.sortByLabel}</span>
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="border border-navy-200 rounded-xl px-3 py-1.5 text-xs font-semibold bg-white text-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
              id="sorting-select-halls"
            >
              <option value="popular">{t.sortPopular}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
              <option value="capacity-desc">{t.sortCapacityDesc}</option>
            </select>
          </div>
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
                  <h4 className="text-sm font-extrabold text-navy-800">{t.noHallsFound}</h4>
                  <p className="text-xs text-navy-400 font-semibold max-w-xs mx-auto">
                    {t.noHallsDesc}
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-extrabold py-2 px-4 rounded-xl shadow-md transition cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
