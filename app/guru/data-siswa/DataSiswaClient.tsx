"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Siswa, Profile, KELAS_LIST } from "@/types";
import { generateDataSiswaPDF } from "@/lib/pdf";

interface Props {
  siswaList: (Siswa & { ortu?: Profile })[];
  ortuList: Profile[];
  isAdmin: boolean;
}

const EMPTY_FORM = {
  nama: "", jenis_kelamin: "L" as "L" | "P",
  tanggal_lahir: "", kelas: "KB Preschool 1",
  ortu_id: "", status: "aktif" as Siswa["status"], catatan: "",
};

export default function DataSiswaClient({ siswaList: initial, ortuList, isAdmin }: Props) {
  const supabase = createClient();
  const [siswaList, setSiswaList] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("aktif");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<string>("");
  const [exportingPDF, setExportingPDF] = useState(false);

  function hitungUsia(tglLahir: string): string {
    if (!tglLahir) return "–";
    const today = new Date();
    const birth = new Date(tglLahir);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    if (today.getDate() < birth.getDate()) months--;
    if (months < 0) { years--; months += 12; }
    if (years === 0 && months === 0) return "0 bulan";
    if (years === 0) return `${months} bln`;
    if (months === 0) return `${years} thn`;
    return `${years} thn ${months} bln`;
  }

  const filtered = siswaList.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase());
    const matchKelas  = filterKelas === "semua" || s.kelas === filterKelas;
    const matchStatus = filterStatus === "semua" || s.status === filterStatus;
    return matchSearch && matchKelas && matchStatus;
  });

  function openAdd() {
    setForm(EMPTY_FORM); setEditId(null); setShowModal(true); setMsg("");
  }

  function openEdit(s: Siswa) {
    setForm({
      nama: s.nama, jenis_kelamin: s.jenis_kelamin ?? "L",
      tanggal_lahir: s.tanggal_lahir ?? "", kelas: s.kelas,
      ortu_id: s.ortu_id ?? "", status: s.status, catatan: s.catatan ?? "",
    });
    setEditId(s.id); setShowModal(true); setMsg("");
  }

  async function handleSave() {
    if (!form.nama.trim()) return setMsg("Nama siswa wajib diisi.");
    setSaving(true);
    const payload = {
      nama: form.nama, jenis_kelamin: form.jenis_kelamin,
      tanggal_lahir: form.tanggal_lahir || null,
      kelas: form.kelas, ortu_id: form.ortu_id || null,
      status: form.status, catatan: form.catatan || null,
    };
    if (editId) {
      const { error } = await supabase.from("siswa").update(payload).eq("id", editId);
      if (error) { setMsg("Gagal: " + error.message); setSaving(false); return; }
      setSiswaList(prev => prev.map(s => s.id === editId ? { ...s, ...payload } as Siswa & { ortu?: Profile } : s));
    } else {
      const { data, error } = await supabase.from("siswa").insert(payload).select().single();
      if (error) { setMsg("Gagal: " + error.message); setSaving(false); return; }
      setSiswaList(prev => [...prev, data]);
    }
    setSaving(false); setShowModal(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus data siswa ini? Semua laporan terkait ikut terhapus.")) return;
    await supabase.from("siswa").delete().eq("id", id);
    setSiswaList(prev => prev.filter(s => s.id !== id));
  }

  // Export CSV
  async function handleExport() {
    const res = await fetch("/api/siswa/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-siswa-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Export PDF (data yang sedang difilter)
  async function handleExportPDF() {
    if (exportingPDF) return;
    setExportingPDF(true);
    try {
      const doc = await generateDataSiswaPDF(filtered);
      doc.save(`data-siswa-${new Date().toISOString().split("T")[0]}.pdf`);
    } finally {
      setExportingPDF(false);
    }
  }

  // Import CSV
  async function handleImport() {
    if (!importFile) return;
    setImportLoading(true);
    setImportResult("");

    const text = await importFile.text();
    const res = await fetch("/api/siswa/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: text }),
    });
    const data = await res.json();

    if (!res.ok) {
      setImportResult(`Gagal: ${data.error}`);
    } else {
      setImportResult(`Berhasil import ${data.imported} siswa. ${data.skipped ? `${data.skipped} baris dilewati.` : ""}`);
      if (data.errors?.length > 0) {
        setImportResult(prev => prev + `\nError: ${data.errors.slice(0, 3).join("; ")}`);
      }
      // Refresh data
      const { data: refreshed } = await supabase.from("siswa").select("*, ortu:profiles!siswa_ortu_id_fkey(id, full_name, phone)").order("nama");
      if (refreshed) setSiswaList(refreshed);
    }
    setImportLoading(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Data Siswa</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} siswa ditemukan</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isAdmin && (
            <>
              <button onClick={handleExport} className="btn-outline">📥 Export CSV</button>
              <button onClick={handleExportPDF} disabled={exportingPDF} className="btn-outline">📄 Export PDF</button>
              <button onClick={() => { setShowImportModal(true); setImportFile(null); setImportResult(""); }} className="btn-outline">📤 Import CSV</button>
            </>
          )}
          <button onClick={openAdd} className="btn-primary">+ Tambah Siswa</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-wrap gap-3">
        <input className="input flex-1 min-w-[180px]" placeholder="🔍 Cari nama siswa..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-auto" value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
          <option value="semua">Semua Kelas</option>
          {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="semua">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="cuti">Cuti</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>

      {/* Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-[var(--primary)] text-white text-xs">
              {["Nama", "Kelas", "Usia", "Jenis Kelamin", "Orang Tua", "Status", "Aksi"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const ortu = ortuList.find(o => o.id === s.ortu_id);
              return (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-[var(--cream)]"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--primary-pale)] flex items-center justify-center text-[var(--primary)] text-xs font-bold flex-shrink-0">
                        {s.nama.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <span className="font-medium text-gray-800">{s.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.kelas}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{hitungUsia(s.tanggal_lahir)}</td>
                  <td className="px-4 py-3 text-gray-600">{s.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {ortu ? <span>{ortu.full_name}<br/><span className="text-xs text-gray-400">{ortu.phone}</span></span> : <span className="text-gray-300">–</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.status === "aktif" ? "badge-hadir" : s.status === "cuti" ? "badge-izin" : "badge-draft"}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-xs px-3 py-1 rounded-lg border border-[var(--primary-border)] hover:bg-[var(--primary-pale)] transition-colors">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Tidak ada data siswa yang ditemukan.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-[var(--primary)] mb-5">
              {editId ? "Edit Data Siswa" : "Tambah Siswa Baru"}
            </h3>
            {msg && <div className="bg-red-50 text-red-600 rounded-xl px-4 py-2 text-sm mb-4">{msg}</div>}
            <div className="space-y-4">
              <div>
                <label className="label">Nama Lengkap *</label>
                <input className="input" value={form.nama} onChange={e => setForm(f => ({...f, nama: e.target.value}))} placeholder="Nama lengkap siswa" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Jenis Kelamin</label>
                  <select className="input" value={form.jenis_kelamin} onChange={e => setForm(f => ({...f, jenis_kelamin: e.target.value as "L"|"P"}))}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tanggal Lahir</label>
                  <input type="date" className="input" value={form.tanggal_lahir} onChange={e => setForm(f => ({...f, tanggal_lahir: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="label">Kelas</label>
                <select className="input" value={form.kelas} onChange={e => setForm(f => ({...f, kelas: e.target.value}))}>
                  {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Orang Tua / Wali</label>
                <select className="input" value={form.ortu_id} onChange={e => setForm(f => ({...f, ortu_id: e.target.value}))}>
                  <option value="">– Pilih Orang Tua –</option>
                  {ortuList.map(o => <option key={o.id} value={o.id}>{o.full_name} ({o.phone ?? "–"})</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Orang tua harus daftar dulu di portal agar muncul di sini.</p>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as any}))}>
                  <option value="aktif">Aktif</option>
                  <option value="cuti">Cuti</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <div>
                <label className="label">Catatan</label>
                <textarea className="input" rows={2} value={form.catatan} onChange={e => setForm(f => ({...f, catatan: e.target.value}))} placeholder="Catatan tambahan (opsional)..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-serif text-xl font-bold text-[var(--primary)] mb-4">Import Data Siswa dari CSV</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Format CSV</label>
                <p className="text-xs text-gray-500 mb-2">
                  Header: <code>nama,jenis_kelamin,tanggal_lahir,kelas,ortu_nama,ortu_phone,status,catatan</code>
                </p>
                <p className="text-xs text-gray-400">
                  Contoh: <code>Ani, P, 2022-05-15, KB Preschool 1, Budi, 081234567890, aktif, </code>
                </p>
              </div>
              <div>
                <label className="label">Pilih File CSV</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                  className="input"
                />
              </div>
              {importResult && (
                <div className={`p-3 rounded-xl text-sm whitespace-pre-line ${importResult.startsWith("Gagal") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {importResult}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleImport} disabled={importLoading || !importFile} className="btn-primary flex-1">
                {importLoading ? "Mengimport..." : "Import"}
              </button>
              <button onClick={() => setShowImportModal(false)} className="btn-outline flex-1">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
