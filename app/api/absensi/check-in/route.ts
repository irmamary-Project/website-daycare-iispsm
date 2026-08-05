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

  // Cek apakah sudah ada record hari ini
  const { data: existing } = await supabase
    .from("absensi_guru")
    .select("id, check_in")
    .eq("guru_id", user.id)
    .eq("tanggal", today)
    .single();

  if (existing?.check_in) {
    return apiError(400, "Anda sudah check-in hari ini");
  }

  const now = new Date().toISOString();

  if (existing) {
    // Update record yang sudah ada (misal admin sudah input status Izin/Sakit)
    const { error } = await supabase
      .from("absensi_guru")
      .update({
        check_in: now,
        check_in_lat: latitude,
        check_in_lng: longitude,
        status: "Hadir",
      })
      .eq("id", existing.id);

    if (error) {
      return apiError(500, error.message);
    }
  } else {
    // Buat record baru
    const { error } = await supabase.from("absensi_guru").insert({
      guru_id: user.id,
      tanggal: today,
      check_in: now,
      check_in_lat: latitude,
      check_in_lng: longitude,
      status: "Hadir",
    });

    if (error) {
      return apiError(500, error.message);
    }
  }

  return NextResponse.json({ success: true, distance: Math.round(distance) });
});
