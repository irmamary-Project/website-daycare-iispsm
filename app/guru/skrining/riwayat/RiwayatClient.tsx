"use client";

import { useState } from "react";
import Link from "next/link";

interface Screening {
  id: string;
  siswa_id: string;
  usia_bulan: number;
  kelompok_usia: string;
  tanggal_skrining: string;
  skor_ya: number;
  skor_tidak: number;
  kode_interpretasi: string;
  interpretasi: string;
  jawaban: Record<string, string>;
  catatan_per_soal: Record<string, string>;
  catatan_umum: string;
  created_at: string;
  siswa: {
    nama: string;
    kelas: string;
    tanggal_lahir: string;
  } | null;
}

const interpretationStyles: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  M: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  P: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export default function RiwayatSkriningClient({ screenings }: { screenings: Screening[] }) {
  const [selected, setSelected] = useState<Screening | null>(null);
  const [filter, setFilter] = useState<"all" | "S" | "M" | "P">("all");

  const filtered = screenings.filter((s) => filter === "all" || s.kode_interpretasi === filter);

  const stats = {
    total: screenings.length,
    S: screenings.filter((s) => s.kode_interpretasi === "S").length,
    M: screenings.filter((s) => s.kode_interpretasi === "M").length,
    P: screenings.filter((s) => s.kode_interpretasi === "P").length,
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary">Riwayat Skrining KPSP</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar hasil skrining yang sudah dilakukan</p>
        </div>
        <Link href="/guru/skrining" className="btn-primary text-sm">
          + Skrining Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card text-center">
          <p className="text-3xl font-serif font-bold text-primary">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Skrining</p>
        </div>
        <div className="card text-center bg-green-50 border-green-200">
          <p className="text-3xl font-serif font-bold text-green-600">{stats.S}</p>
          <p className="text-xs text-green-600">Sesuai (S)</p>
        </div>
        <div className="card text-center bg-yellow-50 border-yellow-200">
          <p className="text-3xl font-serif font-bold text-yellow-600">{stats.M}</p>
          <p className="text-xs text-yellow-600">Meragukan (M)</p>
        </div>
        <div className="card text-center bg-red-50 border-red-200">
          <p className="text-3xl font-serif font-bold text-red-600">{stats.P}</p>
          <p className="text-xs text-red-600">Penyimpangan (P)</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "S", "M", "P"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white border border-primary-border text-gray-600 hover:bg-primary-pale"
            }`}
          >
            {f === "all" ? "Semua" : f === "S" ? "Sesuai" : f === "M" ? "Meragukan" : "Penyimpangan"}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-sm">Belum ada data skrining.</p>
          <Link href="/guru/skrining" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
            Mulai Skrining →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const style = interpretationStyles[s.kode_interpretasi] || interpretationStyles.S;
            const createdAt = new Date(s.created_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            });
            return (
              <div
                key={s.id}
                className={`card cursor-pointer hover:shadow-md transition-all ${selected?.id === s.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelected(selected?.id === s.id ? null : s)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {s.siswa?.nama?.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.siswa?.nama}</p>
                      <p className="text-xs text-gray-500">{s.siswa?.kelas} · {s.kelompok_usia} · {createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-serif font-bold text-primary">{s.skor_ya}/{s.skor_ya + s.skor_tidak}</p>
                      <p className="text-xs text-gray-400">Skor Ya</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${style.bg} ${style.text} ${style.border}`}>
                      {s.kode_interpretasi}
                    </span>
                  </div>
                </div>

                {/* Detail expanded */}
                {selected?.id === s.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Interpretasi */}
                    <div className={`p-3 rounded-xl border mb-4 ${style.bg} ${style.border}`}>
                      <p className={`font-semibold ${style.text}`}>Interpretasi: {s.interpretasi}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {s.kode_interpretasi === "S" && "Perkembangan anak sesuai dengan usianya."}
                        {s.kode_interpretasi === "M" && "Perkembangan anak perlu dipantau lebih lanjut. Disarankan pemeriksaan ulang dalam 1-2 bulan."}
                        {s.kode_interpretasi === "P" && "Perkembangan anak terdapat penyimpangan. Segera rujuk ke fasilitas kesehatan."}
                      </p>
                    </div>

                    {/* Detail jawaban */}
                    <h4 className="font-semibold text-primary text-sm mb-3">Detail Jawaban</h4>
                    <div className="space-y-2 mb-4">
                      {Object.entries(s.jawaban).map(([key, val]) => {
                        const [months, id] = key.split("-");
                        return (
                          <div key={key} className="flex items-center gap-3 text-sm">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {id}
                            </span>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${val === "ya" ? "bg-green-500" : "bg-red-500"}`}>
                              {val === "ya" ? "✓" : "✗"}
                            </span>
                            <span className="text-gray-600">{val === "ya" ? "Ya" : "Tidak"}</span>
                            {s.catatan_per_soal[key] && (
                              <span className="text-xs text-gray-400 italic">— {s.catatan_per_soal[key]}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {s.catatan_umum && (
                      <div className="p-3 rounded-xl bg-gray-50 text-sm">
                        <p className="font-semibold text-gray-700 mb-1">Catatan Umum:</p>
                        <p className="text-gray-600">{s.catatan_umum}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
