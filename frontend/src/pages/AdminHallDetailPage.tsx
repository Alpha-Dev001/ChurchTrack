import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Ruler,
  Trash2,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Hall } from '../types';
import ConfirmDialog, { confirmDialogLabels } from '../components/ConfirmDialog';

interface AdminHallDetailPageProps {
  lang?: string;
  hall: Hall;
  onNavigate: (view: string, params?: any) => void;
  onUpdateHall: (id: string, hallData: any) => Promise<void>;
  onDeleteHall: (id: string) => Promise<void>;
  onToggleHallStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void>;
}

const tDetail: Record<string, any> = {
  EN: {
    back: 'Back to Halls',
    hallDetails: 'Hall Details',
    edit: 'Edit Hall',
    save: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    delete: 'Delete Hall',
    preview: 'Image Preview',
    noImages: 'No images available',
    info: 'Venue Information',
    name: 'Hall Name',
    location: 'Location',
    description: 'Description',
    capacity: 'Capacity',
    price: 'Price / day',
    size: 'Dimensions',
    hours: 'Working Hours',
    status: 'Status',
    facilities: 'Facilities',
    guests: 'Guests',
    active: 'Active',
    inactive: 'Inactive',
    updated: 'Hall updated successfully',
    deleted: 'Hall deleted successfully',
    updateFailed: 'Failed to update hall',
    deleteFailed: 'Failed to delete hall',
    addImageUrl: 'Add image URL',
    add: 'Add',
    cover: 'Cover',
  },
  FR: {
    back: 'Retour aux salles',
    hallDetails: 'Détails de la salle',
    edit: 'Modifier la salle',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    delete: 'Supprimer la salle',
    preview: 'Aperçu des images',
    noImages: 'Aucune image disponible',
    info: 'Informations sur la salle',
    name: 'Nom de la salle',
    location: 'Emplacement',
    description: 'Description',
    capacity: 'Capacité',
    price: 'Prix / jour',
    size: 'Dimensions',
    hours: "Heures d'ouverture",
    status: 'Statut',
    facilities: 'Équipements',
    guests: 'Invités',
    active: 'Actif',
    inactive: 'Inactif',
    updated: 'Salle mise à jour avec succès',
    deleted: 'Salle supprimée avec succès',
    updateFailed: 'Échec de la mise à jour',
    deleteFailed: 'Échec de la suppression',
    addImageUrl: "Ajouter l'URL de l'image",
    add: 'Ajouter',
    cover: 'Couverture',
  },
  RW: {
    back: 'Subira ku Byumba',
    hallDetails: "Amakuru y'Icyumba",
    edit: 'Hindura Icyumba',
    save: 'Bika Impinduka',
    saving: 'Kubika...',
    cancel: 'Hagarika',
    delete: 'Siba Icyumba',
    preview: 'Kureba Amafoto',
    noImages: 'Nta mafoto ahari',
    info: "Amakuru y'Icyumba",
    name: "Izina ry'Icyumba",
    location: 'Aho Giherereye',
    description: 'Ibisobanuro',
    capacity: 'Ubushobozi',
    price: 'Ikiguzi / ku munsi',
    size: 'Ingano',
    hours: 'Amasaha yo Gukora',
    status: 'Imiterere',
    facilities: 'Ibikoresho',
    guests: 'Abantu',
    active: 'Kirakora',
    inactive: 'Ntikora',
    updated: 'Icyumba cyahinduwe neza',
    deleted: 'Icyumba cyasibwe neza',
    updateFailed: 'Guhindura byanze',
    deleteFailed: 'Gusiba byanze',
    addImageUrl: 'Ongeraho URL y\'ifoto',
    add: 'Ongeraho',
    cover: 'Igifuniko',
  },
};

