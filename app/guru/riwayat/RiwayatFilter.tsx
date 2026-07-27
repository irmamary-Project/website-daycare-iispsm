"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface SiswaOption {
  id: string;
  nama: string;
}

function SearchableSelect({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: SiswaOption[];
  onChange: (id: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = query
    ? options.filter((o) => o.nama.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <input
        className="input"
        placeholder={placeholder}
        value={open ? query : selected ? selected.nama : query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
          if (e.target.value === "") onChange("");
        }}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
      />
      {open && (
        <ul className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-primary-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
          <li
            className="px-3 py-2 text-sm text-gray-400 hover:bg-primary-pale cursor-pointer"
            onClick={() => {
              onChange("");
              setQuery("");
              setOpen(false);
            }}
          >
            – Semua Siswa –
          </li>
          {filtered.map((o) => (
            <li
              key={o.id}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-primary-pale cursor-pointer"
              onClick={() => {
                onChange(o.id);
                setQuery(o.nama);
                setOpen(false);
              }}
            >
              {o.nama}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">Tidak ditemukan</li>
          )}
        </ul>
      )}
    </div>
  );
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
        <SearchableSelect
          value={sis}
          options={siswaList}
          onChange={setSis}
          placeholder="Ketik nama siswa..."
        />
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
