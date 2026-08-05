-- Tambah nilai status baru untuk workflow approval pendaftaran
alter table public.siswa
  drop constraint if exists siswa_status_check;

alter table public.siswa
  add constraint siswa_status_check
    check (status in ('aktif', 'cuti', 'alumni', 'pending', 'ditolak'));
