-- Dossiers Cap Horn — Supabase schema
-- Copier-coller dans Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text default 'lecteur' check (role in ('admin','radiologue','interne','lecteur')),
  created_at timestamptz default now()
);

create table if not exists public.radiology_cases (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  indication text,
  clinical_context text,
  final_diagnosis text,
  differential_diagnosis text,
  modality text,
  anatomical_region text,
  educational_score int default 3 check (educational_score between 1 and 5),
  tags text[] default '{}',
  diagnostic_pitfalls text,
  key_learning_points text,
  report_text text,
  references_text text,
  status text default 'brouillon' check (status in ('brouillon','publie','archive')),
  pseudonymized_patient_id text,
  author_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.dicom_files (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid references public.radiology_cases(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  file_size bigint,
  modality text,
  series_description text,
  study_date text,
  instance_count int,
  metadata_warning boolean default false,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid references public.radiology_cases(id) on delete cascade,
  author_id uuid references auth.users(id),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  color text default '#0b4f7a'
);

create table if not exists public.modalities (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

create table if not exists public.anatomical_regions (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

alter table public.profiles enable row level security;
alter table public.radiology_cases enable row level security;
alter table public.dicom_files enable row level security;
alter table public.comments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.tags enable row level security;
alter table public.modalities enable row level security;
alter table public.anatomical_regions enable row level security;

create or replace function public.current_role()
returns text
language sql
security definer
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles read own" on public.profiles
for select using (auth.uid() = id or public.current_role() = 'admin');

create policy "profiles insert own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles update own or admin" on public.profiles
for update using (auth.uid() = id or public.current_role() = 'admin');

create policy "cases read connected" on public.radiology_cases
for select using (
  auth.uid() is not null and (
    status = 'publie'
    or author_id = auth.uid()
    or public.current_role() = 'admin'
  )
);

create policy "cases insert connected" on public.radiology_cases
for insert with check (auth.uid() is not null and author_id = auth.uid());

create policy "cases update author admin" on public.radiology_cases
for update using (author_id = auth.uid() or public.current_role() = 'admin');

create policy "cases delete admin" on public.radiology_cases
for delete using (public.current_role() = 'admin');

create policy "dicom read if case readable" on public.dicom_files
for select using (
  exists (
    select 1 from public.radiology_cases c
    where c.id = case_id
    and (
      c.status = 'publie'
      or c.author_id = auth.uid()
      or public.current_role() = 'admin'
    )
  )
);

create policy "dicom insert connected" on public.dicom_files
for insert with check (auth.uid() is not null);

create policy "dicom delete admin or uploader" on public.dicom_files
for delete using (uploaded_by = auth.uid() or public.current_role() = 'admin');

create policy "comments read connected" on public.comments
for select using (auth.uid() is not null);

create policy "comments insert connected" on public.comments
for insert with check (auth.uid() is not null and author_id = auth.uid());

create policy "audit read admin" on public.audit_logs
for select using (public.current_role() = 'admin');

create policy "audit insert connected" on public.audit_logs
for insert with check (auth.uid() is not null);

create policy "taxonomy read connected tags" on public.tags
for select using (auth.uid() is not null);

create policy "taxonomy read connected modalities" on public.modalities
for select using (auth.uid() is not null);

create policy "taxonomy read connected regions" on public.anatomical_regions
for select using (auth.uid() is not null);

insert into public.modalities(name) values
('Scanner'), ('IRM'), ('Radiographie'), ('Échographie'), ('TEP'), ('Mammographie'), ('Angiographie'), ('Autre')
on conflict do nothing;

insert into public.anatomical_regions(name) values
('Neuro'), ('Thorax'), ('Abdomen'), ('Pelvis'), ('Ostéo-articulaire'), ('Vasculaire'), ('Sénologie'), ('Pédiatrie'), ('Autre')
on conflict do nothing;

insert into public.tags(name,color) values
('urgence','#dc2626'), ('neuro','#2563eb'), ('thorax','#0891b2'), ('abdomen','#16a34a'), ('piège','#f59e0b')
on conflict do nothing;

insert into public.radiology_cases
(title, indication, clinical_context, final_diagnosis, differential_diagnosis, modality, anatomical_region, educational_score, tags, diagnostic_pitfalls, key_learning_points, report_text, references_text, status, pseudonymized_patient_id)
values
('AVC ischémique sylvien en IRM', 'Déficit neurologique brutal', 'Patient pseudonymisé, début brutal des symptômes', 'AVC ischémique aigu du territoire sylvien', 'Migraine, crise comitiale, hypoglycémie', 'IRM', 'Neuro', 5, array['urgence','neuro'], 'Ne pas méconnaître une diffusion positive subtile.', 'Restriction de diffusion avec baisse ADC.', 'Compte-rendu fictif anonymisé.', '', 'publie', 'PSEUDO-001'),
('Embolie pulmonaire au scanner', 'Dyspnée aiguë', 'Patient pseudonymisé avec douleur thoracique', 'Embolie pulmonaire bilatérale', 'Pneumopathie, infarctus pulmonaire', 'Scanner', 'Thorax', 4, array['urgence','thorax'], 'Qualité d’opacification insuffisante.', 'Défaut d’opacification artériel pulmonaire.', 'Compte-rendu fictif anonymisé.', '', 'publie', 'PSEUDO-002'),
('Appendicite aiguë au scanner', 'Douleur FID', 'Syndrome inflammatoire', 'Appendicite aiguë non compliquée', 'Iléite, adénolymphite', 'Scanner', 'Abdomen', 4, array['abdomen'], 'Appendice rétrocaecal parfois difficile.', 'Appendice augmenté de calibre avec infiltration graisseuse.', 'Compte-rendu fictif anonymisé.', '', 'publie', 'PSEUDO-003')
on conflict do nothing;

-- Création du bucket privé DICOM
insert into storage.buckets (id, name, public)
values ('dicom-files', 'dicom-files', false)
on conflict (id) do update set public = false;

-- Policies Storage : bucket privé accessible aux utilisateurs connectés
create policy "authenticated can upload dicom"
on storage.objects for insert
to authenticated
with check (bucket_id = 'dicom-files');

create policy "authenticated can read dicom signed"
on storage.objects for select
to authenticated
using (bucket_id = 'dicom-files');

create policy "authenticated can delete own dicom path"
on storage.objects for delete
to authenticated
using (bucket_id = 'dicom-files');
