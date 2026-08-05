-- ============================================================
-- Security Hardening — 2026-08-05
--
-- Mengubah DB yang masih memakai policy lama (guru == admin,
-- kpsp_screenings tanpa RLS, admission tanpa policy insert)
-- menjadi state aman yang sama dengan supabase/schema.sql.
--
-- IDEMPOTENT: aman dijalankan berulang (DROP ... IF EXISTS
-- sebelum setiap CREATE POLICY).
-- ============================================================

-- ── 1. RLS untuk kpsp_screenings (data kesehatan anak) ────────
alter table public.kpsp_screenings enable row level security;

drop policy if exists "kpsp_admin_all" on public.kpsp_screenings;
drop policy if exists "kpsp_guru_all" on public.kpsp_screenings;
drop policy if exists "kpsp_ortu_select" on public.kpsp_screenings;

create policy "kpsp_admin_all" on public.kpsp_screenings for all
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');

create policy "kpsp_guru_all" on public.kpsp_screenings for all
  using (public.get_user_role() = 'guru')
  with check (public.get_user_role() = 'guru');

create policy "kpsp_ortu_select" on public.kpsp_screenings for select
  using (
    exists (
      select 1 from public.siswa s
      where s.id = siswa_id and s.ortu_id = auth.uid()
    )
  );

-- ── 2. Siswa: pisah admin vs guru ──────────────────────────────
-- Sebelumnya "siswa_guru_all" memberi akses TULIS ke semua guru.
-- Sekarang: admin = semua, guru = hanya baca, ortu = baca anak
-- sendiri + insert status 'pending' via alur pendaftaran publik.
drop policy if exists "siswa_guru_all" on public.siswa;
drop policy if exists "siswa_admin_all" on public.siswa;
drop policy if exists "siswa_guru_select" on public.siswa;

create policy "siswa_admin_all" on public.siswa for all
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');

create policy "siswa_guru_select" on public.siswa for select
  using (public.get_user_role() = 'guru');

create policy "siswa_ortu_insert_pending" on public.siswa for insert
  with check (ortu_id = auth.uid() and status = 'pending');

-- ── 3. Profiles: izinkan insert profil sendiri ─────────────────
-- handle_new_user() (SECURITY DEFINER) sudah insert saat signup,
-- tapi beberapa alur (mis. jika trigger belum terpasang) butuh ini.
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles for insert
  with check (auth.uid() = id);

-- ── 3b. Notifikasi: perbaiki policy insert utk ortu ─────────────
-- Policy lama "notif_own" (for all using user_id = auth.uid()) tanpa
-- WITH CHECK membuat INSERT notifikasi utk ortu (oleh guru/admin)
-- DITOLAK RLS — notifikasi yang dikirim guru ke orang tua gagal
-- (silently) karena error-nya tidak dicek di client.
drop policy if exists "notif_own" on public.notifikasi;
drop policy if exists "notif_ortu_own" on public.notifikasi;
drop policy if exists "notif_ortu_update" on public.notifikasi;
drop policy if exists "notif_guru_all" on public.notifikasi;

create policy "notif_ortu_own" on public.notifikasi for select
  using (user_id = auth.uid());
create policy "notif_ortu_update" on public.notifikasi for update
  using (user_id = auth.uid());
create policy "notif_guru_all" on public.notifikasi for all
  using (public.get_user_role() in ('guru', 'admin'))
  with check (public.get_user_role() in ('guru', 'admin'));

-- ── 4. Absensi guru & geofence: konsisten dengan schema.sql ───
-- Geofence admin update pakai helper (hindari recursion via subquery profiles).
drop policy if exists "geofence_admin_update" on public.geofence_config;
create policy "geofence_admin_update" on public.geofence_config for update
  using (public.get_user_role() = 'admin');

-- Absensi: guru CRUD sendiri + admin semua (konsolidasi nama policy lama).
drop policy if exists "absensi_guru_select" on public.absensi_guru;
drop policy if exists "absensi_guru_insert" on public.absensi_guru;
drop policy if exists "absensi_guru_update" on public.absensi_guru;
drop policy if exists "absensi_admin_select" on public.absensi_guru;
drop policy if exists "absensi_admin_update" on public.absensi_guru;
drop policy if exists "absensi_guru_own" on public.absensi_guru;
drop policy if exists "absensi_admin_all" on public.absensi_guru;

create policy "absensi_guru_own" on public.absensi_guru for all
  using (guru_id = auth.uid())
  with check (guru_id = auth.uid());

create policy "absensi_admin_all" on public.absensi_guru for all
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');
