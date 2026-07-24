const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

/**
 * Booking IDs are stored as "#BK-1020". A bare "#" in a URL is a fragment,
 * so the request never reaches /approve|/reject (backend returns "Route not found").
 * Strip leading # and encode for path segments.
 */
export function encodeBookingId(id: string): string {
  const bare = decodeURIComponent(String(id || ''))
    .replace(/^#/, '')
    .trim();
  return encodeURIComponent(bare);
}

export function bookingApiPath(id: string, suffix = ''): string {
  const base = `/api/bookings/${encodeBookingId(id)}`;
  return suffix ? `${base}/${suffix.replace(/^\//, '')}` : base;
}

export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  // Prepend API base URL for relative paths (e.g., /api/halls)
  // Ensure no double slashes between base URL and path
  const path = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${path}`;
  const res = await fetch(fullUrl, options);
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}: ${res.statusText || "Error"}`);
    }
    throw new Error("Server returned an invalid non-JSON response.");
  }

  if (!res.ok) {
    const errorMsg = (data && (data.error || data.message))
      ? (data.error || data.message)
      : `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
