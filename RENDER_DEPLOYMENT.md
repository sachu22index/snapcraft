# Render Deployment Guide — SnapCraft (React + TanStack Start + Supabase)

This guide covers deploying the **SnapCraft** application to **Render** using the existing **React 19 + TanStack Start + Vite + Nitro + Supabase** architecture.

> **Why a Render Node.js Web Service instead of a Static Site?**
> This project uses `@tanstack/react-start` with Nitro (`src/server.ts`, `src/start.ts`, and SSR `head()` metadata in `src/routes/`). Setting `NITRO_PRESET=node_server` compiles a standalone Node.js server (`.output/server/index.mjs`) plus static assets (`.output/public/`), which preserves SSR metadata, handles all nested routes natively without 404s, and keeps Lovable compatibility intact.

---

## 1. Installing Dependencies Locally

```bash
npm ci
```

*(Requires Node.js `>=20.0.0`; tested with Node 24.)*

## 2. Running the Application Locally

Ensure `.env.local` exists in the project root (copy `.env.example` if needed):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
VITE_SITE_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

## 3. Creating a Production Build Locally

To build the exact Node.js production bundle used on Render:

```bash
# PowerShell
$env:NITRO_PRESET="node_server"
npm run build

# macOS / Linux / Git Bash
NITRO_PRESET=node_server npm run build
```

Run the production server locally:

```bash
npm run start
```

## 4. Pushing the Project to GitHub

Verify sensitive files (`.env.local`, `.env`) are **not** staged:

```bash
git status
```

Stage, commit, and push your changes:

```bash
git add .
git commit -m "chore: configure Render deployment and production environment"
git push origin main
```

## 5. Creating a Render Web Service (Dashboard)

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service** (or use **New +** -> **Blueprint** to load `render.yaml` automatically).
3. Connect your GitHub repository (`sachu22index/snapcraft`).
4. Enter the exact settings below:

| Setting | Value |
| :--- | :--- |
| **Service Type** | Web Service |
| **Language / Runtime** | Node |
| **Name** | `snapcraft` |
| **Branch** | `main` |
| **Root Directory** | *(leave blank / `.`)* |
| **Build Command** | `npm ci && npm run build` |
| **Start Command** | `node .output/server/index.mjs` |
| **Health Check Path** | `/` |

## 6. Adding Environment Variables in Render

Under **Environment** -> **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `NITRO_PRESET` | `node_server` |
| `NODE_VERSION` | `22` |
| `VITE_SUPABASE_URL` | `https://<your-project-id>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `<your-supabase-publishable-or-anon-key>` |
| `VITE_SITE_URL` | `https://<your-service-name>.onrender.com` |

> **Security Note:** Never add `SUPABASE_SERVICE_ROLE_KEY` or database passwords to `VITE_*` variables or frontend code.

## 7. Routing Behavior

Because TanStack Start + Nitro (`node_server`) serves all routes directly from `.output/server/index.mjs`, refreshing or directly opening nested routes such as `/about`, `/hampers`, `/products/<slug>`, `/admin/login`, and `/admin/dashboard` works natively without needing a separate SPA rewrite rule.

## 8. Configuring Supabase Production Authentication URLs

After Render deploys your service and gives you your production URL (e.g. `https://snapcraft.onrender.com`):

1. Open [Supabase Dashboard](https://supabase.com/dashboard) -> your project -> **Authentication** -> **URL Configuration**.
2. Set **Site URL** to:
   ```text
   https://snapcraft.onrender.com
   ```
3. Under **Redirect URLs**, add:
   ```text
   https://snapcraft.onrender.com/**
   https://snapcraft.onrender.com/admin/login
   http://localhost:3000/**
   http://localhost:5173/**
   ```
4. **Security Check:** If you have already created your first `super_admin` via `/admin/setup`, go to **Authentication** -> **Providers** -> **Email** and disable **Allow new users to sign up** (or restrict sign-ups) so unauthorized users cannot register.

## 9. Verifying Production Functionality

1. **Database Connectivity:** Visit the storefront (`/`, `/hampers`) and confirm published products and categories load from Supabase. Place a test order or submit the contact form and verify the record appears in Supabase **Table Editor**.
2. **Authentication:** Open `/admin/login`, sign in with your admin credentials, and confirm `/admin/dashboard` loads and persists across page refreshes.
3. **Password Reset:** Test password reset from `/admin/login` and verify the email link redirects back to `https://<your-render-url>/admin/login?reset=true`.
4. **Images & Media:** Upload a product image in `/admin/media` or `/admin/products/new` and verify it saves to the `product-media` bucket and renders on the storefront.

## 10. Troubleshooting Common Deployment Errors

- **`wrangler.json` generated / server fails to start on Render:** Ensure `NITRO_PRESET=node_server` is set in Render Environment Variables so Nitro outputs `.output/server/index.mjs` instead of a Cloudflare Worker bundle.
- **Supabase not configured / local fallback mode active:** `VITE_*` variables are baked in at build time. If you add or change `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`, trigger a **Manual Deploy -> Clear build cache & deploy**.
- **Auth redirect goes to `localhost`:** Update **Site URL** and **Redirect URLs** in Supabase **Authentication -> URL Configuration** to include your Render URL.
- **Node version mismatch:** Confirm `NODE_VERSION=22` is set in Render Environment Variables.

## 11. Redeploying After GitHub Changes

Render automatically redeploys whenever you push to the connected `main` branch. You can also trigger a manual deploy from the Render dashboard under **Manual Deploy**.
