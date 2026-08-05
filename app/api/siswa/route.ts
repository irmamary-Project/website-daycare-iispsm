import { NextResponse } from "next/server";
import { requireAdmin, withApi, apiError } from "@/lib/auth";
import { SISWA_STATUS } from "@/lib/constants";

export const POST = withApi(async (request) => {
  const { supabase } = await requireAdmin();
  const body = await request.json();
  const {
    nama, jenis_kelamin, tanggal_lahir, kelas,
    ortu_id, status, catatan,
  } = body;

  if (!nama || typeof nama !== "string" || !nama.trim()) {
    return apiError(400, "Nama siswa wajib diisi");
  }
  if (!kelas || typeof kelas !== "string") {
    return apiError(400, "Kelas wajib diisi");
  }

  const { data, error } = await supabase
    .from("siswa")
    .insert({
      nama: nama.trim(),
      jenis_kelamin: jenis_kelamin === "P" ? "P" : "L",
      tanggal_lahir: tanggal_lahir || null,
      kelas,
      ortu_id: ortu_id || null,
      status: SISWA_STATUS.includes(status) ? status : "aktif",
      catatan: catatan || null,
    })
    .select()
    .single();

  if (error) {
    return apiError(500, error.message);
  }

  return NextResponse.json({ data }, { status: 201 });
});
