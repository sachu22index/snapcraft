import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { AdminProduct, Category, ProductMediaItem, ProductStatus } from "@/types/admin";
import { PRODUCTS as DEFAULT_CATALOG_PRODUCTS, Product, logoImg } from "@/data/products";
import {
  idbGetAll,
  idbGet,
  idbPut,
  idbPutAll,
  idbDelete,
  broadcastSyncEvent,
  listenToSyncEvents,
} from "./storage-db";

const LOCAL_PRODUCTS_KEY = "snapcraft_persisted_products";
const LOCAL_CATEGORIES_KEY = "snapcraft_persisted_categories";
const LOCAL_MEDIA_KEY = "snapcraft_persisted_media";

export const DEFAULT_PRODUCT_FALLBACK_IMAGE = logoImg;

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "hampers",
    name: "Gift Hampers",
    slug: "gift-hampers",
    description: "Signature handcrafted baskets & celebratory gift hampers",
    displayOrder: 1,
  },
  {
    id: "bouquets",
    name: "Flower Bouquets",
    slug: "flower-bouquets",
    description: "Fresh Dutch roses, eucalyptus sprigs & hand-tied floral wonders",
    displayOrder: 2,
  },
  {
    id: "boxes",
    name: "Curated Boxes",
    slug: "curated-boxes",
    description: "Belgian chocolate boxes, strawberries & keepsake wooden cases",
    displayOrder: 3,
  },
  {
    id: "keepsakes",
    name: "Photo & Keepsakes",
    slug: "photo-keepsakes",
    description: "Custom photo frames, engraved memorabilia & wax-sealed cards",
    displayOrder: 4,
  },
  {
    id: "curated",
    name: "Curated Celebrations",
    slug: "curated-celebrations",
    description: "Bespoke bridal, baptism & corporate celebratory bundles",
    displayOrder: 5,
  },
];

// Seed initial products from the existing catalog
function convertCatalogToAdminProducts(): AdminProduct[] {
  return DEFAULT_CATALOG_PRODUCTS.map((p, idx) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline || "",
    shortDescription: p.description,
    fullDescription: p.longDescription || p.description,
    sku: `SC-${p.category.toUpperCase().slice(0, 3)}-${100 + idx}`,
    categoryId: p.category,
    categoryLabel: p.categoryLabel,
    price: p.price,
    salePrice: p.originalPrice,
    currency: "INR",
    rating: p.rating || 4.9,
    reviewsCount: p.reviewsCount || 10,
    badge: p.badge || null,
    primaryImageUrl: p.image,
    additionalImages: p.additionalImages || [p.image],
    inclusions: p.inclusions || [],
    specifications: [
      { key: "Lead Time", value: p.leadTime || "Handcrafted to Order / 24 hrs" },
      {
        key: "Customization",
        value: p.customizable ? "Available upon request" : "Standard curation",
      },
      { key: "Packaging", value: "Eco-friendly luxury gift boxing with satin ribbon" },
      { key: "Delivery", value: "Pan-India delivery with protective insulated casing" },
    ],
    occasions: p.occasion || [],
    tags: [p.category, ...(p.occasion || [])],
    leadTime: p.leadTime || "Handcrafted to Order / 24 hrs",
    isCustomizable: p.customizable,
    isAvailable: p.isAvailable,
    status: "published" as ProductStatus,
    seoTitle: `${p.name} — Luxury Gift by SnapCraft`,
    seoDescription: p.description,
    downloadableAssets: [
      {
        name: "SnapCraft Care & Storage Guide.pdf",
        url: "#download-guide",
        type: "pdf",
        size: "1.2 MB",
      },
    ],
    createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
    publishedAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
  }));
}

// -----------------------------------------------------------------------------
// Reactive Event Subscription & Cross-Tab Sync
// -----------------------------------------------------------------------------
type ProductChangeListener = () => void;
const productListeners: Set<ProductChangeListener> = new Set();

export function subscribeToProducts(listener: ProductChangeListener): () => void {
  productListeners.add(listener);
  return () => {
    productListeners.delete(listener);
  };
}

