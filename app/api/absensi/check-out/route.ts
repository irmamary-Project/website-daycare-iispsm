import { NextResponse } from "next/server";
import { getUser, withApi, apiError } from "@/lib/auth";
import { haversineDistance, getGeofenceConfig } from "@/lib/geo";
import { todayWIB } from "@/lib/date";

export const POST = withApi(async (request) => {
  const { supabase, user } = await getUser();

  const body = await request.json();
  const { latitude, longitude } = body;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return apiError(400, "Lokasi tidak valid");
  }

  const config = await getGeofenceConfig(supabase);

  if (!config) {
    return apiError(503, "Geofence belum dikonfigurasi");
  }

  // Validasi jarak server-side
  const distance = haversineDistance(latitude, longitude, config.latitude, config.longitude);
  if (distance > config.radius_meter) {
    return apiError(
      400,
      `Anda berada ${Math.round(distance)}m dari lokasi sekolah. Maksimal ${config.radius_meter}m.`
    );
  }

  const today = todayWIB();

  // Cek record hari ini
  const { data: existing } = await supabase
    .from("absensi_guru")
    .select("id, check_in, check_out")
    .eq("guru_id", user.id)
    .eq("tanggal", today)
    .single();

  if (!existing?.check_in) {
    return apiError(400, "Anda belum check-in hari ini");
  }

  if (existing.check_out) {
    return apiError(400, "Anda sudah check-out hari ini");
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("absensi_guru")
    .update({
      check_out: now,
      check_out_lat: latitude,
      check_out_lng: longitude,
    })
    .eq("id", existing.id);

  if (error) {
    return apiError(500, error.message);
  }

  return NextResponse.json({ success: true, distance: Math.round(distance) });
});
