"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RiwayatFilter({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const router = useRouter();
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);

  function apply() {
    const params = new URLSearchParams();
    if (s) params.set("start", s);
    if (e) params.set("end", e);
    router.push(`/guru/riwayat${params.toString() ? `?${params}` : ""}`);
  }

  function clear() {
    setS("");
    setE("");
    router.push("/guru/riwayat");
  }

  const hasFilter = !!start || !!end;

  return (
    <div className="flex items-end gap-3 flex-wrap">
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
