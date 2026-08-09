import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, CheckCircle2, Clock3, Database, Edit3, Globe2, LockKeyhole, Plus, RefreshCw, Shield, Trash2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFetchJson } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type Lang = 'EN' | 'FR' | 'RW';
type ManagedAdmin = { id: string; email: string; name: string; role: string; createdAt?: string };
type Insights = {
    generatedAt: string;
    uptimeSeconds: number;
    process: { nodeVersion: string; memoryUsageMb: number; environment: string };
    services: { api: string; database: string; cloudinary: string };
    totals: { admins: number; totalHalls: number; totalBookings: number; pendingBookings: number; approvedBookings: number; rejectedBookings: number; totalRevenue: number; unreadNotifications: number; auditEntries: number };
    bookingStatus: { pending: number; approved: number; rejected: number };
    admins: ManagedAdmin[];
    recentAudit: { id: string; action: string; bookingId: string; performedBy: string; timestamp: string; details: string }[];
    settings: { siteName: string; currency: string; timeZone: string } | null;
};

const copy: Record<Lang, Record<string, string>> = {
    EN: { title: 'Super Admin Command Center', subtitle: 'Full-system visibility, operational health, and administrator control.', refresh: 'Refresh', addAdmin: 'Add administrator', live: 'Live system', admins: 'Administrators', halls: 'Halls', bookings: 'Bookings', revenue: 'Paid revenue', pending: 'Pending review', services: 'Service health', database: 'Database', api: 'API', configured: 'Configured', notConfigured: 'Not configured', activity: 'Recent system activity', noActivity: 'No audit activity has been recorded yet.', management: 'Administrator access', managementDesc: 'Create, edit, promote, or remove staff accounts.', name: 'Name', email: 'Email', role: 'Role', actions: 'Actions', password: 'Temporary password', save: 'Save administrator', cancel: 'Cancel', admin: 'Administrator', superadmin: 'Super administrator', remove: 'Remove', edit: 'Edit', passwordHint: 'Leave blank to keep the current password.', confirmDelete: 'Delete this administrator?', health: 'Operational health', runtime: 'Runtime', memory: 'Memory', environment: 'Environment', uptime: 'Uptime', noPermission: 'Super administrator access is required.' },
    FR: { title: 'Centre de Commandement Super Admin', subtitle: 'Visibilité complète, santé opérationnelle et contrôle des administrateurs.', refresh: 'Actualiser', addAdmin: 'Ajouter un administrateur', live: 'Système en direct', admins: 'Administrateurs', halls: 'Salles', bookings: 'Réservations', revenue: 'Revenus payés', pending: 'À examiner', services: 'État des services', database: 'Base de données', api: 'API', configured: 'Configuré', notConfigured: 'Non configuré', activity: 'Activité récente', noActivity: 'Aucune activité enregistrée.', management: 'Accès administrateur', managementDesc: 'Créer, modifier, promouvoir ou supprimer des comptes.', name: 'Nom', email: 'E-mail', role: 'Rôle', actions: 'Actions', password: 'Mot de passe temporaire', save: 'Enregistrer', cancel: 'Annuler', admin: 'Administrateur', superadmin: 'Super administrateur', remove: 'Supprimer', edit: 'Modifier', passwordHint: 'Laisser vide pour conserver le mot de passe.', confirmDelete: 'Supprimer cet administrateur ?', health: 'Santé opérationnelle', runtime: 'Exécution', memory: 'Mémoire', environment: 'Environnement', uptime: 'Disponibilité', noPermission: 'Accès super administrateur requis.' },
    RW: { title: 'Ikigo Cy’Umuyobozi Mukuru', subtitle: 'Reba sisitemu yose, imikorere yayo, n’abayobozi bafite uburenganzira.', refresh: 'Ongera urebe', addAdmin: 'Ongeraho umuyobozi', live: 'Sisitemu iri gukora', admins: 'Abayobozi', halls: 'Amazu', bookings: 'Ubusabe', revenue: 'Amafaranga yishyuwe', pending: 'Bitegereje gusuzumwa', services: 'Imikorere ya serivisi', database: 'Ububiko bw’amakuru', api: 'API', configured: 'Byateguwe', notConfigured: 'Ntabwo byateguwe', activity: 'Ibikorwa bya vuba', noActivity: 'Nta bikorwa byanditswe.', management: 'Uburenganzira bw’abayobozi', managementDesc: 'Kora, hindura, zamura cyangwa siba konti.', name: 'Izina', email: 'Imeri', role: 'Uruhare', actions: 'Ibikorwa', password: 'Ijambo ry’ibanga', save: 'Bika umuyobozi', cancel: 'Hagarika', admin: 'Umuyobozi', superadmin: 'Umuyobozi mukuru', remove: 'Siba', edit: 'Hindura', passwordHint: 'Siga ubusa kugira ngo risigare.', confirmDelete: 'Siba uyu muyobozi?', health: 'Imikorere ya sisitemu', runtime: 'Imikorere', memory: 'Ububiko', environment: 'Ibidukikije', uptime: 'Igihe ikora', noPermission: 'Ukeneye uburenganzira bw’umuyobozi mukuru.' },
};

