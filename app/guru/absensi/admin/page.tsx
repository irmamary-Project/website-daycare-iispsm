"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { todayWIB } from "@/lib/date";

interface GuruAbsensi {
  guru_id: string;
  full_name: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  keterangan: string | null;
}

interface GuruProfile {
  id: string;
  full_name: string;
}

export default function AdminAbsensiPage() {
  const supabase = createClient();
  const [records, setRecords] = useState<GuruAbsensi[]>([]);
  const [allGuru, setAllGuru] = useState<GuruProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => todayWIB());
  const [showModal, setShowModal] = useState(false);
  const [formGuru, setFormGuru] = useState("");
  const [formStatus, setFormStatus] = useState("Izin");
  const [formKeterangan, setFormKeterangan] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch all guru
    const { data: gurus } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "guru");
    setAllGuru(gurus ?? []);

    // Fetch absensi untuk tanggal yang dipilih
    const { data } = await supabase
      .from("absensi_guru")
      .select("guru_id, check_in, check_out, status, keterangan, profiles:guru_id(full_name)")
      .eq("tanggal", selectedDate);

    // Merge: tampilkan semua guru, yang belum ada record tampilkan status "Belum"
    const absensiMap = new Map<string, any>();
    data?.forEach((r: any) => {
      absensiMap.set(r.guru_id, r);
    });

    const merged: GuruAbsensi[] = (gurus ?? []).map((g) => {
      const abs = absensiMap.get(g.id);
      return {
        guru_id: g.id,
        full_name: g.full_name,
        check_in: abs?.check_in ?? null,
        check_out: abs?.check_out ?? null,
        status: abs?.status ?? "Belum",
        keterangan: abs?.keterangan ?? null,
      };
    });

    setRecords(merged);
    setLoading(false);
  }, [supabase, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleInputManual() {
    if (!formGuru || !formStatus) return;
    setFormLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/absensi/admin/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guru_id: formGuru,
          tanggal: selectedDate,
          status: formStatus,
          keterangan: formKeterangan || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error);
        return;
      }
      setMsg("Berhasil disimpan!");
      setShowModal(false);
      setFormGuru("");
      setFormStatus("Izin");
      setFormKeterangan("");
      fetchData();
    } catch {
      setMsg("Gagal menghubungi server");
    } finally {
      setFormLoading(false);
    }
  }

  const rekap = {
    hadir: records.filter((r) => r.status === "Hadir").length,
    izin: records.filter((r) => r.status === "Izin").length,
    sakit: records.filter((r) => r.status === "Sakit").length,
    alpha: records.filter((r) => r.status === "Alpha").length,
    belum: records.filter((r) => r.status === "Belum").length,
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Admin Absensi</h1>
          <p className="text-sm text-gray-500 mt-1">Rekap kehadiran semua guru</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Input Manual
          </button>
        </div>
      </div>

      {/* Rekap */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Hadir", value: rekap.hadir, color: "text-green-600", bg: "bg-green-100" },
          { label: "Izin", value: rekap.izin, color: "text-yellow-600", bg: "bg-yellow-100" },
          { label: "Sakit", value: rekap.sakit, color: "text-red-600", bg: "bg-red-100" },
          { label: "Alpha", value: rekap.alpha, color: "text-gray-600", bg: "bg-gray-100" },
          { label: "Belum Absen", value: rekap.belum, color: "text-orange-600", bg: "bg-orange-100" },
        ].map((r) => (
          <div key={r.label} className="card text-center">
            <div className={`text-2xl font-bold ${r.color} ${r.bg} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1`}>
              {r.value}
            </div>
            <div className="text-xs text-gray-500">{r.label}</div>
          </div>
        ))}
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.includes("Gagal") || msg.includes("Forbidden") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--primary-pale)]">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Guru</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Check In</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">Memuat...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">Tidak ada data guru</td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.guru_id} className="border-b border-[var(--primary-pale)] last:border-0">
                  <td className="py-3 px-2 font-medium text-gray-800">{r.full_name}</td>
                  <td className="py-3 px-2">
                    <span className={
                      r.status === "Hadir" ? "badge-hadir" :
                      r.status === "Izin" ? "badge-izin" :
                      r.status === "Sakit" ? "badge-sakit" :
                      r.status === "Alpha" ? "badge-draft" :
                      r.status === "Cuti" ? "badge-draft" :
                      "badge-draft"
                    }>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {r.check_in
                      ? format(new Date(r.check_in), "HH:mm", { locale: id })
                      : "-"}
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {r.check_out
                      ? format(new Date(r.check_out), "HH:mm", { locale: id })
                      : "-"}
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-xs">{r.keterangan || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Input Manual */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="font-serif text-lg font-bold text-[var(--primary)] mb-4">Input Absensi Manual</h3>

            <div className="space-y-4">
              <div>
                <label className="label">Guru</label>
                <select value={formGuru} onChange={(e) => setFormGuru(e.target.value)} className="input">
                  <option value="">Pilih guru...</option>
                  {allGuru.map((g) => (
                    <option key={g.id} value={g.id}>{g.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Tanggal</label>
                <input type="date" value={selectedDate} disabled className="input opacity-60" />
              </div>

              <div>
                <label className="label">Status</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="input">
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Hadir">Hadir</option>
                </select>
              </div>

              <div>
                <label className="label">Keterangan (opsional)</label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="input"
                  placeholder="Contoh: Izin keluarga"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1">Batal</button>
              <button
                onClick={handleInputManual}
                disabled={formLoading || !formGuru}
                className="btn-primary flex-1"
              >
                {formLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
