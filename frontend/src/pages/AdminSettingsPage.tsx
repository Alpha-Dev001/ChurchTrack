import React, { useState } from "react";
import { Settings, Save, Sparkles, Building, Phone, Mail, Clock, Database, Check } from "lucide-react";
import toast from "react-hot-toast";
import { safeFetchJson } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import ConfirmDialog, { confirmDialogLabels } from "../components/ConfirmDialog";

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
    currency: "Default Currency",
    saveBtn: "Save Configuration",
    utilitiesTitle: "System Utilities",
    utilitiesDesc: "Restore initial seed data to test the platform using preset weddings, conferences, occupancy donut stats, and timeline logs.",
    resetBtn: "Reset System Database",
    resetting: "Resetting database...",
    confirmReset: "Are you sure you want to restore the local JSON database to initial default seed values? This will clear any newly added bookings or halls.",
    successReset: "Local database reset successfully to initial parish seed state! Reloading...",
    failReset: "Failed to reset database."
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
    currency: "Devise par Défaut",
    saveBtn: "Enregistrer la Configuration",
    utilitiesTitle: "Utilitaires Système",
    utilitiesDesc: "Restaurez les données de démonstration initiales (mariages, conférences, statistiques) pour tester la plateforme.",
    resetBtn: "Réinitialiser la Base de Données",
    resetting: "Réinitialisation de la base...",
    confirmReset: "Êtes-vous sûr de vouloir restaurer la base de données par défaut ? Cela effacera les réservations ou salles récemment créées.",
    successReset: "Base de données réinitialisée avec succès ! Rechargement...",
    failReset: "Échec de la réinitialisation."
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
    currency: "Ifaranga Ryemewe",
    saveBtn: "Bika Igenamiterere",
    utilitiesTitle: "Ibikoresho bya Sisitemu",
    utilitiesDesc: "Subiza sisitemu ku miterere yayo y'ibanze n'amakuru y'icyitegererezo.",
    resetBtn: "Reset Sisitemu Yose",
    resetting: "Iri guhinduka...",
    confirmReset: "Ese urashaka gusiba amakuru yose mashya ugasubizaho amakuru y'ibanze y'icyitegererezo?",
    successReset: "Sisitemu yasubijwe ku miterere y'ibanze neza! Iri kwitangira...",
    failReset: "Gusubira ku miterere y'ibanze byanze."
  }
};

export default function AdminSettingsPage({ lang = "EN" }: AdminSettingsPageProps) {
  const t = tSettings[lang] || tSettings["EN"];
  const c = confirmDialogLabels[lang] || confirmDialogLabels.EN;
  const { adminToken } = useAuth();
  const [siteName, setSiteName] = useState("SalleHub Parish");
  const [siteTagline, setSiteTagline] = useState("Digitizing Church Hall Reservations");
  const [email, setEmail] = useState("info@sallehub.rw");
  const [phone, setPhone] = useState("+250 781 234 567");
  const [currency, setCurrency] = useState("RWF (FRw)");
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast.success(t.savedMsg);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDb = async () => {
    if (!adminToken) {
      toast.error(t.failReset);
      setShowResetConfirm(false);
      return;
    }
    setResetting(true);
    try {
      await safeFetchJson("/api/admin/reset-db", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success(t.successReset);
      window.location.reload();
    } catch {
      toast.error(t.failReset);
      setShowResetConfirm(false);
    } finally {
      setResetting(false);
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
              <label className="text-[10px] font-black uppercase text-navy-400 tracking-wider">{t.currency}</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs font-bold focus:outline-none"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="RWF (FRw)">RWF (FRw) - Rwandan Franc</option>
              </select>
            </div>
          </div>

          <div className="border-t border-navy-100 pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-navy-950 hover:bg-navy-800 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </form>

        {/* Right side helper tools */}
        <div className="space-y-6">
          {/* DB Reset block */}
          <div className="bg-white border border-navy-200/80 rounded-lg p-5 text-left shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-navy-400 tracking-wider border-b border-navy-100 pb-2.5 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-navy-400" />
              <span>{t.utilitiesTitle}</span>
            </h3>

            <p className="text-xs text-navy-500 leading-relaxed font-semibold">
              {t.utilitiesDesc}
            </p>

            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={resetting}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider py-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="btn-system-reset-db"
            >
              <span>{resetting ? t.resetting : t.resetBtn}</span>
            </button>
          </div>
        </div>

      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title={c.resetTitle}
        message={t.confirmReset || c.resetMessage}
        confirmLabel={c.resetConfirm}
        cancelLabel={c.cancel}
        variant="danger"
        loading={resetting}
        onConfirm={handleResetDb}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
