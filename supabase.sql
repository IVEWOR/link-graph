-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1) users  (mirrors auth.users → extra profile fields)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text unique,
  name text,
  created_at timestamp with time zone default current_timestamp
);

-- 2) stack_items (a user’s tech)
create table if not exists public.stack_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  image_url text not null,
  link_url text,
  category text not null,
  position_index int default 0,
  created_at timestamp with time zone default current_timestamp
);

-- 3) recommended_stacks (global preset list)
create table if not exists public.recommended_stacks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  image_url text not null,
  link_url text,
  category text not null,
  created_at timestamp with time zone default current_timestamp
);

-- 4) quiz_responses (anonymous temp data)
create table if not exists public.quiz_responses (
  id uuid primary key default uuid_generate_v4(),
  session_id text unique not null,
  question_pairs jsonb not null,
  chosen jsonb not null,
  created_at timestamp with time zone default current_timestamp
);

-- Row‑Level Security
alter table users enable row level security;
alter table stack_items enable row level security;

-- Policies
create policy "Users: owners only" on users
  for all using (auth.uid() = id);

create policy "Stacks: owner access" on stack_items
  for all using (auth.uid() = user_id);