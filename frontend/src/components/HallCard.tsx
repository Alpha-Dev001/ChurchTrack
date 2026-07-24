import React from "react";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Hall } from "../types";

interface HallCardProps {
  key?: string | number;
  hall: Hall;
  lang?: string;
  onNavigate: (view: string, params?: any) => void;
}

const tCard: Record<string, { available: string; booked: string; viewDetails: string; guests: string; day: string }> = {
  EN: {
    available: "Available",
    booked: "Booked",
    viewDetails: "View Details",
    guests: "Guests",
    day: "day",
  },
  FR: {
    available: "Disponible",
    booked: "Réservé",
    viewDetails: "Voir les détails",
    guests: "Invités",
    day: "jour",
  },
  RW: {
    available: "Kiriho",
    booked: "Barafashe",
    viewDetails: "Reba Ibirambuye",
    guests: "Abantu",
    day: "munsi",
  },
};

export default function HallCard({ hall, lang = "EN", onNavigate }: HallCardProps) {
  const t = tCard[lang] || tCard["EN"];
  const isAvailable = hall.status !== "Inactive";
  const rating = hall.id === "grace-hall" ? "4.9" : hall.id === "victory-hall" ? "4.8" : "4.9";
  const formattedPrice = (hall.price >= 1000 ? hall.price : hall.price * 1000).toLocaleString();

  const openHall = () => onNavigate("visitor-hall-details", { hallId: hall.id });

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openHall}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openHall();
        }
      }}
      className="group relative w-full aspect-[4/3] md:aspect-[16/10] rounded-lg overflow-hidden bg-navy-950 hover:-translate-y-1 transition-transform duration-300 ease-out cursor-pointer border border-navy-200 select-none flex flex-col justify-between p-5"
      id={`hall-card-${hall.id}`}
    >
      <img
        src={hall.images[0]}
        alt={hall.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
        referrerPolicy="no-referrer"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 via-35% to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between w-full">
        {isAvailable ? (
          <span className="bg-navy-950/70 text-white border border-white/15 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{t.available}</span>
          </span>
        ) : (
          <span className="bg-navy-950/70 text-white/70 border border-white/15 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-400" />
            <span>{t.booked}</span>
          </span>
        )}

        <span className="bg-navy-950/70 text-white border border-white/15 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{rating}</span>
        </span>
      </div>

      <div className="relative z-10 space-y-1.5 text-left">
        <h3 className="text-xl sm:text-[22px] font-semibold text-white tracking-tight line-clamp-1">
          {hall.name}
        </h3>

        <div className="flex items-center justify-between text-xs text-white/75 font-medium">
          <p className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
            <span className="truncate">{hall.location}</span>
          </p>
          <span className="text-white/60 font-normal pl-2 flex-shrink-0">
            {hall.capacity} {t.guests}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/15 mt-1.5">
          <div className="text-white text-base sm:text-[17px] font-semibold tracking-tight">
            RWF {formattedPrice}
            <span className="text-xs font-normal text-white/60">/{t.day}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openHall();
            }}
            className="bg-white hover:bg-navy-50 text-navy-950 text-xs font-medium px-3.5 py-1.5 rounded-md transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
            id={`btn-hall-card-view-${hall.id}`}
          >
            <span>{t.viewDetails}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </article>
  );
}
