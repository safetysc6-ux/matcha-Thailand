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
  ingredients text,
  brewing_steps text,
  matcha_cost numeric(10,2) default 0,
  selling_price numeric(10,2) default 0,
  profit numeric(10,2) generated always as (selling_price - matcha_cost) stored,
  image_url text,
  category text,
  featured boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.recipes enable row level security;

create policy "public read products" on public.products for select using (true);
create policy "public read recipes" on public.recipes for select using (true);
create policy "public manage products" on public.products for all using (true) with check (true);
create policy "public manage recipes" on public.recipes for all using (true) with check (true);


create policy "users can read own profile" on public.users for select using (auth.uid() = id);
create policy "users can insert own profile" on public.users for insert with check (auth.uid() = id);
create policy "users can update own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);


create table if not exists public.cost_calculations (
  id bigint generated always as identity primary key,
  matcha_price_per_gram numeric(10,2) default 0,
  grams_used numeric(10,2) default 0,
  milk_cost numeric(10,2) default 0,
  cup_cost numeric(10,2) default 0,
  topping_cost numeric(10,2) default 0,
  labor_cost numeric(10,2) default 0,
  total_cost numeric(10,2) default 0,
  selling_price numeric(10,2) default 0,
  profit numeric(10,2) default 0,
  profit_percent numeric(10,2) default 0,
  created_at timestamptz default now()
);

alter table public.cost_calculations enable row level security;
create policy "public insert cost calculations" on public.cost_calculations for insert with check (true);
create policy "public read cost calculations" on public.cost_calculations for select using (true);
