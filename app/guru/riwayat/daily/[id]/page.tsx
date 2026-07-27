import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FITRAH_LIST, MOOD_OPTIONS } from "@/types";
import Link from "next/link";
import DailyDetailClient from "./DailyDetailClient";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmtDate(d: string) {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default async function DailyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: report } = await supabase
    .from("daily_reports")
    .select("*, siswa(nama, kelas)")
    .eq("id", id)
    .single();

  if (!report) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-3">📭</div>
        <p>Daily report tidak ditemukan.</p>
        <Link href="/guru/riwayat" className="text-blue-600 underline mt-2 inline-block">← Kembali ke Riwayat</Link>
      </div>
    );
  }

  const moodMap = Object.fromEntries(MOOD_OPTIONS.map(m => [m.value, m]));
  const fitrahMap = Object.fromEntries(FITRAH_LIST.map(f => [f.key, f]));

  return (
    <DailyDetailClient>
      <div id="daily-report-content" className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6 print:p-4">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Daily Report</h1>
          <p className="text-sm text-gray-500">IIS PSM Daycare & Preschool Magetan</p>
          <p className="text-xs text-gray-400 mt-1">
            {report.siswa?.kelas} · {fmtDate(report.tanggal)} · {report.sesi}
          </p>
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600 w-48">Nama Siswa</td>
              <td className="py-2">{report.siswa?.nama ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Kehadiran</td>
              <td className="py-2">{report.kehadiran}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Mood Datang</td>
              <td className="py-2">{report.mood_datang ? `${moodMap[report.mood_datang]?.emoji ?? ""} ${report.mood_datang}` : "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Mood Pulang</td>
              <td className="py-2">{report.mood_pulang ? `${moodMap[report.mood_pulang]?.emoji ?? ""} ${report.mood_pulang}` : "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Kondisi Kesehatan</td>
              <td className="py-2">{report.kondisi_kesehatan ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Suhu Tubuh</td>
              <td className="py-2">{report.suhu_tubuh ? `${report.suhu_tubuh}°C` : "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Sarapan</td>
              <td className="py-2">{report.sarapan ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Snack Pagi</td>
              <td className="py-2">{report.snack_pagi ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Makan Siang</td>
              <td className="py-2">{report.makan_siang ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Snack Sore</td>
              <td className="py-2">{report.snack_sore ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Minum</td>
              <td className="py-2">{report.minum_gelas ? `${report.minum_gelas} gelas` : "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Tidur Siang</td>
              <td className="py-2">{report.tidur_siang ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Durasi Tidur</td>
              <td className="py-2">{report.durasi_tidur ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">BAK</td>
              <td className="py-2">{report.bak_kali ? `${report.bak_kali} kali` : "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">BAB</td>
              <td className="py-2">{report.bab ?? "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Ibadah & Aktivitas</td>
              <td className="py-2">
                {report.ibadah_checklist?.length
                  ? report.ibadah_checklist.map((i: string) => `✅ ${i}`).join(", ")
                  : "-"}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4 font-medium text-gray-600">Fitrah Distimulasi</td>
              <td className="py-2">
                {report.fitrah_distimulasi?.length
                  ? report.fitrah_distimulasi.map((f: string) => `${fitrahMap[f]?.icon ?? ""} ${fitrahMap[f]?.label ?? f}`).join(", ")
                  : "-"}
              </td>
            </tr>
            {report.observasi_guru && (
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-gray-600 align-top">Observasi Guru</td>
                <td className="py-2 whitespace-pre-wrap">{report.observasi_guru}</td>
              </tr>
            )}
            {report.catatan_ortu && (
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-gray-600 align-top">Catatan untuk Orang Tua</td>
                <td className="py-2 whitespace-pre-wrap">{report.catatan_ortu}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-right text-xs text-gray-400 mt-6 pt-4 border-t">
          Status: {report.status === "terkirim" ? "✓ Terkirim" : "Draft"}
          {report.dikirim_at && ` · Dikirim: ${fmtDate(report.dikirim_at)} ${new Date(report.dikirim_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
        </div>
      </div>
    </DailyDetailClient>
  );
}
