import { NextResponse } from "next/server";
import { requireAdmin, withApi, apiError } from "@/lib/auth";
import { parseCsv } from "@/lib/csv";
import { SISWA_STATUS } from "@/lib/constants";

export const POST = withApi(async (request) => {
  const { supabase } = await requireAdmin();

  const body = await request.json();
  const { csv } = body;

  if (!csv || typeof csv !== "string") {
    return apiError(400, "CSV kosong");
  }

  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return apiError(400, "Tidak ada data yang bisa diimport");
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    if (!row.nama.trim()) {
      skipped++;
      continue;
    }

    // Cari ortu by nama atau phone
    let ortuId: string | null = null;
    if (row.ortu_nama || row.ortu_phone) {
      const { data: ortu } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "ortu")
        .or(`full_name.eq.${row.ortu_nama},phone.eq.${row.ortu_phone}`)
        .limit(1)
        .single();
      ortuId = ortu?.id ?? null;
    }

    const payload = {
      nama: row.nama.trim(),
      jenis_kelamin: row.jenis_kelamin.toUpperCase() === "P" ? "P" : "L",
      tanggal_lahir: row.tanggal_lahir || null,
      kelas: row.kelas || "KB Preschool 1",
      ortu_id: ortuId,
      status: SISWA_STATUS.includes(row.status as (typeof SISWA_STATUS)[number]) ? row.status : "aktif",
      catatan: row.catatan || null,
    };

    const { error } = await supabase.from("siswa").insert(payload);
    if (error) {
      errors.push(`${row.nama}: ${error.message}`);
    } else {
      imported++;
    }
  }

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  });
});
