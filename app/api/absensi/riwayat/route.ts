import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bulan = searchParams.get("bulan"); // format: YYYY-MM
  const guruId = searchParams.get("guru_id"); // optional, admin only

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let query = supabase
    .from("absensi_guru")
    .select("*, profiles:guru_id(full_name)")
    .order("tanggal", { ascending: false });

  // Filter by bulan
  if (bulan) {
    const startDate = `${bulan}-01`;
    const [year, month] = bulan.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${bulan}-${String(lastDay).padStart(2, "0")}`;
    query = query.gte("tanggal", startDate).lte("tanggal", endDate);
  }

  // Non-admin hanya bisa lihat data sendiri
  if (!isAdmin || !guruId) {
    query = query.eq("guru_id", user.id);
  } else {
    query = query.eq("guru_id", guruId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
