import { NextResponse } from "next/server";
import { requireAdmin, withApi, apiError } from "@/lib/auth";
import { escapeCsv } from "@/lib/csv";
import type { Siswa } from "@/types";

type SiswaExport = Siswa & {
  ortu?: { full_name: string | null; phone: string | null } | null;
};

export const GET = withApi(async () => {
  const { supabase } = await requireAdmin();

  const { data: siswa } = await supabase
    .from("siswa")
    .select("*, ortu:profiles!siswa_ortu_id_fkey(full_name, phone)")
    .order("nama");

  if (!siswa) {
    return apiError(500, "Gagal mengambil data");
  }

  // Build CSV
  const headers = ["nama", "jenis_kelamin", "tanggal_lahir", "kelas", "ortu_nama", "ortu_phone", "status", "catatan"];
  const rows = siswa.map((s: SiswaExport) => [
    s.nama,
    s.jenis_kelamin ?? "",
    s.tanggal_lahir ?? "",
    s.kelas,
    s.ortu?.full_name ?? "",
    s.ortu?.phone ?? "",
    s.status,
    s.catatan ?? "",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="data-siswa-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
});
