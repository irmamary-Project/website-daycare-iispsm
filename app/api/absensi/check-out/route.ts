import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { todayWIB } from "@/lib/date";

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { latitude, longitude } = body;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ error: "Lokasi tidak valid" }, { status: 400 });
  }

  // Ambil config geofence
  const { data: config } = await supabase
    .from("geofence_config")
    .select("latitude, longitude, radius_meter")
    .limit(1)
    .single();

  if (!config) {
    return NextResponse.json({ error: "Geofence belum dikonfigurasi" }, { status: 500 });
  }

  // Validasi jarak server-side
  const distance = haversineDistance(latitude, longitude, config.latitude, config.longitude);
  if (distance > config.radius_meter) {
    return NextResponse.json(
      { error: `Anda berada ${Math.round(distance)}m dari lokasi sekolah. Maksimal ${config.radius_meter}m.` },
      { status: 403 }
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
    return NextResponse.json({ error: "Anda belum check-in hari ini" }, { status: 400 });
  }

  if (existing.check_out) {
    return NextResponse.json({ error: "Anda sudah check-out hari ini" }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, distance: Math.round(distance) });
}
