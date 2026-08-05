# Supabase — Database Management

Semua skema database dan **Row Level Security (RLS)** di-version-control di folder ini, agar
setiap perubahan bisa di-*review* seperti kode dan bisa di-reproduce di lingkungan mana pun.

## Struktur

| File | Tujuan |
|------|--------|
| `schema.sql` | **Snapshot lengkap & idempotent** skema saat stabil. Source of truth untuk merekonstruksi DB baru. |
| `migrations/*.sql` | Perubahan bertahap (satu file per batch). Berlaku berurutan. |
| `README.md` | (file ini) panduan kerja. |

## Aturan wajib

1. **Setiap tabel WAJIB mengaktifkan RLS** (`alter table ... enable row level security`).
   Anon key Supabase itu **publik** (terekspos di bundle JS browser), jadi RLS adalah satu-satunya
   benteng yang mencegah orang membaca/menulis data orang lain.
2. Tab apapun yang berisi data sensitif anak (mis. `kpsp_screenings`) harus punya policy yang ketat
   (admin/guru vs ortu-scoped).
3. Policy memakai helper `public.get_user_role()` (SECURITY DEFINER) — **jangan** query `profiles`
   langsung di dalam policy (menyebabkan infinite recursion).
4. Jangan commit `.env.local` / key asli. Key ada di Vercel & `.env.local` (gitignored).

## Cara menambah perubahan (migration)

1. Buat file baru: `supabase/migrations/YYYYMMDD_nama_perubahan.sql`
2. Tulis SQL (idempotent: pakai `CREATE OR REPLACE`, `DROP POLICY IF EXISTS`, `ON CONFLICT`, dll).
3. Update `schema.sql` agar snapshot tetap sinkron dengan state terakhir.
4. Commit `migrations/*.sql` + `schema.sql` bersama perubahan kode yang terkait.

## Cara mengaplikasikan ke Supabase

Ada dua opsi:

### Opsi A — Supabase CLI (disarankan untuk migration berurutan)

```bash
# link project dulu (satu kali)
supabase link --project-ref <project-ref>

# terapkan semua migration yang belum dijalankan
supabase db push

# atau cek dulu diff tanpa apply
supabase db push --dry-run
```

### Opsi B — Dashboard / SQL Editor

1. Buka https://supabase.com/dashboard → project → **SQL Editor**.
2. Untuk snapshot penuh: tempel isi `schema.sql`, lalu **Run**.
3. Untuk migration tambahan: tempel isi masing-masing file `migrations/*.sql`, lalu **Run**.

> Pastikan snapshot/migration **idempotent** (aman dijalankan berulang) sebelum menempel utuh.

## Regenerasi snapshot dari DB live

Jika DB live sudah berubah selama develop dan kamu ingin sinkron ulang `schema.sql`:

```bash
# Membuat dump seluruh schema (partial/structure-only)
supabase db dump --linked --schema public
```

Kemudian rapikan manual agar `schema.sql` ringkas keterbacaan serta idempotent.
`kpsp_screenings`, `geofence_config`, dan `absensi_guru` disertakan agar snapshot lengkap.

## Catatan produksi

- Bagian **SAMPLE DATA** di `schema.sql` bersifat opsional/testing — pastikan tidak ada data
  dummy yang masuk ke produksi.
- CCTV stream URLs (`CCTV_STREAM_URL_1/2`) bersifat server-only, dipegang Vercel + `.env.local`,
  tidak pernah di-commit.