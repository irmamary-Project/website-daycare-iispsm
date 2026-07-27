import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FITRAH_LIST } from "@/types";
import Link from "next/link";
import PortoDetailClient from "./PortoDetailClient";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function fmtDate(d: string) {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default async function PortoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: porto } = await supabase
    .from("portofolio")
    .select("*, siswa(nama, kelas), portofolio_media(id, url, tipe, nama_file)")
    .eq("id", id)
    .single();

  if (!porto) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-3">📭</div>
        <p>Portofolio tidak ditemukan.</p>
        <Link href="/guru/riwayat" className="text-blue-600 underline mt-2 inline-block">← Kembali ke Riwayat</Link>
      </div>
    );
  }

  const fitrahMap = Object.fromEntries(FITRAH_LIST.map(f => [f.key, f]));

  return (
    <PortoDetailClient>
      <div id="porto-content" className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6 print:p-4">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Portofolio</h1>
          <p className="text-sm text-gray-500">IIS PSM Daycare & Preschool Magetan</p>
          <p className="text-xs text-gray-400 mt-1">
            {porto.siswa?.kelas} · {fmtDate(porto.tanggal)}
            {porto.sesi && ` · ${porto.sesi}`}
          </p>
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600 w-48">Nama Siswa</td>
              <td className="py-2">{porto.siswa?.nama ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Fitrah Distimulasi</td>
              <td className="py-2">
                {porto.fitrah?.length
                  ? porto.fitrah.map((f: string) => `${fitrahMap[f]?.icon ?? ""} ${fitrahMap[f]?.label ?? f}`).join(", ")
                  : "-"}
              </td>
            </tr>
            {porto.observasi && (
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-gray-600 align-top">Observasi</td>
                <td className="py-2 whitespace-pre-wrap">{porto.observasi}</td>
              </tr>
            )}
            {porto.catatan_ortu && (
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-gray-600 align-top">Catatan untuk Orang Tua</td>
                <td className="py-2 whitespace-pre-wrap">{porto.catatan_ortu}</td>
              </tr>
            )}
            {porto.portofolio_media && porto.portofolio_media.length > 0 && (
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-gray-600 align-top">Media ({porto.portofolio_media.length})</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {porto.portofolio_media.map((m: any) => (
                      <div key={m.id} className="text-xs text-gray-500">
                        {m.tipe === "foto" ? "🖼️" : "🎬"} {m.nama_file ?? "Media"}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-right text-xs text-gray-400 mt-6 pt-4 border-t">
          Status: {porto.status === "terkirim" ? "✓ Terkirim" : "Draft"}
          {porto.dikirim_at && ` · Dikirim: ${fmtDate(porto.dikirim_at)} ${new Date(porto.dikirim_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
        </div>
      </div>
    </PortoDetailClient>
  );
}