export default function AdminHallDetailPage({
  lang = 'EN',
  hall,
  onNavigate,
  onUpdateHall,
  onDeleteHall,
  onToggleHallStatus,
}: AdminHallDetailPageProps) {
  const t = tDetail[lang] || tDetail.EN;
  const c = confirmDialogLabels[lang] || confirmDialogLabels.EN;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [form, setForm] = useState({
    name: hall.name,
    location: hall.location,
    description: hall.description || '',
    capacity: hall.capacity,
    price: hall.price,
    size: hall.size || '',
    workingHours: hall.workingHours || '08:00 AM - 08:00 PM',
    status: hall.status,
    images: [...(hall.images || [])],
    facilities: [...(hall.facilities || [])],
  });

  const images = editing ? form.images : hall.images || [];
  const facilitiesText = useMemo(
    () => (editing ? form.facilities : hall.facilities || []).join(', '),
    [editing, form.facilities, hall.facilities]
  );

  const startEdit = () => {
    setForm({
      name: hall.name,
      location: hall.location,
      description: hall.description || '',
      capacity: hall.capacity,
      price: hall.price,
      size: hall.size || '',
      workingHours: hall.workingHours || '08:00 AM - 08:00 PM',
      status: hall.status,
      images: [...(hall.images || [])],
      facilities: [...(hall.facilities || [])],
    });
    setEditing(true);
    setActiveImgIdx(0);
  };

  const cancelEdit = () => {
    setEditing(false);
    setImageUrlInput('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error(t.name);
      return;
    }
    setSaving(true);
    try {
      await onUpdateHall(hall.id, {
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.description,
        capacity: Number(form.capacity),
        price: Number(form.price),
        size: form.size,
        workingHours: form.workingHours,
        status: form.status,
        images: form.images,
        facilities: form.facilities,
      });
      toast.success(t.updated);
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || t.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDeleteHall(hall.id);
      toast.success(t.deleted);
      onNavigate('admin-halls');
    } catch (err: any) {
      toast.error(err.message || t.deleteFailed);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url].slice(0, 10) }));
    setImageUrlInput('');
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const next = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: next };
    });
    setActiveImgIdx((idx) => Math.max(0, Math.min(idx, images.length - 2)));
  };

  const setField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 text-left font-sans text-navy-800 max-w-6xl mx-auto pb-10" id="admin-hall-detail-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-100 pb-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('admin-halls')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-500 hover:text-navy-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.back}
          </button>
          <h2 className="text-xl font-black text-navy-900 tracking-wide">{editing ? t.edit : t.hallDetails}</h2>
          <p className="text-sm font-bold text-navy-600 mt-1">{hall.name}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                {t.edit}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 hover:bg-navy-100 text-navy-700 text-xs font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.delete}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-700 text-xs font-bold hover:bg-navy-50 cursor-pointer disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? t.saving : t.save}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Images */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-navy-400">{t.preview}</h3>
          <div className="relative h-72 sm:h-96 bg-navy-100 rounded-lg overflow-hidden border border-navy-200">
            {images.length > 0 ? (
              <>
                <img src={images[activeImgIdx]} alt={hall.name} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImgIdx((p) => (p === 0 ? images.length - 1 : p - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/85 hover:bg-white rounded-lg shadow cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImgIdx((p) => (p === images.length - 1 ? 0 : p + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/85 hover:bg-white rounded-lg shadow cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-navy-400 gap-2">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs font-semibold">{t.noImages}</span>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                    idx === activeImgIdx ? 'border-navy-950' : 'border-navy-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-navy-950/80 text-white text-[8px] font-bold py-0.5">
                      {t.cover}
                    </span>
                  )}
                  {editing && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          removeImage(idx);
                        }
                      }}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-navy-700 text-white rounded"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {editing && (
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder={t.addImageUrl}
                className="input-field flex-1 text-xs"
              />
              <button type="button" onClick={addImageUrl} className="btn-secondary text-[10px] px-3">
                {t.add}
              </button>
            </div>
          )}
        </div>

        {/* Info / Edit form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-surface p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-navy-400">{t.info}</h3>

            {!editing ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-navy-400">{t.name}</p>
                  <p className="text-sm font-black text-navy-950">{hall.name}</p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" />
                  <span className="font-semibold text-navy-700">{hall.location}</span>
                </div>
                <p className="text-xs text-navy-600 leading-relaxed font-medium">{hall.description}</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg bg-navy-50 border border-navy-100 p-3">
                    <Users className="w-3.5 h-3.5 text-navy-500 mb-1" />
                    <p className="text-[9px] uppercase font-bold text-navy-400">{t.capacity}</p>
                    <p className="text-sm font-black text-navy-900">
                      {hall.capacity} {t.guests}
                    </p>
                  </div>
                  <div className="rounded-lg bg-navy-50 border border-navy-100 p-3">
                    <DollarSign className="w-3.5 h-3.5 text-navy-500 mb-1" />
                    <p className="text-[9px] uppercase font-bold text-navy-400">{t.price}</p>
                    <p className="text-sm font-black text-navy-900">${hall.price}</p>
                  </div>
                  <div className="rounded-lg bg-navy-50 border border-navy-100 p-3">
                    <Ruler className="w-3.5 h-3.5 text-navy-500 mb-1" />
                    <p className="text-[9px] uppercase font-bold text-navy-400">{t.size}</p>
                    <p className="text-sm font-black text-navy-900">{hall.size}</p>
                  </div>
                  <div className="rounded-lg bg-navy-50 border border-navy-100 p-3">
                    <Clock className="w-3.5 h-3.5 text-navy-500 mb-1" />
                    <p className="text-[9px] uppercase font-bold text-navy-400">{t.hours}</p>
                    <p className="text-sm font-black text-navy-900">{hall.workingHours}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase text-navy-400">{t.status}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      const next = hall.status === 'Active' ? 'Inactive' : 'Active';
                      try {
                        await onToggleHallStatus(hall.id, next);
                        toast.success(`${t.status}: ${next === 'Active' ? t.active : t.inactive}`);
                      } catch (err: any) {
                        toast.error(err.message || t.updateFailed);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border cursor-pointer ${
                      hall.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-navy-50 border-navy-200 text-navy-600'
                    }`}
                  >
                    {hall.status === 'Active' ? t.active : t.inactive}
                  </button>
                </div>
                {facilitiesText && (
                  <div>
                    <p className="text-[10px] font-bold uppercase text-navy-400 mb-1">{t.facilities}</p>
                    <p className="text-xs font-semibold text-navy-700">{facilitiesText}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.name}</label>
                  <input className="input-field text-sm" value={form.name} onChange={(e) => setField('name', e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.location}</label>
                  <input className="input-field text-sm" value={form.location} onChange={(e) => setField('location', e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.description}</label>
                  <textarea
                    className="input-field text-sm min-h-[80px]"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.capacity}</label>
                    <input
                      type="number"
                      className="input-field text-sm"
                      value={form.capacity}
                      onChange={(e) => setField('capacity', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.price}</label>
                    <input
                      type="number"
                      className="input-field text-sm"
                      value={form.price}
                      onChange={(e) => setField('price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.size}</label>
                    <input className="input-field text-sm" value={form.size} onChange={(e) => setField('size', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.hours}</label>
                    <input
                      className="input-field text-sm"
                      value={form.workingHours}
                      onChange={(e) => setField('workingHours', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.status}</label>
                  <select
                    className="input-field text-sm"
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value as 'Active' | 'Inactive')}
                  >
                    <option value="Active">{t.active}</option>
                    <option value="Inactive">{t.inactive}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-navy-400 block mb-1">{t.facilities}</label>
                  <input
                    className="input-field text-sm"
                    value={form.facilities.join(', ')}
                    onChange={(e) =>
                      setField(
                        'facilities',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title={c.deleteTitle}
        message={c.deleteMessage}
        confirmLabel={c.deleteConfirm}
        cancelLabel={c.cancel}
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
