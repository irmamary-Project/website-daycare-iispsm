-- ============================================================
-- COMPREHENSIVE FIX: All RLS infinite recursion issues
-- Uses get_user_role() SECURITY DEFINER function
-- Date: 2026-07-20
-- ============================================================

-- Step 1: Create security definer function to get user role
-- This bypasses RLS because it runs as the function owner (superuser)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Step 2: Drop ALL policies that query profiles directly

-- Profiles
DROP POLICY IF EXISTS "profiles_guru_select" ON public.profiles;

-- Siswa
DROP POLICY IF EXISTS "siswa_guru_all" ON public.siswa;

-- Daily reports
DROP POLICY IF EXISTS "daily_guru_all" ON public.daily_reports;

-- Portofolio
DROP POLICY IF EXISTS "porto_guru_all" ON public.portofolio;

-- Portofolio media
DROP POLICY IF EXISTS "media_guru_all" ON public.portofolio_media;

-- Laporan triwulan
DROP POLICY IF EXISTS "laporan_guru_all" ON public.laporan_triwulan;

-- Pengumuman
DROP POLICY IF EXISTS "pengumuman_guru_all" ON public.pengumuman;

-- Storage
DROP POLICY IF EXISTS "storage_guru_all" ON storage.objects;

-- Geofence config
DROP POLICY IF EXISTS "geofence_admin_update" ON public.geofence_config;

-- Absensi guru
DROP POLICY IF EXISTS "absensi_admin_select" ON public.absensi_guru;
DROP POLICY IF EXISTS "absensi_admin_update" ON public.absensi_guru;

-- Step 3: Recreate all policies using get_user_role()

-- Profiles: guru + admin bisa baca semua profil
CREATE POLICY "profiles_guru_select" ON public.profiles FOR SELECT
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Siswa: guru + admin bisa semua
CREATE POLICY "siswa_guru_all" ON public.siswa FOR ALL
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Daily reports: guru + admin bisa semua
CREATE POLICY "daily_guru_all" ON public.daily_reports FOR ALL
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Portofolio: guru + admin bisa semua
CREATE POLICY "porto_guru_all" ON public.portofolio FOR ALL
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Portofolio media: guru + admin bisa semua
CREATE POLICY "media_guru_all" ON public.portofolio_media FOR ALL
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Laporan triwulan: guru + admin bisa semua
CREATE POLICY "laporan_guru_all" ON public.laporan_triwulan FOR ALL
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Pengumuman: guru + admin bisa semua
CREATE POLICY "pengumuman_guru_all" ON public.pengumuman FOR ALL
  USING (public.get_user_role() IN ('guru', 'admin'));

-- Pengumuman: ortu bisa baca yang terkirim
DROP POLICY IF EXISTS "pengumuman_ortu_select" ON public.pengumuman;
CREATE POLICY "pengumuman_ortu_select" ON public.pengumuman FOR SELECT
  USING (status = 'terkirim' AND public.get_user_role() = 'ortu');

-- Storage: guru + admin bisa semua untuk portofolio bucket
CREATE POLICY "storage_guru_all" ON storage.objects FOR ALL
  USING (
    bucket_id = 'portofolio' AND
    public.get_user_role() IN ('guru', 'admin')
  );

-- Geofence config: admin bisa update
CREATE POLICY "geofence_admin_update" ON public.geofence_config FOR UPDATE
  USING (public.get_user_role() = 'admin');

-- Absensi guru: admin bisa baca semua
CREATE POLICY "absensi_admin_select" ON public.absensi_guru FOR SELECT
  USING (public.get_user_role() = 'admin');

-- Absensi guru: admin bisa update semua (input izin/sakit manual)
CREATE POLICY "absensi_admin_update" ON public.absensi_guru FOR UPDATE
  USING (public.get_user_role() = 'admin');
