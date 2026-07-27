"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pengumuman, KELAS_LIST } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PengumumanClient({ list: initial, guruId }: { list: Pengumuman[]; guruId: string }) {
  const supabase = createClient();
  const [list, setList] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [target, setTarget] = useState("semua");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSend() {
    if (!judul.trim() || !isi.trim()) return setMsg("Judul dan isi wajib diisi.");
    setSaving(true); setMsg("");

    const { data, error } = await supabase.from("pengumuman").insert({
      guru_id: guruId, judul, isi, target_kelas: target, status: "terkirim",
    }).select().single();

    if (error) { setMsg("Gagal: " + error.message); setSaving(false); return; }

    // Notifikasi ke semua ortu
    const { data: ortuList } = await supabase.from("profiles").select("id").eq("role", "ortu");
    if (ortuList && ortuList.length > 0) {
      await supabase.from("notifikasi").insert(
        ortuList.map(o => ({
          user_id: o.id, tipe: "pengumuman",
          judul, pesan: isi.slice(0, 120), ref_id: data.id,
        }))
      );
    }

    setList(prev => [data, ...prev]);
    setJudul(""); setIsi(""); setTarget("semua"); setShowForm(false);
    setMsg("✅ Pengumuman berhasil dikirim!");
    setSaving(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">📣 Pengumuman</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kirim informasi ke orang tua siswa</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "× Tutup" : "+ Buat Pengumuman"}
        </button>
      </div>

      {msg && <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl px-4 py-3 text-sm mb-5">{msg}</div>}

      {showForm && (
        <div className="card mb-6 border-[var(--primary)]">
          <h3 className="font-semibold text-[var(--primary)] mb-4">📝 Buat Pengumuman Baru</h3>
          <div className="space-y-3">
            <div>
              <label className="label">Judul</label>
              <input className="input" value={judul} onChange={e => setJudul(e.target.value)} placeholder="Judul pengumuman..." />
            </div>
            <div>
              <label className="label">Target Penerima</label>
              <select className="input" value={target} onChange={e => setTarget(e.target.value)}>
                <option value="semua">Semua Orang Tua</option>
                {KELAS_LIST.map(k => <option key={k} value={k}>Kelas {k}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Isi Pengumuman</label>
              <textarea className="input" rows={4} value={isi} onChange={e => setIsi(e.target.value)}
                placeholder="Tulis isi pengumuman di sini..." />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSend} disabled={saving} className="btn-primary">
                {saving ? "Mengirim..." : "📨 Kirim Sekarang"}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline">Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">{p.judul}</div>
                <div className="text-sm text-gray-600 mb-2 leading-relaxed">{p.isi}</div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>🎯 {p.target_kelas === "semua" ? "Semua orang tua" : `Kelas ${p.target_kelas}`}</span>
                  <span>·</span>
                  <span>{format(new Date(p.created_at), "d MMM yyyy, HH:mm", { locale: id })}</span>
                </div>
              </div>
              <span className={p.status === "terkirim" ? "badge-sent" : "badge-draft"}>
                {p.status === "terkirim" ? "Terkirim" : "Draft"}
              </span>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Belum ada pengumuman. Buat pengumuman pertama!</p>
          </div>
        )}
      </div>
    </div>
  );
}
