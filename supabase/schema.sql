-- ==============================================================================
-- SnapCraft Admin Dashboard & Product Management Schema
-- Database: PostgreSQL (Supabase)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Admin Profiles Table
-- Stores authorized administrators and their roles.
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  category_label TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'INR',
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  badge TEXT CHECK (badge IN ('Bestseller', 'Signature', 'Popular', 'Romantic', 'New', 'None') OR badge IS NULL),
  primary_image_url TEXT NOT NULL,
  additional_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  occasions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  lead_time TEXT DEFAULT 'Handcrafted to Order / 24 hrs',
  is_customizable BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  video_url TEXT,
  downloadable_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- 5. Product Media Table
CREATE TABLE IF NOT EXISTS public.product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  storage_path TEXT,
  file_type TEXT NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'video', 'document')),
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Admin Activity Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  target_type TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_published_at ON public.products(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);

-- 8. Row Level Security (RLS) Helper Function
-- Verifies whether current authenticated user has an active admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role IN ('super_admin', 'admin', 'editor')
  );
$$;

-- 9. Enable Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 10. Admin Profiles Policies
-- Admins can read admin profiles
CREATE POLICY "Admins can view admin profiles"
  ON public.admin_profiles
  FOR SELECT
  USING (public.is_admin() OR auth.uid() = id);

-- Super admins can manage admin profiles
CREATE POLICY "Super admins can manage admin profiles"
  ON public.admin_profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND role = 'super_admin' AND status = 'active'
    )
  );

-- 11. Categories Policies
-- Everyone can read categories
CREATE POLICY "Public read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Admins can create/edit/delete categories
CREATE POLICY "Admins manage categories"
  ON public.categories
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 12. Products Policies
-- Public can ONLY view published products
CREATE POLICY "Public read published products"
  ON public.products
  FOR SELECT
  USING (status = 'published');

-- Admins can view ALL products (draft, published, archived)
CREATE POLICY "Admins view all products"
  ON public.products
  FOR SELECT
  USING (public.is_admin());

-- Admins can insert products
CREATE POLICY "Admins insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update products
CREATE POLICY "Admins update products"
  ON public.products
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can delete products
CREATE POLICY "Admins delete products"
  ON public.products
  FOR DELETE
  USING (public.is_admin());

-- 13. Product Media Policies
-- Public read media for published products
CREATE POLICY "Public read product media"
  ON public.product_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_media.product_id AND p.status = 'published'
    )
  );

-- Admins manage all media
CREATE POLICY "Admins manage product media"
  ON public.product_media
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 14. Activity Logs Policies
CREATE POLICY "Admins view activity logs"
  ON public.admin_activity_logs
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins insert activity logs"
  ON public.admin_activity_logs
  FOR INSERT
  WITH CHECK (public.is_admin());

-- 15. Storage Bucket Configuration for Media
-- (Insert into storage.buckets if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'product-media'
CREATE POLICY "Public read product-media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-media');

CREATE POLICY "Admins upload to product-media bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-media' AND public.is_admin());

CREATE POLICY "Admins update product-media bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-media' AND public.is_admin());

CREATE POLICY "Admins delete from product-media bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-media' AND public.is_admin());

-- 16. Seed Default Categories
INSERT INTO public.categories (id, name, slug, description, display_order)
VALUES
  ('hampers', 'Gift Hampers', 'gift-hampers', 'Luxury handcrafted gift baskets and celebratory hampers', 1),
  ('bouquets', 'Flower Bouquets', 'flower-bouquets', 'Fresh hand-tied blooms, roses and botanical arrangements', 2),
  ('boxes', 'Curated Boxes', 'curated-boxes', 'Artisanal chocolate boxes and elegant keepsake gift sets', 3),
  ('keepsakes', 'Photo & Keepsakes', 'photo-keepsakes', 'Personalized photo frames, engraved keepsakes and cards', 4),
  ('curated', 'Curated Celebrations', 'curated-celebrations', 'Bespoke event hampers and bridal gift collections', 5)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description;
