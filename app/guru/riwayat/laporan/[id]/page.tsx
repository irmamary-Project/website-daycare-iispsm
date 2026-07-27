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
      <div id="laporan-content" className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6 print:p-4">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Laporan Perkembangan Triwulan</h1>
          <p className="text-sm text-gray-500">IIS PSM Daycare & Preschool Magetan</p>
          <p className="text-xs text-gray-400 mt-1">
            {laporan.siswa?.kelas} · {laporan.periode} {laporan.tahun}
          </p>
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600 w-48">Nama Siswa</td>
              <td className="py-2">{laporan.siswa?.nama ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Periode</td>
              <td className="py-2">{laporan.periode} {laporan.tahun}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-semibold text-gray-700 mt-6 mb-3">Penilaian 8 Fitrah</h3>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-3 border font-medium text-gray-600">Fitrah</th>
              <th className="text-left py-2 px-3 border font-medium text-gray-600">Capaian</th>
              <th className="text-left py-2 px-3 border font-medium text-gray-600">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {fitrahKeys.map((key) => {
              const col = `fitrah_${key}` as keyof typeof laporan;
              const data = laporan[col] as { capaian?: string; catatan?: string } | null;
              return (
                <tr key={key} className="border-b">
                  <td className="py-2 px-3 border font-medium text-gray-700">
                    {FITRAH_LIST.find(f => f.key === key)?.icon} {FITRAH_LIST.find(f => f.key === key)?.label ?? key}
                  </td>
                  <td className="py-2 px-3 border">{data?.capaian ? capaianLabel[data.capaian] ?? data.capaian : "-"}</td>
                  <td className="py-2 px-3 border text-gray-600">{data?.catatan ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {laporan.catatan_umum && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-1">Catatan Umum</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{laporan.catatan_umum}</p>
          </div>
        )}

        {laporan.rekomendasi && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-1">Rekomendasi</h4>
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
