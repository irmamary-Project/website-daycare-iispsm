# IIS PSM Daycare — Portal Guru & Orang Tua

Aplikasi web fullstack untuk manajemen daycare:
- **Portal Guru** — input daily report, portofolio, laporan triwulan, data siswa, pengumuman, absensi
- **Portal Orang Tua** — lihat perkembangan anak, portofolio, laporan, notifikasi, video CCTV
- **Admin** — persetujuan pendaftaran, rekap & geofence absensi, data siswa

**Stack:** Next.js 16 (App Router, React 19) · Supabase (Auth + DB + Storage + RLS) · Tailwind CSS · Vercel

---

## 📁 Struktur Project

```
iis-psm-daycare/
├── app/
│   ├── api/                 # REST API routes (server-side auth guard)
│   │   ├── absensi/          # check-in, check-out, geofence, rekap, riwayat
│   │   ├── siswa/            # CRUD, export CSV, import CSV
│   │   └── cctv/stream-url/  # HLS stream URL (server-only env)
│   ├── login/                # Login & reset password
│   ├── auth/callback/        # Email verifikasi
│   ├── admission/            # Form pendaftaran (public)
│   ├── guru/                 # Portal Guru (role: guru & admin)
│   │   ├── dashboard/        # Ringkasan harian
│   │   ├── absensi/          # check-in/out, rekap (admin), geofence (admin), riwayat
│   │   ├── data-siswa/       # CRUD data siswa (admin)
│   │   ├── admission/        # Persetujuan pendaftaran (admin)
│   │   ├── daily-report/     # Input laporan harian
│   │   ├── portofolio/       # Upload foto/video
│   │   ├── laporan/          # Laporan triwulan
│   │   ├── skrining/         # Skrining KPSP
│   │   ├── pengumuman/       # Broadcast ke orang tua
│   │   └── riwayat/          # History + detail & export PDF
│   ├── ortu/                 # Portal Orang Tua
│   │   ├── dashboard/        # Ringkasan anak
│   │   ├── portofolio/       # Foto/video & daily report anak
│   │   ├── laporan/          # Laporan triwulan anak
│   │   └── notifikasi/       # Dari guru
│   └── cctv/                 # Live CCTV (semua role)
├── components/
│   ├── guru/SidebarClient.tsx
│   ├── ortu/SidebarClient.tsx
│   └── cctv/LiveCCTVClient.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # browser client (createBrowserClient)
│   │   └── server.ts        # server client (createServerClient + cookies)
│   ├── auth.ts              # guard API: getUser/requireAdmin/requireRole/withApi
│   ├── geo.ts               # haversine + geofence config helper
│   ├── csv.ts               # CSV parse/escape
│   ├── pdf.ts               # generasi PDF (laporan, portofolio, absensi, skrining)
│   ├── constants.ts         # URL storage, daftar kelas/fitrah/mood/status
│   └── date.ts              # util waktu WIB
├── types/index.ts           # tipe/shared type seluruh app
├── middleware.ts             # proteksi rute + redirect role
├── styles/                   # tema & CSS landing page
├── supabase/
│   ├── schema.sql           # canonical schema (idempotent snapshot)
│   ├── migrations/          # migration SQL perubahan berurutan
│   └── README.md           # alur kerja & cara apply migration
└── next.config.ts
```

---

## 🔐 Arsitektur Keamanan (penting untuk kontributor)

- **Anon key Supabase itu publik.** Keamanan data **harus** dijaga di level **Row Level Security (RLS)** di Supabase, bukan di kode.
- Klien Supabase dibagi dua:
  - `createBrowserClient` (lib/supabase/client) — dipakai komponen client.
  - `createServerClient` (lib/supabase/server) — dipakai server component & API route.
- **Semua endpoint `/api/*` mem-verifikasi sesi & role di server** memakai helper di `lib/auth.ts`:
  - `getUser()` → 401 bila belum login.
  - `requireAdmin()` / `requireRole(...)` → 403 bila role tidak sesuai.
  - `withApi(handler)` — bungkus handler agar `ApiError` diubah jadi respons JSON yang rapi.
- `/api/*` **tidak** dilindungi middleware (lihat `middleware.ts`), jadi setiap route harus guard sendiri (defense in depth).
- Selalu cek `supabase/schema.sql` sebagai sumber kebenaran tabel & policy. Jangan mengubah DB langsung tanpa migration.

---

## 🚀 Setup & Deploy

### 1. Setup Supabase
1. Buat project di supabase.com (region Singapore).
2. Jalankan seluruh isi `supabase/schema.sql` di **SQL Editor** (pastikan sukses tanpa error).
3. Buat bucket storage `portofolio` (Public: **OFF** / private).
4. Ambil `Project URL` dan `anon public` key → disimpan di env.

### 2. Setup Lokal
```bash
cp .env.local.example .env.local   # isi semua variabel
npm install
npm run dev                        # buka http://localhost:3000
```

### 3. Deploy ke Vercel
1. Hubungkan repo ke Vercel → framework **Next.js** (auto).
2. Isi env (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan variabel CCTV/`NEXT_PUBLIC_*` lain jika ada).
3. **Update Supabase Auth URL config** dengan URL Vercel: di sidebar → Authentication → URL Configuration.

### 4. Perubahan Database
- Buat file baru di `supabase/migrations/`, lalu apply ke dashboard → SQL Editor (atau `supabase db push`).
- Lihat `supabase/README.md` untuk alur lengkap & aturan idempotency.

---

## 🔐 RLS (Ringkasan)
Semua data dilindungi di level database. Lihat `supabase/schema.sql` untuk detail policy.

| Data | Guru | Orang Tua |
|------|------|-----------|
| Data Siswa | ✅ (admin yang kelola) | 👁️ Hanya anak sendiri |
| Daily Report | ✅ | 👁️ Hanya yang terkirim |
| Portofolio | ✅ | 👁️ Hanya yang terkirim |
| Laporan Triwulan | ✅ | 👁️ Hanya yang terkirim |
| Pengumuman | ✅ | 👁️ Baca saja |
| Notifikasi | – | ✅ Hanya milik sendiri |

---

## Scripts
```bash
npm run dev      # development
npm run build    # production build
npm run start    # start production
npm run lint     # ESLint
```

## Troubleshooting ringkas
- **`relation "profiles" does not exist`** → belum menjalankan `supabase/schema.sql`.
- **Ortu login tapi tidak ada data anak** → hubungkan akun via Data Siswa di portal guru.
- **Upload foto gagal** → pastikan bucket `portofolio` sudah dibuat.
- **Deploy error env** → pastikan semua `NEXT_PUBLIC_*` sudah di isi di Vercel.

---

## Roadmap
- [x] Export laporan ke PDF
- [ ] Notifikasi WhatsApp via Fonnte/WA API
- [ ] Galeri portofolio dengan filter per bulan
- [ ] Grafik tren perkembangan fitrah
- [ ] Mode offline / PWA
- [ ] Multi-bahasa (Indonesia / English)