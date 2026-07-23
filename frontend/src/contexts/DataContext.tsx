import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Hall, Booking, DashboardStats } from '../types';
import { bookingApiPath, safeFetchJson } from '../lib/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  halls: Hall[];
  bookings: Booking[];
  stats: DashboardStats;
  hallsLoading: boolean;
  bookingsLoading: boolean;
  fetchHalls: () => Promise<void>;
  fetchAdminData: () => Promise<void>;
  addHall: (hallData: any) => Promise<void>;
  updateHall: (id: string, hallData: any) => Promise<void>;
  toggleHallStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void>;
  deleteHall: (id: string) => Promise<void>;
  approveBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { adminToken } = useAuth();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hallsLoading, setHallsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalHalls: 0,
    occupancyRate: 0,
  });

  const fetchHalls = useCallback(async () => {
    setHallsLoading(true);
    try {
      const data = await safeFetchJson<Hall[]>('/api/halls');
      if (Array.isArray(data)) setHalls(data);
    } catch (err) {
      console.error('Error loading halls:', err);
    } finally {
      setHallsLoading(false);
    }
  }, []);

  const fetchAdminData = useCallback(async () => {
    if (!adminToken) return;
    setBookingsLoading(true);
    try {
      const [bookingsData, statsData] = await Promise.all([
        safeFetchJson<Booking[]>('/api/bookings', {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        safeFetchJson<DashboardStats>('/api/stats', {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
      ]);
      if (Array.isArray(bookingsData)) setBookings(bookingsData);
      if (statsData) setStats(statsData);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setBookingsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { fetchHalls(); }, [fetchHalls]);
  useEffect(() => { if (adminToken) fetchAdminData(); }, [adminToken, fetchAdminData]);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  }), [adminToken]);

  const addHall = useCallback(async (hallData: any) => {
    const { imageFiles, images, ...fields } = hallData || {};
    const files: File[] = Array.isArray(imageFiles)
      ? imageFiles.filter((f: unknown): f is File => f instanceof File)
      : [];
    const urlImages = (Array.isArray(images) ? images : [])
      .map(String)
      .filter((url: string) => url && !url.startsWith('data:') && !url.startsWith('blob:'));

    // Prefer multipart when files are present so large images never hit express.json limits (413).
    if (files.length > 0) {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      if (urlImages.length > 0) {
        formData.append('existingImages', JSON.stringify(urlImages));
      }
      files.slice(0, 5).forEach((file) => formData.append('images', file));

      await safeFetchJson('/api/halls', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
    } else {
      if (urlImages.length === 0) {
        throw new Error('At least one hall image is required');
      }
      await safeFetchJson('/api/halls', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...fields, images: urlImages }),
      });
    }

    await Promise.all([fetchHalls(), fetchAdminData()]);
  }, [adminToken, authHeaders, fetchHalls, fetchAdminData]);

  const updateHall = useCallback(async (id: string, hallData: any) => {
    const { imageFiles, images, ...fields } = hallData || {};
    const files: File[] = Array.isArray(imageFiles)
      ? imageFiles.filter((f: unknown): f is File => f instanceof File)
      : [];
    const urlImages = (Array.isArray(images) ? images : [])
      .map(String)
      .filter((url: string) => url && !url.startsWith('data:') && !url.startsWith('blob:'));

    if (files.length > 0) {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      if (urlImages.length > 0) {
        formData.append('existingImages', JSON.stringify(urlImages));
      }
      files.slice(0, 5).forEach((file) => formData.append('images', file));

      await safeFetchJson(`/api/halls/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
    } else {
      await safeFetchJson(`/api/halls/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ...fields, images: urlImages }),
      });
    }

    await Promise.all([fetchHalls(), fetchAdminData()]);
  }, [adminToken, authHeaders, fetchHalls, fetchAdminData]);

  const toggleHallStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    await safeFetchJson(`/api/halls/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    await fetchHalls();
  }, [authHeaders, fetchHalls]);

  const deleteHall = useCallback(async (id: string) => {
    await safeFetchJson(`/api/halls/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await Promise.all([fetchHalls(), fetchAdminData()]);
  }, [adminToken, fetchHalls, fetchAdminData]);

  const approveBooking = useCallback(async (id: string) => {
    await safeFetchJson(bookingApiPath(id, 'approve'), {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await fetchAdminData();
  }, [adminToken, fetchAdminData]);

  const rejectBooking = useCallback(async (id: string) => {
    await safeFetchJson(bookingApiPath(id, 'reject'), {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await fetchAdminData();
  }, [adminToken, fetchAdminData]);

  return (
    <DataContext.Provider
      value={{
        halls, bookings, stats,
        hallsLoading, bookingsLoading,
        fetchHalls, fetchAdminData,
        addHall, updateHall, toggleHallStatus, deleteHall,
        approveBooking, rejectBooking,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}