function notifyProductChange() {
  productListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Error in product change listener", e);
    }
  });

  broadcastSyncEvent("products");
}

// Listen to sync events across tabs / windows
if (typeof window !== "undefined") {
  listenToSyncEvents((eventType) => {
    if (eventType === "products" || eventType === "snapcraft:products-updated") {
      // Invalidate memory cache so next read fetches fresh data
      cachedProducts = null;
      productListeners.forEach((listener) => {
        try {
          listener();
        } catch (e) {
          console.error("Error in cross-tab sync listener", e);
        }
      });
    } else if (eventType === "categories" || eventType === "snapcraft:categories-updated") {
      cachedCategories = null;
    }
  });
}

// -----------------------------------------------------------------------------
// In-Memory Caching & Storage Engine (IndexedDB + Safe LocalStorage)
// -----------------------------------------------------------------------------
let cachedProducts: AdminProduct[] | null = null;
let cachedCategories: Category[] | null = null;
let isHydrating = false;

// Safe localStorage write that strips massive binary strings to avoid 5MB quota errors
function safeSaveLocalStorage(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(data);
    // If payload is under 2MB, store in localStorage as well
    if (serialized.length < 2 * 1024 * 1024) {
      localStorage.setItem(key, serialized);
    }
  } catch (err) {
    console.warn(`LocalStorage quota reached for key "${key}". Data safely preserved in IndexedDB.`);
  }
}

async function getStoredProducts(): Promise<AdminProduct[]> {
  if (typeof window === "undefined") return convertCatalogToAdminProducts();

  if (cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }

  // 1. Try reading from IndexedDB
  try {
    const idbItems = await idbGetAll<AdminProduct>("products");
    if (idbItems && idbItems.length > 0) {
      cachedProducts = idbItems;
      return idbItems;
    }
  } catch (err) {
    console.warn("Failed to load products from IndexedDB:", err);
  }

  // 2. Try reading from localStorage
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedProducts = parsed;
        // Migrate to IndexedDB in background
        idbPutAll("products", parsed).catch(() => {});
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed reading localStorage products:", err);
  }

  // 3. Seed initial products from catalog
  const initial = convertCatalogToAdminProducts();
  cachedProducts = initial;
  await saveStoredProducts(initial);
  return initial;
}

async function saveStoredProducts(products: AdminProduct[]) {
  cachedProducts = [...products];
  if (typeof window === "undefined") return;

  // Persist into IndexedDB (supports high-res images and large binary data)
  await idbPutAll("products", products);

  // Safely persist to localStorage for instant SSR hydration
  safeSaveLocalStorage(LOCAL_PRODUCTS_KEY, products);

  notifyProductChange();
}

