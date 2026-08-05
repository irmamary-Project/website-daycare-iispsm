import { NextResponse } from "next/server";
import { requireAdmin, withApi, apiError } from "@/lib/auth";
import { ABSENSI_STATUS } from "@/lib/constants";

export const POST = withApi(async (request) => {
  const { supabase } = await requireAdmin();
  const body = await request.json();
  const { guru_id, tanggal, status, keterangan } = body;

  if (!guru_id || !tanggal || !status) {
    return apiError(400, "guru_id, tanggal, status wajib diisi");
  }

  if (!ABSENSI_STATUS.includes(status)) {
    return apiError(400, "Status tidak valid");
  }

  // Cek apakah sudah ada record
  const { data: existing } = await supabase
    .from("absensi_guru")
    .select("id, check_in")
    .eq("guru_id", guru_id)
    .eq("tanggal", tanggal)
    .single();

  if (existing) {
    // Update
    const updateData: Record<string, unknown> = { status };
    if (keterangan !== undefined) updateData.keterangan = keterangan;

    // Kalau status Izin/Sakit/Alpha/Cuti, reset check_in/out
    if (status !== "Hadir") {
      updateData.check_in = null;
      updateData.check_out = null;
      updateData.check_in_lat = null;
      updateData.check_in_lng = null;
      updateData.check_out_lat = null;
      updateData.check_out_lng = null;
    }

    const { error } = await supabase
      .from("absensi_guru")
      .update(updateData)
      .eq("id", existing.id);

    if (error) {
      return apiError(500, error.message);
    }
  } else {
    // Insert baru
    const insertData: Record<string, unknown> = {
      guru_id,
      tanggal,
      status,
      keterangan: keterangan || null,
    };

    const { error } = await supabase.from("absensi_guru").insert(insertData);

    if (error) {
      return apiError(500, error.message);
    }
  }

  return NextResponse.json({ success: true });
});
