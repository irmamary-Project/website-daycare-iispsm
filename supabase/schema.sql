-- ============================================================
-- IIS PSM Daycare — Supabase Database Schema
-- Jalankan file ini di Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────
-- Extends Supabase Auth users
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null,
  role        text not null check (role in ('guru', 'ortu', 'admin')),
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- ── SISWA (Students) ──────────────────────────────────────
create table public.siswa (
  id          uuid primary key default uuid_generate_v4(),
  nama        text not null,
  jenis_kelamin text check (jenis_kelamin in ('L', 'P')),
  tanggal_lahir date,
  kelas       text not null, -- Infant Care, Playgroup, KB Preschool 1, KB Preschool 2, TKA, TKB
  foto_url    text,
  ortu_id     uuid references public.profiles(id),   -- orang tua linked
  guru_id     uuid references public.profiles(id),   -- guru wali kelas
  status      text default 'aktif' check (status in ('aktif', 'cuti', 'alumni')),
  catatan     text,
  created_at  timestamptz default now()
);

-- ── DAILY REPORT ──────────────────────────────────────────
create table public.daily_reports (
  id              uuid primary key default uuid_generate_v4(),
  siswa_id        uuid references public.siswa(id) on delete cascade,
  guru_id         uuid references public.profiles(id),
  tanggal         date not null,
  sesi            text default 'Full Day' check (sesi in ('Pagi', 'Siang', 'Full Day')),
  kehadiran       text default 'Hadir' check (kehadiran in ('Hadir', 'Izin', 'Sakit', 'Alpha')),
  -- Mood
  mood_datang     text check (mood_datang in ('senang', 'biasa', 'sedih', 'marah')),
  mood_pulang     text check (mood_pulang in ('senang', 'biasa', 'sedih', 'marah')),
  -- Kesehatan
  kondisi_kesehatan text default 'Sehat',
  suhu_tubuh      text,
  -- Makan
  sarapan         text,
  snack_pagi      text,
  makan_siang     text,
  snack_sore      text,
  minum_gelas     integer,
  -- Tidur & BAB/BAK
  tidur_siang     text,
  durasi_tidur    text,
  bak_kali        integer,
  bab             text,
  -- Ibadah & Aktivitas (JSONB array of completed items)
  ibadah_checklist jsonb default '[]',
  -- Fitrah distimulasi
  fitrah_distimulasi text[] default '{}',
  -- Catatan
  observasi_guru  text,
  catatan_ortu    text,
  -- Status
  status          text default 'draft' check (status in ('draft', 'terkirim')),
  dikirim_at      timestamptz,
  created_at      timestamptz default now(),
  unique(siswa_id, tanggal)
);

-- ── PORTOFOLIO ────────────────────────────────────────────
create table public.portofolio (
  id              uuid primary key default uuid_generate_v4(),
  siswa_id        uuid references public.siswa(id) on delete cascade,
  guru_id         uuid references public.profiles(id),
  tanggal         date not null,
  sesi            text,
  fitrah          text[] default '{}',
  observasi       text,
  catatan_ortu    text,
  status          text default 'draft' check (status in ('draft', 'terkirim')),
  dikirim_at      timestamptz,
  created_at      timestamptz default now()
);

-- ── PORTOFOLIO MEDIA ──────────────────────────────────────
create table public.portofolio_media (
  id              uuid primary key default uuid_generate_v4(),
  portofolio_id   uuid references public.portofolio(id) on delete cascade,
  url             text not null,
  tipe            text check (tipe in ('foto', 'video')),
  nama_file       text,
  ukuran_bytes    bigint,
  created_at      timestamptz default now()
);

-- ── LAPORAN 3 BULANAN ────────────────────────────────────
create table public.laporan_triwulan (
  id              uuid primary key default uuid_generate_v4(),
  siswa_id        uuid references public.siswa(id) on delete cascade,
  guru_id         uuid references public.profiles(id),
  periode         text not null, -- misal: "Q1-2026", "Q2-2026"
  tahun           integer not null,
  -- Penilaian per fitrah (BSB/BSH/MB/BB + catatan)
  fitrah_keimanan jsonb,   -- { capaian: 'BSH', catatan: '...' }
  fitrah_belajar  jsonb,
  fitrah_bakat    jsonb,
  fitrah_seksualitas jsonb,
  fitrah_jasmani  jsonb,
  fitrah_bahasa   jsonb,
  fitrah_sosialitas jsonb,
  fitrah_adab     jsonb,
  -- Ringkasan
  catatan_umum    text,
  rekomendasi     text,
  status          text default 'draft' check (status in ('draft', 'terkirim')),
  dikirim_at      timestamptz,
  created_at      timestamptz default now(),
  unique(siswa_id, periode)
);

