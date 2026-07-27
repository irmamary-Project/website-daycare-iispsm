"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface AbsensiRecord {
  id: string;
  tanggal: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  keterangan: string | null;
  profiles: { full_name: string } | null;
}

export default function AbsensiRiwayatPage() {
  const supabase = createClient();
  const [records, setRecords] = useState<AbsensiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [guruList, setGuruList] = useState<{ id: string; full_name: string }[]>([]);
  const [selectedGuru, setSelectedGuru] = useState<string>("");

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ bulan });

    // Check role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        // Fetch guru list
        const { data: gurus } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "guru");
        setGuruList(gurus ?? []);

        if (selectedGuru) {
          params.set("guru_id", selectedGuru);
        }
      }
    }

    const res = await fetch(`/api/absensi/riwayat?${params.toString()}`);
    const data = await res.json();
    setRecords(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [supabase, bulan, selectedGuru]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Rekap
  const rekap = {
    hadir: records.filter((r) => r.status === "Hadir").length,
    izin: records.filter((r) => r.status === "Izin").length,
    sakit: records.filter((r) => r.status === "Sakit").length,
    alpha: records.filter((r) => r.status === "Alpha").length,
    cuti: records.filter((r) => r.status === "Cuti").length,
  };

  function formatTime(iso: string | null) {
    if (!iso) return "-";
    return format(new Date(iso), "HH:mm", { locale: id });
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Riwayat Absensi</h1>
        <p className="text-sm text-gray-500 mt-1">Rekap kehadiran bulanan</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="label">Bulan</label>
            <input
              type="month"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="input"
            />
          </div>
          {isAdmin && guruList.length > 0 && (
            <div>
              <label className="label">Guru</label>
              <select
                value={selectedGuru}
                onChange={(e) => setSelectedGuru(e.target.value)}
                className="input"
              >
                <option value="">Semua Guru</option>
                {guruList.map((g) => (
                  <option key={g.id} value={g.id}>{g.full_name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Rekap */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Hadir", value: rekap.hadir, color: "bg-green-100 text-green-700" },
          { label: "Izin", value: rekap.izin, color: "bg-yellow-100 text-yellow-700" },
          { label: "Sakit", value: rekap.sakit, color: "bg-red-100 text-red-700" },
          { label: "Alpha", value: rekap.alpha, color: "bg-gray-100 text-gray-600" },
          { label: "Cuti", value: rekap.cuti, color: "bg-blue-100 text-blue-700" },
        ].map((r) => (
          <div key={r.label} className="card text-center">
            <div className={`text-2xl font-bold ${r.color} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1`}>
              {r.value}
            </div>
            <div className="text-xs text-gray-500">{r.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--primary-pale)]">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
              {isAdmin && <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Guru</th>}
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Masuk</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Pulang</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-gray-400">Memuat...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-gray-400">Belum ada data</td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-b border-[var(--primary-pale)] last:border-0">
                  <td className="py-3 px-2">
                    {format(new Date(r.tanggal), "d MMM yyyy", { locale: id })}
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-2 text-gray-600">
                      {r.profiles?.full_name ?? "-"}
                    </td>
                  )}
                  <td className="py-3 px-2">
                    <span className={
                      r.status === "Hadir" ? "badge-hadir" :
                      r.status === "Izin" ? "badge-izin" :
                      r.status === "Sakit" ? "badge-sakit" :
                      r.status === "Cuti" ? "badge-draft" :
                      "badge-draft"
                    }>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{formatTime(r.check_in)}</td>
                  <td className="py-3 px-2 text-gray-600">{formatTime(r.check_out)}</td>
                  <td className="py-3 px-2 text-gray-500 text-xs">{r.keterangan || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
