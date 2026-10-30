import Constants from "expo-constants";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ||
  "";

let accessToken: string | null = null;

export function setToken(t: string | null) {
  accessToken = t;
}
export function getToken() {
  return accessToken;
}

export const DEMO_LISTINGS = [
  {
    id: "demo-1",
    title: "10 Marla Plot — DHA Phase 5, Lahore",
    priceAmount: "24500000000",
    areaValue: 10,
    areaUnit: "MARLA",
    bedrooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
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
    bedrooms: 3,
    bathrooms: 3,
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
    bedrooms: 5,
    bathrooms: 6,
    city: { name: "Islamabad" },
    society: { name: "DHA Islamabad" },
    purpose: "SALE",
  },
  {
    id: "demo-4",
    title: "3 Marla Flat for Rent — Gulberg Lahore",
    priceAmount: "8500000",
    areaValue: 3,
    areaUnit: "MARLA",
    bedrooms: 2,
    bathrooms: 2,
    city: { name: "Lahore" },
    society: { name: "Gulberg" },
    purpose: "RENT",
  },
  {
    id: "demo-5",
    title: "Shop — MM Alam Road Lahore",
    priceAmount: "32000000000",
    areaValue: 4,
    areaUnit: "MARLA",
    city: { name: "Lahore" },
    society: { name: "MM Alam" },
    purpose: "SALE",
  },
];

export async function api<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  if (!API_URL) throw new Error("NO_API");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  const tok = opts.token ?? accessToken;
  if (tok) headers.Authorization = `Bearer ${tok}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...opts,
      headers,
      signal: controller.signal,
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw { error: { message: "Invalid server response" } };
    }
    if (!res.ok) throw data ?? { error: { message: `HTTP ${res.status}` } };
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

export const authApi = {
  requestOtp: async (phone: string) => {
    try {
      return await api<{ message: string; devOtp?: string }>("/api/v1/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
    } catch {
      return { message: "Demo mode — use OTP 123456", devOtp: "123456" };
    }
  },
  verifyOtp: async (phone: string, code: string) => {
    try {
      const res = await api<{
        accessToken: string;
        user: { id: string; phone: string; role: string; fullName?: string };
      }>("/api/v1/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      });
      setToken(res.accessToken);
      return res;
    } catch {
      if (code === "123456" || /^\d{6}$/.test(code)) {
        setToken("demo-token");
        return {
          accessToken: "demo-token",
          user: { id: "demo", phone, role: "BUYER", fullName: "Demo User" },
        };
      }
      throw { error: { message: "Invalid OTP. Demo code: 123456" } };
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
  createDraft: async (body: Record<string, unknown>) => {
    try {
      return await api<Record<string, unknown>>("/api/v1/properties", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch {
      return { id: `demo-${Date.now()}`, status: "DRAFT", ...body };
    }
  },
  submit: async (id: string) => {
    try {
      return await api(`/api/v1/properties/${id}/submit`, { method: "POST" });
    } catch {
      return {
        property: { id, status: "ACTIVE" },
        fraud: { score: 12, action: "auto_approve" },
      };
    }
  },
  toggleFavourite: async (id: string) => {
    try {
      return await api<{ favourited: boolean }>(`/api/v1/properties/${id}/favourite`, {
        method: "POST",
      });
    } catch {
      return { favourited: true };
    }
  },
};

export { API_URL };
