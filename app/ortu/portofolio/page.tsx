import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FITRAH_LIST } from "@/lib/constants";
import { DailyReport, Portofolio } from "@/types";
import PortfolioMedia from "./Lightbox";
import PDFExportButton from "@/components/riwayat/PDFExportButton";

export default async function OrtuPortofolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: anak } = await supabase.from("siswa").select("id, nama").eq("ortu_id", user.id);
  const anakIds = anak?.map(a => a.id) ?? [];

  const { data: portofolio } = await supabase
    .from("portofolio")
    .select("*, siswa(nama, kelas), portofolio_media(*)")
    .in("siswa_id", anakIds)
    .eq("status", "terkirim")
    .order("tanggal", { ascending: false });

  const { data: dailyReports } = await supabase
    .from("daily_reports")
    .select("*,siswa(nama, kelas)")
    .in("siswa_id", anakIds)
    .eq("status", "terkirim")
    .order("tanggal", { ascending: false })
    .limit(10);

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-bold text-primary mb-2">📷 Portofolio & Laporan Harian</h1>
      <p className="text-sm text-gray-500 mb-8">Dokumentasi kegiatan dan perkembangan si kecil</p>

      {/* Daily Reports */}
      {dailyReports && dailyReports.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-primary mb-4">📋 Laporan Harian Terbaru</h2>
          <div className="space-y-4">
            {dailyReports.map((r: DailyReport) => (
              <div key={r.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-semibold text-gray-800">{r.siswa?.nama}</span>
                    <span className="text-sm text-gray-400 ml-2">{format(new Date(r.tanggal), "EEEE, d MMMM yyyy", { locale: id })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={r.kehadiran === "Hadir" ? "badge-hadir" : "badge-izin"}>{r.kehadiran}</span>
                    <PDFExportButton type="daily" data={r} filename={`daily-report-${r.siswa?.nama ?? "siswa"}_${r.tanggal}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[
                    { icon: r.mood_datang === "senang" ? "😊" : r.mood_datang === "sedih" ? "😢" : "😐", label: "Mood Datang", val: r.mood_datang ?? "–" },
                    { icon: "🍽️", label: "Makan Siang", val: r.makan_siang ?? "–" },
                    { icon: "💤", label: "Tidur Siang", val: r.tidur_siang ?? "–" },
                    { icon: "🌡️", label: "Suhu", val: r.suhu_tubuh ? `${r.suhu_tubuh}°C` : "–" },
                  ].map(item => (
                    <div key={item.label} className="bg-cream rounded-xl p-2.5 text-center">
                      <div className="text-xl mb-0.5">{item.icon}</div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-xs font-medium text-gray-700 capitalize mt-0.5">{item.val}</div>
                    </div>
                  ))}
                </div>

                {r.fitrah_distimulasi?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.fitrah_distimulasi.map((key: string) => {
                      const f = FITRAH_LIST.find(fl => fl.key === key);
                      return f ? <span key={key} className="text-xs bg-primary-pale text-primary px-2 py-0.5 rounded-full">{f.icon} {f.label}</span> : null;
                    })}
                  </div>
                )}

                {r.observasi_guru && (
                  <div className="bg-primary-pale rounded-xl px-3 py-2 mt-2">
                    <p className="text-xs font-semibold text-primary mb-0.5">Observasi Guru:</p>
                    <p className="text-sm text-gray-700">{r.observasi_guru}</p>
                  </div>
                )}
                {r.catatan_ortu && (
                  <div className="bg-gold-pale rounded-xl px-3 py-2 mt-2">
                    <p className="text-xs font-semibold text-gold-dark mb-0.5">Pesan untuk Orang Tua:</p>
                    <p className="text-sm text-gray-700">{r.catatan_ortu}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portofolio */}
      <h2 className="font-display text-xl font-bold text-primary mb-4">🖼️ Portofolio Foto & Video</h2>
      {(!portofolio || portofolio.length === 0) ? (
        <div className="card text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📷</div>
          <p>Belum ada portofolio yang dikirim.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {portofolio.map((p: Portofolio) => (
            <div key={p.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{p.siswa?.nama}</span>
                    <span className="text-sm text-gray-400">{format(new Date(p.tanggal), "d MMMM yyyy", { locale: id })}</span>
                  </div>
                  {p.fitrah?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.fitrah.map((key: string) => {
                        const f = FITRAH_LIST.find(fl => fl.key === key);
                        return f ? <span key={key} className="text-xs bg-primary-pale text-primary px-2 py-0.5 rounded-full">{f.icon} {f.label}</span> : null;
                      })}
                    </div>
                  )}
                </div>
                <PDFExportButton type="portofolio" data={p} filename={`portofolio-${p.siswa?.nama ?? "siswa"}_${p.tanggal}`} />
              </div>

              {p.portofolio_media && p.portofolio_media.length > 0 && (
                <PortfolioMedia media={p.portofolio_media} />
              )}

              {p.observasi && (
                <div className="bg-primary-pale rounded-xl px-3 py-2 mb-2">
                  <p className="text-xs font-semibold text-primary mb-0.5">Observasi Guru:</p>
                  <p className="text-sm text-gray-700">{p.observasi}</p>
                </div>
              )}
              {p.catatan_ortu && (
                <div className="bg-gold-pale rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold text-gold-dark mb-0.5">Pesan untuk Orang Tua:</p>
                  <p className="text-sm text-gray-700">{p.catatan_ortu}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
