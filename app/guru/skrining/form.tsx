"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { KPSP_DATA, getInterpretation } from "@/lib/kpsp-data";
import { type KPSPAgeGroup, type Siswa } from "@/types";
import { todayWIB } from "@/lib/date";

type Answers = Record<string, "ya" | "tidak" | null>;
type Notes = Record<string, string>;

type SiswaListItem = Pick<Siswa, "id" | "nama" | "jenis_kelamin" | "tanggal_lahir" | "kelas">;

function calculateAge(birthDate: string, screeningDate: string): number | null {
  if (!birthDate || !screeningDate) return null;
  const birth = new Date(birthDate);
  const screen = new Date(screeningDate);
  if (isNaN(birth.getTime()) || isNaN(screen.getTime())) return null;
  let months = (screen.getFullYear() - birth.getFullYear()) * 12 + (screen.getMonth() - birth.getMonth());
  if (screen.getDate() < birth.getDate()) months--;
  return months >= 0 ? months : null;
}

function findAgeGroup(ageMonths: number): KPSPAgeGroup | null {
  const sorted = [...KPSP_DATA].sort((a, b) => a.months - b.months);
  let matched: KPSPAgeGroup | null = null;
  for (const group of sorted) {
    if (ageMonths >= group.months) matched = group;
  }
  return matched;
}

const categoryColors: Record<string, string> = {
  "Gerak Kasar": "bg-blue-100 text-blue-700",
  "Gerak Halus": "bg-purple-100 text-purple-700",
  "Bicara & Bahasa": "bg-teal-100 text-teal-700",
  "Bicara dan Bahasa": "bg-teal-100 text-teal-700",
  "Sosialisasi & Kemandirian": "bg-orange-100 text-orange-700",
  "Sosialisai & Kemandirian": "bg-orange-100 text-orange-700",
  "Sosialisasi &Kemandirian": "bg-orange-100 text-orange-700",
};

