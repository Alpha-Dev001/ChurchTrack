import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { footerTranslations } from "../translations";
import { safeFetchJson } from "../lib/api";
import SalleHubLogo from "./SalleHubLogo";
import type { SystemSettings } from "../types";

interface FooterProps {
  lang: string;
  onNavigate: (view: string) => void;
}

export default function Footer({ lang, onNavigate }: FooterProps) {
  const tFooter = footerTranslations[lang] || footerTranslations["EN"];
  const [emailInput, setEmailInput] = useState("");
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await safeFetchJson<SystemSettings>('/api/settings');
        setSettings(data);
      } catch {
        // Use defaults if settings can't be loaded
      }
    };
    loadSettings();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      alert(tFooter.joinAlert);
      setEmailInput("");
    }
  };

  const siteName = settings?.siteName || "SalleHub";
  const siteAddress = settings?.address || "Kigali, Rwanda";
  const sitePhone = settings?.phone || "+250 788 000 000";
  const siteEmail = settings?.email || "info@sallehub.rw";

  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800 py-16 px-4 text-left font-sans" id="public-footer">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 text-white rounded-lg">
              <SalleHubLogo size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-[0.18em] font-serif leading-none">{siteName}</h1>
              <span className="text-[9px] text-navy-300 font-bold uppercase tracking-[0.24em] leading-none block mt-0.5">Parish Venues</span>
            </div>
          </div>
          <p className="text-[11px] text-navy-300 leading-relaxed font-light">
            {tFooter.tagline}
          </p>
          <div className="space-y-2 text-xs font-semibold text-navy-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-navy-400" />
              <span>{siteAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-navy-400" />
              <span>{sitePhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-navy-400" />
              <span>{siteEmail}</span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-navy-200">{tFooter.quickLinks}</h4>
          <ul className="space-y-2.5 text-xs font-light text-navy-300">
            <li>
              <Link
                to="/catalogue"
                className="hover:text-white transition cursor-pointer focus:outline-none focus:underline"
                aria-label="View halls catalog"
              >
                {tFooter.hallsCatalog}
              </Link>
            </li>
            <li>
              <Link
                to="/track"
                className="hover:text-white transition cursor-pointer focus:outline-none focus:underline"
                aria-label="Track booking"
              >
                {tFooter.trackBooking}
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="hover:text-white transition cursor-pointer focus:outline-none focus:underline"
                aria-label="Coordinator sign in"
              >
                {tFooter.coordinatorSignIn}
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-navy-200">{tFooter.supportHelp}</h4>
          <ul className="space-y-2.5 text-xs font-light text-navy-300">
            <li>
              <span className="cursor-pointer hover:text-white transition focus:outline-none focus:underline">
                {tFooter.about}
              </span>
            </li>
            <li>
              <span className="cursor-pointer hover:text-white transition focus:outline-none focus:underline">
                {tFooter.howItWorks}
              </span>
            </li>
            <li>
              <span className="cursor-pointer hover:text-white transition focus:outline-none focus:underline">
                {tFooter.faqs}
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-navy-200">{tFooter.newsletter}</h4>
          <p className="text-[11px] text-navy-300 leading-relaxed font-light">
            {tFooter.newsDesc}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder={tFooter.emailPlaceholder}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition"
              aria-label="Email address for newsletter"
              required
            />
            <button
              type="submit"
              className="bg-white hover:bg-navy-100 text-navy-900 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              {tFooter.join}
            </button>
          </form>
        </div>
      </div>

      {/* Copyrights */}
      <div className="max-w-5xl mx-auto border-t border-navy-800 mt-12 pt-6 text-center flex flex-col sm:flex-row justify-between text-[11px] font-medium text-navy-300">
        <p>© {new Date().getFullYear()} {siteName}. {tFooter.rights}</p>
        <div className="flex gap-4 mt-2 sm:mt-0 justify-center">
          <span className="cursor-pointer hover:text-white transition focus:outline-none focus:underline">
            {tFooter.privacy}
          </span>
          <span className="cursor-pointer hover:text-white transition focus:outline-none focus:underline">
            {tFooter.terms}
          </span>
        </div>
      </div>
    </footer>
  );
}