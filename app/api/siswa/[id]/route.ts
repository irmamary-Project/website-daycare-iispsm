import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_STATUS = ["aktif", "cuti", "alumni", "pending", "ditolak"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const payload: Record<string, unknown> = {};

  if (typeof body.nama === "string" && body.nama.trim()) payload.nama = body.nama.trim();
  if (body.jenis_kelamin === "L" || body.jenis_kelamin === "P") payload.jenis_kelamin = body.jenis_kelamin;
  if (body.tanggal_lahir !== undefined) payload.tanggal_lahir = body.tanggal_lahir || null;
  if (typeof body.kelas === "string") payload.kelas = body.kelas;
  if (body.ortu_id !== undefined) payload.ortu_id = body.ortu_id || null;
  if (VALID_STATUS.includes(body.status)) payload.status = body.status;
  if (body.catatan !== undefined) payload.catatan = body.catatan || null;

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("siswa")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("siswa").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
