-- Esquema de Trader Marketer para Supabase.
-- Ejecutar en Supabase > SQL Editor > New query > Run.
-- Es idempotente: se puede volver a ejecutar sin romper nada.

-- =========================================================
-- 1. Perfiles de empresa (uno por usuario)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  company text not null default '',
  tax_id text not null default '',
  contact_name text not null default '',
  phone text not null default '',
  city text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "perfil propio: leer" on public.profiles;
create policy "perfil propio: leer" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "perfil propio: crear" on public.profiles;
create policy "perfil propio: crear" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "perfil propio: actualizar" on public.profiles;
create policy "perfil propio: actualizar" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Crea el perfil automáticamente al registrarse, con los datos del formulario.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, company, contact_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'company', ''),
    coalesce(new.raw_user_meta_data ->> 'contact_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- 2. Informes generados por el agente de IA
-- =========================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  query text not null,
  product text not null default '',
  hs_code text not null default '',
  market text not null default '',
  destination_country text not null default '',
  route text not null default 'ordinaria',
  mode text not null default 'maritimo',
  generated_by text not null default 'base',
  model text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_created_idx on public.reports (user_id, created_at desc);

alter table public.reports enable row level security;

drop policy if exists "informes propios: leer" on public.reports;
create policy "informes propios: leer" on public.reports
  for select using (auth.uid() = user_id);

drop policy if exists "informes propios: crear" on public.reports;
create policy "informes propios: crear" on public.reports
  for insert with check (auth.uid() = user_id);

drop policy if exists "informes propios: borrar" on public.reports;
create policy "informes propios: borrar" on public.reports
  for delete using (auth.uid() = user_id);

-- =========================================================
-- 3. Operaciones de exportación (checklist documental)
-- =========================================================
create table if not exists public.operations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  code text not null,
  product text not null,
  hs_code text not null default '',
  destination_country text not null default '',
  market text not null,
  route text not null,
  mode text not null,
  incoterm text not null default 'FOB',
  checklist jsonb not null default '{}'::jsonb,
  report_id uuid references public.reports on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists operations_user_created_idx on public.operations (user_id, created_at desc);

alter table public.operations enable row level security;

drop policy if exists "operaciones propias: todo" on public.operations;
create policy "operaciones propias: todo" on public.operations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- 4. Referidos a aliados
-- =========================================================
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  code text not null,
  ally_id text not null,
  operation_id uuid references public.operations on delete set null,
  document_ids text[] not null default '{}',
  note text not null default '',
  status text not null default 'enviado',
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists referrals_user_created_idx on public.referrals (user_id, created_at desc);

alter table public.referrals enable row level security;

drop policy if exists "referidos propios: todo" on public.referrals;
create policy "referidos propios: todo" on public.referrals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
