"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { FITRAH_LIST, type Siswa } from "@/types";
import { todayWIB } from "@/lib/date";

export default function PortofolioClient({ siswaList, guruId }: { siswaList: Pick<Siswa, "id" | "nama" | "kelas">[]; guruId: string }) {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const today = todayWIB();

  const [siswaId, setSiswaId] = useState("");
  const [tanggal, setTanggal] = useState(today);
  const [sesi, setSesi] = useState("Full Day");
  const [fitrah, setFitrah] = useState<string[]>([]);
  const [observasi, setObservasi] = useState("");
  const [catatanOrtu, setCatatanOrtu] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function toggleFitrah(key: string) {
    setFitrah(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter(f => {
      if (f.size > 20 * 1024 * 1024) return false;
      if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) return false;
      return true;
    });
    if (valid.length < selected.length) setMsg("⚠️ Beberapa file dilewati (ukuran > 20MB atau format tidak didukung).");
    setFiles(prev => [...prev, ...valid]);
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave(kirim: boolean) {
    if (!siswaId) return setMsg("Pilih siswa terlebih dahulu.");
    setSaving(true); setMsg("");

    // 1. Insert portofolio record
    const { data: porto, error } = await supabase.from("portofolio").insert({
      siswa_id: siswaId, guru_id: guruId, tanggal, sesi,
      fitrah, observasi, catatan_ortu: catatanOrtu,
      status: kirim ? "terkirim" : "draft",
      dikirim_at: kirim ? new Date().toISOString() : null,
    }).select().single();

    if (error) { setMsg("Gagal: " + error.message); setSaving(false); return; }

    // 2. Upload files to Supabase Storage
    for (const file of files) {
      const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "bin";
      const path = `${porto.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("portofolio").upload(path, file);
      if (uploadErr) continue;
      const { data: urlData } = supabase.storage.from("portofolio").getPublicUrl(path);
      await supabase.from("portofolio_media").insert({
        portofolio_id: porto.id,
        url: urlData.publicUrl,
        tipe: file.type.startsWith("video") ? "video" : "foto",
        nama_file: file.name,
        ukuran_bytes: file.size,
      });
    }

    // 3. Notifikasi ortu jika dikirim
    if (kirim) {
      const { data: siswa } = await supabase.from("siswa").select("ortu_id, nama").eq("id", siswaId).single();
      if (siswa?.ortu_id) {
        await supabase.from("notifikasi").insert({
          user_id: siswa.ortu_id, tipe: "portofolio",
          judul: `Portofolio Baru – ${siswa.nama}`,
          pesan: `Portofolio kegiatan ${siswa.nama} tanggal ${tanggal} telah dikirim.`,
          ref_id: porto.id,
        });
      }
    }

    setMsg(kirim ? "✅ Portofolio berhasil dikirim ke orang tua!" : "💾 Draft portofolio tersimpan.");
    setFiles([]); setObservasi(""); setCatatanOrtu(""); setFitrah([]);
    setSaving(false);
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-2">📷 Input Portofolio</h1>
      <p className="text-sm text-gray-500 mb-8">Upload foto & video kegiatan harian siswa</p>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm mb-6 ${msg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : msg.startsWith("💾") ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
          {msg}
        </div>
      )}

      {/* Header */}
      <div className="card mb-5 grid grid-cols-3 gap-4">
        <div className="col-span-3 sm:col-span-1">
          <label className="label">Pilih Siswa</label>
          <select className="input" value={siswaId} onChange={e => setSiswaId(e.target.value)}>
            <option value="">– Pilih Siswa –</option>
            {siswaList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tanggal</label>
          <input type="date" className="input" value={tanggal} onChange={e => setTanggal(e.target.value)} />
        </div>
        <div>
          <label className="label">Sesi</label>
          <select className="input" value={sesi} onChange={e => setSesi(e.target.value)}>
            {["Pagi","Siang","Full Day"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Fitrah */}
      <div className="card mb-5">
        <h3 className="font-semibold text-[var(--primary)] mb-4">🌱 Fitrah yang Distimulasi</h3>
        <div className="grid grid-cols-4 gap-2">
          {FITRAH_LIST.map(f => (
            <button key={f.key} type="button" onClick={() => toggleFitrah(f.key)}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                fitrah.includes(f.key) ? "border-[var(--primary)] bg-[var(--primary-pale)] text-[var(--primary)]" : "border-[var(--primary-border)] text-gray-500 hover:border-[var(--primary-mid)]"
              }`}>
              <span className="text-xl">{f.icon}</span>{f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload */}
      <div className="card mb-5">
        <h3 className="font-semibold text-[var(--primary)] mb-4">📁 Upload Foto / Video</h3>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[var(--primary-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--primary-mid)] hover:bg-[var(--primary-pale)] transition-all"
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm font-medium text-gray-600">Klik untuk memilih file</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 · Maks 20MB per file</p>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
        </div>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-[var(--cream)] rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>{f.type.startsWith("video") ? "🎬" : "🖼️"}</span>
                  <span className="text-sm text-gray-700 truncate max-w-xs">{f.name}</span>
                  <span className="text-xs text-gray-400">({(f.size/1024/1024).toFixed(1)} MB)</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catatan */}
      <div className="card mb-6">
        <h3 className="font-semibold text-[var(--primary)] mb-4">📝 Catatan</h3>
        <div className="space-y-3">
          <div>
            <label className="label">Observasi Guru</label>
            <textarea className="input" rows={3} value={observasi} onChange={e => setObservasi(e.target.value)}
              placeholder="Tuliskan observasi perkembangan hari ini..." />
          </div>
          <div>
            <label className="label">Catatan untuk Orang Tua</label>
            <textarea className="input" rows={2} value={catatanOrtu} onChange={e => setCatatanOrtu(e.target.value)}
              placeholder="Pesan untuk orang tua (tampil di portal orang tua)..." />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline">💾 Simpan Draft</button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-1">
          {saving ? "Mengupload..." : "📨 Kirim ke Orang Tua →"}
        </button>
      </div>
    </div>
  );
}
