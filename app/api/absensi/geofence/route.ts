import { NextResponse } from "next/server";
import { requireAdmin, withApi, apiError } from "@/lib/auth";

export const PUT = withApi(async (request) => {
  const { supabase } = await requireAdmin();
  const body = await request.json();
  const { latitude, longitude, radius_meter, nama_lokasi } = body;

  // Ambil config yang ada
  const { data: existing } = await supabase
    .from("geofence_config")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    return apiError(404, "Config not found");
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
    return apiError(500, error.message);
  }

  return NextResponse.json(data);
});