async function getStoredCategories(): Promise<Category[]> {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;

  if (cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }

  try {
    const idbCats = await idbGetAll<Category>("categories");
    if (idbCats && idbCats.length > 0) {
      cachedCategories = idbCats;
      return idbCats;
    }
  } catch {
    // Ignore
  }

  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCategories = parsed;
        idbPutAll("categories", parsed).catch(() => {});
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  cachedCategories = DEFAULT_CATEGORIES;
  await saveStoredCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

async function saveStoredCategories(categories: Category[]) {
  cachedCategories = [...categories];
  if (typeof window === "undefined") return;

  await idbPutAll("categories", categories);
  safeSaveLocalStorage(LOCAL_CATEGORIES_KEY, categories);
  broadcastSyncEvent("categories");
  notifyProductChange();
}

// -----------------------------------------------------------------------------
// Database Mapping Helpers
// -----------------------------------------------------------------------------

function mapDbToAdminProduct(row: Record<string, unknown>): AdminProduct {
  return {
    id: String(row["id"]),
    name: String(row["name"]),
    slug: String(row["slug"]),
    tagline: row["tagline"] ? String(row["tagline"]) : "",
    shortDescription: String(row["short_description"] || ""),
    fullDescription: String(row["full_description"] || ""),
    sku: String(row["sku"] || ""),
    categoryId: String(row["category_id"] || "hampers"),
    categoryLabel: String(row["category_label"] || "Gift Hampers"),
    price: Number(row["price"]),
    salePrice: row["sale_price"] ? Number(row["sale_price"]) : undefined,
    currency: String(row["currency"] || "INR"),
    rating: Number(row["rating"]) || 4.9,
    reviewsCount: Number(row["reviews_count"]) || 0,
    badge: (row["badge"] as AdminProduct["badge"]) || null,
    primaryImageUrl: String(row["primary_image_url"] || ""),
    additionalImages: Array.isArray(row["additional_images"])
      ? (row["additional_images"] as string[])
      : [],
    inclusions: Array.isArray(row["inclusions"]) ? (row["inclusions"] as string[]) : [],
    specifications: Array.isArray(row["specifications"])
      ? (row["specifications"] as AdminProduct["specifications"])
      : [],
    occasions: Array.isArray(row["occasions"]) ? (row["occasions"] as string[]) : [],
    tags: Array.isArray(row["tags"]) ? (row["tags"] as string[]) : [],
    leadTime: String(row["lead_time"] || "Handcrafted to Order / 24 hrs"),
    isCustomizable: Boolean(row["is_customizable"]),
    isAvailable: Boolean(row["is_available"]),
    status: (row["status"] as ProductStatus) || "draft",
    seoTitle: row["seo_title"] ? String(row["seo_title"]) : undefined,
    seoDescription: row["seo_description"] ? String(row["seo_description"]) : undefined,
    videoUrl: row["video_url"] ? String(row["video_url"]) : undefined,
    downloadableAssets: Array.isArray(row["downloadable_assets"])
      ? (row["downloadable_assets"] as AdminProduct["downloadableAssets"])
      : [],
    createdAt: String(row["created_at"] || new Date().toISOString()),
    updatedAt: String(row["updated_at"] || new Date().toISOString()),
    publishedAt: row["published_at"] ? String(row["published_at"]) : null,
  };
}

function mapAdminProductToDb(p: AdminProduct) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    short_description: p.shortDescription,
    full_description: p.fullDescription,
    sku: p.sku,
    category_id: p.categoryId,
    category_label: p.categoryLabel,
    price: p.price,
    sale_price: p.salePrice || null,
    currency: p.currency,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    badge: p.badge && p.badge !== "None" ? p.badge : null,
    primary_image_url: p.primaryImageUrl,
    additional_images: p.additionalImages,
    inclusions: p.inclusions,
    specifications: p.specifications,
    occasions: p.occasions,
    tags: p.tags,
    lead_time: p.leadTime,
    is_customizable: p.isCustomizable,
    is_available: p.isAvailable,
    status: p.status,
    seo_title: p.seoTitle || null,
    seo_description: p.seoDescription || null,
    video_url: p.videoUrl || null,
    downloadable_assets: p.downloadableAssets,
    created_at: p.createdAt,
    updated_at: new Date().toISOString(),
    published_at: p.status === "published" ? p.publishedAt || new Date().toISOString() : null,
  };
}

// Convert AdminProduct to public Product format expected by existing website components
export function toPublicProduct(p: AdminProduct): Product {
  const primaryImg = p.primaryImageUrl || DEFAULT_PRODUCT_FALLBACK_IMAGE;
  const gallery =
    p.additionalImages && p.additionalImages.length > 0
      ? [primaryImg, ...p.additionalImages.filter((img) => img !== primaryImg)]
      : [primaryImg];

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline || "",
    description: p.shortDescription,
    longDescription: p.fullDescription || p.shortDescription,
    price: p.price,
    originalPrice: p.salePrice,
    rating: p.rating || 4.9,
    reviewsCount: p.reviewsCount || 0,
    category: (p.categoryId as Product["category"]) || "hampers",
    categoryLabel: p.categoryLabel,
    occasion: p.occasions || [],
    image: primaryImg,
    additionalImages: gallery,
    badge: p.badge && p.badge !== "None" ? (p.badge as Product["badge"]) : undefined,
    inclusions: p.inclusions || [],
    customizable: p.isCustomizable,
    isAvailable: p.isAvailable,
    leadTime: p.leadTime || "Handcrafted to Order / 24 hrs",
  };
}

