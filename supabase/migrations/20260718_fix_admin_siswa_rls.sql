-- ============================================================
-- Fix: Admin akses data siswa + export/import CSV
-- ============================================================

-- Drop policy lama yang hanya untuk guru
drop policy if exists "siswa_guru_all" on public.siswa;

-- Buat policy baru: guru DAN admin bisa akses semua siswa
create policy "siswa_guru_all" on public.siswa for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('guru', 'admin')
  ));
