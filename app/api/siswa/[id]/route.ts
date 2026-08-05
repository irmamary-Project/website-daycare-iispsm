import { NextResponse } from "next/server";
import { requireAdmin, withApi, apiError } from "@/lib/auth";
import { SISWA_STATUS } from "@/lib/constants";

export const PATCH = withApi(async (request, context) => {
  const { id } = await context.params!;
  const { supabase } = await requireAdmin();

  const body = await request.json();
  const payload: Record<string, unknown> = {};

  if (typeof body.nama === "string" && body.nama.trim()) payload.nama = body.nama.trim();
  if (body.jenis_kelamin === "L" || body.jenis_kelamin === "P") payload.jenis_kelamin = body.jenis_kelamin;
  if (body.tanggal_lahir !== undefined) payload.tanggal_lahir = body.tanggal_lahir || null;
  if (typeof body.kelas === "string") payload.kelas = body.kelas;
  if (body.ortu_id !== undefined) payload.ortu_id = body.ortu_id || null;
  if (SISWA_STATUS.includes(body.status)) payload.status = body.status;
  if (body.catatan !== undefined) payload.catatan = body.catatan || null;

  if (Object.keys(payload).length === 0) {
    return apiError(400, "Tidak ada data yang diubah");
  }

  const { data, error } = await supabase
    .from("siswa")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return apiError(500, error.message);
  }

  return NextResponse.json({ data });
});

export const DELETE = withApi(async (_request, context) => {
  const { id } = await context.params!;
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("siswa").delete().eq("id", id);

  if (error) {
    return apiError(500, error.message);
  }

  return NextResponse.json({ success: true });
});
