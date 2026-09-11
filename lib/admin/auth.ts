import { getAdminCreds } from "@/lib/adminAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not set — add it to frontend/.env.local");
}

class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function adminRequest<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown
): Promise<T> {
  const creds = getAdminCreds();
  if (!creds) throw new AdminApiError(401, "Not logged in.");

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Id": creds.id,
      "X-Admin-Secret": creds.secret,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new AdminApiError(res.status, detail || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function verifyAdminCreds(id: string, secret: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/admin/ping`, {
    headers: { "X-Admin-Id": id, "X-Admin-Secret": secret },
  });
  return res.ok;
}

export async function uploadSymptomSeed(entries: unknown[]): Promise<{ created: number }> {
  return adminRequest("POST", "/admin/seed/symptoms", entries);
}

export async function createCategory(payload: {
  name: string;
  description?: string;
}): Promise<{ id: string }> {
  return adminRequest("POST", "/admin/categories", payload);
}

export async function createProduct(payload: {
  category_id: string;
  name: string;
  model_number: string;
  specs: Record<string, unknown>;
  use_case_tags?: string;
}): Promise<{ id: string }> {
  return adminRequest("POST", "/admin/products", payload);
}

export async function createBlogPost(payload: {
  product_id: string;
  content: string;
  do_you_know?: string;
  buy_links?: string;
}): Promise<{ id: string }> {
  return adminRequest("POST", "/admin/blog", payload);
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  model_number: string;
  specs: Record<string, unknown>;
  use_case_tags: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/v1/categories`);
  if (!res.ok) throw new Error("Failed to load categories.");
  return res.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/v1/products`);
  if (!res.ok) throw new Error("Failed to load products.");
  return res.json();
}