import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FITRAH_LIST, CAPAIAN_OPTIONS } from "@/types";
import Link from "next/link";
import LaporanDetailClient from "./LaporanDetailClient";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function fmtDate(d: string) {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default async function LaporanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: laporan } = await supabase
    .from("laporan_triwulan")
    .select("*, siswa(nama, kelas)")
    .eq("id", id)
    .single();

  if (!laporan) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-3">📭</div>
        <p>Laporan triwulan tidak ditemukan.</p>
        <Link href="/guru/riwayat" className="text-blue-600 underline mt-2 inline-block">← Kembali ke Riwayat</Link>
      </div>
    );
  }

  const capaianLabel = Object.fromEntries(CAPAIAN_OPTIONS.map(o => [o.value, o.label]));
  const fitrahKeys = FITRAH_LIST.map(f => f.key);

  return (
    <LaporanDetailClient>
      <div id="laporan-content" className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border sm:p-6 p-4 print:p-4">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Laporan Perkembangan Triwulan</h1>
          <p className="text-sm text-gray-500">IIS PSM Daycare & Preschool Magetan</p>
          <p className="text-xs text-gray-400 mt-1">
            {laporan.siswa?.kelas} · {laporan.periode} {laporan.tahun}
          </p>
        </div>

        <div className="divide-y divide-gray-100 text-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
            <span className="font-medium text-gray-600 text-xs sm:text-sm">Nama Siswa</span>
            <span className="text-gray-800 text-sm sm:text-base">{laporan.siswa?.nama ?? "-"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
            <span className="font-medium text-gray-600 text-xs sm:text-sm">Periode</span>
            <span className="text-gray-800 text-sm sm:text-base">{laporan.periode} {laporan.tahun}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Penilaian 8 Fitrah</h3>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm border-collapse min-w-[500px] sm:min-w-0">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 border font-medium text-gray-600 whitespace-nowrap">Fitrah</th>
                <th className="text-left py-2 px-3 border font-medium text-gray-600 whitespace-nowrap">Capaian</th>
                <th className="text-left py-2 px-3 border font-medium text-gray-600">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {fitrahKeys.map((key) => {
                const col = `fitrah_${key}` as keyof typeof laporan;
                const data = laporan[col] as { capaian?: string; catatan?: string } | null;
                return (
                  <tr key={key} className="border-b">
                    <td className="py-2 px-3 border font-medium text-gray-700 whitespace-nowrap">
                      {FITRAH_LIST.find(f => f.key === key)?.icon} {FITRAH_LIST.find(f => f.key === key)?.label ?? key}
                    </td>
                    <td className="py-2 px-3 border whitespace-nowrap">{data?.capaian ? capaianLabel[data.capaian] ?? data.capaian : "-"}</td>
                    <td className="py-2 px-3 border text-gray-600">{data?.catatan ?? "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {laporan.catatan_umum && (
          <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Catatan Umum</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{laporan.catatan_umum}</p>
          </div>
        )}

        {laporan.rekomendasi && (
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Rekomendasi</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{laporan.rekomendasi}</p>
          </div>
        )}

        <div className="text-right text-xs text-gray-400 mt-6 pt-4 border-t">
          Status: {laporan.status === "terkirim" ? "✓ Terkirim" : "Draft"}
          {laporan.dikirim_at && ` · Dikirim: ${fmtDate(laporan.dikirim_at)} ${new Date(laporan.dikirim_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
        </div>
      </div>
    </LaporanDetailClient>
  );
}