// -----------------------------------------------------------------------------
// Public & Admin Product Queries
// -----------------------------------------------------------------------------

export async function getProducts(options?: {
  status?: ProductStatus | "all" | undefined;
  categoryId?: string | undefined;
  search?: string | undefined;
  sortBy?: ("newest" | "oldest" | "price-asc" | "price-desc" | "name" | "rating") | undefined;
}): Promise<AdminProduct[]> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    try {
      let query = supabase.from("products").select("*");

      if (options?.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }
      if (options?.categoryId && options.categoryId !== "all") {
        query = query.eq("category_id", options.categoryId);
      }
      if (options?.search?.trim()) {
        const q = `%${options.search.trim()}%`;
        query = query.or(`name.ilike.${q},sku.ilike.${q},short_description.ilike.${q}`);
      }

      if (options?.sortBy === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (options?.sortBy === "price-desc") {
        query = query.order("price", { ascending: false });
      } else if (options?.sortBy === "name") {
        query = query.order("name", { ascending: true });
      } else if (options?.sortBy === "rating") {
        query = query.order("rating", { ascending: false });
      } else if (options?.sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(mapDbToAdminProduct);
      }
      console.warn("Supabase query returned error or empty, falling back to local store:", error);
    } catch (err) {
      console.warn("Supabase products fetch failed:", err);
    }
  }

  // Persistent local store
  let items = await getStoredProducts();

  if (options?.status && options.status !== "all") {
    items = items.filter((p) => p.status === options.status);
  }
  if (options?.categoryId && options.categoryId !== "all") {
    items = items.filter((p) => p.categoryId === options.categoryId);
  }
  if (options?.search?.trim()) {
    const q = options.search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (options?.sortBy === "price-asc") {
    items.sort((a, b) => a.price - b.price);
  } else if (options?.sortBy === "price-desc") {
    items.sort((a, b) => b.price - a.price);
  } else if (options?.sortBy === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (options?.sortBy === "rating") {
    items.sort((a, b) => b.rating - a.rating);
  } else if (options?.sortBy === "oldest") {
    items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return items;
}

/**
 * Fetch ONLY published products for the public consumer website.
 * Draft and archived products will NEVER be returned here.
 */
export async function getPublishedProducts(): Promise<Product[]> {
  const adminProducts = await getProducts({ status: "published" });
  return adminProducts.map(toPublicProduct);
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (!error && data) {
        return mapDbToAdminProduct(data);
      }
    } catch {
      // Ignore
    }
  }

  const items = await getStoredProducts();
  return items.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
      if (!error && data) {
        return mapDbToAdminProduct(data);
      }
    } catch {
      // Ignore
    }
  }

  const items = await getStoredProducts();
  return items.find((p) => p.slug === slug) || null;
}

// -----------------------------------------------------------------------------
// Mutation Operations (Create, Update, Status, Delete)
// -----------------------------------------------------------------------------

