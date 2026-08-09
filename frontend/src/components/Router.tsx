import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { ViewName, ViewParams, Hall } from '../types';
import { useData } from '../contexts/DataContext';
import { HallDetailsSkeleton, AdminStatsSkeleton, BookingDetailsSkeleton } from './Skeletons';

// Public pages
import LandingPage from '../pages/LandingPage';
import CataloguePage from '../pages/CataloguePage';
import HallDetailsPage from '../pages/HallDetailsPage';
import BookingRequestPage from '../pages/BookingRequestPage';
import SuccessPage from '../pages/SuccessPage';
import TrackBookingPage from '../pages/TrackBookingPage';
import ChurchTrackLanding from '../pages/ChurchTrackLanding';
import WeddingLanding from '../pages/WeddingLanding';
import WeddingBooking from '../pages/WeddingBooking';
import WeddingTrack from '../pages/WeddingTrack';

// Admin pages
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminHallsPage from '../pages/AdminHallsPage';
import AdminAddHallPage from '../pages/AdminAddHallPage';
import AdminHallDetailPage from '../pages/AdminHallDetailPage';
import AdminBookingsPage from '../pages/AdminBookingsPage';
import AdminBookingDetailsPage from '../pages/AdminBookingDetailsPage';
import AdminCalendarPage from '../pages/AdminCalendarPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';

interface RouterProps {
  view: ViewName;
  params: ViewParams;
  lang: string;
  onNavigate: (view: ViewName, params?: ViewParams) => void;
  onSearch: (filters: any) => void;
  onAddHall: (data: any) => Promise<void>;
  onUpdateHall: (id: string, data: any) => Promise<void>;
  onToggleHallStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void>;
  onDeleteHall: (id: string) => Promise<void>;
  onApproveBooking: (id: string) => Promise<void>;
  onRejectBooking: (id: string) => Promise<void>;
}

