export type AdminRole = "super_admin" | "admin" | "editor";
export type AdminStatus = "active" | "inactive" | "suspended";

export interface AdminUser {
  id: string;
  email: string;
  displayName?: string | undefined;
  avatarUrl?: string | undefined;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductDownloadable {
  name: string;
  url: string;
  type: string;
  size?: string | undefined;
}

export interface ProductMediaItem {
  id: string;
  productId?: string | undefined;
  fileUrl: string;
  storagePath?: string | undefined;
  fileType: "image" | "video" | "document";
  altText?: string | undefined;
  displayOrder: number;
  isPrimary: boolean;
  size?: number | undefined;
  mimeType?: string | undefined;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | undefined;
  displayOrder: number;
  createdAt?: string | undefined;
  productCount?: number | undefined;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  sku: string;
  categoryId: string;
  categoryLabel: string;
  price: number;
  salePrice?: number | undefined;
  currency: string;
  rating: number;
  reviewsCount: number;
  badge?: "Bestseller" | "Signature" | "Popular" | "Romantic" | "New" | "None" | null | undefined;
  primaryImageUrl: string;
  additionalImages: string[];
  inclusions: string[];
  specifications: ProductSpecification[];
  occasions: string[];
  tags: string[];
  leadTime: string;
  isCustomizable: boolean;
  isAvailable: boolean;
  status: ProductStatus;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
  videoUrl?: string | undefined;
  downloadableAssets: ProductDownloadable[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null | undefined;
}

export interface AdminActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  targetId?: string | undefined;
  targetType?: string | undefined;
  details?: Record<string, unknown> | undefined;
  createdAt: string;
}
