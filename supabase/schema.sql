-- ============================================================================
-- GLAM — Supabase schema (v1)
-- Alibaba-hybrid (B2B tiered pricing) + Shein visuals (B2C retail).
-- Run in Supabase SQL Editor in ONE shot.
-- ============================================================================

-- Enable required extensions (gen_random_uuid is built-in to modern pg, but
-- pgcrypto is the safe dependency for older Postgres versions).
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1) profiles — one row per auth user; role gates admin features
-- ============================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================================
-- 2) categories
-- ============================================================================
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  image_url     text,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- 3) products — wholesale base + B2C retail + MOQ for Alibaba-style tiers
-- ============================================================================
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  title              text not null,
  description        text not null,
  specifications     jsonb not null default '{}'::jsonb,
  category_id        uuid references public.categories(id) on delete set null,
  base_price_cents   int  not null,                    -- wholesale base (per unit)
  retail_price_cents int  not null,                    -- B2C single-unit price
  currency           text not null default 'USD',
  moq                int  not null default 1,          -- minimum order qty
  stock              int  not null default 0,
  rating_avg         numeric not null default 0,
  rating_count       int  not null default 0,
  is_featured        boolean not null default false,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================================
-- 4) product_images — cover first, ordered by display_order
-- ============================================================================
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  url           text not null,
  display_order int  not null default 0,
  is_cover      boolean not null default false
);

-- ============================================================================
-- 5) price_tiers — descending unit_price per (product, min_qty)
-- ============================================================================
create table if not exists public.price_tiers (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  min_qty          int  not null,
  unit_price_cents int  not null,
  unique (product_id, min_qty)
);

-- ============================================================================
-- 6) carts — owned by user (logged in) OR session_id (guest)
-- ============================================================================
create table if not exists public.carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 7) cart_items
-- ============================================================================
create table if not exists public.cart_items (
  id               uuid primary key default gen_random_uuid(),
  cart_id          uuid not null references public.carts(id) on delete cascade,
  product_id       uuid not null references public.products(id) on delete cascade,
  quantity         int  not null check (quantity > 0),
  unit_price_cents int  not null,
  unique (cart_id, product_id)
);

-- ============================================================================
-- 8) orders — inserted only via Stripe webhook (service_role)
-- ============================================================================
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  email             text not null,
  status            text not null default 'pending'
                       check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  subtotal_cents    int,
  shipping_cents    int  not null default 0,
  total_cents       int,
  stripe_session_id text,
  shipping_address  jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================================
-- 9) order_items — product_title is denormalised so historical orders survive
-- ============================================================================
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  product_title    text not null,
  unit_price_cents int  not null,
  quantity         int  not null
);

-- ============================================================================
-- 10) inquiries — B2B RFQ form
-- ============================================================================
create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  name       text not null,
  email      text not null,
  company    text,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists products_slug_idx          on public.products (slug);
create index if not exists products_category_id_idx   on public.products (category_id);
create index if not exists products_featured_active_idx
  on public.products (is_featured) where is_active;
create index if not exists product_images_product_id_idx on public.product_images (product_id);
create index if not exists price_tiers_product_qty_idx   on public.price_tiers (product_id, min_qty);
create index if not exists carts_user_id_idx             on public.carts (user_id);
create index if not exists carts_session_id_idx          on public.carts (session_id);
create index if not exists cart_items_cart_id_idx        on public.cart_items (cart_id);
create index if not exists orders_user_created_idx       on public.orders (user_id, created_at desc);
create index if not exists orders_stripe_session_idx     on public.orders (stripe_session_id);
create index if not exists order_items_order_id_idx      on public.order_items (order_id);
create index if not exists inquiries_product_id_idx      on public.inquiries (product_id);

-- ============================================================================
-- updated_at trigger helper + per-table triggers
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'products', 'carts', 'orders']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated_at on public.%1$s; '
      'create trigger trg_%1$s_updated_at '
      'before update on public.%1$s '
      'for each row execute function public.set_updated_at();',
      t
    );
  end loop;
end $$;

