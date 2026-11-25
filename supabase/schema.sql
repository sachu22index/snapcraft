
-- SnapCraft Supabase backend schema
-- Run this whole file once in Supabase Dashboard -> SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  avatar_url text,
  role text not null default 'admin' check (role in ('super_admin','admin','editor')),
  status text not null default 'active' check (status in ('active','inactive','suspended')),
  created_at timestamptz not null default now()
);

-- Bootstrap: first authenticated user becomes the first super admin.
-- This trigger runs only when admin_profiles is empty.
create or replace function public.bootstrap_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.admin_profiles) then
    insert into public.admin_profiles(id,email,display_name,role,status)
    values (new.id, coalesce(new.email,''), split_part(coalesce(new.email,''),'@',1), 'super_admin','active')
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_bootstrap_admin on auth.users;
create trigger on_auth_user_created_bootstrap_admin
after insert on auth.users for each row execute procedure public.bootstrap_first_admin();

create or replace function public.is_active_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and status = 'active' and role in ('super_admin','admin','editor')
  );
$$;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  tagline text,
  short_description text,
  full_description text,
  sku text unique,
  category_id text references public.categories(id) on update cascade on delete set null,
  category_label text,
  price numeric(12,2) not null default 0 check (price >= 0),
  sale_price numeric(12,2),
  currency text not null default 'INR',
  rating numeric(3,2) not null default 4.9,
  reviews_count integer not null default 0,
  badge text,
  primary_image_url text,
  additional_images jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  occasions jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  lead_time text,
  is_customizable boolean not null default false,
  is_available boolean not null default true,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  seo_title text,
  seo_description text,
  video_url text,
  downloadable_assets jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category_id);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id) on delete cascade,
  file_url text not null,
  storage_path text,
  file_type text not null check (file_type in ('image','video','document')),
  file_size bigint,
  mime_type text,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  items jsonb not null,
  subtotal numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  pincode text not null,
  delivery_date date,
  delivery_slot text,
  gift_note text,
  payment_method text,
  payment_status text not null default 'pending',
  order_status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  occasion text not null,
  service text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.orders enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profiles: a logged-in admin can read their own profile; admins can manage admin profiles.
drop policy if exists "admin reads own profile" on public.admin_profiles;
create policy "admin reads own profile" on public.admin_profiles for select to authenticated using (id = auth.uid() or public.is_active_admin());
drop policy if exists "active admins manage profiles" on public.admin_profiles;
create policy "active admins manage profiles" on public.admin_profiles for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

-- Public can see categories and published products. Admins manage catalog.
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select to anon, authenticated using (true);
drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products for select to anon, authenticated using (status = 'published' or public.is_active_admin());
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "public read product media" on public.product_media;
create policy "public read product media" on public.product_media for select to anon, authenticated using (true);
drop policy if exists "admins manage product media" on public.product_media;
create policy "admins manage product media" on public.product_media for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

-- Guest checkout and guest enquiries are allowed. Only admins can read/manage them.
drop policy if exists "guest create orders" on public.orders;
create policy "guest create orders" on public.orders for insert to anon, authenticated with check (true);
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders for select to authenticated using (public.is_active_admin());
drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "guest create enquiries" on public.contact_enquiries;
create policy "guest create enquiries" on public.contact_enquiries for insert to anon, authenticated with check (true);
drop policy if exists "admins manage enquiries" on public.contact_enquiries;
create policy "admins manage enquiries" on public.contact_enquiries for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "guest subscribe newsletter" on public.newsletter_subscribers;
create policy "guest subscribe newsletter" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_active_admin());

-- Public product images are served from this bucket. Upload/delete is admin-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media','product-media',true,52428800,array['image/*','video/mp4','video/webm','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 52428800;
drop policy if exists "public view product media bucket" on storage.objects;
create policy "public view product media bucket" on storage.objects for select to anon, authenticated using (bucket_id = 'product-media');
drop policy if exists "admins upload product media bucket" on storage.objects;
create policy "admins upload product media bucket" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and public.is_active_admin());
drop policy if exists "admins update product media bucket" on storage.objects;
create policy "admins update product media bucket" on storage.objects for update to authenticated using (bucket_id = 'product-media' and public.is_active_admin()) with check (bucket_id = 'product-media' and public.is_active_admin());
drop policy if exists "admins delete product media bucket" on storage.objects;
create policy "admins delete product media bucket" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and public.is_active_admin());

-- Seed categories used by the existing SnapCraft product service.
insert into public.categories(id,name,slug,description,display_order) values
('hampers','Gift Hampers','gift-hampers','Signature handcrafted baskets & celebratory gift hampers',1),
('bouquets','Flower Bouquets','flower-bouquets','Fresh Dutch roses, eucalyptus sprigs & hand-tied floral wonders',2),
('boxes','Curated Boxes','curated-boxes','Belgian chocolate boxes, strawberries & keepsake wooden cases',3),
('keepsakes','Photo & Keepsakes','photo-keepsakes','Custom photo frames, engraved memorabilia & wax-sealed cards',4),
('curated','Curated Celebrations','curated-celebrations','Bespoke bridal, baptism & corporate celebratory bundles',5)
on conflict (id) do nothing;
