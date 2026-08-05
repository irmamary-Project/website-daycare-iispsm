import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_STATUS = ["aktif", "cuti", "alumni", "pending", "ditolak"];

export async function POST(request: Request) {
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
  const {
    nama, jenis_kelamin, tanggal_lahir, kelas,
    ortu_id, status, catatan,
  } = body;

  if (!nama || typeof nama !== "string" || !nama.trim()) {
    return NextResponse.json({ error: "Nama siswa wajib diisi" }, { status: 400 });
  }
  if (!kelas || typeof kelas !== "string") {
    return NextResponse.json({ error: "Kelas wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("siswa")
    .insert({
      nama: nama.trim(),
      jenis_kelamin: jenis_kelamin === "P" ? "P" : "L",
      tanggal_lahir: tanggal_lahir || null,
      kelas,
      ortu_id: ortu_id || null,
      status: VALID_STATUS.includes(status) ? status : "aktif",
      catatan: catatan || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
