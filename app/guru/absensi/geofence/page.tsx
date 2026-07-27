"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface GeofenceConfig {
  id: string;
  nama_lokasi: string;
  latitude: number;
  longitude: number;
  radius_meter: number;
}

export default function GeofencePage() {
  const supabase = createClient();
  const [config, setConfig] = useState<GeofenceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Form
  const [nama, setNama] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("geofence_config")
        .select("*")
        .limit(1)
        .single();

      if (data) {
        setConfig(data);
        setNama(data.nama_lokasi);
        setLat(String(data.latitude));
        setLng(String(data.longitude));
        setRadius(String(data.radius_meter));
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleSave() {
    setSaving(true);
    setMsg("");

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseInt(radius);

    if (isNaN(latNum) || isNaN(lngNum) || isNaN(radiusNum) || radiusNum <= 0) {
      setMsg("Format angka tidak valid");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/absensi/geofence", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lokasi: nama,
          latitude: latNum,
          longitude: lngNum,
          radius_meter: radiusNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error);
        return;
      }
      setConfig(data);
      setMsg("Berhasil disimpan!");
    } catch {
      setMsg("Gagal menghubungi server");
    } finally {
      setSaving(false);
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setMsg("GPS tidak didukung");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
        setMsg("Lokasi GPS terisi!");
      },
      () => setMsg("Gagal mengambil lokasi GPS"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

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
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Atur Geofence</h1>
        <p className="text-sm text-gray-500 mt-1">Konfigurasi lokasi sekolah & radius absensi</p>
      </div>

      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="label">Nama Lokasi</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="input"
                placeholder="-7.654898"
              />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="input"
                placeholder="111.311512"
              />
            </div>
          </div>

          <button onClick={getCurrentLocation} className="btn-outline w-full text-sm">
            📍 Ambil Lokasi GPS Sekarang
          </button>

          <div>
            <label className="label">Radius (meter)</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="input"
              min="1"
            />
            <p className="text-xs text-gray-400 mt-1">Guru harus dalam radius ini untuk bisa absen</p>
          </div>
        </div>

        {msg && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${msg.includes("Gagal") || msg.includes("valid") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {msg}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full mt-4"
        >
          {saving ? "Menyimpan..." : "💾 Simpan Pengaturan"}
        </button>
      </div>

      {/* Info */}
      {config && (
        <div className="card mt-4">
          <h3 className="font-semibold text-[var(--primary)] mb-2">Konfigurasi Saat Ini</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Lokasi: {config.nama_lokasi}</p>
            <p>Koordinat: {config.latitude}, {config.longitude}</p>
            <p>Radius: {config.radius_meter}m</p>
          </div>
        </div>
      )}
    </div>
  );
}
