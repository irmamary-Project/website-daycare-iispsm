-- ============================================================
-- Fix: Daily Report bisa lebih dari 1 per hari (per sesi)
-- ============================================================

-- Drop constraint lama
ALTER TABLE public.daily_reports DROP CONSTRAINT IF EXISTS daily_reports_siswa_id_tanggal_key;

-- Buat constraint baru: per siswa + tanggal + sesi
ALTER TABLE public.daily_reports ADD CONSTRAINT daily_reports_siswa_id_tanggal_sesi_key
  UNIQUE (siswa_id, tanggal, sesi);
