# IIS PSM Daycare — Portal Guru & Orang Tua

Aplikasi web fullstack untuk manajemen daycare:
- **Portal Guru** — input daily report, portofolio, laporan triwulan, data siswa, pengumuman
- **Portal Orang Tua** — lihat perkembangan anak, portofolio, laporan, notifikasi

**Stack:** Next.js 15 · Supabase (Auth + DB + Storage) · Tailwind CSS · Vercel

---

## 🚀 PANDUAN DEPLOY LENGKAP

### LANGKAH 1 — Setup Supabase

1. Buka **https://supabase.com** → klik **"Start your project"**
2. Login dengan GitHub, lalu klik **"New project"**
3. Isi:
   - **Name:** `iis-psm-daycare`
   - **Database Password:** buat password kuat (simpan!)
   - **Region:** `Southeast Asia (Singapore)`
4. Tunggu ~2 menit sampai project siap

**Jalankan Schema SQL:**
1. Di sidebar Supabase → klik **SQL Editor** → **"New query"**
2. Copy seluruh isi file `supabase/schema.sql`
3. Paste ke SQL Editor → klik **"Run"**
4. Pastikan muncul "Success" tanpa error

**Buat Storage Bucket:**
1. Di sidebar → **Storage** → **"New bucket"**
2. Name: `portofolio`, centang **Public bucket: OFF** (private)
3. Klik **Create bucket**

**Ambil API Keys:**
1. Sidebar → **Settings** → **API**
2. Copy:
   - `Project URL` → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Setup Email (untuk verifikasi akun):**
1. Sidebar → **Authentication** → **URL Configuration**
2. **Site URL:** `https://nama-project-anda.vercel.app`
3. **Redirect URLs:** tambahkan `https://nama-project-anda.vercel.app/auth/callback`

---

### LANGKAH 2 — Setup Project Lokal

```bash
# Clone / download project ini
cd iis-psm-daycare

# Install dependencies
npm install

# Buat file .env.local
cp .env.example .env.local
```
---

### LANGKAH 3 — Buat Akun Guru Pertama

1. Buka `http://localhost:3000` → klik **Daftar**
2. Pilih role **Guru**, isi nama & email → klik **Daftar**
3. Cek email → klik link verifikasi
4. **Promosikan ke role guru** di Supabase:
   - Supabase → **Table Editor** → tabel `profiles`
   - Cari row dengan email Anda
   - Ubah kolom `role` dari `ortu` ke `guru`
   - Klik **Save**
5. Login kembali → akan masuk ke Portal Guru

> **Tip:** Untuk akun guru selanjutnya, minta mereka daftar dulu lalu update role di Supabase.

---

### LANGKAH 4 — Deploy ke Vercel

**A. Push ke GitHub:**
```bash
git init
git add .
git commit -m "Initial commit — IIS PSM Portal"

# Buat repo baru di github.com lalu:
git remote add origin https://github.com/username/iis-psm-daycare.git
git push -u origin main
```

**B. Deploy di Vercel:**
1. Buka **https://vercel.com** → login dengan GitHub
2. Klik **"Add New Project"** → pilih repo `iis-psm-daycare`
3. Framework: **Next.js** (auto-detected)
4. **Environment Variables** — tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://xxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
   ```
5. Klik **Deploy** → tunggu ~2 menit

**C. Update Supabase dengan URL Vercel:**
1. Setelah deploy, copy URL Vercel: `https://iis-psm-daycare-xxx.vercel.app`
2. Supabase → **Authentication** → **URL Configuration**
3. Update **Site URL** dan **Redirect URLs** dengan URL Vercel tersebut

---

### LANGKAH 5 — Tambah Orang Tua & Hubungkan ke Siswa

1. Minta orang tua daftar di portal → pilih role **Orang Tua**
2. Guru masuk ke **Data Siswa** → tambah/edit siswa
3. Di field **Orang Tua / Wali** → pilih nama orang tua yang sudah daftar
4. Orang tua sekarang bisa lihat data anaknya di portal mereka

---

## 📁 Struktur Project

```
iis-psm-daycare/
├── app/
│   ├── login/              # Halaman login & register
│   ├── auth/callback/      # Handler email verification
│   ├── guru/               # Portal Guru (protected)
│   │   ├── dashboard/      # Ringkasan harian
│   │   ├── data-siswa/     # CRUD data siswa
│   │   ├── daily-report/   # Input laporan harian
│   │   ├── portofolio/     # Upload foto/video
│   │   ├── laporan/        # Laporan triwulan
│   │   ├── riwayat/        # History semua laporan
│   │   └── pengumuman/     # Broadcast ke orang tua
│   └── ortu/               # Portal Orang Tua (protected)
│       ├── dashboard/      # Beranda & ringkasan anak
│       ├── portofolio/     # Lihat foto/video & daily report
│       ├── laporan/        # Lihat laporan triwulan
│       └── notifikasi/     # Notifikasi dari guru
├── components/
│   ├── guru/SidebarClient  # Navigasi guru
│   └── ortu/SidebarClient  # Navigasi orang tua
├── lib/supabase/
│   ├── client.ts           # Supabase browser client
│   └── server.ts           # Supabase server client
├── types/index.ts          # TypeScript types & constants
├── middleware.ts            # Auth routing & role guard
├── supabase/schema.sql     # Database schema lengkap
└── .env.example            # Template environment variables
```

---

## 🔐 Sistem Keamanan (Row Level Security)

Semua data dilindungi di level database:

| Data | Guru | Orang Tua |
|------|------|-----------|
| Data Siswa | ✅ Full CRUD | 👁️ Hanya anak sendiri |
| Daily Report | ✅ Full CRUD | 👁️ Hanya yang terkirim |
| Portofolio | ✅ Full CRUD | 👁️ Hanya yang terkirim |
| Laporan Triwulan | ✅ Full CRUD | 👁️ Hanya yang terkirim |
| Pengumuman | ✅ Full CRUD | 👁️ Baca saja |
| Notifikasi | – | ✅ Hanya milik sendiri |

---

## 🛠️ Troubleshooting

**Error: `relation "profiles" does not exist`**
→ Schema SQL belum dijalankan. Ulangi Langkah 1 bagian "Jalankan Schema SQL".

**Orang tua login tapi tidak ada data anak:**
→ Hubungkan akun orang tua ke data siswa via Data Siswa di portal guru.

**Email verifikasi tidak masuk:**
→ Cek folder Spam. Atau di Supabase → Authentication → Settings → matikan "Enable email confirmations" untuk testing.

**Upload foto gagal:**
→ Pastikan bucket `portofolio` sudah dibuat di Supabase Storage.

**Deploy Vercel error `NEXT_PUBLIC_SUPABASE_URL is not defined`:**
→ Pastikan environment variables sudah diisi di Vercel dashboard sebelum deploy.

---

## 📞 Fitur Mendatang (Roadmap)

- [ ] Export laporan ke PDF
- [ ] Notifikasi WhatsApp via Fonnte/WA API
- [ ] Galeri portofolio dengan filter per bulan
- [ ] Grafik tren perkembangan fitrah
- [ ] Mode offline / PWA
- [ ] Multi-bahasa (Indonesia / English)
