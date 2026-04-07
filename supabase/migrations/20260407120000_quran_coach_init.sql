-- Quran Coach: profiles, goals, progress, bookmarks, reflections
-- Run via Supabase Dashboard → SQL Editor, or: supabase db push / migration apply
-- Auth: uses Supabase Auth (auth.users). RLS enforces per-user access.

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── profiles (1:1 with auth.users) ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Reading goal (one active row per user) ─────────────────────────────────
create table if not exists public.user_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  goal_type text not null check (goal_type in ('finish_in_days', 'memorize_per_week')),
  goal_value integer not null check (goal_value > 0),
  started_at timestamptz not null,
  updated_at timestamptz not null default now()
);

-- ─── Progress / streak ───────────────────────────────────────────────────────
create table if not exists public.reading_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  last_verse_key text not null,
  last_read_at timestamptz not null,
  total_verses_read integer not null default 0 check (total_verses_read >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  last_streak_date date,
  updated_at timestamptz not null default now()
);

-- ─── Bookmarks ────────────────────────────────────────────────────────────────
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  verse_key text not null,
  arabic_text text not null,
  translation text not null,
  saved_at timestamptz not null default now(),
  unique (user_id, verse_key)
);

create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);

-- ─── AI reflections (saved notes) ────────────────────────────────────────────
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  verse_key text not null,
  body text not null,
  saved_at timestamptz not null default now(),
  remote_post_id integer,
  created_at timestamptz not null default now()
);

create index if not exists reflections_user_id_idx on public.reflections (user_id);

-- ─── Auto-create profile on signup ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── updated_at helper ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists user_goals_set_updated_at on public.user_goals;
create trigger user_goals_set_updated_at
  before update on public.user_goals
  for each row execute procedure public.set_updated_at();

drop trigger if exists reading_progress_set_updated_at on public.reading_progress;
create trigger reading_progress_set_updated_at
  before update on public.reading_progress
  for each row execute procedure public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.user_goals enable row level security;
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reflections enable row level security;

-- profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- user_goals
create policy "Users can read own goal"
  on public.user_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goal"
  on public.user_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goal"
  on public.user_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goal"
  on public.user_goals for delete
  using (auth.uid() = user_id);

-- reading_progress
create policy "Users can read own progress"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.reading_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.reading_progress for delete
  using (auth.uid() = user_id);

-- bookmarks
create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- reflections
create policy "Users can read own reflections"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert own reflections"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reflections"
  on public.reflections for update
  using (auth.uid() = user_id);

create policy "Users can delete own reflections"
  on public.reflections for delete
  using (auth.uid() = user_id);
