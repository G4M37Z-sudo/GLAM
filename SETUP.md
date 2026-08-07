# Setup — Online Store

Step-by-step deploy walkthrough for the Online Store (Next.js + Supabase + Stripe + Vercel). Follow the sections in order; each step has a single action and the exact path or command you need.

---

## 1. Supabase

1. Sign up / sign in at [supabase.com](https://supabase.com).
2. Click **New project**.
   - **Name:** `online-store` (or anything you like).
   - **Database password:** generate a strong one and save it somewhere safe.
   - **Region:** pick the one closest to you.
   - Click **Create new project** and wait for provisioning (~1–2 min).
3. In the left sidebar, open **SQL Editor** → **New query**.
4. Paste the full contents of `supabase/schema.sql` (from this repo) into the editor.
   - Click **Run** (or press `Ctrl+Enter`). Every table, index, RLS policy, and helper function will be created.
5. Again in **SQL Editor** → **New query**, paste the full contents of `supabase/seed.sql`.
   - Click **Run**. This populates categories, products, images, and tier pricing.
6. (Optional, for onboarding) Paste and run `supabase/schema_v2.sql` — this adds the
   onboarding columns to `profiles` (display_name, preferred_categories,
   marketing_opt_in, onboarding_step) plus the `handle_new_user` trigger that
   auto-creates a profile row when a user signs up. Required only if you want
   the magic-link sign-in + onboarding wizard to work end-to-end.
7. Open **Project Settings → API** (gear icon in the sidebar).
8. Copy three values — you'll need them in section 3:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys → `anon` `public`** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys → `service_role`** → `SUPABASE_SERVICE_ROLE_KEY` (treat this like a password)

---

## 2. Stripe

1. Sign up / sign in at [stripe.com](https://stripe.com).
2. Make sure you're in **Test mode** (toggle in the top-right of the dashboard).
3. Open **Developers → API keys**.
   - Copy **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Click **Reveal test key** and copy **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`
4. **For local dev** — install the Stripe CLI:
   - macOS: `brew install stripe/stripe-cli/stripe`
   - Windows: `scoop install stripe` (or download from [GitHub releases](https://github.com/stripe/stripe-cli/releases))
   - Linux: see [stripe docs](https://stripe.com/docs/stripe-cli#install)
5. Log in the CLI: `stripe login` (opens a browser).
6. Forward webhooks to your local dev server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
   The CLI prints a line starting with `> Ready! Your webhook signing secret is…` — copy the `whsec_...` value → `STRIPE_WEBHOOK_SECRET`.
   Keep this terminal running while you develop locally.
7. **For production** — once the Vercel URL is live (after section 5), come back to **Developers → Webhooks → Add endpoint**:
   - **Endpoint URL:** `https://<your-vercel-app>.vercel.app/api/stripe-webhook`
   - **Events to send:** select `checkout.session.completed` (and any others you add later).
   - Click **Add endpoint**, then click the endpoint and copy the **Signing secret** — that's your production `STRIPE_WEBHOOK_SECRET`.

---

## 3. Local dev

1. From the project root, copy the env template and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and paste the values from sections 1 and 2.
   For local dev, `NEXT_PUBLIC_SITE_URL=http://localhost:3000` is already correct.
2. Install deps (if you haven't already):
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).
   - You should see the home page with categories and featured products (from the seeded data).
   - The Stripe CLI is forwarding webhooks to this same port (section 2, step 6), so any test checkout will reach your local server.

---

## 4. Push to GitHub

The repo at [`github.com/G4M37Z-sudo/GLAM`](https://github.com/G4M37Z-sudo/GLAM) has already been created.

1. Add the remote (only once per machine):
   ```bash
   git remote add origin https://github.com/G4M37Z-sudo/GLAM.git
   ```
2. Verify the remote:
   ```bash
   git remote -v
   ```
   You should see `origin` pointing at `github.com/G4M37Z-sudo/GLAM.git`.
3. Push:
   ```bash
   git push -u origin main
   ```
   Enter your GitHub credentials / use a PAT if prompted.

---

## 5. Deploy to Vercel

1. Sign in at [vercel.com](https://vercel.com) (use **Continue with GitHub**).
2. Click **Add New… → Project**.
3. **Import** the `G4M37Z-sudo/GLAM` repo.
4. Vercel auto-detects the framework as **Next.js**. Leave the defaults:
   - **Root Directory:** `./`
   - **Build Command:** `next build` (auto)
   - **Output Directory:** `.next` (auto)
5. **Environment variables** — open the **Environment Variables** section and add each of these for the **Production** environment (and **Preview** if you want previews to work):
   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | from §1 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from §1 |
   | `SUPABASE_SERVICE_ROLE_KEY` | from §1 |
   | `STRIPE_SECRET_KEY` | from §2 (test key for now) |
   | `STRIPE_WEBHOOK_SECRET` | from §2 step 6 (local `whsec_…`) — you'll update it after the first deploy |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | from §2 |
   | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for now — update after the first deploy |
6. Click **Deploy**. The first build runs `npm run build` on Vercel's servers (~1–2 min).
7. When the deploy finishes, you'll get a URL like `https://online-store-xxxx.vercel.app`.

---

## 6. After the first deploy

Now you know the real Vercel URL — go wire it back into the system.

1. In the Vercel dashboard, open your project → **Settings → Environment Variables**.
2. Update `NEXT_PUBLIC_SITE_URL` to your actual `https://<your-app>.vercel.app` URL.
3. **Trigger a redeploy** — Deployments → latest → **⋯ → Redeploy** (the env var change requires a rebuild).
4. In the Stripe dashboard, **Developers → Webhooks → Add endpoint** (if you didn't in §2):
   - **Endpoint URL:** `https://<your-app>.vercel.app/api/stripe-webhook`
   - **Events:** `checkout.session.completed`
   - Copy the new **Signing secret** (`whsec_...`).
5. Back in Vercel, update `STRIPE_WEBHOOK_SECRET` to that new production value, then **redeploy again**.

---

## 7. Test the flow

1. Open your deployed URL (or `http://localhost:3000`).
2. Browse to a category, open a product, click **Add to Cart**.
3. Open the cart, click **Proceed to Checkout**.
4. Stripe Checkout opens. Use the test card:
   - **Number:** `4242 4242 4242 4242`
   - **Expiry:** any future date (e.g. `12/34`)
   - **CVC:** any 3 digits
   - **ZIP:** any 5 digits
   - **Name / email:** anything
5. Click **Pay**. You should land on the success page.
6. In Supabase, open **Table Editor → orders** and confirm your new order is there with `status = 'paid'`. The webhook fired and updated it.
7. Confirm `order_items` rows match what you bought, and that `products.stock` decremented.

---

## Troubleshooting

**Build error: "Dynamic server usage: `cookies()` was called outside a request scope" / page must be dynamic.**
The Supabase server client reads cookies, so the page can't be statically rendered. Add this at the top of the affected page file:
```ts
export const dynamic = 'force-dynamic'
```
Then rebuild.

**SQL error in Supabase / tables don't exist.**
The agent (Hermes) cannot run DDL on your Supabase project from its side — the `service_role` key only does data-plane operations (CRUD on existing tables, calling existing RPCs). You must paste `supabase/schema.sql` into the **SQL Editor** yourself and click **Run**. See §1.

**Stripe webhook not firing locally.**
- Is the Stripe CLI running? `stripe listen --forward-to localhost:3000/api/stripe-webhook` should be in its own terminal.
- Did you copy the `whsec_...` from the CLI output (not the one from the dashboard) into `STRIPE_WEBHOOK_SECRET` in `.env.local`?
- Restart `npm run dev` after changing `.env.local`.

**Stripe webhook not firing in production.**
- In Stripe Dashboard → Webhooks, open the endpoint and check the **Logs** tab for delivery errors.
- Confirm the endpoint URL is exactly `https://<your-app>.vercel.app/api/stripe-webhook` (no trailing slash).
- Confirm the `STRIPE_WEBHOOK_SECRET` in Vercel matches the endpoint's signing secret. After env changes, redeploy.

**`supabase.from('products')` returns nothing.**
Make sure `supabase/seed.sql` was run — without it the tables are empty. Re-run it in the SQL Editor (it's idempotent — safe to run twice).

**Vercel build passes but the page is blank / 500.**
Open the **Logs** tab in the Vercel dashboard for the deployment. Most likely an env var is missing or misspelled — variable names are case-sensitive.

---

## Notes

- **`service_role` key is data-plane only.** It can `SELECT` / `INSERT` / `UPDATE` / `DELETE` and call existing RPCs, but it **cannot** run `CREATE TABLE`, `ALTER TABLE`, `CREATE POLICY`, or any other DDL. That's why you paste `supabase/schema.sql` into the SQL Editor yourself — the agent has no way to apply schema changes from its side.
- **Test mode only for v1.** All Stripe keys above are test keys (`sk_test_...`, `pk_test_...`). When you're ready to go live, swap to live keys in both Vercel env vars and the Stripe webhook endpoint.
- **Next.js 16 quirk.** `params` and `searchParams` in pages are now `Promise`s — you must `await` them inside the page component. See `src/app/product/[slug]/page.tsx` for the pattern.
- **Tailwind v4.** Theme tokens are defined in `src/app/globals.css` under `@theme` (no `tailwind.config.js`).
- **Home page uses `export const dynamic = 'force-dynamic'`.** The Supabase server client reads cookies for the auth session, so the page must render per request. This is expected, not a bug.
- **Stock updates happen in the webhook.** A race condition is possible with very high concurrency — acceptable for v1 single-vendor store.
- **No product reviews / no admin dashboard in v1.** The schema is ready for both; UI is deferred.