export default function Router({
  view, params, lang, onNavigate, onSearch,
  onAddHall, onUpdateHall, onToggleHallStatus, onDeleteHall,
  onApproveBooking, onRejectBooking,
}: RouterProps) {
  const { halls, bookings, stats, hallsLoading, bookingsLoading } = useData();

  const findHall = (id?: string): Hall | undefined =>
    id ? halls.find((h) => h.id === id) : undefined;

  const todayIso = new Date().toISOString().slice(0, 10);

  const renderPage = () => {
    switch (view) {
      // Public pages
      case 'visitor-home':
        return (
          <ChurchTrackLanding
            lang={lang}
            onNavigate={onNavigate}
          />
        );

      case 'visitor-sallehub':
        return <LandingPage lang={lang} halls={halls} onNavigate={onNavigate} onSearch={onSearch} />;

      case 'visitor-wedding-landing':
        return <WeddingLanding lang={lang} onNavigate={onNavigate} />;

      case 'visitor-wedding-booking': {
        const sanctuary = halls.find((hall) => hall.id === 'church-sanctuary');
        if (hallsLoading) return <HallDetailsSkeleton />;
        if (!sanctuary) return <div className="mx-auto max-w-lg py-24 text-center">Wedding venue is currently unavailable.</div>;
        return <WeddingBooking lang={lang} hall={sanctuary} onNavigate={onNavigate} onSubmitSuccess={(details) => onNavigate('visitor-success', { booking: details })} />;
      }

      case 'visitor-wedding-track':
        return <WeddingTrack lang={lang} onNavigate={onNavigate} />;

      case 'visitor-catalogue':
        return (
          <CataloguePage
            lang={lang}
            halls={halls}
            initialFilters={params}
            onNavigate={onNavigate}
          />
        );

      case 'visitor-hall-details': {
        if (hallsLoading) return <HallDetailsSkeleton />;
        const hall = findHall(params.hallId);
        if (!hall) {
          return (
            <div className="max-w-lg mx-auto py-24 px-4 text-center space-y-4">
              <h2 className="text-2xl font-serif text-navy-950">Hall not found</h2>
              <p className="text-sm text-navy-600">The venue you requested is unavailable or does not exist.</p>
              <button className="btn-primary" onClick={() => onNavigate('visitor-catalogue')}>
                Browse halls
              </button>
            </div>
          );
        }
        return <HallDetailsPage lang={lang} hall={hall} onNavigate={onNavigate} />;
      }

      case 'visitor-booking': {
        if (hallsLoading) return <HallDetailsSkeleton />;
        const hall = findHall(params.hallId);
        if (!hall) {
          return (
            <div className="max-w-lg mx-auto py-24 px-4 text-center space-y-4">
              <h2 className="text-2xl font-serif text-navy-950">Select a hall to continue</h2>
              <p className="text-sm text-navy-600">Choose a venue before submitting a booking request.</p>
              <button className="btn-primary" onClick={() => onNavigate('visitor-catalogue')}>
                Browse halls
              </button>
            </div>
          );
        }
        return (
          <BookingRequestPage
            lang={lang}
            hall={hall}
            selectedParams={{
              date: params.date || todayIso,
              timeSlot: params.timeSlot || '09:00 AM - 10:00 AM',
              duration: params.duration || '1 Hour',
              guests: params.guests || hall.capacity,
              serviceType: params.serviceType || 'SalleHub',
            }}
            onNavigate={onNavigate}
            onSubmitSuccess={(details) =>
              onNavigate('visitor-success', { booking: details })
            }
          />
        );
      }

      case 'visitor-success':
        return (
          <SuccessPage
            lang={lang}
            bookingDetails={params.booking?.booking || params.booking}
            onNavigate={onNavigate}
          />
        );

      case 'visitor-track':
        return (
          <TrackBookingPage
            lang={lang}
            initialCode={params.searchCode || ''}
            onNavigate={onNavigate}
          />
        );

      // Admin pages
      case 'admin-login':
        return <AdminLogin lang={lang} onNavigate={onNavigate} />;

      case 'superadmin-dashboard':
        return <SuperAdminDashboard lang={lang} />;

      case 'admin-dashboard':
        if (bookingsLoading && bookings.length === 0) {
          return (
            <div className="space-y-8">
              <AdminStatsSkeleton />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="lg:col-span-2 h-64 bg-navy-100 rounded-lg" />
                <div className="h-64 bg-navy-100 rounded-lg" />
              </div>
            </div>
          );
        }
        return (
          <AdminDashboard
            lang={lang}
            stats={stats}
            recentBookings={bookings}
            notifications={[]}
            onNavigate={onNavigate}
            onApproveBooking={onApproveBooking}
            onRejectBooking={onRejectBooking}
          />
        );

      case 'admin-halls':
        return (
          <AdminHallsPage
            lang={lang}
            halls={halls}
            bookings={bookings}
            onNavigate={onNavigate}
            onAddHall={onAddHall}
            onToggleHallStatus={onToggleHallStatus}
            onDeleteHall={onDeleteHall}
          />
        );

      case 'admin-add-hall':
        return (
          <AdminAddHallPage lang={lang} onNavigate={onNavigate} onAddHall={onAddHall} />
        );

      case 'admin-hall-details': {
        const hall = findHall(params.hallId);
        if (!hall) {
          return (
            <div className="max-w-lg mx-auto py-24 px-4 text-center space-y-4">
              <h2 className="text-2xl font-serif text-navy-950">Hall not found</h2>
              <button className="btn-primary" onClick={() => onNavigate('admin-halls')}>
                Back to halls
              </button>
            </div>
          );
        }
        return (
          <AdminHallDetailPage
            lang={lang}
            hall={hall}
            onNavigate={onNavigate}
            onUpdateHall={onUpdateHall}
            onDeleteHall={onDeleteHall}
            onToggleHallStatus={onToggleHallStatus}
          />
        );
      }

      case 'admin-bookings':
        return (
          <AdminBookingsPage lang={lang} bookings={bookings} onNavigate={onNavigate} />
        );

      case 'admin-booking-details':
        if (!params.bookingId) {
          return <BookingDetailsSkeleton />;
        }
        return (
          <AdminBookingDetailsPage
            lang={lang}
            bookingId={params.bookingId || ''}
            onNavigate={onNavigate}
            onApproveBooking={onApproveBooking}
            onRejectBooking={onRejectBooking}
          />
        );

      case 'admin-calendar':
        return <AdminCalendarPage lang={lang} onNavigate={onNavigate} />;

      case 'admin-settings':
        return <AdminSettingsPage lang={lang} />;

      default:
        return (
          <ChurchTrackLanding
            lang={lang}
            onNavigate={onNavigate}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}