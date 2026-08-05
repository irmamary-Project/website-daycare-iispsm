import { NextResponse } from "next/server";
import { getUser, withApi, apiError } from "@/lib/auth";

export const GET = withApi(async (request) => {
  const { supabase, user } = await getUser();

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
    return apiError(500, error.message);
  }

  return NextResponse.json(data);
});
