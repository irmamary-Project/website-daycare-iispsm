import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
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
  const { latitude, longitude, radius_meter, nama_lokasi } = body;

  // Ambil config yang ada
  const { data: existing } = await supabase
    .from("geofence_config")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Config not found" }, { status: 500 });
  }

  const updateData: Record<string, unknown> = {};
  if (typeof latitude === "number") updateData.latitude = latitude;
  if (typeof longitude === "number") updateData.longitude = longitude;
  if (typeof radius_meter === "number" && radius_meter > 0) updateData.radius_meter = radius_meter;
  if (typeof nama_lokasi === "string" && nama_lokasi.trim()) updateData.nama_lokasi = nama_lokasi.trim();

  const { data, error } = await supabase
    .from("geofence_config")
    .update(updateData)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
