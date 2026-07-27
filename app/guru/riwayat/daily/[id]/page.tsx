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
      <div id="daily-report-content" className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border sm:p-6 p-4 print:p-4">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Daily Report</h1>
          <p className="text-sm text-gray-500">IIS PSM Daycare & Preschool Magetan</p>
          <p className="text-xs text-gray-400 mt-1">
            {report.siswa?.kelas} · {fmtDate(report.tanggal)} · {report.sesi}
          </p>
        </div>

        <div className="divide-y divide-gray-100 text-sm">
          {[
            ["Nama Siswa", report.siswa?.nama ?? "-"],
            ["Kehadiran", report.kehadiran],
            ["Mood Datang", report.mood_datang ? `${moodMap[report.mood_datang]?.emoji ?? ""} ${report.mood_datang}` : "-"],
            ["Mood Pulang", report.mood_pulang ? `${moodMap[report.mood_pulang]?.emoji ?? ""} ${report.mood_pulang}` : "-"],
            ["Kondisi Kesehatan", report.kondisi_kesehatan ?? "-"],
            ["Suhu Tubuh", report.suhu_tubuh ? `${report.suhu_tubuh}°C` : "-"],
            ["Sarapan", report.sarapan ?? "-"],
            ["Snack Pagi", report.snack_pagi ?? "-"],
            ["Makan Siang", report.makan_siang ?? "-"],
            ["Snack Sore", report.snack_sore ?? "-"],
            ["Minum", report.minum_gelas ? `${report.minum_gelas} gelas` : "-"],
            ["Tidur Siang", report.tidur_siang ?? "-"],
            ["Durasi Tidur", report.durasi_tidur ?? "-"],
            ["BAK", report.bak_kali ? `${report.bak_kali} kali` : "-"],
            ["BAB", report.bab ?? "-"],
            ["Ibadah & Aktivitas", report.ibadah_checklist?.length ? report.ibadah_checklist.map((i: string) => `✅ ${i}`).join(", ") : "-"],
            ["Fitrah Distimulasi", report.fitrah_distimulasi?.length ? report.fitrah_distimulasi.map((f: string) => `${fitrahMap[f]?.icon ?? ""} ${fitrahMap[f]?.label ?? f}`).join(", ") : "-"],
          ].map(([label, value]) => (
            <div key={label as string} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
              <span className="font-medium text-gray-600 text-xs sm:text-sm">{label as string}</span>
              <span className="text-gray-800 text-sm sm:text-base">{value as string}</span>
            </div>
          ))}
          {report.observasi_guru && (
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
              <span className="font-medium text-gray-600 text-xs sm:text-sm">Observasi Guru</span>
              <span className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap">{report.observasi_guru}</span>
            </div>
          )}
          {report.catatan_ortu && (
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-3">
              <span className="font-medium text-gray-600 text-xs sm:text-sm">Catatan untuk Orang Tua</span>
              <span className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap">{report.catatan_ortu}</span>
            </div>
          )}
        </div>

        <div className="text-right text-xs text-gray-400 mt-6 pt-4 border-t">
          Status: {report.status === "terkirim" ? "✓ Terkirim" : "Draft"}
          {report.dikirim_at && ` · Dikirim: ${fmtDate(report.dikirim_at)} ${new Date(report.dikirim_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
        </div>
      </div>
    </DailyDetailClient>
  );
}
