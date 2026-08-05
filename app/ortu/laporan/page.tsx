import { createClient } from "@/lib/supabase/server";
import { FITRAH_LIST, LaporanTriwulan } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PDFExportButton from "@/components/riwayat/PDFExportButton";


export default async function OrtuLaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: anak } = await supabase.from("siswa").select("id, nama").eq("ortu_id", user.id);
  const anakIds = anak?.map(a => a.id) ?? [];

  const { data: laporans } = await supabase
    .from("laporan_triwulan")
    .select("*, siswa(nama, kelas, tanggal_lahir)")
    .in("siswa_id", anakIds)
    .eq("status", "terkirim")
    .order("tahun", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-primary mb-2">📋 Laporan Perkembangan</h1>
      <p className="text-sm text-gray-500 mb-8">Penilaian 8 fitrah per triwulan</p>

      {(!laporans || laporans.length === 0) ? (
        <div className="card text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p>Belum ada laporan triwulan yang tersedia.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {laporans.map((l: LaporanTriwulan) => (
            <div key={l.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-primary">{l.periode}</h2>
                  <p className="text-sm text-gray-500">{l.siswa?.nama} · {l.siswa?.kelas}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-sent">Laporan Resmi</span>
                  <PDFExportButton type="laporan" data={l} filename={`laporan-triwulan_${l.periode}_${l.siswa?.nama ?? "siswa"}`} />
                </div>
              </div>

              {/* Fitrah grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {FITRAH_LIST.map(f => {
                  const penilaian = l[`fitrah_${f.key}`];
                  if (!penilaian) return null;
                  return (
                    <div key={f.key} className="bg-[var(--cream)] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{f.icon}</span>
                          <span className="font-medium text-sm text-gray-800">Fitrah {f.label}</span>
                        </div>
                        <span className={`badge-${penilaian.capaian} font-bold`}>{penilaian.capaian}</span>
                      </div>
                      {penilaian.catatan && (
                        <p className="text-xs text-gray-600 leading-relaxed">{penilaian.catatan}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {l.catatan_umum && (
                <div className="bg-[var(--primary-pale)] rounded-xl p-4 mb-3">
                  <p className="text-xs font-semibold text-[var(--primary)] mb-1">📝 Catatan Umum Guru</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{l.catatan_umum}</p>
                </div>
              )}
              {l.rekomendasi && (
                <div className="bg-[#fdf5e0] rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#8a6a00] mb-1">💡 Rekomendasi untuk di Rumah</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{l.rekomendasi}</p>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4">
                Dikirim: {format(new Date(l.dikirim_at || l.created_at), "d MMMM yyyy", { locale: id })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
