-- ============================================================
-- Fix: Admin bisa akses semua tabel (daily_reports, portofolio, dll)
-- ============================================================

-- Daily reports: guru + admin bisa semua
DROP POLICY IF EXISTS "daily_guru_all" ON public.daily_reports;
CREATE POLICY "daily_guru_all" ON public.daily_reports FOR ALL
  USING (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));

-- Portofolio: guru + admin bisa semua
DROP POLICY IF EXISTS "porto_guru_all" ON public.portofolio;
CREATE POLICY "porto_guru_all" ON public.portofolio FOR ALL
  USING (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));

-- Portofolio media: guru + admin bisa semua
DROP POLICY IF EXISTS "media_guru_all" ON public.portofolio_media;
CREATE POLICY "media_guru_all" ON public.portofolio_media FOR ALL
  USING (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));

-- Laporan triwulan: guru + admin bisa semua
DROP POLICY IF EXISTS "laporan_guru_all" ON public.laporan_triwulan;
CREATE POLICY "laporan_guru_all" ON public.laporan_triwulan FOR ALL
  USING (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));

-- Pengumuman: guru + admin bisa semua
DROP POLICY IF EXISTS "pengumuman_guru_all" ON public.pengumuman;
CREATE POLICY "pengumuman_guru_all" ON public.pengumuman FOR ALL
  USING (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));

-- Profiles: guru + admin bisa baca semua profil
DROP POLICY IF EXISTS "profiles_guru_select" ON public.profiles;
CREATE POLICY "profiles_guru_select" ON public.profiles for select
  USING (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));
