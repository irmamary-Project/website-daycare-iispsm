import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RiwayatFilter from "./RiwayatFilter";

const DETAIL_LINKS: Record<string, (id: string) => string> = {
  daily:   (id) => `/guru/riwayat/daily/${id}`,
  porto:   (id) => `/guru/riwayat/porto/${id}`,
  laporan: (id) => `/guru/riwayat/laporan/${id}`,
};

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { start, end } = await searchParams;
  const supabase = await createClient();

  const startDate = start && !isNaN(Date.parse(start)) ? start : undefined;
  const endDate = end && !isNaN(Date.parse(end)) ? end : undefined;

  function filterDate(q: any, col = "created_at") {
    let query = q;
    if (startDate) query = query.gte(col, startDate);
    if (endDate) query = query.lte(col, `${endDate}T23:59:59.999Z`);
    return query;
  }

  const [{ data: dailyReports }, { data: portofolios }, { data: laporans }] = await Promise.all([
    filterDate(supabase.from("daily_reports").select("*, siswa(nama)"), "created_at")
      .order("created_at", { ascending: false }).limit(50),
    filterDate(supabase.from("portofolio").select("*, siswa(nama), portofolio_media(id)"), "created_at")
      .order("created_at", { ascending: false }).limit(50),
    filterDate(supabase.from("laporan_triwulan").select("*, siswa(nama)"), "created_at")
      .order("created_at", { ascending: false }).limit(50),
  ]);

  // Merge and sort all
  const all = [
    ...(dailyReports ?? []).map((r: any) => ({ ...r, _type: "daily" as const, _date: r.created_at })),
    ...(portofolios ?? []).map((r: any) => ({ ...r, _type: "porto" as const, _date: r.created_at })),
    ...(laporans ?? []).map((r: any) => ({ ...r, _type: "laporan" as const, _date: r.created_at })),
  ].sort((a, b) => new Date(b._date).getTime() - new Date(a._date).getTime());

  const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
    daily:   { icon: "✅", label: "Daily Report",     color: "bg-green-50 text-green-700" },
    porto:   { icon: "📷", label: "Portofolio",       color: "bg-blue-50 text-blue-700" },
    laporan: { icon: "📋", label: "Laporan Triwulan", color: "bg-orange-50 text-orange-700" },
  } as const;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">🕘 Riwayat</h1>
          <p className="text-sm text-gray-500 mt-1">Semua laporan dan portofolio yang telah dibuat</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
        <RiwayatFilter start={start ?? ""} end={end ?? ""} />
      </div>

      <div className="space-y-3">
        {all.map((item: any) => {
          const cfg = typeConfig[item._type];
          const href = DETAIL_LINKS[item._type]?.(item.id);
          return (
            <Link
              key={`${item._type}-${item.id}`}
              href={href ?? "#"}
              className="card flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer !no-underline"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800">
                  {cfg.label} – {item.siswa?.nama ?? "–"}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {item._type === "laporan" ? `Periode ${item.periode}` : format(new Date(item.tanggal || item._date), "d MMMM yyyy", { locale: id })}
                  {" · "}
                  {item._type === "porto" && `${item.portofolio_media?.length ?? 0} media`}
                  {item._type === "daily" && item.kehadiran}
                  {item._type === "laporan" && item.tahun}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={item.status === "terkirim" ? "badge-sent" : "badge-draft"}>
                  {item.status === "terkirim" ? "Terkirim" : "Draft"}
                </span>
              </div>
            </Link>
          );
        })}
        {all.length === 0 && (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Belum ada laporan atau portofolio{startDate || endDate ? " dengan filter tersebut" : ""}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
