/**
 * Local listings store — ensures user-created listings appear on Home & Map
 * even when backend API is offline (demo / standalone APK mode).
 */

export type ListingItem = {
  id: string;
  title: string;
  priceAmount: string;
  areaValue: number;
  areaUnit: string;
  purpose?: string;
  category?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  city?: { name: string };
  society?: { name?: string };
  latitude?: number;
  longitude?: number;
  addressText?: string;
  description?: string;
  status?: string;
  createdAt?: string;
};

type Listener = () => void;

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Lahore: { lat: 31.5204, lng: 74.3587 },
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Faisalabad: { lat: 31.4504, lng: 73.135 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
  Quetta: { lat: 30.1798, lng: 66.975 },
  Sialkot: { lat: 32.4945, lng: 74.5229 },
  Gujranwala: { lat: 32.1877, lng: 74.1945 },
  Hyderabad: { lat: 25.396, lng: 68.3578 },
  Bahawalpur: { lat: 29.3544, lng: 71.6911 },
};

let userListings: ListingItem[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeListings(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getUserListings(): ListingItem[] {
  return [...userListings];
}

export function coordsForCity(cityName?: string): { lat: number; lng: number } {
  if (!cityName) return CITY_COORDS.Lahore;
  const key = Object.keys(CITY_COORDS).find(
    (k) => k.toLowerCase() === cityName.toLowerCase(),
  );
  if (key) return CITY_COORDS[key];
  // slight jitter for unknown cities so markers don't stack
  return { lat: 30.3753, lng: 69.3451 };
}

export function addUserListing(item: ListingItem): ListingItem {
  const cityName = item.city?.name;
  const base = coordsForCity(cityName);
  // small random offset so multiple listings in same city don't overlap
  const jitter = () => (Math.random() - 0.5) * 0.04;
  const listing: ListingItem = {
    ...item,
    status: item.status ?? "ACTIVE",
    latitude: item.latitude ?? base.lat + jitter(),
    longitude: item.longitude ?? base.lng + jitter(),
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
  // newest first; replace if same id
  userListings = [listing, ...userListings.filter((x) => x.id !== listing.id)];
  notify();
  return listing;
}

export function clearUserListings() {
  userListings = [];
  notify();
}
