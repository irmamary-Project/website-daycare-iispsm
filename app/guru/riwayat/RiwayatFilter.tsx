"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SiswaOption {
  id: string;
  nama: string;
}

export default function RiwayatFilter({
  start,
  end,
  siswaId,
  siswaList,
}: {
  start: string;
  end: string;
  siswaId: string;
  siswaList: SiswaOption[];
}) {
  const router = useRouter();
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);
  const [sis, setSis] = useState(siswaId);

  function apply() {
    const params = new URLSearchParams();
    if (s) params.set("start", s);
    if (e) params.set("end", e);
    if (sis) params.set("siswa_id", sis);
    router.push(`/guru/riwayat${params.toString() ? `?${params}` : ""}`);
  }

  function clear() {
    setS("");
    setE("");
    setSis("");
    router.push("/guru/riwayat");
  }

  const hasFilter = !!start || !!end || !!siswaId;

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div>
        <label className="label">Nama Siswa</label>
        <select className="input" value={sis} onChange={(e) => setSis(e.target.value)}>
          <option value="">– Semua Siswa –</option>
          {siswaList.map((s) => (
            <option key={s.id} value={s.id}>{s.nama}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Dari</label>
        <input
          type="date"
          className="input"
          value={s}
          onChange={(e) => setS(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Sampai</label>
        <input
          type="date"
          className="input"
          value={e}
          onChange={(e) => setE(e.target.value)}
        />
      </div>
      <button onClick={apply} className="btn-primary text-sm">
        🔍 Tampilkan
      </button>
      {hasFilter && (
        <button onClick={clear} className="btn-outline text-sm">
          ✕ Hapus Filter
        </button>
      )}
    </div>
  );
}
