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
    <PortoDetailClient data={porto}>
      <div id="porto-content" className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border sm:p-6 p-4 print:p-4">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Portofolio</h1>
          <p className="text-sm text-gray-500">IIS PSM Daycare & Preschool Magetan</p>
          <p className="text-xs text-gray-400 mt-1">
            {porto.siswa?.kelas} · {fmtDate(porto.tanggal)}
            {porto.sesi && ` · ${porto.sesi}`}
          </p>
        </div>

        <div className="divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
            <span className="font-medium text-gray-600 text-xs sm:text-sm">Nama Siswa</span>
            <span className="text-gray-800 text-sm sm:text-base">{porto.siswa?.nama ?? "-"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
            <span className="font-medium text-gray-600 text-xs sm:text-sm">Fitrah Distimulasi</span>
            <span className="text-gray-800 text-sm sm:text-base">
              {porto.fitrah?.length
                ? porto.fitrah.map((f: string) => `${fitrahMap[f]?.icon ?? ""} ${fitrahMap[f]?.label ?? f}`).join(", ")
                : "-"}
            </span>
          </div>
          {porto.observasi && (
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
              <span className="font-medium text-gray-600 text-xs sm:text-sm">Observasi</span>
              <span className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap">{porto.observasi}</span>
            </div>
          )}
          {porto.catatan_ortu && (
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
              <span className="font-medium text-gray-600 text-xs sm:text-sm">Catatan untuk Orang Tua</span>
              <span className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap">{porto.catatan_ortu}</span>
            </div>
          )}
          {porto.portofolio_media && porto.portofolio_media.length > 0 && (
            <div className="py-3">
              <span className="font-medium text-gray-600 text-xs sm:text-sm block mb-2">Media ({porto.portofolio_media.length})</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {porto.portofolio_media.map((m: any) => (
                  <div key={m.id} className="rounded-lg overflow-hidden border bg-gray-50">
                    {m.tipe === "foto" ? (
                      <img
                        src={m.url}
                        alt={m.nama_file ?? "Foto"}
                        crossOrigin="anonymous"
                        className="w-full aspect-square object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400 text-xs sm:text-sm">
                        🎬 {m.nama_file ?? "Video"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-right text-xs text-gray-400 mt-6 pt-4 border-t">
          Status: {porto.status === "terkirim" ? "✓ Terkirim" : "Draft"}
          {porto.dikirim_at && ` · Dikirim: ${fmtDate(porto.dikirim_at)} ${new Date(porto.dikirim_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
        </div>
      </div>
    </PortoDetailClient>
  );
}
