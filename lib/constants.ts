import type { CapaianType, MoodType } from "@/types";

export const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL ?? "https://kdtqjhxkesjbczxfzfqi.supabase.co/storage/v1/object/public";

// NOTE: gallery & facilities images live on a DIFFERENT Supabase storage project
// (dwmpoeqjjrpqdruanhxi) than the logo/OG images (SUPABASE_STORAGE_URL / kdtqjhxkesjbczxfzfqi).
// Override via NEXT_PUBLIC_GALLERY_STORAGE_URL if they are ever migrated to the same project.
export const GALLERY_STORAGE_URL =
  process.env.NEXT_PUBLIC_GALLERY_STORAGE_URL ?? "https://dwmpoeqjjrpqdruanhxi.supabase.co/storage/v1/object/public";

export const LOGO_URL = `${SUPABASE_STORAGE_URL}/LOGO%20IIS/energia.png`;
export const FACILITIES_IMG_URL = `${GALLERY_STORAGE_URL}/gallery/facilities.jpg`;
export const GALLERY_BASE_URL = `${GALLERY_STORAGE_URL}/gallery`;
export const OG_IMAGE_URL = `${SUPABASE_STORAGE_URL}/og_image/og-image.png`;

// Base URL untuk file portofolio yang disimpan di cPanel hosting
export const PORTFOLIO_STORAGE_URL =
  process.env.NEXT_PUBLIC_UPLOAD_URL?.replace('/upload.php', '/portofolio')
  ?? "https://lumizo.my.id/energia/uploads/portofolio";

export const SISWA_STATUS = ["aktif", "cuti", "alumni", "pending", "ditolak"] as const;

export const ABSENSI_STATUS = ["Hadir", "Izin", "Sakit", "Alpha", "Cuti"] as const;

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

export const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: "senang", emoji: "😊", label: "Senang" },
  { value: "biasa",  emoji: "😐", label: "Biasa" },
  { value: "sedih",  emoji: "😢", label: "Sedih" },
  { value: "marah",  emoji: "😤", label: "Marah" },
];
