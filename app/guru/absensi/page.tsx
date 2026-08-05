"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { todayWIB } from "@/lib/date";
import { type GeofenceConfig } from "@/types";

interface AbsensiHariIni {
  id: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

export default function AbsensiPage() {
  const supabase = createClient();
  const [config, setConfig] = useState<GeofenceConfig | null>(null);
  const [absensi, setAbsensi] = useState<AbsensiHariIni | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const today = todayWIB();

  // Hitung jarak Haversine
  function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [configRes, absensiRes] = await Promise.all([
        supabase.from("geofence_config").select("*").limit(1).single(),
        supabase.from("absensi_guru").select("*").eq("tanggal", today).single(),
      ]);
      if (cancelled) return;
      if (configRes.data) setConfig(configRes.data);
      if (absensiRes.data) setAbsensi(absensiRes.data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [supabase, today]);

  // Ambil GPS
  function getGps(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("GPS tidak didukung di browser ini"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          if (err.code === 1) reject(new Error("Izin GPS ditolak. Aktifkan izin lokasi di browser."));
          else if (err.code === 2) reject(new Error("Lokasi tidak tersedia."));
          else reject(new Error("Timeout mengambil lokasi. Coba lagi."));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // Refresh GPS & hitung jarak
  async function refreshGps() {
    setGpsStatus("loading");
    setErrorMsg("");
    try {
      const coords = await getGps();
      setGpsCoords(coords);
      setGpsStatus("ok");
      if (config) {
        const d = haversine(coords.lat, coords.lng, config.latitude, config.longitude);
        setDistance(Math.round(d));
      }
    } catch (e) {
      setGpsStatus("error");
      setErrorMsg(e instanceof Error ? e.message : String(e));
    }
  }

  // Check-in
  async function handleCheckIn() {
    if (!gpsCoords) {
      setErrorMsg("Ambil lokasi GPS terlebih dahulu");
      return;
    }
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/absensi/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: gpsCoords.lat, longitude: gpsCoords.lng }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error);
        return;
      }

      setSuccessMsg(`Check-in berhasil! Jarak ${data.distance}m dari sekolah.`);
      setAbsensi({
        id: "",
        check_in: new Date().toISOString(),
        check_out: null,
        status: "Hadir",
      });
    } catch {
      setErrorMsg("Gagal menghubungi server");
    } finally {
      setActionLoading(false);
    }
  }

  // Check-out
  async function handleCheckOut() {
    if (!gpsCoords) {
      setErrorMsg("Ambil lokasi GPS terlebih dahulu");
      return;
    }
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/absensi/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: gpsCoords.lat, longitude: gpsCoords.lng }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error);
        return;
      }

      setSuccessMsg(`Check-out berhasil! Jarak ${data.distance}m dari sekolah.`);
      setAbsensi((prev) => prev ? { ...prev, check_out: new Date().toISOString() } : prev);
    } catch {
      setErrorMsg("Gagal menghubungi server");
    } finally {
      setActionLoading(false);
    }
  }

  const hasCheckedIn = !!absensi?.check_in;
  const hasCheckedOut = !!absensi?.check_out;
  const withinRadius = distance !== null && config ? distance <= config.radius_meter : false;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Absensi</h1>
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
        </p>
      </div>

      {/* Status Card */}
      <div className="card mb-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3"
            style={{
              background: hasCheckedIn
                ? hasCheckedOut ? "var(--primary-pale)" : "#dcfce7"
                : "var(--primary-pale)",
            }}>
            <span className="text-4xl">
              {hasCheckedOut ? "✅" : hasCheckedIn ? "🔵" : "📍"}
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[var(--primary)]">
            {hasCheckedOut
              ? "Sudah Check-Out"
              : hasCheckedIn
                ? "Sudah Check-In"
                : "Belum Absen"}
          </h2>
          {hasCheckedIn && absensi?.check_in && (
            <p className="text-sm text-gray-500 mt-1">
              Masuk: {format(new Date(absensi.check_in), "HH:mm:ss", { locale: id })}
            </p>
          )}
          {hasCheckedOut && absensi?.check_out && (
            <p className="text-sm text-gray-500 mt-1">
              Pulang: {format(new Date(absensi.check_out), "HH:mm:ss", { locale: id })}
            </p>
          )}
        </div>

        {/* GPS Status */}
        <div className="bg-[var(--cream)] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Lokasi GPS</span>
            <button
              onClick={refreshGps}
              disabled={gpsStatus === "loading"}
              className="text-xs text-[var(--primary-mid)] hover:underline disabled:opacity-50"
            >
              {gpsStatus === "loading" ? "Mencari..." : "🔄 Refresh"}
            </button>
          </div>

          {gpsStatus === "idle" && (
            <p className="text-xs text-gray-400">Tekan &quot;Refresh&quot; untuk mengambil lokasi</p>
          )}
          {gpsStatus === "ok" && gpsCoords && (
            <div className="space-y-1">
              <p className="text-xs text-green-600 font-medium">
                ✓ Lokasi terdeteksi
              </p>
              <p className="text-xs text-gray-400">
                Lat: {gpsCoords.lat.toFixed(6)}, Lng: {gpsCoords.lng.toFixed(6)}
              </p>
              {distance !== null && config && (
                <p className={`text-xs font-medium ${withinRadius ? "text-green-600" : "text-red-500"}`}>
                  Jarak: {distance}m dari {config.nama_lokasi}
                  {withinRadius ? " (dalam radius)" : " (di luar radius)"}
                </p>
              )}
            </div>
          )}
          {gpsStatus === "error" && (
            <p className="text-xs text-red-500">{errorMsg}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!hasCheckedIn && (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || !withinRadius}
              className="btn-primary w-full text-center disabled:opacity-40"
            >
              {actionLoading
                ? "Memproses..."
                : !gpsCoords
                  ? "Ambil Lokasi Dulu"
                  : !withinRadius
                    ? `Di Luar Radius (${distance ?? "?"}m)`
                    : "📍 Check In"}
            </button>
          )}

          {hasCheckedIn && !hasCheckedOut && (
            <button
              onClick={handleCheckOut}
              disabled={actionLoading || !withinRadius}
              className="btn-primary w-full text-center disabled:opacity-40"
              style={{ background: "var(--gold)" }}
            >
              {actionLoading
                ? "Memproses..."
                : !gpsCoords
                  ? "Ambil Lokasi Dulu"
                  : !withinRadius
                    ? `Di Luar Radius (${distance ?? "?"}m)`
                    : "🏠 Check Out"}
            </button>
          )}
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm">
            {successMsg}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="card">
        <h3 className="font-semibold text-[var(--primary)] mb-3">ℹ️ Informasi</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Anda harus berada dalam radius <strong>{config?.radius_meter ?? 10}m</strong> dari sekolah untuk absen</li>
          <li>• GPS harus aktif dan izin lokasi diberikan</li>
          <li>• Check-in dan check-out hanya bisa dilakukan sekali sehari</li>
          <li>• Hubungi admin jika ada kendala teknis</li>
        </ul>
      </div>
    </div>
  );
}
