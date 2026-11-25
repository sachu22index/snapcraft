# SnapCraft + Supabase backend setup

This project already included a Supabase client, admin authentication flow, product/category service and media uploader. I added the missing database schema and connected checkout orders, contact enquiries and newsletter subscriptions.

## 1. Create a Supabase project
1. Open https://supabase.com/dashboard and create a project.
2. In **Project Settings -> API**, copy the Project URL and `anon` / publishable key.
3. In the project root, create `.env.local` (same folder as `package.json`):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
VITE_SITE_URL=http://localhost:3000
```

Never put a `service_role` key in a `VITE_` variable or frontend code.

## 2. Create database tables and security rules
1. Open Supabase **SQL Editor -> New query**.
2. Copy all of `supabase/schema.sql` into the editor.
3. Click **Run**.

The SQL creates the tables used by this project:
- `admin_profiles`
- `categories`
- `products`
- `product_media`
- `orders`
- `contact_enquiries`
- `newsletter_subscribers`

It also creates the public `product-media` Storage bucket and Row Level Security policies. Guests can create orders/enquiries and subscribe, but only authenticated active admins can read/manage private records.

## 3. Create the first admin
1. Run the site: `npm install` then `npm run dev`.
2. Open `/admin/setup` and create your first admin account.
3. Sign in at `/admin/login`.

The SQL trigger promotes only the first newly registered auth user to `super_admin`. **Important:** after creating the first admin, go to Supabase **Authentication -> Providers -> Email** and disable public sign-ups (or otherwise restrict sign-ups). Do not leave open registration enabled for a production admin dashboard.

If email confirmation is enabled, confirm the admin email before signing in. Check the `admin_profiles` table if setup/login does not complete.

## 4. Test the backend
- Open the admin dashboard and add a product. It should appear in `products`.
- Upload a product image. It should appear in Storage bucket `product-media`.
- Place a test order. It should appear in `orders` with `payment_status = pending`.
- Submit Contact and Newsletter forms. Records should appear in `contact_enquiries` and `newsletter_subscribers`.

## Notes
- Checkout currently stores the selected payment method and creates an order with `payment_status = pending`. It does **not** collect money. To accept online UPI/card payments, integrate a payment gateway such as Razorpay and verify payment server-side before marking an order paid.
- Admin product and category operations use the existing service layer and Supabase client.
- Never expose a Supabase `service_role` key in browser code. The anon/publishable key is intended for the frontend when RLS is configured correctly.
- Existing local IndexedDB fallback remains for product browsing when Supabase is not configured. For a live store, configure Supabase and verify the test steps above.