-- ── PENGUMUMAN ────────────────────────────────────────────
create table public.pengumuman (
  id              uuid primary key default uuid_generate_v4(),
  guru_id         uuid references public.profiles(id),
  judul           text not null,
  isi             text not null,
  target_kelas    text default 'semua', -- 'semua', 'Infant Care', dll
  status          text default 'terkirim' check (status in ('draft', 'terkirim', 'dijadwalkan')),
  jadwal_kirim    timestamptz,
  created_at      timestamptz default now()
);

-- ── NOTIFIKASI ────────────────────────────────────────────
create table public.notifikasi (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.profiles(id) on delete cascade,
  judul           text not null,
  pesan           text not null,
  tipe            text check (tipe in ('daily_report', 'portofolio', 'laporan', 'pengumuman', 'sistem')),
  ref_id          uuid,   -- ID referensi ke tabel terkait
  dibaca          boolean default false,
  created_at      timestamptz default now()
);

-- ── KPSP SCREENING ────────────────────────────────────────
-- Hasil skrining perkembangan anak (data kesehatan sensitif → WAJIB RLS)
create table public.kpsp_screenings (
  id              uuid default gen_random_uuid() primary key,
  siswa_id        uuid not null references public.siswa(id) on delete cascade,
  guru_id         uuid not null references public.profiles(id) on delete set null,
  usia_bulan      integer not null,
  kelompok_usia   text not null,
  tanggal_skrining date not null default current_date,
  skor_ya         integer not null default 0,
  skor_tidak      integer not null default 0,
  kode_interpretasi text not null,
  interpretasi    text not null,
  jawaban         jsonb not null default '{}',
  catatan_per_soal jsonb not null default '{}',
  catatan_umum    text default '',
  created_at      timestamptz default now()
);

create index if not exists idx_kpsp_screenings_siswa on public.kpsp_screenings(siswa_id);
create index if not exists idx_kpsp_screenings_tanggal on public.kpsp_screenings(tanggal_skrining);

-- ── GEOFENCE CONFIG ───────────────────────────────────────
-- Lokasi sekolah + radius untuk validasi GPS absensi
create table public.geofence_config (
  id              uuid primary key default uuid_generate_v4(),
  nama_lokasi     text not null default 'IIS PSM Daycare',
  latitude        numeric not null,
  longitude       numeric not null,
  radius_meter    integer not null default 10,
  created_at      timestamptz default now()
);

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

