import Constants from "expo-constants";

/** Phone pe localhost nahi chalega — LAN IP ya deployed API set karo */
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ||
  "";

const DEMO_LISTINGS = [
  {
    id: "demo-1",
    title: "10 Marla Plot — DHA Phase 5, Lahore",
    priceAmount: "24500000000",
    areaValue: 10,
    areaUnit: "MARLA",
    city: { name: "Lahore" },
    society: { name: "DHA Phase 5" },
    purpose: "SALE",
  },
  {
    id: "demo-2",
    title: "5 Marla House — Bahria Town Karachi",
    priceAmount: "18500000000",
    areaValue: 5,
    areaUnit: "MARLA",
    city: { name: "Karachi" },
    society: { name: "Bahria Town" },
    purpose: "SALE",
  },
  {
    id: "demo-3",
    title: "1 Kanal Villa — DHA Islamabad",
    priceAmount: "75000000000",
    areaValue: 1,
    areaUnit: "KANAL",
    city: { name: "Islamabad" },
    society: { name: "DHA Islamabad" },
    purpose: "SALE",
  },
  {
    id: "demo-4",
    title: "3 Marla Flat for Rent — Lahore",
    priceAmount: "8500000",
    areaValue: 3,
    areaUnit: "MARLA",
    city: { name: "Lahore" },
    society: { name: undefined },
    purpose: "RENT",
  },
];

export async function api<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("NO_API");
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
}

export const authApi = {
  requestOtp: async (phone: string) => {
    try {
      return await api<{ message: string; devOtp?: string }>("/api/v1/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
    } catch {
      return { message: "Demo mode", devOtp: "123456" };
    }
  },
  verifyOtp: async (phone: string, code: string) => {
    try {
      return await api<{
        accessToken: string;
        user: { id: string; phone: string; role: string; fullName?: string };
      }>("/api/v1/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      });
    } catch {
      if (code === "123456" || code.length === 6) {
        return {
          accessToken: "demo-token",
          user: { id: "demo", phone, role: "BUYER", fullName: "Demo User" },
        };
      }
      throw { error: { message: "Invalid OTP — demo mein 123456 try karo" } };
    }
  },
};

export const propertiesApi = {
  list: async (page = 1) => {
    try {
      return await api<{ items: unknown[]; pageInfo: { total: number } }>(
        `/api/v1/properties?page=${page}&limit=20`,
      );
    } catch {
      return { items: DEMO_LISTINGS, pageInfo: { total: DEMO_LISTINGS.length } };
    }
  },
  search: async (params: Record<string, string>) => {
    try {
      const q = new URLSearchParams(params).toString();
      return await api<{ items: unknown[]; pageInfo: { total: number } }>(
        `/api/v1/search/properties?${q}`,
      );
    } catch {
      return { items: DEMO_LISTINGS, pageInfo: { total: DEMO_LISTINGS.length } };
    }
  },
};

export { API_URL, DEMO_LISTINGS };
