const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
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
  requestOtp: (phone: string) =>
    api<{ message: string; devOtp?: string }>("/api/v1/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, code: string) =>
    api<{
      accessToken: string;
      user: { id: string; phone: string; role: string; fullName?: string };
    }>("/api/v1/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),
};

export const propertiesApi = {
  list: (page = 1) =>
    api<{ items: unknown[]; pageInfo: { total: number } }>(
      `/api/v1/properties?page=${page}&limit=20`,
    ),
  search: (params: Record<string, string>) => {
    const q = new URLSearchParams(params).toString();
    return api<{ items: unknown[]; pageInfo: { total: number } }>(
      `/api/v1/search/properties?${q}`,
    );
  },
};