export function generateSlug(name: string = ""): string {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSku(category: string, name: string): string {
  const catCode = category ? category.substring(0, 3).toUpperCase() : "GEN";
  const nameCode = name
    .replace(/[^A-Za-z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `SC-${catCode}-${nameCode || "PRD"}-${randomNum}`;
}

export async function createProduct(
  input: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
): Promise<AdminProduct> {
  const now = new Date().toISOString();
  const id = input.slug ? generateSlug(input.slug) : generateSlug(input.name) || `prod-${Date.now()}`;

  const newProduct: AdminProduct = {
    ...input,
    id,
    slug: input.slug ? generateSlug(input.slug) : generateSlug(input.name),
    sku: input.sku?.trim() || generateSku(input.categoryId, input.name),
    createdAt: now,
    updatedAt: now,
    publishedAt: input.status === "published" ? now : null,
  };

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    const dbPayload = mapAdminProductToDb(newProduct);
    const { data, error } = await supabase.from("products").insert(dbPayload).select().single();
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    notifyProductChange();
    return mapDbToAdminProduct(data);
  }

  // Local persistent save
  const items = await getStoredProducts();

  // Handle unique slug / sku collision
  const existingIndex = items.findIndex((p) => p.slug === newProduct.slug || p.id === newProduct.id);
  if (existingIndex !== -1) {
    newProduct.slug = `${newProduct.slug}-${Date.now().toString().slice(-4)}`;
    newProduct.id = newProduct.slug;
  }

  const existingSku = items.find((p) => p.sku === newProduct.sku);
  if (existingSku) {
    newProduct.sku = `${newProduct.sku}-${Date.now().toString().slice(-3)}`;
  }

  items.unshift(newProduct);
  await saveStoredProducts(items);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<AdminProduct>,
): Promise<AdminProduct> {
  const existing = await getProductById(id);
  if (!existing) {
    throw new Error(`Product with ID "${id}" was not found.`);
  }

  const now = new Date().toISOString();
  const updatedProduct: AdminProduct = {
    ...existing,
    ...updates,
    id,
    updatedAt: now,
    publishedAt:
      updates.status === "published"
        ? existing.publishedAt || now
        : updates.status
          ? null
          : existing.publishedAt,
  };

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    const dbPayload = mapAdminProductToDb(updatedProduct);
    const { data, error } = await supabase
      .from("products")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
    notifyProductChange();
    return mapDbToAdminProduct(data);
  }

  // Local store update
  const items = await getStoredProducts();
  const index = items.findIndex((p) => p.id === id);
  if (index !== -1) {
    items[index] = updatedProduct;
    await saveStoredProducts(items);
  } else {
    items.unshift(updatedProduct);
    await saveStoredProducts(items);
  }
  return updatedProduct;
}

export async function setProductStatus(id: string, status: ProductStatus): Promise<AdminProduct> {
  return updateProduct(id, { status });
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
    notifyProductChange();
    return;
  }

  const items = await getStoredProducts();
  const filtered = items.filter((p) => p.id !== id);
  await saveStoredProducts(filtered);
}

// -----------------------------------------------------------------------------
// Categories Management
// -----------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((c: Record<string, unknown>) => ({
          id: String(c["id"]),
          name: String(c["name"]),
          slug: String(c["slug"]),
          description: c["description"] ? String(c["description"]) : undefined,
          displayOrder: Number(c["display_order"]) || 0,
          createdAt: c["created_at"] ? String(c["created_at"]) : undefined,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getStoredCategories();
}

