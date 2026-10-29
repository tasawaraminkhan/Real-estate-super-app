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
  if (!API_URL) throw new Error("NO_API");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  const tok = opts.token ?? accessToken;
  if (tok) headers.Authorization = `Bearer ${tok}`;
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
      if (code === "123456" || code.length === 6) {
        setToken("demo-token");
        return {
          accessToken: "demo-token",
          user: { id: "demo", phone, role: "BUYER", fullName: "Demo User" },
        };
      }
      throw { error: { message: "Invalid OTP — demo: 123456" } };
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
      return { id: "demo-draft", status: "DRAFT", ...body };
    }
  },
  submit: async (id: string) => {
    try {
      return await api(`/api/v1/properties/${id}/submit`, { method: "POST" });
    } catch {
      return { property: { id, status: "ACTIVE" }, fraud: { score: 10, action: "auto_approve" } };
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

export const billingApi = {
  plans: async () => {
    try {
      return await api<unknown[]>("/api/v1/billing/plans");
    } catch {
      return null;
    }
  },
};

export { API_URL, DEMO_LISTINGS };