export default function SkriningForm({ siswaList }: { siswaList: SiswaListItem[] }) {
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [screeningDate, setScreeningDate] = useState(todayWIB());
  const [answers, setAnswers] = useState<Answers>({});
  const [notes, setNotes] = useState<Notes>({});
  const [generalNotes, setGeneralNotes] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  function handleSiswaChange(siswaId: string) {
    setSelectedSiswaId(siswaId);
    const siswa = siswaList.find((s) => s.id === siswaId);
    if (siswa) {
      setChildName(siswa.nama);
      setBirthDate(siswa.tanggal_lahir);
    } else {
      setChildName("");
      setBirthDate("");
    }
    setAnswers({});
    setNotes({});
    setGeneralNotes("");
    setShowResult(false);
  }

  const ageMonths = useMemo(() => calculateAge(birthDate, screeningDate), [birthDate, screeningDate]);
  const ageGroup = useMemo(() => (ageMonths !== null ? findAgeGroup(ageMonths) : null), [ageMonths]);

  const score = useMemo(() => {
    if (!ageGroup) return 0;
    return ageGroup.questions.filter((q) => answers[`${ageGroup.months}-${q.id}`] === "ya").length;
  }, [ageGroup, answers]);

  const interpretation = useMemo(() => getInterpretation(score), [score]);

  const answeredCount = useMemo(() => {
    if (!ageGroup) return 0;
    return ageGroup.questions.filter((q) => answers[`${ageGroup.months}-${q.id}`] !== null && answers[`${ageGroup.months}-${q.id}`] !== undefined).length;
  }, [ageGroup, answers]);

  function handleAnswer(key: string, value: "ya" | "tidak") {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setSelectedSiswaId("");
    setChildName("");
    setBirthDate("");
    setScreeningDate(todayWIB());
    setAnswers({});
    setNotes({});
    setGeneralNotes("");
    setShowResult(false);
    setSaved(false);
  }

  function handlePrint() {
    setShowResult(true);
    setTimeout(() => window.print(), 300);
  }

  async function handleSave() {
    if (!selectedSiswaId || !ageGroup) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("kpsp_screenings").insert({
      siswa_id: selectedSiswaId,
      guru_id: user?.id ?? null,
      usia_bulan: ageMonths,
      kelompok_usia: ageGroup.label,
      tanggal_skrining: screeningDate,
      skor_ya: score,
      skor_tidak: ageGroup.questions.length - score,
      kode_interpretasi: interpretation.code,
      interpretasi: interpretation.label,
      jawaban: answers,
      catatan_per_soal: notes,
      catatan_umum: generalNotes,
    });
    setSaving(false);
    if (!error) setSaved(true);
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary">Skrining KPSP</h1>
            <p className="text-sm text-gray-500 mt-1">Kuisioner Pra Skrining Perkembangan Anak</p>
          </div>
          <Link href="/guru/skrining/riwayat" className="btn-outline text-sm">
            📋 Riwayat Skrining
          </Link>
        </div>

        {/* Data Anak */}
        <div className="card mb-6 no-print">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
            Data Anak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="label">Pilih Siswa</label>
              <select
                className="input"
                value={selectedSiswaId}
                onChange={(e) => handleSiswaChange(e.target.value)}
              >
                <option value="">-- Pilih nama siswa --</option>
                {siswaList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} — {s.kelas}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tanggal Skrining</label>
              <input type="date" className="input" value={screeningDate} onChange={(e) => setScreeningDate(e.target.value)} />
            </div>
          </div>
          {selectedSiswaId && (
            <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm">
              <span className="text-gray-500">Nama:</span> <span className="font-semibold">{childName}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-500">Lahir:</span> <span className="font-semibold">{birthDate ? new Date(birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
            </div>
          )}
        </div>

        {/* Usia Info */}
        {ageMonths !== null && ageGroup && (
          <div className="card mb-6 bg-primary/5 border-primary/20 no-print">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usia anak saat skrining</p>
                <p className="font-serif text-2xl font-bold text-primary">{ageMonths} bulan</p>
                <p className="text-xs text-gray-500 mt-1">Soal kelompok usia <span className="font-semibold text-primary">{ageGroup.label}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Alat & bahan:</p>
                <p className="text-sm text-gray-700 font-medium">{ageGroup.tools}</p>
              </div>
            </div>
          </div>
        )}

        {ageMonths !== null && !ageGroup && (
          <div className="card mb-6 bg-yellow-50 border-yellow-200 no-print">
            <p className="text-sm text-yellow-700">Usia {ageMonths} bulan belum tersedia. Rentang usia: 3-48 bulan.</p>
          </div>
        )}

        {/* Progress */}
        {ageGroup && (
          <div className="card mb-6 no-print">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progres Pengisian</span>
              <span className="text-sm font-semibold text-primary">{answeredCount}/{ageGroup.questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${(answeredCount / ageGroup.questions.length) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Soal */}
        {ageGroup && (
          <div className="space-y-4 mb-6">
            {ageGroup.questions.map((q) => {
              const key = `${ageGroup.months}-${q.id}`;
              const currentAnswer = answers[key] ?? null;
              const catColor = categoryColors[q.category] || "bg-gray-100 text-gray-600";
              return (
                <div key={key} className="card">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {q.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-relaxed mb-3">{q.text}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>{q.category}</span>
                      </div>
                      <div className="flex gap-2 no-print">
                        <button
                          onClick={() => handleAnswer(key, "ya")}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentAnswer === "ya"
                              ? "bg-green-500 text-white shadow-sm"
                              : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                          }`}
                        >
                          ✓ Ya
                        </button>
                        <button
                          onClick={() => handleAnswer(key, "tidak")}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentAnswer === "tidak"
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          }`}
                        >
                          ✗ Tidak
                        </button>
                      </div>
                      {currentAnswer && (
                        <div className="mt-2">
                          <input
                            type="text"
                            className="input text-xs"
                            placeholder="Catatan untuk soal ini (opsional)"
                            value={notes[key] || ""}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [key]: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Catatan Umum */}
        {ageGroup && (
          <div className="card mb-6 no-print">
            <h3 className="font-semibold text-primary mb-3">Catatan Umum</h3>
            <textarea
              className="input min-h-[80px] resize-y"
              placeholder="Tulis catatan tambahan mengenai kondisi anak..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
            />
          </div>
        )}

        {/* Ringkasan & Aksi */}
        {ageGroup && answeredCount === ageGroup.questions.length && (
          <div className="card mb-6 no-print">
            <h3 className="font-semibold text-primary mb-4">Ringkasan Hasil</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 rounded-xl bg-primary/5">
                <p className="text-2xl font-serif font-bold text-primary">{score}</p>
                <p className="text-xs text-gray-500">Skor Ya</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <p className="text-2xl font-serif font-bold text-gray-600">{ageGroup.questions.length - score}</p>
                <p className="text-xs text-gray-500">Skor Tidak</p>
              </div>
              <div className="text-center p-3 rounded-xl border">
                <p className={`text-2xl font-serif font-bold ${interpretation.color.split(" ")[0]}`}>{interpretation.code}</p>
                <p className="text-xs text-gray-500">Kode</p>
              </div>
              <div className="text-center p-3 rounded-xl border">
                <p className={`text-lg font-serif font-bold ${interpretation.color.split(" ")[0]}`}>{interpretation.label}</p>
                <p className="text-xs text-gray-500">Interpretasi</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl border ${interpretation.color}`}>
              <p className="text-sm font-medium">{interpretation.description}</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} disabled={saving || saved} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${saved ? "bg-green-500 text-white" : "bg-gold text-white hover:bg-gold-dark"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                {saved ? "✓ Tersimpan" : saving ? "Menyimpan..." : "💾 Simpan"}
              </button>
              <button onClick={handlePrint} className="btn-primary">🖨️ Cetak PDF</button>
              <button onClick={handleReset} className="btn-outline">🔄 Reset Formulir</button>
            </div>
          </div>
        )}

        {saved && (
          <div className="card mb-6 bg-green-50 border-green-200 no-print">
            <p className="text-sm text-green-700 font-medium">✓ Hasil skrining berhasil disimpan ke database.</p>
          </div>
        )}
        {showResult && ageGroup && (
          <div id="print-area" ref={printRef}>
            <div className="border-2 border-primary rounded-xl p-6 bg-white">
              <div className="text-center mb-6 border-b-2 border-primary pb-4">
                <h2 className="font-serif text-xl font-bold text-primary">Kuisioner Pra Skrining Perkembangan (KPSP)</h2>
                <p className="text-sm text-gray-600 mt-1">Kelompok Usia {ageGroup.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Nama Anak:</span>
                  <span className="font-semibold ml-2">{childName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tanggal Lahir:</span>
                  <span className="font-semibold ml-2">{birthDate ? new Date(birthDate).toLocaleDateString("id-ID") : "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Usia:</span>
                  <span className="font-semibold ml-2">{ageMonths} bulan</span>
                </div>
                <div>
                  <span className="text-gray-500">Tanggal Skrining:</span>
                  <span className="font-semibold ml-2">{new Date(screeningDate).toLocaleDateString("id-ID")}</span>
                </div>
              </div>

              <table className="w-full text-sm mb-6 border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-2 py-2 text-center w-8 rounded-tl-lg">No</th>
                    <th className="px-3 py-2 text-left">Pertanyaan</th>
                    <th className="px-2 py-2 text-center w-24">Kategori</th>
                    <th className="px-2 py-2 text-center w-14">Ya</th>
                    <th className="px-2 py-2 text-center w-14 rounded-tr-lg">Tidak</th>
                  </tr>
                </thead>
                <tbody>
                  {ageGroup.questions.map((q) => {
                    const key = `${ageGroup.months}-${q.id}`;
                    const ans = answers[key];
                    return (
                      <tr key={key} className="border-b border-gray-200">
                        <td className="px-2 py-2 text-center font-medium">{q.id}</td>
                        <td className="px-3 py-2">{q.text}</td>
                        <td className="px-2 py-2 text-xs text-center">{q.category}</td>
                        <td className="px-2 py-2 text-center">
                          {ans === "ya" ? <span className="text-green-600 font-bold">✓</span> : ""}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {ans === "tidak" ? <span className="text-red-600 font-bold">✗</span> : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={3} className="px-3 py-2 text-right">Total Skor Ya:</td>
                    <td className="px-2 py-2 text-center text-lg">{score}</td>
                    <td className="px-2 py-2"></td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border-2" style={{ borderColor: interpretation.code === "S" ? "#22c55e" : interpretation.code === "M" ? "#eab308" : "#ef4444" }}>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Kode</p>
                  <p className="text-3xl font-serif font-bold" style={{ color: interpretation.code === "S" ? "#16a34a" : interpretation.code === "M" ? "#ca8a04" : "#dc2626" }}>{interpretation.code}</p>
                </div>
                <div>
                  <p className="font-semibold">Interpretasi: {interpretation.label}</p>
                  <p className="text-sm text-gray-600">{interpretation.description}</p>
                </div>
              </div>

              {generalNotes && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Catatan:</p>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{generalNotes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-300">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-12">Orang Tua/Wali</p>
                  <div className="border-t border-gray-400 w-40 mx-auto"></div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-12">Petugas Skrining</p>
                  <div className="border-t border-gray-400 w-40 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
