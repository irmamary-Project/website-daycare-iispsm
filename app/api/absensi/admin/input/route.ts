import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cek admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { guru_id, tanggal, status, keterangan } = body;

  if (!guru_id || !tanggal || !status) {
    return NextResponse.json({ error: "guru_id, tanggal, status wajib diisi" }, { status: 400 });
  }

  if (!["Hadir", "Izin", "Sakit", "Alpha", "Cuti"].includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
