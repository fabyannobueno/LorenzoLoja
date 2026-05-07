import axios from "axios";

export const STORE_SLUG = import.meta.env.VITE_STORE_SLUG ?? "mclorenzo";

const API_ORIGIN = import.meta.env.DEV
  ? "/api-proxy"
  : (import.meta.env.VITE_API_URL ?? "https://api.mclorenzo.com");

const BASE = API_ORIGIN + "/api/v1/public";

const publicApi = axios.create({ baseURL: BASE });

const privateApi = axios.create({ baseURL: API_ORIGIN + "/api/v1" });

export async function syncCustomer(params: {
  idToken: string;
  firebase_uid: string;
  name: string;
  email: string;
  phone?: string | null;
  photo_url?: string | null;
  provider?: string;
}): Promise<void> {
  const { idToken, ...body } = params;
  await privateApi.post("/customers", body, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

export interface PublicProduct {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  images?: string[];
  sale_price: number;
  promotional_price?: number;
  is_featured: boolean;
  category_id?: string;
  category?: { id: string; name: string };
  stock?: number;
  sku?: string;
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
  if (!data.success) return { products: [], total: 0, totalPages: 1 };
  return {
    products: data.data,
    total: data.pagination?.total ?? 0,
    totalPages: data.pagination?.totalPages ?? 1,
  };
}

export async function fetchProduct(id: string): Promise<PublicProduct> {
  const { data } = await publicApi.get<{ success: boolean; data: PublicProduct }>(
    `/stores/${STORE_SLUG}/products/${id}`
  );
  if (!data.success) throw new Error("Produto não encontrado");
  return data.data;
}

export async function fetchCategories(): Promise<PublicCategory[]> {
  const { data } = await publicApi.get<{ success: boolean; data: PublicCategory[] }>(
    `/stores/${STORE_SLUG}/categories`
  );
  return data.success ? data.data : [];
}

export async function fetchBanners(): Promise<PublicBanner[]> {
  const { data } = await publicApi.get<{ success: boolean; data: PublicBanner[] }>(
    `/stores/${STORE_SLUG}/banners`
  );
  return data.success ? data.data : [];
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
