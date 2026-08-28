# Rencana Implementasi: Migrasi Storage Portofolio ke cPanel Hosting

## 📋 Status

| Item | Status |
|---|---|
| Tanggal | 28 Agustus 2026 |
| Prioritas | Tinggi |
| Estimasi Waktu | ~1 jam |
| Budget Tambahan | $0 (sudah ada hosting) |

---

## ✅ Status Pengerjaan

### Sudah Selesai (Otomatis)

- [x] Update `.env.local` - tambah `NEXT_PUBLIC_UPLOAD_URL`
- [x] Update `.env.local.example` - tambah template env variable
- [x] Update `lib/constants.ts` - tambah `PORTFOLIO_STORAGE_URL`
- [x] Update `next.config.ts` - tambah domain ke `remotePatterns`
- [x] Modifikasi `PortofolioClient.tsx` - ganti logic upload ke PHP endpoint

### Perlu Anda Lakukan Manual (di cPanel)

- [ ] **Step 1:** Buat folder `uploads/portofolio/` di cPanel File Manager
- [ ] **Step 2:** Buat file `.htaccess` di `public_html/uploads/portofolio/`
- [ ] **Step 3:** Buat file `upload.php` di `public_html/uploads/`
- [ ] **Step 4:** Konfigurasi PHP di cPanel (upload_max_filesize = 20M)
- [ ] **Step 5:** Set permission folder (755) dan file (644)
- [ ] **Step 6:** Update `UPLOAD_API_KEY` di `.env.local` dengan key yang aman
- [ ] **Step 7:** Deploy ke Vercel (push ke repo)
- [ ] **Step 8:** Set environment variable di Vercel dashboard

---

## 🎯 Tujuan

Migrasi penyimpanan file portofolio (foto/video) dari **Supabase Storage** ke **cPanel Hosting** yang sudah dimiliki, untuk menghemat biaya dan mendapatkan storage lebih besar ("unlimited" vs 1 GB gratis Supabase).

---

## 📊 Kebutuhan Storage

| Metrik | Nilai |
|---|---|
| Penggunaan saat ini | ~3 GB (2 bulan) |
| Proyeksi per tahun | ~20 GB |
| Storage cPanel | "Unlimited" (fair use ~50-150 GB) |
| Storage Supabase gratis | 1 GB ❌ |

---

## 🏗️ Arsitektur Setelah Migrasi

```
┌─────────────────────────────────────────────────────────────┐
│                      FLOW UPLOAD                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Browser (Guru)                                             │
│       │                                                     │
│       ▼                                                     │
│  Next.js PortofolioClient.tsx                               │
│       │                                                     │
│       ├──1──▶ POST /uploads/upload.php (cPanel)             │
│       │           │                                         │
│       │           ▼                                         │
│       │       Simpan file ke /uploads/portofolio/{id}/      │
│       │           │                                         │
│       │           ▼                                         │
│       │       Return JSON { url: "https://..." }            │
│       │                                                     │
│       ├──2──▶ INSERT portofolio_media (Supabase DB)         │
│       │           url: https://lumizo.my.id/energia/... │
│       │                                                     │
│       ▼                                                     │
│  ✅ Selesai                                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      FLOW READ                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Portal Orang Tua / Guru                                    │
│       │                                                     │
│       ▼                                                     │
│  SELECT portofolio_media FROM Supabase DB                   │
│       │                                                     │
│       ▼                                                     │
│  Render <Image src={url} /> atau <video src={url} />        │
│       │                                                     │
│       ▼                                                     │
│  Browser load file langsung dari cPanel hosting             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File yang Perlu Dibuat/Diubah

### File Baru (di cPanel)

| File | Lokasi | Deskripsi |
|---|---|---|
| `upload.php` | `public_html/uploads/` | PHP endpoint untuk handle upload |
| `.htaccess` | `public_html/uploads/portofolio/` | Proteksi & CORS headers |

### File yang Diubah (di Next.js)

| File | Aksi | Deskripsi |
|---|---|---|
| `.env.local` | Tambah | Tambah `NEXT_PUBLIC_UPLOAD_URL` |
| `lib/constants.ts` | Tambah | Tambah `PORTFOLIO_STORAGE_URL` |
| `next.config.ts` | Ubah | Tambah domain hosting ke `remotePatterns` |
| `app/guru/portofolio/PortofolioClient.tsx` | Ubah | Ganti logic upload ke PHP endpoint |

---

## 🛠️ Step-by-Step Implementation

### ⚡ Quick Start (Yang Perlu Anda Lakukan)

> **Kode sudah selesai diubah.** Sekarang Anda perlu setup di cPanel hosting.

#### Ringkasan Cepat:

1. **Buka cPanel** → File Manager → `public_html/`
2. **Buat folder** `uploads/portofolio/`
3. **Buat 2 file** (copy-paste kode di bawah):
   - `public_html/uploads/upload.php`
   - `public_html/uploads/portofolio/.htaccess`
4. **Konfigurasi PHP** di cPanel → PHP Selector → Options
5. **Set permission** folder ke 755, file ke 644
6. **Update** `UPLOAD_API_KEY` di `.env.local`
7. **Deploy** ke Vercel

---

### Step 1: Setup di cPanel Hosting

#### 1.1 Buat Folder Struktur

```
public_html/
└── uploads/
    ├── upload.php
    └── portofolio/
        └── .htaccess
