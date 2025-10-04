// src/services/admin.ts
import api from "../lib/api";

/** Model koji UI koristi (normalizovan) */
export type AdminWine = {
  wineId: number;
  name: string;
  year?: number;
  price: number;
  category?: { categoryId?: number; name?: string } | null;
  winery?: { wineryId?: number; name?: string } | null;
};

/** Bezbedno “odpakuj” listu iz raznih formata koje API može da vrati */
function unwrapList<T = any>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];

  if (Array.isArray(data.data)) return data.data as T[];
  if (Array.isArray(data.items)) return data.items as T[];
  if (Array.isArray(data.results)) return data.results as T[];
  if (Array.isArray(data.value)) return data.value as T[];
  if (Array.isArray(data.rows)) return data.rows as T[];

  if (data.data && typeof data.data === "object") {
    const inner = unwrapList<T>(data.data);
    if (inner.length) return inner;
  }
  return [];
}

/** Normalizuj vino da uvek imamo isti shape */
function normalizeWine(x: any): AdminWine {
  return {
    wineId: Number(x.wineId ?? x.id ?? x.WineId ?? x.WINE_ID ?? 0),
    name: String(x.name ?? x.Name ?? ""),
    year: x.year ?? x.Year,
    price: Number(x.price ?? x.Price ?? 0),
    category: x.category ?? x.Category ?? null,
    winery: x.winery ?? x.Winery ?? null,
  };
}

/** Pokušaj više mogućih ruta, u zavisnosti od backend-a */
async function tryGetMany<T = any>(urls: string[]): Promise<T[]> {
  let lastError: any = null;

  for (const url of urls) {
    try {
      const { data } = await api.get(url);
      const list = unwrapList<T>(data);
      if (list.length) return list;
      if (Array.isArray(data) && data.length === 0) return [];
      if (Array.isArray((data as any)?.data) && (data as any).data.length === 0) return [];
    } catch (e: any) {
      lastError = e;
      continue;
    }
  }

  if (lastError) throw lastError;
  return [];
}

export const adminApi = {
  /** Vraća listu vina (admin → fallback na javnu rutu) */
  async listWines(): Promise<AdminWine[]> {
    const urls = [
      "/api/admin/wines",
      "/api/Wines",
      "/api/wines",
      "/api/wine",
    ];
    const raw = await tryGetMany<any>(urls);
    return raw.map(normalizeWine);
  },

  async listWineries() {
    const urls = ["/api/admin/wineries", "/api/Wineries", "/api/wineries"];
    const raw = await tryGetMany<any>(urls);
    return raw;
  },

  async listCategories() {
    const urls = ["/api/admin/categories", "/api/WineCategory", "/api/categories", "/api/winecategory"];
    const raw = await tryGetMany<any>(urls);
    return raw;
  },

  async listOrders() {
    const urls = ["/api/admin/orders", "/api/Orders", "/api/orders"];
    const raw = await tryGetMany<any>(urls);
    return raw;
  },

  /** CREATE / UPDATE / DELETE za vina */
  async createWine(payload: {
    name: string;
    price: number;
    categoryId: number;
    wineryId: number;
    year?: number;
  }) {
    const { data } = await api.post("/api/Wines", payload);
    return data;
  },

  async updateWine(id: number, payload: Partial<{ name: string; price: number; categoryId: number; wineryId: number; year: number }>) {
    const { data } = await api.put(`/api/Wines/${id}`, payload);
    return data;
  },

  async deleteWine(id: number) {
    await api.delete(`/api/Wines/${id}`);
  },
};