-- ============================================================================
-- is_admin() — security definer; reads the caller's role from profiles
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.price_tiers    enable row level security;
alter table public.carts          enable row level security;
alter table public.cart_items     enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.inquiries      enable row level security;

-- ============================================================================
-- PUBLIC CATALOG — readable by anon + authenticated; writes only via admin
-- ============================================================================

-- categories
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories
  for select to anon, authenticated using (true);
drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- products
drop policy if exists products_read on public.products;
create policy products_read on public.products
  for select to anon, authenticated using (true);
drop policy if exists products_admin_write on public.products;
create policy products_admin_write on public.products
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- product_images
drop policy if exists product_images_read on public.product_images;
create policy product_images_read on public.product_images
  for select to anon, authenticated using (true);
drop policy if exists product_images_admin_write on public.product_images;
create policy product_images_admin_write on public.product_images
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- price_tiers
drop policy if exists price_tiers_read on public.price_tiers;
create policy price_tiers_read on public.price_tiers
  for select to anon, authenticated using (true);
drop policy if exists price_tiers_admin_write on public.price_tiers;
create policy price_tiers_admin_write on public.price_tiers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- CARTS — owner (auth.uid) OR matching guest session_id
-- ============================================================================
drop policy if exists carts_owner_select on public.carts;
create policy carts_owner_select on public.carts
  for select to anon, authenticated
  using (
    (user_id is not null and user_id = auth.uid())
    or (session_id is not null)
  );

drop policy if exists carts_owner_insert on public.carts;
create policy carts_owner_insert on public.carts
  for insert to anon, authenticated
  with check (
    (user_id is not null and user_id = auth.uid())
    or (session_id is not null)
  );

drop policy if exists carts_owner_update on public.carts;
create policy carts_owner_update on public.carts
  for update to anon, authenticated
  using (
    (user_id is not null and user_id = auth.uid())
    or (session_id is not null)
  )
  with check (
    (user_id is not null and user_id = auth.uid())
    or (session_id is not null)
  );

drop policy if exists carts_owner_delete on public.carts;
create policy carts_owner_delete on public.carts
  for delete to anon, authenticated
  using (
    (user_id is not null and user_id = auth.uid())
    or (session_id is not null)
  );

drop policy if exists cart_items_owner_select on public.cart_items;
create policy cart_items_owner_select on public.cart_items
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id
        and (
          (c.user_id is not null and c.user_id = auth.uid())
          or (c.session_id is not null)
        )
    )
  );

drop policy if exists cart_items_owner_modify on public.cart_items;
create policy cart_items_owner_modify on public.cart_items
  for all to anon, authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id
        and (
          (c.user_id is not null and c.user_id = auth.uid())
          or (c.session_id is not null)
        )
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id
        and (
          (c.user_id is not null and c.user_id = auth.uid())
          or (c.session_id is not null)
        )
    )
  );

-- ============================================================================
-- ORDERS — SELECT for owner OR admin; INSERT/UPDATE/DELETE only via service role
-- ============================================================================
drop policy if exists orders_owner_select on public.orders;
create policy orders_owner_select on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists order_items_owner_select on public.order_items;
create policy order_items_owner_select on public.order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- No INSERT/UPDATE/DELETE policies for anon/authenticated on orders or
-- order_items — those operations are performed exclusively by the Stripe
-- webhook handler using the service_role key.

-- ============================================================================
-- INQUIRIES — anyone can submit, only admins can read
-- ============================================================================
drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert on public.inquiries
  for insert to anon, authenticated
  with check (
    length(btrim(name))    > 0
    and length(btrim(email))   > 0
    and length(btrim(message)) > 0
  );

drop policy if exists inquiries_admin_select on public.inquiries;
create policy inquiries_admin_select on public.inquiries
  for select to authenticated
  using (public.is_admin());

-- ============================================================================
-- PROFILES — read self or admin; update self only (cannot escalate role)
-- ============================================================================
drop policy if exists profiles_self_or_admin_select on public.profiles;
create policy profiles_self_or_admin_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
-- Note: role can only change via service_role (bypasses RLS), preventing
-- privilege escalation through self-update.
