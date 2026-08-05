"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOOD_OPTIONS, FITRAH_LIST } from "@/lib/constants";
import { type Siswa } from "@/types";
import { todayWIB } from "@/lib/date";

const IBADAH_LIST = [
  "Doa sebelum makan", "Dzikir pagi", "Hafalan surat pendek",
  "Shalat Dzuhur berjamaah", "Shalat Ashar berjamaah",
  "Cuci tangan 6 langkah", "Toilet training mandiri",
];

interface DraftRecord {
  id: string;
  siswa_id: string;
  tanggal: string;
  sesi: string;
  status: string;
  kehadiran: string;
  created_at: string;
}

export default function DailyReportClient({ siswaList, guruId }: { siswaList: Pick<Siswa, "id" | "nama" | "kelas">[]; guruId: string }) {
  const supabase = createClient();
  const today = todayWIB();

  const [siswaId, setSiswaId] = useState("");
  const [tanggal, setTanggal] = useState(today);
  const [sesi, setSesi] = useState("Full Day");
  const [kehadiran, setKehadiran] = useState("Hadir");
  const [moodDatang, setMoodDatang] = useState("");
  const [moodPulang, setMoodPulang] = useState("");
  const [kondisi, setKondisi] = useState("Sehat");
  const [suhu, setSuhu] = useState("36.5");
  const [sarapan, setSarapan] = useState("Habis");
  const [snackPagi, setSnackPagi] = useState("Habis");
  const [makanSiang, setMakanSiang] = useState("Habis");
  const [snackSore, setSnackSore] = useState("Habis");
  const [minumGelas, setMinumGelas] = useState(5);
  const [tidurSiang, setTidurSiang] = useState("Nyenyak");
  const [durasiTidur, setDurasiTidur] = useState("60 menit");
  const [bakKali, setBakKali] = useState(4);
  const [bab, setBab] = useState("Ya, normal");
  const [ibadah, setIbadah] = useState<string[]>([]);
  const [fitrah, setFitrah] = useState<string[]>([]);
  const [observasi, setObservasi] = useState("");
  const [catatanOrtu, setCatatanOrtu] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftRefresh, setDraftRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!siswaId) { setDrafts([]); return; }
      const { data } = await supabase
        .from("daily_reports")
        .select("id, siswa_id, tanggal, sesi, status, kehadiran, created_at")
        .eq("siswa_id", siswaId)
        .eq("tanggal", tanggal)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      setDrafts(data ?? []);
    })();
    return () => { cancelled = true; };
  }, [supabase, siswaId, tanggal, draftRefresh]);

  function toggleIbadah(item: string) {
    setIbadah(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }
  function toggleFitrah(key: string) {
    setFitrah(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
  }

  // Reset form
  function resetForm() {
    setSesi("Full Day");
    setKehadiran("Hadir");
    setMoodDatang(""); setMoodPulang("");
    setKondisi("Sehat"); setSuhu("36.5");
    setSarapan("Habis"); setSnackPagi("Habis"); setMakanSiang("Habis"); setSnackSore("Habis");
    setMinumGelas(5); setTidurSiang("Nyenyak"); setDurasiTidur("60 menit");
    setBakKali(4); setBab("Ya, normal");
    setIbadah([]); setFitrah([]);
    setObservasi(""); setCatatanOrtu("");
    setEditingId(null);
  }

  // Load draft
  async function handleLoadDraft(draft: DraftRecord) {
    setSesi(draft.sesi);
    setKehadiran(draft.kehadiran);
    setEditingId(draft.id);

    // Fetch full data
    const { data } = await supabase.from("daily_reports").select("*").eq("id", draft.id).single();
    if (!data) return;

    setMoodDatang(data.mood_datang ?? "");
    setMoodPulang(data.mood_pulang ?? "");
    setKondisi(data.kondisi_kesehatan ?? "Sehat");
    setSuhu(data.suhu_tubuh ?? "36.5");
    setSarapan(data.sarapan ?? "Habis");
    setSnackPagi(data.snack_pagi ?? "Habis");
    setMakanSiang(data.makan_siang ?? "Habis");
    setSnackSore(data.snack_sore ?? "Habis");
    setMinumGelas(data.minum_gelas ?? 5);
    setTidurSiang(data.tidur_siang ?? "Nyenyak");
    setDurasiTidur(data.durasi_tidur ?? "60 menit");
    setBakKali(data.bak_kali ?? 4);
    setBab(data.bab ?? "Ya, normal");
    setIbadah(data.ibadah_checklist ?? []);
    setFitrah(data.fitrah_distimulasi ?? []);
    setObservasi(data.observasi_guru ?? "");
    setCatatanOrtu(data.catatan_ortu ?? "");
    setMsg(`📂 Draft "${draft.sesi}" dimuat.`);
  }

  async function handleSave(kirim: boolean) {
    if (!siswaId) return setMsg("Pilih siswa terlebih dahulu.");
    setSaving(true); setMsg("");
    const payload = {
      siswa_id: siswaId, guru_id: guruId, tanggal, sesi,
      kehadiran, mood_datang: moodDatang || null, mood_pulang: moodPulang || null,
      kondisi_kesehatan: kondisi, suhu_tubuh: suhu,
      sarapan, snack_pagi: snackPagi, makan_siang: makanSiang,
      snack_sore: snackSore, minum_gelas: minumGelas,
      tidur_siang: tidurSiang, durasi_tidur: durasiTidur,
      bak_kali: bakKali, bab,
      ibadah_checklist: ibadah, fitrah_distimulasi: fitrah,
      observasi_guru: observasi, catatan_ortu: catatanOrtu,
      status: kirim ? "terkirim" : "draft",
      dikirim_at: kirim ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("daily_reports").upsert(payload, {
      onConflict: "siswa_id,tanggal,sesi",
    });

    if (error) { setMsg("Gagal: " + error.message); }
    else {
      setMsg(kirim ? "✅ Daily report berhasil dikirim ke orang tua!" : "💾 Draft tersimpan.");
      if (kirim) {
        const { data: siswa } = await supabase.from("siswa").select("ortu_id, nama").eq("id", siswaId).single();
        if (siswa?.ortu_id) {
          await supabase.from("notifikasi").insert({
            user_id: siswa.ortu_id, tipe: "daily_report",
            judul: `Daily Report ${siswa.nama}`,
            pesan: `Laporan harian ${siswa.nama} (${sesi}) untuk tanggal ${tanggal} telah dikirim.`,
          });
        }
      }
      setDraftRefresh(r => r + 1);
    }
    setSaving(false);
  }
  // Sesi yang sudah diisi hari ini
  const filledSesi = drafts.map(d => d.sesi);
  const sesiOptions = ["Pagi", "Siang", "Full Day"].filter(s => {
    // Full Day tidak bisa jika sudah ada Pagi atau Siang
    if (s === "Full Day" && (filledSesi.includes("Pagi") || filledSesi.includes("Siang"))) return false;
    // Pagi/Siang tidak bisa jika sudah ada Full Day
    if ((s === "Pagi" || s === "Siang") && filledSesi.includes("Full Day")) return false;
    // Sesi yang sama tidak bisa diisi lagi
    if (filledSesi.includes(s) && !editingId) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold text-primary mb-2">✅ Daily Report</h1>
      <p className="text-sm text-gray-500 mb-8">Isi laporan harian portofolio siswa</p>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm mb-6 ${msg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : msg.startsWith("💾") ? "bg-blue-50 text-blue-700 border border-blue-200" : msg.startsWith("📂") ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {msg}
        </div>
      )}

      {/* Header */}
      <div className="card mb-5 grid grid-cols-2 gap-4">
        <div>
          <label className="label">Pilih Siswa</label>
          <select className="input" value={siswaId} onChange={e => { setSiswaId(e.target.value); resetForm(); }}>
            <option value="">– Pilih Siswa –</option>
            {siswaList.map(s => <option key={s.id} value={s.id}>{s.nama} – {s.kelas}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tanggal</label>
          <input type="date" className="input" value={tanggal} onChange={e => { setTanggal(e.target.value); resetForm(); }} />
        </div>
        <div>
          <label className="label">Sesi</label>
          <select className="input" value={sesi} onChange={e => setSesi(e.target.value)} disabled={!!editingId}>
            {sesiOptions.map(s => <option key={s}>{s}</option>)}
            {editingId && <option>{sesi}</option>}
          </select>
        </div>
        <div>
          <label className="label">Kehadiran</label>
          <select className="input" value={kehadiran} onChange={e => setKehadiran(e.target.value)}>
            {["Hadir", "Izin", "Sakit", "Alpha"].map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
      </div>

      {/* Draft List */}
      {siswaId && drafts.length > 0 && (
        <div className="card mb-5">
          <h3 className="font-semibold text-primary mb-3">📂 Draft Hari Ini ({drafts.length})</h3>
          <div className="space-y-2">
            {drafts.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--cream)]">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    d.status === "terkirim" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {d.sesi}
                  </span>
                  <span className={`text-xs ${d.status === "terkirim" ? "text-green-600" : "text-gray-500"}`}>
                    {d.status === "terkirim" ? "✓ Terkirim" : "Draft"}
                  </span>
                </div>
                <button
                  onClick={() => handleLoadDraft(d)}
                  className="text-xs px-3 py-1 rounded-lg border border-[var(--primary-border)] hover:bg-[var(--primary-pale)] transition-colors"
                >
                  {editingId === d.id ? "✓ Sedang diedit" : "Edit"}
                </button>
              </div>
            ))}
          </div>
          {sesiOptions.length === 0 && !editingId && (
            <p className="text-xs text-gray-400 mt-2">Semua sesi hari ini sudah terisi.</p>
          )}
        </div>
      )}

      {/* Mood */}
      <div className="card mb-5">
        <h3 className="font-semibold text-primary mb-4">😊 Mood & Kondisi</h3>
        <div className="space-y-4">
          {[{ label: "Mood saat datang", val: moodDatang, set: setMoodDatang }, { label: "Mood saat pulang", val: moodPulang, set: setMoodPulang }].map(({ label, val, set }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-36 flex-shrink-0">{label}</span>
              <div className="flex gap-2">
                {MOOD_OPTIONS.map(m => (
                  <button key={m.value} type="button"
                    onClick={() => set(m.value)}
                    className={`text-2xl px-2 py-1 rounded-xl border-2 transition-all ${val === m.value ? "border-[var(--primary)] bg-[var(--primary-pale)]" : "border-transparent hover:border-[var(--primary-border)]"}`}
                    title={m.label}>{m.emoji}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Kondisi Kesehatan</label>
              <select className="input" value={kondisi} onChange={e => setKondisi(e.target.value)}>
                {["Sehat", "Kurang sehat", "Demam ringan", "Batuk/pilek"].map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Suhu Tubuh (°C)</label>
              <input className="input" type="text" value={suhu} onChange={e => setSuhu(e.target.value)} placeholder="36.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Makan */}
      <div className="card mb-5">
        <h3 className="font-semibold text-primary mb-4">🍽️ Makan & Minum</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sarapan", val: sarapan, set: setSarapan, opts: ["Habis","Sarapan di Rumah","Setengah","Sedikit","Tidak makan"] },
            { label: "Snack pagi", val: snackPagi, set: setSnackPagi, opts: ["Habis","Snack Pagi di Rumah","Setengah","Tidak makan"] },
            { label: "Makan siang", val: makanSiang, set: setMakanSiang, opts: ["Habis","Setengah","Sedikit","Tidak makan"] },
            { label: "Snack sore", val: snackSore, set: setSnackSore, opts: ["Habis","Setengah","Tidak makan"] },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <label className="label">{label}</label>
              <select className="input" value={val} onChange={e => set(e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="label">Minum (gelas)</label>
            <input type="number" className="input" value={minumGelas} onChange={e => setMinumGelas(+e.target.value)} min={0} max={15} />
          </div>
        </div>
      </div>

      {/* Tidur */}
      <div className="card mb-5">
        <h3 className="font-semibold text-primary mb-4">💤 Tidur & BAB/BAK</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Tidur siang</label>
            <select className="input" value={tidurSiang} onChange={e => setTidurSiang(e.target.value)}>
              {["Nyenyak","Setengah","Tidak tidur"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Durasi tidur</label>
            <input className="input" value={durasiTidur} onChange={e => setDurasiTidur(e.target.value)} placeholder="60 menit" />
          </div>
          <div>
            <label className="label">BAK (kali)</label>
            <input type="number" className="input" value={bakKali} onChange={e => setBakKali(+e.target.value)} min={0} />
          </div>
          <div>
            <label className="label">BAB</label>
            <select className="input" value={bab} onChange={e => setBab(e.target.value)}>
              {["Ya, normal","Ya, tidak normal","Tidak"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Ibadah */}
      <div className="card mb-5">
        <h3 className="font-semibold text-primary mb-4">☪️ Ibadah & Aktivitas</h3>
        <div className="grid grid-cols-2 gap-2">
          {IBADAH_LIST.map(item => (
            <label key={item} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={ibadah.includes(item)} onChange={() => toggleIbadah(item)}
                className="w-4 h-4 rounded accent-[var(--primary)]" />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Fitrah */}
      <div className="card mb-5">
        <h3 className="font-semibold text-primary mb-4">🌱 Fitrah yang Distimulasi</h3>
        <div className="grid grid-cols-4 gap-2">
          {FITRAH_LIST.map(f => (
            <button key={f.key} type="button" onClick={() => toggleFitrah(f.key)}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                fitrah.includes(f.key) ? "border-[var(--primary)] bg-[var(--primary-pale)] text-primary" : "border-[var(--primary-border)] text-gray-500 hover:border-[var(--primary-mid)]"
              }`}>
              <span className="text-xl">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catatan */}
      <div className="card mb-6">
        <h3 className="font-semibold text-primary mb-4">📝 Catatan</h3>
        <div className="space-y-3">
          <div>
            <label className="label">Observasi Guru</label>
            <textarea className="input" rows={3} value={observasi} onChange={e => setObservasi(e.target.value)}
              placeholder="Tuliskan observasi perkembangan anak hari ini..." />
          </div>
          <div>
            <label className="label">Catatan untuk Orang Tua</label>
            <textarea className="input" rows={2} value={catatanOrtu} onChange={e => setCatatanOrtu(e.target.value)}
              placeholder="Pesan atau informasi penting untuk orang tua..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {editingId && (
          <button onClick={resetForm} className="btn-outline">
            ✨ Buat Baru
          </button>
        )}
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline">
          💾 Simpan Draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-1">
          📨 Simpan & Kirim ke Orang Tua →
        </button>
      </div>
    </div>
  );
}
