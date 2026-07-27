"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FITRAH_LIST, CAPAIAN_OPTIONS, FitrahPenilaian, CapaianType } from "@/types";

const currentYear = new Date().getFullYear();
const PERIODES = ["Q1", "Q2", "Q3", "Q4"].map(q => `${q}-${currentYear}`);

const DEFAULT_FITRAH: FitrahPenilaian = { capaian: "BSH", catatan: "" };

export default function LaporanClient({ siswaList, guruId }: { siswaList: any[]; guruId: string }) {
  const supabase = createClient();
  const [siswaId, setSiswaId] = useState("");
  const [periode, setPeriode] = useState(PERIODES[0]);
  const [fitrahData, setFitrahData] = useState<Record<string, FitrahPenilaian>>(
    Object.fromEntries(FITRAH_LIST.map(f => [f.key, { ...DEFAULT_FITRAH }]))
  );
  const [catatanUmum, setCatatanUmum] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function updateFitrah(key: string, field: keyof FitrahPenilaian, value: string) {
    setFitrahData(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleSave(kirim: boolean) {
    if (!siswaId) return setMsg("Pilih siswa terlebih dahulu.");
    setSaving(true); setMsg("");

    const payload: any = {
      siswa_id: siswaId, guru_id: guruId,
      periode, tahun: currentYear,
      catatan_umum: catatanUmum, rekomendasi,
      status: kirim ? "terkirim" : "draft",
      dikirim_at: kirim ? new Date().toISOString() : null,
    };
    FITRAH_LIST.forEach(f => { payload[`fitrah_${f.key}`] = fitrahData[f.key]; });

    const { data, error } = await supabase.from("laporan_triwulan")
      .upsert(payload, { onConflict: "siswa_id,periode" }).select().single();

    if (error) { setMsg("Gagal: " + error.message); setSaving(false); return; }

    if (kirim && data) {
      const { data: siswa } = await supabase.from("siswa").select("ortu_id, nama").eq("id", siswaId).single();
      if (siswa?.ortu_id) {
        await supabase.from("notifikasi").insert({
          user_id: siswa.ortu_id, tipe: "laporan",
          judul: `Laporan ${periode} – ${siswa.nama}`,
          pesan: `Laporan perkembangan ${periode} untuk ${siswa.nama} telah tersedia.`,
          ref_id: data.id,
        });
      }
    }
    setMsg(kirim ? "✅ Laporan berhasil dikirim ke orang tua!" : "💾 Draft laporan tersimpan.");
    setSaving(false);
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-2">📋 Laporan 3 Bulanan</h1>
      <p className="text-sm text-gray-500 mb-8">Penilaian perkembangan 8 fitrah per triwulan</p>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm mb-6 ${msg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : msg.startsWith("💾") ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {msg}
        </div>
      )}

      <div className="card mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="label">Pilih Siswa</label>
          <select className="input" value={siswaId} onChange={e => setSiswaId(e.target.value)}>
            <option value="">– Pilih Siswa –</option>
            {siswaList.map(s => <option key={s.id} value={s.id}>{s.nama} – {s.kelas}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Periode</label>
          <select className="input" value={periode} onChange={e => setPeriode(e.target.value)}>
            {PERIODES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {FITRAH_LIST.map(f => (
          <div key={f.key} className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{f.icon}</span>
              <h3 className="font-semibold text-[var(--primary)]">Fitrah {f.label}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Capaian</label>
                <select className="input" value={fitrahData[f.key]?.capaian}
                  onChange={e => updateFitrah(f.key, "capaian", e.target.value as CapaianType)}>
                  {CAPAIAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="label">Catatan Perkembangan</label>
                <textarea className="input" rows={2}
                  value={fitrahData[f.key]?.catatan}
                  onChange={e => updateFitrah(f.key, "catatan", e.target.value)}
                  placeholder={`Tuliskan capaian fitrah ${f.label.toLowerCase()}...`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-[var(--primary)] mb-4">📝 Ringkasan & Rekomendasi</h3>
        <div className="space-y-3">
          <div>
            <label className="label">Catatan Umum</label>
            <textarea className="input" rows={3} value={catatanUmum} onChange={e => setCatatanUmum(e.target.value)}
              placeholder="Ringkasan perkembangan umum anak selama periode ini..." />
          </div>
          <div>
            <label className="label">Rekomendasi untuk Orang Tua</label>
            <textarea className="input" rows={3} value={rekomendasi} onChange={e => setRekomendasi(e.target.value)}
              placeholder="Rekomendasi kegiatan atau stimulasi yang bisa dilakukan di rumah..." />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline">💾 Simpan Draft</button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-1">
          {saving ? "Menyimpan..." : "📨 Finalisasi & Kirim ke Orang Tua →"}
        </button>
      </div>
    </div>
  );
}
