import type { SupabaseClient } from "@supabase/supabase-js";

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface GeofenceConfig {
  id?: string;
  latitude: number;
  longitude: number;
  radius_meter: number;
  nama_lokasi?: string;
}

export async function getGeofenceConfig(
  supabase: SupabaseClient
): Promise<GeofenceConfig | null> {
  const { data } = await supabase
    .from("geofence_config")
    .select("*")
    .limit(1)
    .single();
  return data;
}
