import React, { useState, useEffect } from "react";
import { Save, Sparkles, Building, Phone, Mail, Clock, MapPin, Check } from "lucide-react";
import toast from "react-hot-toast";
import { safeFetchJson } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { SystemSettings } from "../types";

interface AdminSettingsPageProps {
  lang?: string;
}

const tSettings: Record<string, any> = {
  EN: {
    title: "Church Parish Settings",
    subtitle: "Configure global application variables, localized contacts, default working periods, and systems configuration.",
    savedMsg: "Global Settings Saved Successfully!",
    generalTitle: "General Setup",
    siteName: "Site Name",
    siteTagline: "Site Tagline",
    email: "Email Contact",
    phone: "Phone Contact",
    address: "Address",
    currency: "Default Currency",
    workingHours: "Working Hours",
    saveBtn: "Save Configuration",
    saveSuccess: "Settings saved successfully!",
    saveError: "Failed to save settings.",
  },
  FR: {
    title: "Paramètres de la Paroisse",
    subtitle: "Configurez les variables de l'application, les contacts, les horaires et la configuration système.",
    savedMsg: "Paramètres globaux enregistrés avec succès !",
    generalTitle: "Configuration Générale",
    siteName: "Nom du Site",
    siteTagline: "Slogan du Site",
    email: "E-mail de Contact",
    phone: "Téléphone de Contact",
    address: "Adresse",
    currency: "Devise par Défaut",
    workingHours: "Heures de Travail",
    saveBtn: "Enregistrer la Configuration",
    saveSuccess: "Paramètres enregistrés avec succès !",
    saveError: "Échec de l'enregistrement des paramètres.",
  },
  RW: {
    title: "Igenamiterere rya Paruwasi",
    subtitle: "Hindura amakuru rusange y'urubuga, nimero n'imyimerere ya paruwasi.",
    savedMsg: "Igenamiterere Ryabitswe Neza!",
    generalTitle: "Ibisabwa Rusange",
    siteName: "Izina ry'Urubuga",
    siteTagline: "Slogan y'Urubuga",
    email: "Imeri yo Kwandikiraho",
    phone: "Terefone yo Guhamagaraho",
    address: "Aho Iherereye",
    currency: "Ifaranga Ryemewe",
    workingHours: "Amasaha yo gukora",
    saveBtn: "Bika Igenamiterere",
    saveSuccess: "Igenamiterere ryabitswe neza!",
    saveError: "Kubika byanze.",
  }
};

export default function AdminSettingsPage({ lang = "EN" }: AdminSettingsPageProps) {
  const t = tSettings[lang] || tSettings["EN"];
  const { adminToken } = useAuth();
  const [saving, setSaving] = useState(false);
  const [siteName, setSiteName] = useState("ChurchTrack");
  const [siteTagline, setSiteTagline] = useState("Parish wedding and hall services");
  const [email, setEmail] = useState("info@sallehub.rw");
  const [phone, setPhone] = useState("+250 788 000 000");
  const [address, setAddress] = useState("Kigali, Rwanda");
  const [currency, setCurrency] = useState("RWF");
  const [workingHours, setWorkingHours] = useState("9:00 AM - 6:00 PM");
  const [saved, setSaved] = useState(false);

  // Silently load settings — no loading state, no error toasts
  useEffect(() => {
    safeFetchJson<SystemSettings>('/api/settings')
      .then(data => {
        if (data) {
          setSiteName(data.siteName || "ChurchTrack");
          setSiteTagline(data.siteTagline || "Parish wedding and hall services");
          setEmail(data.email || "info@sallehub.rw");
          setPhone(data.phone || "+250 788 000 000");
          setAddress(data.address || "Kigali, Rwanda");
          setCurrency(data.currency || "RWF");
          setWorkingHours(data.workingHours || "9:00 AM - 6:00 PM");
        }
      })
      .catch(() => {
        // Silently keep defaults
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) {
      toast.error("Authentication required");
      return;
    }
    setSaving(true);
    try {
      console.log('[Settings] Saving with adminToken:', adminToken ? 'present' : 'missing');
      await safeFetchJson('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          siteName,
          siteTagline,
          email,
          phone,
          address,
          currency,
          workingHours,
        }),
      });
      setSaved(true);
      toast.success(t.saveSuccess);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('[Settings] Save error:', err?.message || err);
      toast.error(err?.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans text-navy-800" id="admin-settings-page">
      {/* Page Header */}
      <div className="border-b border-navy-100 pb-5">
        <h2 className="text-xl font-black text-navy-900 tracking-wide">{t.title}</h2>
        <p className="text-xs text-navy-500 font-semibold mt-1">{t.subtitle}</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-xs font-bold flex items-center gap-2">
          <Check className="w-4.5 h-4.5 text-emerald-500" />
          <span>{t.savedMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Form */}
        <form onSubmit={handleSave} className="md:col-span-2 bg-white rounded-lg border border-navy-200/80 p-5 space-y-5 shadow-sm">
          <h3 className="text-xs font-black uppercase text-navy-400 tracking-wider border-b border-navy-100 pb-2.5">{t.generalTitle}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.siteName}</label>
              <input
                type="text"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.siteTagline}</label>
              <input
                type="text"
                value={siteTagline}
                onChange={e => setSiteTagline(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.phone}</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.address}</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.currency}</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              >
                <option value="RWF">RWF (FRw) - Rwandan Franc</option>
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.workingHours}</label>
              <input
                type="text"
                value={workingHours}
                onChange={e => setWorkingHours(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-navy-100 pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-navy-950 hover:bg-navy-800 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? '...' : t.saveBtn}</span>
            </button>
          </div>
        </form>

        {/* Right side helper info */}
        <div className="space-y-6">
          <div className="bg-white border border-navy-200/80 rounded-lg p-5 text-left shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-navy-400 tracking-wider border-b border-navy-100 pb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-navy-400" />
              <span>Info</span>
            </h3>
            <p className="text-xs text-navy-500 leading-relaxed font-semibold">
              These settings control the information displayed on the public website footer and throughout the application.
              Changes will take effect immediately after saving.
            </p>
            <div className="space-y-2 text-xs text-navy-600 font-semibold">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-navy-400" />
                <span>{siteName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-navy-400" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-navy-400" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-navy-400" />
                <span>{workingHours}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}