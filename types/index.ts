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
  status: "aktif" | "cuti" | "alumni";
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

export const FITRAH_LIST = [
  { key: "keimanan",    label: "Keimanan",    icon: "🕌" },
  { key: "belajar",     label: "Belajar",     icon: "🧠" },
  { key: "bakat",       label: "Bakat",       icon: "⭐" },
  { key: "seksualitas", label: "Seksualitas", icon: "❤️" },
  { key: "jasmani",     label: "Jasmani",     icon: "💪" },
  { key: "bahasa",      label: "Bahasa",      icon: "🌿" },
  { key: "sosialitas",  label: "Sosialitas",  icon: "🤝" },
  { key: "adab",        label: "Adab",        icon: "✨" },
] as const;

export const KELAS_LIST = [
  "Infant 1 (3-6 bulan)",
  "Infant 2 (6-12 Bulan)",
  "Toddler (1-3 Tahun)",
"KB/Preschool 1 (4 tahun)",
"TK A/Preschool 1 (5 Tahun)",
"TK B/Preschool 2 (6 Tahun)",
];

export const CAPAIAN_OPTIONS: { value: CapaianType; label: string; color: string }[] = [
  { value: "BSB", label: "Berkembang Sangat Baik (BSB)", color: "text-green-600" },
  { value: "BSH", label: "Berkembang Sesuai Harapan (BSH)", color: "text-blue-600" },
  { value: "MB",  label: "Mulai Berkembang (MB)",          color: "text-yellow-600" },
  { value: "BB",  label: "Belum Berkembang (BB)",           color: "text-red-600" },
];

export const MOOD_OPTIONS = [
  { value: "senang", emoji: "😊", label: "Senang" },
  { value: "biasa",  emoji: "😐", label: "Biasa" },
  { value: "sedih",  emoji: "😢", label: "Sedih" },
  { value: "marah",  emoji: "😤", label: "Marah" },
] as const;