```

#### 1.2 Buat File `.htaccess`

Lokasi: `public_html/uploads/portofolio/.htaccess`

```apache
# Disable directory listing
Options -Indexes

# Block direct access to PHP files in upload folder
<FilesMatch "\.php$">
    Deny from all
</FilesMatch>

# Allow access to image/video files
<FilesMatch "\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm)$">
    Allow from all
</FilesMatch>

# CORS headers for Next.js
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

#### 1.3 Buat File `upload.php`

Lokasi: `public_html/uploads/upload.php`

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Configuration
$uploadDir = __DIR__ . '/portofolio/';
$maxFileSize = 20 * 1024 * 1024; // 20MB
$allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'
];

// Auth check (optional - bisa tambahkan API key)
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$expectedToken = getenv('UPLOAD_API_KEY');
if ($expectedToken && $authHeader !== "Bearer $expectedToken") {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Validate file
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Upload error: ' . $file['error']]);
    exit;
}

if ($file['size'] > $maxFileSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large (max 20MB)']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'File type not allowed: ' . $mime]);
    exit;
}

// Generate path: portfolio_id/timestamp.ext
$portfolioId = $_POST['portfolio_id'] ?? 'unknown';
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$ext = preg_replace('/[^a-zA-Z0-9]/', '', $ext) ?: 'bin';
$filename = time() . '.' . $ext;
$relativePath = $portfolioId . '/' . $filename;
$fullPath = $uploadDir . $relativePath;

// Create directory
if (!is_dir($uploadDir . $portfolioId)) {
    mkdir($uploadDir . $portfolioId, 0755, true);
}

