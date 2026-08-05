-- ============================================================
-- Absensi Guru dengan Geofencing
-- ============================================================

-- ── GEOFENCE CONFIG ───────────────────────────────────────
-- Lokasi sekolah untuk validasi GPS
create table public.geofence_config (
  id              uuid primary key default uuid_generate_v4(),
  nama_lokasi     text not null default 'IIS PSM Daycare',
  latitude        numeric not null,
  longitude       numeric not null,
  radius_meter    integer not null default 10,
  created_at      timestamptz default now()
);

-- Insert lokasi default (IIS PSM Daycare, Magetan)
insert into public.geofence_config (nama_lokasi, latitude, longitude, radius_meter)
values ('IIS PSM Daycare', -7.6548983186081685, 111.31151245200812, 10);

-- ── ABSENSI GURU ──────────────────────────────────────────
create table public.absensi_guru (
  id              uuid primary key default uuid_generate_v4(),
  guru_id         uuid references public.profiles(id) on delete cascade,
  tanggal         date not null,
  check_in        timestamptz,
  check_out       timestamptz,
  check_in_lat    numeric,
  check_in_lng    numeric,
  check_out_lat   numeric,
  check_out_lng   numeric,
  status          text default 'Hadir' check (status in ('Hadir', 'Izin', 'Sakit', 'Alpha', 'Cuti')),
  keterangan      text,
  created_at      timestamptz default now(),
  unique(guru_id, tanggal)
);

-- Index untuk query cepat
create index idx_absensi_tanggal on public.absensi_guru(tanggal);
create index idx_absensi_guru on public.absensi_guru(guru_id);

-- ── RLS ───────────────────────────────────────────────────
alter table public.geofence_config enable row level security;
alter table public.absensi_guru enable row level security;

-- Geofence config: semua user authenticated bisa baca
create policy "geofence_select" on public.geofence_config for select
  using (auth.uid() is not null);

-- Geofence config: hanya admin yang bisa update
create policy "geofence_admin_update" on public.geofence_config for update
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Absensi guru: guru bisa CRUD data sendiri
create policy "absensi_guru_select" on public.absensi_guru for select
  using (guru_id = auth.uid());

create policy "absensi_guru_insert" on public.absensi_guru for insert
  with check (guru_id = auth.uid());

create policy "absensi_guru_update" on public.absensi_guru for update
  using (guru_id = auth.uid());

-- Admin bisa baca semua absensi
create policy "absensi_admin_select" on public.absensi_guru for select
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Admin bisa update semua absensi (untuk input izin/sakit manual)
create policy "absensi_admin_update" on public.absensi_guru for update
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
