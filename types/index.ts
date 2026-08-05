export type Role = "guru" | "ortu" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Siswa {
  id: string;
  nama: string;
  jenis_kelamin: "L" | "P";
  tanggal_lahir: string;
  kelas: string;
  foto_url?: string;
  ortu_id?: string;
  guru_id?: string;
  status: "aktif" | "cuti" | "alumni" | "pending" | "ditolak";
  catatan?: string;
  created_at: string;
  // joined
  ortu?: Profile;
}

export type MoodType = "senang" | "biasa" | "sedih" | "marah";
export type CapaianType = "BSB" | "BSH" | "MB" | "BB";
export type StatusLaporan = "draft" | "terkirim";

export interface DailyReport {
  id: string;
  siswa_id: string;
  guru_id: string;
  tanggal: string;
  sesi: "Pagi" | "Siang" | "Full Day";
  kehadiran: "Hadir" | "Izin" | "Sakit" | "Alpha";
  mood_datang?: MoodType;
  mood_pulang?: MoodType;
  kondisi_kesehatan?: string;
  suhu_tubuh?: string;
  sarapan?: string;
  snack_pagi?: string;
  makan_siang?: string;
  snack_sore?: string;
  minum_gelas?: number;
  tidur_siang?: string;
  durasi_tidur?: string;
  bak_kali?: number;
  bab?: string;
  ibadah_checklist: string[];
  fitrah_distimulasi: string[];
  observasi_guru?: string;
  catatan_ortu?: string;
  status: StatusLaporan;
  dikirim_at?: string;
  created_at: string;
  // joined
  siswa?: Siswa;
}

export interface FitrahPenilaian {
  capaian: CapaianType;
  catatan: string;
}

export interface LaporanTriwulan {
  id: string;
  siswa_id: string;
  guru_id: string;
  periode: string;
  tahun: number;
  fitrah_keimanan?: FitrahPenilaian;
  fitrah_belajar?: FitrahPenilaian;
  fitrah_bakat?: FitrahPenilaian;
  fitrah_seksualitas?: FitrahPenilaian;
  fitrah_jasmani?: FitrahPenilaian;
  fitrah_bahasa?: FitrahPenilaian;
  fitrah_sosialitas?: FitrahPenilaian;
  fitrah_adab?: FitrahPenilaian;
  catatan_umum?: string;
  rekomendasi?: string;
  status: StatusLaporan;
  dikirim_at?: string;
  created_at: string;
  siswa?: Siswa;
}

export interface PortofolioMedia {
  id: string;
  portofolio_id: string;
  url: string;
  tipe: "foto" | "video";
  nama_file?: string;
  ukuran_bytes?: number;
  created_at: string;
}

export interface Portofolio {
  id: string;
  siswa_id: string;
  guru_id: string;
  tanggal: string;
  sesi?: string;
  fitrah: string[];
  observasi?: string;
  catatan_ortu?: string;
  status: StatusLaporan;
  dikirim_at?: string;
  created_at: string;
  siswa?: Siswa;
  portofolio_media?: PortofolioMedia[];
}

export interface Pengumuman {
  id: string;
  guru_id: string;
  judul: string;
  isi: string;
  target_kelas: string;
  status: "draft" | "terkirim" | "dijadwalkan";
  jadwal_kirim?: string;
  created_at: string;
}

export interface Notifikasi {
  id: string;
  user_id: string;
  judul: string;
  pesan: string;
  tipe: "daily_report" | "portofolio" | "laporan" | "pengumuman" | "sistem";
  ref_id?: string;
  dibaca: boolean;
  created_at: string;
}

export interface GeofenceConfig {
  id?: string;
  latitude: number;
  longitude: number;
  radius_meter: number;
  nama_lokasi?: string;
}

export interface Screening {
  id: string;
  siswa_id: string;
  usia_bulan: number;
  kelompok_usia: string;
  tanggal_skrining: string;
  skor_ya: number;
  skor_tidak: number;
  kode_interpretasi: string;
  interpretasi: string;
  jawaban: Record<string, string>;
  catatan_per_soal: Record<string, string>;
  catatan_umum: string;
  created_at: string;
  siswa?: { nama: string; kelas: string; tanggal_lahir: string } | null;
}

export interface AbsensiRekapRecord {
  guru_id: string;
  tanggal: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  keterangan: string | null;
  guru_name: string;
}

export interface GuruAbsensi {
  guru_id: string;
  full_name: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  keterangan: string | null;
}

export interface GuruProfile {
  id: string;
  full_name: string;
}

export interface AbsensiRecord {
  id: string;
  tanggal: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  keterangan: string | null;
  profiles: { full_name: string } | null;
}

export type AdmissionSiswa = Siswa & {
  profiles?: { full_name: string | null; email: string | null; phone: string | null } | null;
};

export type SiswaExport = Siswa & {
  ortu?: { full_name: string | null; phone: string | null } | null;
};

export interface KPSPQuestion {
  id: number;
  text: string;
  category: string;
}

export interface KPSPAgeGroup {
  months: number;
  label: string;
  tools: string;
  questions: KPSPQuestion[];
}