create index idx_absensi_tanggal on public.absensi_guru(tanggal);
create index idx_absensi_guru on public.absensi_guru(guru_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles         enable row level security;
alter table public.siswa             enable row level security;
alter table public.daily_reports     enable row level security;
alter table public.portofolio        enable row level security;
alter table public.portofolio_media  enable row level security;
alter table public.laporan_triwulan  enable row level security;
alter table public.pengumuman        enable row level security;
alter table public.notifikasi        enable row level security;
alter table public.kpsp_screenings   enable row level security;
alter table public.geofence_config   enable row level security;
alter table public.absensi_guru      enable row level security;

-- Profiles: user bisa baca & update profil sendiri
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

-- Function to get user role (SECURITY DEFINER bypasses RLS to avoid infinite recursion)
create or replace function public.get_user_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Guru + admin bisa baca semua profil (guru butuh kontak orang tua utk tugas harian)
create policy "profiles_guru_select" on public.profiles for select
  using (public.get_user_role() in ('guru', 'admin'));

-- Siswa: admin bisa semua; guru & ortu hanya baca.
-- Insert dengan status 'pending' diizinkan utk ortu via alur pendaftaran publik.
create policy "siswa_admin_all" on public.siswa for all
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');
create policy "siswa_guru_select" on public.siswa for select
  using (public.get_user_role() = 'guru');
create policy "siswa_ortu_select" on public.siswa for select
  using (ortu_id = auth.uid());
create policy "siswa_ortu_insert_pending" on public.siswa for insert
  with check (ortu_id = auth.uid() and status = 'pending');

-- Daily reports: guru + admin bisa semua, ortu hanya baca anak sendiri yang sudah terkirim
create policy "daily_guru_all" on public.daily_reports for all
  using (public.get_user_role() in ('guru', 'admin'));
create policy "daily_ortu_select" on public.daily_reports for select
  using (
    status = 'terkirim' and
    exists (select 1 from public.siswa s where s.id = siswa_id and s.ortu_id = auth.uid())
  );

-- Portofolio: guru + admin bisa semua, ortu hanya baca anak sendiri yang sudah terkirim
create policy "porto_guru_all" on public.portofolio for all
  using (public.get_user_role() in ('guru', 'admin'));
create policy "porto_ortu_select" on public.portofolio for select
  using (
    status = 'terkirim' and
    exists (select 1 from public.siswa s where s.id = siswa_id and s.ortu_id = auth.uid())
  );

-- Portofolio media: guru + admin bisa semua
create policy "media_guru_all" on public.portofolio_media for all
  using (public.get_user_role() in ('guru', 'admin'));
create policy "media_ortu_select" on public.portofolio_media for select
  using (
    exists (
      select 1 from public.portofolio po
      join public.siswa s on s.id = po.siswa_id
      where po.id = portofolio_id and po.status = 'terkirim' and s.ortu_id = auth.uid()
    )
  );

-- Laporan triwulan: guru + admin bisa semua, ortu hanya baca anak sendiri
create policy "laporan_guru_all" on public.laporan_triwulan for all
  using (public.get_user_role() in ('guru', 'admin'));
create policy "laporan_ortu_select" on public.laporan_triwulan for select
  using (
    status = 'terkirim' and
    exists (select 1 from public.siswa s where s.id = siswa_id and s.ortu_id = auth.uid())
  );

-- Pengumuman: guru + admin bisa semua, ortu bisa baca
create policy "pengumuman_guru_all" on public.pengumuman for all
  using (public.get_user_role() in ('guru', 'admin'));
create policy "pengumuman_ortu_select" on public.pengumuman for select
  using (
    status = 'terkirim' and
    public.get_user_role() = 'ortu'
  );

-- Notifikasi: ortu baca/update sendiri; guru & admin bisa kelola + kirim utk ortu
create policy "notif_ortu_own" on public.notifikasi for select
  using (user_id = auth.uid());
create policy "notif_ortu_update" on public.notifikasi for update
  using (user_id = auth.uid());
create policy "notif_guru_all" on public.notifikasi for all
  using (public.get_user_role() in ('guru', 'admin'))
  with check (public.get_user_role() in ('guru', 'admin'));

-- KPSP screening (data kesehatan anak → ketat):
--   admin & guru: semua; ortu: hanya anak sendiri.
create policy "kpsp_admin_all" on public.kpsp_screenings for all
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');
create policy "kpsp_guru_all" on public.kpsp_screenings for all
  using (public.get_user_role() = 'guru')
  with check (public.get_user_role() = 'guru');
create policy "kpsp_ortu_select" on public.kpsp_screenings for select
  using (
    exists (select 1 from public.siswa s where s.id = siswa_id and s.ortu_id = auth.uid())
  );

-- Geofence config: semua authed baca, admin update
create policy "geofence_select" on public.geofence_config for select
  using (auth.uid() is not null);
create policy "geofence_admin_update" on public.geofence_config for update
  using (public.get_user_role() = 'admin');

-- Absensi guru: guru CRUD data sendiri, admin baca/update semua
create policy "absensi_guru_own" on public.absensi_guru for all
  using (guru_id = auth.uid())
  with check (guru_id = auth.uid());
create policy "absensi_admin_all" on public.absensi_guru for all
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Buat bucket untuk portofolio (foto/video)
insert into storage.buckets (id, name, public) values ('portofolio', 'portofolio', false)
  on conflict (id) do nothing;

-- Policy storage: guru + admin bisa upload/read, ortu hanya bisa read file anak sendiri
create policy "storage_guru_all" on storage.objects for all
  using (
    bucket_id = 'portofolio' and
    public.get_user_role() in ('guru', 'admin')
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile saat user baru daftar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'ortu')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SAMPLE DATA (untuk testing — hapus di production)
-- ============================================================

-- Catatan: insert sample data setelah mendaftar akun guru terlebih dahulu
-- kemudian update role di tabel profiles menjadi 'guru'
-- UPDATE public.profiles SET role = 'guru' WHERE id = 'uuid-akun-guru-anda';