export async function createCategory(cat: Omit<Category, "displayOrder">): Promise<Category> {
  const categories = await getCategories();
  const catName = cat.name || (cat as any).label || cat.id || "Category";
  const newCat: Category = {
    ...cat,
    name: catName,
    id: cat.id || generateSlug(catName),
    slug: cat.slug || generateSlug(catName),
    displayOrder: categories.length + 1,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        id: newCat.id,
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        display_order: newCat.displayOrder,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Category creation failed: ${error.message}`);
    }
    notifyProductChange();
    return newCat;
  }

  categories.push(newCat);
  await saveStoredCategories(categories);
  return newCat;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
    notifyProductChange();
    return;
  }

  const categories = await getStoredCategories();
  const filtered = categories.filter((c) => c.id !== id);
  await saveStoredCategories(filtered);
}

// -----------------------------------------------------------------------------
// Asset & Media Uploads
// -----------------------------------------------------------------------------

export interface UploadResult {
  url: string;
  storagePath: string;
  fileName: string;
  fileType: "image" | "video" | "document";
  size: number;
}

export async function uploadProductMediaFile(
  file: File,
  options?: {
    productId?: string | undefined;
    folder?: string | undefined;
    onProgress?: ((percent: number) => void) | undefined;
  },
): Promise<UploadResult> {
  // Validate file size: images <= 20MB, videos <= 50MB, documents <= 25MB
  const isVideo = file.type.startsWith("video/");
  const isDoc = file.type === "application/pdf" || file.name.endsWith(".pdf");
  const isImage = file.type.startsWith("image/");

  if (!isImage && !isVideo && !isDoc) {
    throw new Error(
      `Unsupported file type "${file.type}". Please upload an image (PNG, JPG, WEBP), demonstration video (MP4, WEBM), or PDF document.`,
    );
  }

  const maxSize = isVideo ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds allowed limit of ${
        isVideo ? "50 MB" : "20 MB"
      }.`,
    );
  }

  const fileType: "image" | "video" | "document" = isVideo ? "video" : isDoc ? "document" : "image";
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const timestamp = Date.now();
  const folder = options?.folder || (isVideo ? "videos" : isDoc ? "documents" : "products");
  const storagePath = `${folder}/${timestamp}_${sanitizedName}`;

  options?.onProgress?.(25);

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.storage
        .from("product-media")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error(`Storage upload error: ${error.message}`);
      }

      options?.onProgress?.(80);

      const { data: urlData } = supabase.storage.from("product-media").getPublicUrl(data.path);
      options?.onProgress?.(100);

      // Save record in product_media if product is specified
      if (options?.productId) {
        await supabase.from("product_media").insert({
          product_id: options.productId,
          file_url: urlData.publicUrl,
          storage_path: data.path,
          file_type: fileType,
          file_size: file.size,
          mime_type: file.type,
          alt_text: file.name,
        });
      }

      return {
        url: urlData.publicUrl,
        storagePath: data.path,
        fileName: file.name,
        fileType,
        size: file.size,
      };
    } catch (err: unknown) {
      console.warn("Supabase storage upload failed, saving to persistent IndexedDB storage:", err);
    }
  }

  // Persistent IndexedDB File Upload
  options?.onProgress?.(50);

  const readFileAsDataUrl = async (): Promise<string> => {
    if (typeof FileReader !== "undefined") {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file from browser device."));
        reader.readAsDataURL(file);
      });
    } else if (typeof file.arrayBuffer === "function") {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return `data:${file.type};base64,${base64}`;
    } else {
      throw new Error("No compatible file reading API available in current environment");
    }
  };

  try {
    const dataUrl = await readFileAsDataUrl();
    options?.onProgress?.(85);
    const mediaId = `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const mediaItem: ProductMediaItem = {
      id: mediaId,
      productId: options?.productId,
      fileUrl: dataUrl,
      storagePath,
      fileType,
      altText: file.name,
      displayOrder: 0,
      isPrimary: false,
      size: file.size,
      mimeType: file.type,
    };

    try {
      await idbPut("media", mediaItem);
      broadcastSyncEvent("media");
    } catch (err) {
      console.error("IndexedDB media storage error:", err);
    }

    options?.onProgress?.(100);
    return {
      url: dataUrl,
      storagePath,
      fileName: file.name,
      fileType,
      size: file.size,
    };
  } catch (err) {
    throw new Error(`Failed to read file: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getAllMedia(): Promise<ProductMediaItem[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("product_media")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((m: Record<string, unknown>) => ({
          id: String(m["id"]),
          productId: m["product_id"] ? String(m["product_id"]) : undefined,
          fileUrl: String(m["file_url"]),
          storagePath: m["storage_path"] ? String(m["storage_path"]) : undefined,
          fileType: (m["file_type"] as ProductMediaItem["fileType"]) || "image",
          altText: m["alt_text"] ? String(m["alt_text"]) : undefined,
          displayOrder: Number(m["display_order"]) || 0,
          isPrimary: Boolean(m["is_primary"]),
          size: m["file_size"] ? Number(m["file_size"]) : undefined,
          mimeType: m["mime_type"] ? String(m["mime_type"]) : undefined,
        }));
      }
    } catch {
      // fallback
    }
  }

  // Load from IndexedDB
  try {
    const idbMedia = await idbGetAll<ProductMediaItem>("media");
    if (idbMedia && idbMedia.length > 0) {
      return idbMedia.reverse();
    }
  } catch {
    // Ignore
  }

  return [];
}