const formatUptime = (seconds: number) => `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

export default function SuperAdminDashboard({ lang = 'EN' }: { lang?: string }) {
    const t = copy[(lang as Lang) in copy ? lang as Lang : 'EN'];
    const { adminToken, adminUser } = useAuth();
    const [insights, setInsights] = useState<Insights | null>(null);
    const [admins, setAdmins] = useState<ManagedAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<ManagedAdmin | null>(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });

    const headers = useMemo(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }), [adminToken]);
    const load = async () => {
        if (!adminToken || adminUser?.role !== 'superadmin') return;
        setLoading(true);
        try {
            const [overview, managed] = await Promise.all([
                safeFetchJson<Insights>('/api/superadmin/insights', { headers }),
                safeFetchJson<ManagedAdmin[]>('/api/superadmin/admins', { headers }),
            ]);
            setInsights(overview); setAdmins(managed);
        } catch (error: any) { toast.error(error?.message || 'Unable to load system insights'); }
        finally { setLoading(false); }
    };
    useEffect(() => { void load(); }, [adminToken, adminUser?.role]);

    if (adminUser?.role !== 'superadmin') return <div className="card-surface p-8 text-center"><Shield className="mx-auto mb-3 text-amber-600" /><p className="font-semibold">{t.noPermission}</p></div>;

    const openCreate = () => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'admin' }); setShowForm(true); };
    const openEdit = (admin: ManagedAdmin) => { setEditing(admin); setForm({ name: admin.name, email: admin.email, password: '', role: admin.role }); setShowForm(true); };
    const saveAdmin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const body = editing ? { name: form.name, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) } : form;
            await safeFetchJson(editing ? `/api/superadmin/admins/${encodeURIComponent(editing.id)}` : '/api/superadmin/admins', { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(body) });
            toast.success(editing ? 'Administrator updated' : 'Administrator created'); setShowForm(false); await load();
        } catch (error: any) { toast.error(error?.message || 'Unable to save administrator'); }
    };
    const deleteAdmin = async (admin: ManagedAdmin) => {
        if (!window.confirm(t.confirmDelete)) return;
        try { await safeFetchJson(`/api/superadmin/admins/${encodeURIComponent(admin.id)}`, { method: 'DELETE', headers }); toast.success('Administrator removed'); await load(); }
        catch (error: any) { toast.error(error?.message || 'Unable to remove administrator'); }
    };

    const metrics = insights ? [
        { label: t.admins, value: insights.totals.admins, icon: Users, tone: 'text-violet-700 bg-violet-50' },
        { label: t.halls, value: insights.totals.totalHalls, icon: Globe2, tone: 'text-blue-700 bg-blue-50' },
        { label: t.bookings, value: insights.totals.totalBookings, icon: BarChart3, tone: 'text-emerald-700 bg-emerald-50' },
        { label: t.revenue, value: new Intl.NumberFormat('en-RW', { style: 'currency', currency: insights.settings?.currency || 'RWF', maximumFractionDigits: 0 }).format(insights.totals.totalRevenue), icon: Activity, tone: 'text-amber-700 bg-amber-50' },
    ] : [];
    const healthItems: { label: string; value: string; icon: React.ElementType }[] = insights ? [
        { label: t.api, value: insights.services.api, icon: Activity },
        { label: t.database, value: insights.services.database, icon: Database },
        { label: t.runtime, value: insights.process.nodeVersion, icon: Clock3 },
        { label: t.memory, value: `${insights.process.memoryUsageMb} MB`, icon: BarChart3 },
    ] : [];

    return <div className="space-y-7 text-left" id="superadmin-dashboard-page">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-200 pb-5">
            <div><div className="flex items-center gap-2 mb-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{t.live}</span></div><h1 className="page-title">{t.title}</h1><p className="page-subtitle">{t.subtitle}</p></div>
            <div className="flex gap-2"><button onClick={() => void load()} className="btn-secondary py-2.5!"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />{t.refresh}</button><button onClick={openCreate} className="btn-primary py-2.5!"><Plus className="w-4 h-4" />{t.addAdmin}</button></div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">{metrics.map(({ label, value, icon: Icon, tone }) => <div key={label} className="card-surface p-5 flex items-start justify-between"><div><span className="section-eyebrow">{label}</span><strong className="mt-2 block text-xl md:text-2xl text-navy-950">{value}</strong></div><span className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-4 w-4" /></span></div>)}</div>

        {insights && <div className="grid grid-cols-1 lg:grid-cols-3 gap-5"><section className="card-surface p-5 lg:col-span-2"><div className="flex items-center justify-between border-b border-navy-100 pb-3 mb-4"><div><h2 className="text-sm font-bold text-navy-950">{t.health}</h2><p className="text-[11px] text-navy-500">{new Date(insights.generatedAt).toLocaleString()}</p></div><CheckCircle2 className="text-emerald-600" /></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{healthItems.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-navy-100 bg-navy-50/70 p-3"><span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{label}</span><div className="mt-2 flex items-center gap-2 text-xs font-bold text-navy-800"><Icon className="h-3.5 w-3.5 text-emerald-600" />{value}</div></div>)}</div><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold text-navy-500"><span>{t.environment}: {insights.process.environment}</span><span>{t.uptime}: {formatUptime(insights.uptimeSeconds)}</span><span>{t.pending}: {insights.totals.pendingBookings}</span></div></section><section className="card-surface p-5"><div className="flex items-center gap-2 border-b border-navy-100 pb-3 mb-4"><AlertTriangle className="h-4 w-4 text-amber-600" /><h2 className="text-sm font-bold text-navy-950">{t.activity}</h2></div>{insights.recentAudit.length ? <div className="space-y-3">{insights.recentAudit.slice(0, 5).map(log => <div key={log.id} className="border-l-2 border-navy-200 pl-3"><p className="text-xs font-bold text-navy-800">{log.action}</p><p className="text-[10px] text-navy-500">{log.details || log.bookingId} · {new Date(log.timestamp).toLocaleDateString()}</p></div>)}</div> : <p className="text-xs text-navy-500">{t.noActivity}</p>}</section></div>}

        <section className="card-surface overflow-hidden"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-100 p-5"><div><h2 className="text-sm font-bold text-navy-950">{t.management}</h2><p className="text-[11px] text-navy-500 mt-1">{t.managementDesc}</p></div><span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-navy-500"><LockKeyhole className="h-3.5 w-3.5" />{admins.length} {t.admins}</span></div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-navy-50 text-[10px] uppercase tracking-wider text-navy-500"><tr><th className="px-5 py-3">{t.name}</th><th className="px-5 py-3">{t.email}</th><th className="px-5 py-3">{t.role}</th><th className="px-5 py-3 text-right">{t.actions}</th></tr></thead><tbody className="divide-y divide-navy-100">{admins.map(admin => <tr key={admin.id} className="hover:bg-navy-50/70"><td className="px-5 py-4 font-semibold text-navy-900">{admin.name}</td><td className="px-5 py-4 text-navy-500">{admin.email}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${admin.role === 'superadmin' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>{admin.role === 'superadmin' ? t.superadmin : t.admin}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => openEdit(admin)} className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900" title={t.edit}><Edit3 className="h-3.5 w-3.5" /></button><button onClick={() => void deleteAdmin(admin)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title={t.remove}><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div></section>

        {showForm && <div className="fixed inset-0 z-70 flex items-center justify-center bg-navy-950/50 p-4"><form onSubmit={saveAdmin} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-navy-950">{editing ? t.edit : t.addAdmin}</h2><button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-navy-500" /></button></div><div className="space-y-4">{([['name', t.name], ['email', t.email], ['password', t.password]] as const).map(([key, label]) => <label key={key} className="block space-y-1.5"><span className="section-eyebrow">{label}</span><input required={key !== 'password' || !editing} type={key === 'password' ? 'password' : key} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="input-field" />{key === 'password' && editing && <span className="block text-[10px] text-navy-400">{t.passwordHint}</span>}</label>)}<label className="block space-y-1.5"><span className="section-eyebrow">{t.role}</span><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field"><option value="admin">{t.admin}</option><option value="superadmin">{t.superadmin}</option></select></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{t.cancel}</button><button type="submit" className="btn-primary">{t.save}</button></div></form></div>}
    </div>;
}
