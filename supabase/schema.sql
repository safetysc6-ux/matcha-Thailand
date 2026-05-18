-- Supabase MVP schema
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(10,2) not null,
  image_url text,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.recipes (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  ingredients jsonb,
  steps jsonb,
  image_url text,
  is_featured boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.recipes enable row level security;

create policy "public read products" on public.products for select using (true);
create policy "public read recipes" on public.recipes for select using (true);
create policy "admins manage products" on public.products for all using (exists (select 1 from public.users u where u.id = auth.uid() and u.role='admin'));
create policy "admins manage recipes" on public.recipes for all using (exists (select 1 from public.users u where u.id = auth.uid() and u.role='admin'));
