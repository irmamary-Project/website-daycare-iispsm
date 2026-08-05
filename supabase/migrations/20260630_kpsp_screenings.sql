-- Tabel untuk menyimpan hasil skrining KPSP
CREATE TABLE IF NOT EXISTS kpsp_screenings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  guru_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  usia_bulan INTEGER NOT NULL,
  kelompok_usia TEXT NOT NULL,
  tanggal_skrining DATE NOT NULL DEFAULT CURRENT_DATE,
  skor_ya INTEGER NOT NULL DEFAULT 0,
  skor_tidak INTEGER NOT NULL DEFAULT 0,
  kode_interpretasi TEXT NOT NULL,
  interpretasi TEXT NOT NULL,
  jawaban JSONB NOT NULL DEFAULT '{}',
  catatan_per_soal JSONB NOT NULL DEFAULT '{}',
  catatan_umum TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk cepat cari berdasarkan siswa
CREATE INDEX IF NOT EXISTS idx_kpsp_screenings_siswa ON kpsp_screenings(siswa_id);
CREATE INDEX IF NOT EXISTS idx_kpsp_screenings_tanggal ON kpsp_screenings(tanggal_skrining);
