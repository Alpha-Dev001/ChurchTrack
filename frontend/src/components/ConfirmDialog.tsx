import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClasses =
    variant === 'danger'
      ? 'bg-navy-800 hover:bg-navy-950 text-white'
      : variant === 'warning'
        ? 'bg-navy-700 hover:bg-navy-900 text-white'
        : 'bg-navy-950 hover:bg-navy-900 text-white';

  const iconClasses =
    variant === 'danger'
      ? 'bg-navy-50 text-navy-700 border-navy-100'
      : variant === 'warning'
        ? 'bg-navy-50 text-navy-700 border-navy-100'
        : 'bg-navy-50 text-navy-700 border-navy-100';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={loading ? undefined : onCancel} />
      <div className="relative w-full max-w-md rounded-lg border border-navy-200 bg-white shadow-xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-navy-400 hover:text-navy-800 hover:bg-navy-50 transition disabled:opacity-50 cursor-pointer"
          aria-label={cancelLabel}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className={`shrink-0 p-2.5 rounded-lg border ${iconClasses}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-left space-y-1.5">
            <h3 id="confirm-dialog-title" className="text-base font-bold text-navy-950 tracking-wide">
              {title}
            </h3>
            <p className="text-sm text-navy-600 font-medium leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-xs font-semibold uppercase tracking-wider text-navy-700 hover:bg-navy-50 transition disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer ${confirmClasses}`}
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Shared EN / FR / RW labels for confirm dialogs */
export const confirmDialogLabels: Record<string, {
  cancel: string;
  confirm: string;
  logoutTitle: string;
  logoutMessage: string;
  logoutConfirm: string;
  deleteTitle: string;
  deleteMessage: string;
  deleteConfirm: string;
  approveTitle: string;
  approveMessage: string;
  approveConfirm: string;
  rejectTitle: string;
  rejectMessage: string;
  rejectConfirm: string;
  resetTitle: string;
  resetMessage: string;
  resetConfirm: string;
}> = {
  EN: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    logoutTitle: 'Log out?',
    logoutMessage: 'Are you sure you want to log out of the admin panel?',
    logoutConfirm: 'Log out',
    deleteTitle: 'Delete this item?',
    deleteMessage: 'Are you sure you want to delete this? This action cannot be undone.',
    deleteConfirm: 'Delete',
    approveTitle: 'Approve this booking?',
    approveMessage: 'Are you sure you want to approve this booking request? The time slot will be reserved.',
    approveConfirm: 'Approve',
    rejectTitle: 'Reject this booking?',
    rejectMessage: 'Are you sure you want to reject this booking request? The customer will be notified.',
    rejectConfirm: 'Reject',
    resetTitle: 'Reset database?',
    resetMessage: 'Are you sure you want to reset the database? This will wipe operational data.',
    resetConfirm: 'Reset',
  },
  FR: {
    cancel: 'Annuler',
    confirm: 'Confirmer',
    logoutTitle: 'Se déconnecter ?',
    logoutMessage: 'Êtes-vous sûr de vouloir vous déconnecter du panneau d\'administration ?',
    logoutConfirm: 'Se déconnecter',
    deleteTitle: 'Supprimer cet élément ?',
    deleteMessage: 'Êtes-vous sûr de vouloir supprimer ceci ? Cette action est irréversible.',
    deleteConfirm: 'Supprimer',
    approveTitle: 'Approuver cette réservation ?',
    approveMessage: 'Êtes-vous sûr de vouloir approuver cette demande ? Le créneau sera réservé.',
    approveConfirm: 'Approuver',
    rejectTitle: 'Rejeter cette réservation ?',
    rejectMessage: 'Êtes-vous sûr de vouloir rejeter cette demande ? Le client sera notifié.',
    rejectConfirm: 'Rejeter',
    resetTitle: 'Réinitialiser la base ?',
    resetMessage: 'Êtes-vous sûr de vouloir réinitialiser la base de données ? Les données opérationnelles seront effacées.',
    resetConfirm: 'Réinitialiser',
  },
  RW: {
    cancel: 'Hagarika',
    confirm: 'Emeza',
    logoutTitle: 'Gusohoka?',
    logoutMessage: 'Uzi neza ko ushaka gusohoka muri paneli y\'ubuyobozi?',
    logoutConfirm: 'Sohoka',
    deleteTitle: 'Gusiba iki kintu?',
    deleteMessage: 'Uzi neza ko ushaka gusiba iki? Iki gikorwa ntigishobora gusubizwa.',
    deleteConfirm: 'Siba',
    approveTitle: 'Kwemera ubu busabe?',
    approveMessage: 'Uzi neza ko ushaka kwemera ubu busabe? Uwo mwanya uzabikwa.',
    approveConfirm: 'Emera',
    rejectTitle: 'Kwanga ubu busabe?',
    rejectMessage: 'Uzi neza ko ushaka kwanga ubu busabe? Umukiriya azamenyeshwa.',
    rejectConfirm: 'Anga',
    resetTitle: 'Gusubiza database?',
    resetMessage: 'Uzi neza ko ushaka gusubiza database? Amakuru y\'ibikorwa azasibwa.',
    resetConfirm: 'Subiza',
  },
};