// Move file
if (move_uploaded_file($file['tmp_name'], $fullPath)) {
    $url = 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/portofolio/' . $relativePath;
    echo json_encode([
        'success' => true,
        'url' => $url,
        'path' => $relativePath
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
}
?>
```

#### 1.4 Konfigurasi PHP di cPanel

Pastikan setting berikut di **PHP Selector → Options**:

| Setting | Nilai | Keterangan |
|---|---|---|
| `upload_max_filesize` | 20M | Maks ukuran file upload |
| `post_max_size` | 25M | Maks ukuran POST data |
| `max_execution_time` | 300 | Timeout script (5 menit) |
| `memory_limit` | 256M | Memory yang digunakan |

#### 1.5 Set Permission

Di **File Manager**:
- Folder `uploads/` → Permission `755`
- Folder `portofolio/` → Permission `755`
- File `upload.php` → Permission `644`

---

### Step 2: Modifikasi Kode Next.js

#### 2.1 Tambah Environment Variable

File: `.env.local`

```env
# Upload endpoint (baru)
NEXT_PUBLIC_UPLOAD_URL=https://lumizo.my.id/energia/uploads/upload.php
UPLOAD_API_KEY=your-secret-key-here
```

> **Catatan:** Ganti `lumizo.my.id/energia` dengan domain Anda, dan `your-secret-key-here` dengan API key acak yang aman.

#### 2.2 Tambah Konstanta

File: `lib/constants.ts`

Tambahkan di **line 15** (setelah `OG_IMAGE_URL`):

```typescript
// Base URL untuk file portofolio yang disimpan di cPanel hosting
export const PORTFOLIO_STORAGE_URL = 
  process.env.NEXT_PUBLIC_UPLOAD_URL?.replace('/upload.php', '/portofolio') 
  ?? "https://lumizo.my.id/energia/uploads/portofolio";
```

#### 2.3 Update Next.js Config

File: `next.config.ts`

Tambahkan domain hosting ke `remotePatterns`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lumizo.my.id/energia" }, // TAMBAH
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lumizo.my.id/energia" }],
        destination: "https://lumizo.my.id/energia/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

#### 2.4 Modifikasi PortofolioClient.tsx

File: `app/guru/portofolio/PortofolioClient.tsx`

**Ganti blok upload** (lines 56-71) dengan kode berikut:

```typescript
    // 2. Upload files to cPanel hosting
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('portfolio_id', porto.id);

      try {
        const uploadRes = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL!, {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (uploadData.success) {
          await supabase.from("portofolio_media").insert({
            portofolio_id: porto.id,
            url: uploadData.url,
            tipe: file.type.startsWith("video") ? "video" : "foto",
            nama_file: file.name,
            ukuran_bytes: file.size,
          });
        }
      } catch {
        continue; // Skip failed uploads
      }
    }
```

**Perubahan yang dilakukan:**
- Hapus import `createClient` dari Supabase (jika hanya digunakan untuk storage)
- Ganti `supabase.storage.from("portofolio").upload(...)` dengan `fetch()` ke PHP endpoint
- Ganti `supabase.storage.from("portofolio").getPublicUrl(...)` dengan URL dari response PHP

---

### Step 3: Migrasi Data Lama (Opsional)

#### Opsi A: Biarkan Saja (Recommended)

File yang sudah ada di Supabase Storage **tetap bisa diakses** selama:
- Bucket `portofolio` di Supabase masih aktif
- Tidak ada perubahan RLS policy

**Kelebihan:**
- Tidak perlu migrasi
- Tidak ada downtime
- Semua file lama tetap bisa diakses

**Kekurangan:**
- Storage terbagi di 2 tempat
- URL berbeda antara file lama dan baru

#### Opsi B: Migrasi Batch

Jika ingin semua file di satu tempat:

1. **Download dari Supabase Storage:**
   ```bash
   node backup-portofolio-v2.js
   ```

2. **Upload ke cPanel:**
   ```bash
   # Script manual atau buat script khusus
   ```

3. **Update URL di database:**
   ```sql
   UPDATE portofolio_media
   SET url = REPLACE(url, 
     'https://kdtqjhxkesjbczxfzfqi.supabase.co/storage/v1/object/public/portofolio/',
     'https://lumizo.my.id/energia/uploads/portofolio/'
   )
   WHERE url LIKE '%supabase.co/storage%';
   ```

---

### Step 4: Testing

#### 4.1 Test Upload Baru

1. Login sebagai Guru
2. Buka menu Portofolio
3. Pilih siswa, isi form, upload foto/video
4. Klik "Kirim ke Orang Tua"
5. **Pastikan:**
   - File ter-upload ke cPanel (cek via File Manager)
   - URL tersimpan di `portofolio_media` table
   - Tidak ada error

#### 4.2 Test Tampilan Orang Tua

1. Login sebagai Orang Tua
2. Buka menu Portofolio
3. **Pastikan:**
   - Foto muncul dengan benar
   - Video bisa diputar
   - Lightbox berfungsi

#### 4.3 Test PDF Export

1. Login sebagai Guru
2. Buka Riwayat → pilih portofolio
3. Klik "Export PDF"
4. **Pastikan:**
   - Gambar ter-embed di PDF
   - Tidak ada error "[Gagal memuat]"

#### 4.4 Test File Lama

1. Buka portofolio yang di-upload sebelum migrasi
2. **Pastikan:**
   - File lama masih bisa diakses (dari Supabase Storage)
   - Tampil dengan benar

---

## 🔒 Keamanan

### Yang Sudah Di-handle

| Fitur | Keterangan |
|---|---|
| File type validation | PHP memvalidasi MIME type |
| File size limit | Maks 20MB per file |
| Directory listing disabled | `.htaccess` blok akses direktori |
| CORS | Header yang benar untuk Next.js |

### Yang Perlu Ditambahkan (Opsional)

| Fitur | Keterangan |
|---|---|
| API Key Authentication | Tambahkan header `Authorization` |
| Rate Limiting | Batasi jumlah upload per menit |
| Virus Scanning | Scan file sebelum disimpan |

---

## 🐛 Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Upload gagal | PHP `upload_max_filesize` terlalu kecil | Update di cPanel → PHP Selector |
| CORS error | `.htaccess` belum dikonfigurasi | Cek header `Access-Control-Allow-Origin` |
| Gambar tidak muncul | Domain belum di `remotePatterns` | Tambah di `next.config.ts` |
| 403 Forbidden | Permission folder salah | Set folder ke `755`, file ke `644` |
| File lama tidak muncul | URL Supabase expired | Cek bucket masih aktif |

---

## 📈 Monitoring

### Cek Penggunaan Storage

Di cPanel → **Disk Usage** atau **File Usage**:
- Total ukuran folder `uploads/portofolio/`
- Bandwidth transfer per bulan

### Cek Database

```sql
-- Total file portofolio
SELECT COUNT(*) as total_files, 
       SUM(ukuran_bytes) / 1024 / 1024 / 1024 as total_gb
FROM portofolio_media;

-- URL breakdown (Supabase vs cPanel)
SELECT 
  CASE 
    WHEN url LIKE '%supabase.co%' THEN 'Supabase'
    WHEN url LIKE '%lumizo.my.id/energia%' THEN 'cPanel'
    ELSE 'Other'
  END as source,
  COUNT(*) as count
FROM portofolio_media
GROUP BY source;
```

---

## 🔄 Rollback Plan

Jika ada masalah setelah migrasi:

1. **Revert kode Next.js** ke versi sebelumnya
2. **File baru tetap ada** di cPanel (tidak hilang)
3. **Upload akan kembali ke Supabase Storage**

Tidak ada yang hilang karena:
- File lama masih di Supabase Storage
- Database tidak diubah (hanya URL yang berbeda)
- Kode bisa di-revert dengan mudah

---

## 📝 Checklist

### Sebelum Deploy

- [ ] Buat folder `uploads/portofolio/` di cPanel
- [ ] Upload `upload.php` ke `public_html/uploads/`
- [ ] Upload `.htaccess` ke `public_html/uploads/portofolio/`
- [ ] Konfigurasi PHP di cPanel (upload_max_filesize = 20M)
- [ ] Set permission folder (755) dan file (644)
- [ ] Tambah env variable di `.env.local`
- [ ] Update `lib/constants.ts`
- [ ] Update `next.config.ts`
- [ ] Modifikasi `PortofolioClient.tsx`

### Setelah Deploy

- [ ] Test upload foto baru
- [ ] Test upload video baru
- [ ] Test tampilan di portal ortu
- [ ] Test PDF export
- [ ] Test file lama masih bisa diakses
- [ ] Cek tidak ada error di console

---

## 📚 Referensi

- [PHP File Upload Documentation](https://www.php.net/manual/en/features.file-upload.php)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 📋 Lampiran: File yang Perlu Dibuat di cPanel

### File 1: `public_html/uploads/upload.php`

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Configuration
$uploadDir = __DIR__ . '/portofolio/';
$maxFileSize = 20 * 1024 * 1024; // 20MB
$allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'
];

// Auth check (optional - bisa tambahkan API key)
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$expectedToken = getenv('UPLOAD_API_KEY');
if ($expectedToken && $authHeader !== "Bearer $expectedToken") {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Validate file
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Upload error: ' . $file['error']]);
    exit;
}

if ($file['size'] > $maxFileSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large (max 20MB)']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'File type not allowed: ' . $mime]);
    exit;
}

// Generate path: portfolio_id/timestamp.ext
$portfolioId = $_POST['portfolio_id'] ?? 'unknown';
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$ext = preg_replace('/[^a-zA-Z0-9]/', '', $ext) ?: 'bin';
$filename = time() . '.' . $ext;
$relativePath = $portfolioId . '/' . $filename;
$fullPath = $uploadDir . $relativePath;

// Create directory
if (!is_dir($uploadDir . $portfolioId)) {
    mkdir($uploadDir . $portfolioId, 0755, true);
}

// Move file
if (move_uploaded_file($file['tmp_name'], $fullPath)) {
    $url = 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/portofolio/' . $relativePath;
    echo json_encode([
        'success' => true,
        'url' => $url,
        'path' => $relativePath
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
}
?>
```

### File 2: `public_html/uploads/portofolio/.htaccess`

```apache
# Disable directory listing
Options -Indexes

# Block direct access to PHP files in upload folder
<FilesMatch "\.php$">
    Deny from all
</FilesMatch>

# Allow access to image/video files
<FilesMatch "\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm)$">
    Allow from all
</FilesMatch>

# CORS headers for Next.js
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

---

**Dibuat oleh:** opencode
**Tanggal:** 28 Agustus 2026
