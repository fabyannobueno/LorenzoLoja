import axios from "axios";

export const STORE_SLUG = import.meta.env.VITE_STORE_SLUG ?? "mclorenzo";

const BASE = import.meta.env.DEV
  ? "/api-proxy/api/v1/public"
  : (import.meta.env.VITE_API_URL ?? "https://api.mclorenzo.com") + "/api/v1/public";

const publicApi = axios.create({ baseURL: BASE });

export interface PublicProduct {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sale_price: number;
  promotional_price?: number;
  is_featured: boolean;
  category_id?: string;
  category?: { id: string; name: string };
}

export interface PublicCategory {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  sort_order: number;
}

export interface PublicBanner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
}

export interface PublicStore {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  phone?: string;
  email?: string;
  status: "open" | "closed" | "paused";
}

export async function fetchStore(): Promise<PublicStore | null> {
  try {
    const { data } = await publicApi.get<{ success: boolean; data: PublicStore }>(`/stores/${STORE_SLUG}`);
    return data.success ? data.data : null;
  } catch { return null; }
}

export async function fetchProducts(params?: {
  category_id?: string;
  limit?: number;
  page?: number;
}): Promise<{ products: PublicProduct[]; total: number; totalPages: number }> {
  try {
    const p = new URLSearchParams({
      limit: String(params?.limit ?? 20),
      page: String(params?.page ?? 1),
    });
    if (params?.category_id) p.set("category_id", params.category_id);
    const { data } = await publicApi.get<{
      success: boolean;
      data: PublicProduct[];
      pagination: any;
    }>(`/stores/${STORE_SLUG}/products?${p}`);
    return data.success
      ? { products: data.data, total: data.pagination?.total ?? 0, totalPages: data.pagination?.totalPages ?? 1 }
      : { products: [], total: 0, totalPages: 1 };
  } catch { return { products: [], total: 0, totalPages: 1 }; }
}

export async function fetchCategories(): Promise<PublicCategory[]> {
  try {
    const { data } = await publicApi.get<{ success: boolean; data: PublicCategory[] }>(`/stores/${STORE_SLUG}/categories`);
    return data.success ? data.data : [];
  } catch { return []; }
}

export async function fetchBanners(): Promise<PublicBanner[]> {
  try {
    const { data } = await publicApi.get<{ success: boolean; data: PublicBanner[] }>(`/stores/${STORE_SLUG}/banners`);
    return data.success ? data.data : [];
  } catch { return []; }
}

export async function validateCoupon(
  code: string,
  orderValue: number
): Promise<{ valid: boolean; discount?: number; message?: string }> {
  try {
    const { data } = await publicApi.post(`/stores/${STORE_SLUG}/coupons/validate`, {
      code,
      order_value: orderValue,
    });
    return data.success
      ? { valid: true, discount: data.data?.discount_value }
      : { valid: false, message: data.error?.message };
  } catch (err: any) {
    return { valid: false, message: err?.response?.data?.error?.message ?? "Cupom inválido" };
  }
}

export async function createOrder(payload: any) {
  const { data } = await publicApi.post(`/stores/${STORE_SLUG}/orders`, payload);
  return data;
}

export default publicApi;
