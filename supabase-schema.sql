create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  steps text not null,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  image_url text,
  created_at timestamptz default now()
);

alter table recipes enable row level security;
alter table products enable row level security;
alter table users enable row level security;
