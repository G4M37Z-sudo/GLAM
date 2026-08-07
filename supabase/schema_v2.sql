-- =====================================================================
-- GLAM — Schema additions v2
-- User onboarding: extended profile fields + RLS policy for the user
-- to update their own onboarding_step / preferred_categories / etc.
--
-- Run this AFTER schema.sql. Safe to re-run: uses IF NOT EXISTS /
-- DROP POLICY IF EXISTS / CREATE OR REPLACE.
-- =====================================================================

-- -------------------------------------------------------------------------
-- 1. Extend profiles with onboarding + preference fields
-- -------------------------------------------------------------------------

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists preferred_categories text[] default '{}'::text[],
  add column if not exists marketing_opt_in boolean not null default false,
  add column if not exists onboarding_step int not null default 1
    check (onboarding_step between 1 and 999),
  add column if not exists onboarding_completed_at timestamptz;

comment on column public.profiles.onboarding_step is
  '1 = welcome, 2 = pick categories, 3 = display name + email prefs, 4 = done. 999 = skipped or already complete.';
comment on column public.profiles.preferred_categories is
  'Slugs of the user''s preferred categories — drives the personalised homepage and recommendations.';

-- -------------------------------------------------------------------------
-- 2. RLS: let users update their own onboarding fields
--    (the existing self-update policy already covers role/full_name,
--    but we add explicit coverage for the new columns to be safe.)
-- -------------------------------------------------------------------------

drop policy if exists "Profiles self-update onboarding" on public.profiles;

create policy "Profiles self-update onboarding"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- -------------------------------------------------------------------------
-- 3. Trigger: when a new auth.users row is created, also create a
--    matching profiles row with onboarding_step = 1 so the wizard
--    kicks in on first login.
-- -------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, onboarding_step)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer',
    1
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
