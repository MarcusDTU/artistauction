-- Initial backend for auth profiles, roles, and policies

-- 1) Role enum
do $$ begin
  create type public.user_role as enum ('user','artist');
exception when duplicate_object then null; end $$;

-- 2) Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Updated-at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- 4) Helper: detect service role
create or replace function public.is_service_role()
returns boolean language sql stable as $$
  select coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
$$;

-- 5) Prevent client from changing role
create or replace function public.protect_role_update()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and not public.is_service_role() then
    raise exception 'Changing role is not allowed' using errcode = '42501';
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_protect_role on public.profiles;
create trigger trg_profiles_protect_role before update of role on public.profiles
  for each row execute function public.protect_role_update();

-- 6) Create profile row on signup; copy full_name from metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = case when excluded.full_name <> '' then excluded.full_name else public.profiles.full_name end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7) RLS
alter table public.profiles enable row level security;

drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles"
  on public.profiles for select
  using (true);

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Insert own profile (by function)" on public.profiles;
create policy "Insert own profile (by function)"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 8) Convenience view
create or replace view public.me as
select p.*, auth.uid() as current_uid
from public.profiles p
where p.id = auth.uid();

-- 9) Admin-only helper to set artist role via service key
create or replace function public.set_artist_role(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_service_role() then
    raise exception 'Only service role can call set_artist_role' using errcode = '42501';
  end if;
  update public.profiles set role = 'artist' where email = p_email;
end; $$;


