import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Portofolio, PortofolioMedia } from "@/types";


export default async function OrtuDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: anak } = await supabase.from("siswa")
    .select("*").eq("ortu_id", user.id).eq("status", "aktif");

  const { data: pendingAnak } = await supabase.from("siswa")
    .select("id", { count: "exact", head: true }).eq("ortu_id", user.id).eq("status", "pending");

  if (!anak || anak.length === 0) {
    if (pendingAnak && pendingAnak.length > 0) {
      return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">Menunggu Persetujuan</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Pendaftaran <strong>{pendingAnak.length}</strong> anak Anda sedang diproses oleh admin.
              Silakan tunggu konfirmasi dalam 1x24 jam. Kami akan memberi tahu jika sudah disetujui.
            </p>
            <div className="card bg-yellow-50 border-yellow-200 text-sm text-gray-700">
              <p className="font-medium mb-1">Email akun Anda:</p>
              <p className="font-mono text-xs">{user?.email}</p>
              <p className="text-gray-500 text-xs mt-2">Hubungi admin jika ada pertanyaan.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🧒</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-3">Akun Belum Terhubung</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Akun Anda belum dihubungkan ke data anak. Silakan hubungi guru atau admin IIS PSM Daycare untuk menghubungkan akun Anda dengan data anak.
          </p>
          <div className="card bg-primary-pale border-primary-border text-sm text-primary">
            <p className="font-medium mb-1">Email akun Anda:</p>
            <p className="font-mono text-xs">{user?.email}</p>
            <p className="text-gray-500 text-xs mt-2">Berikan email ini ke pihak sekolah.</p>
          </div>
        </div>
      </div>
    );
  }

  // Ambil data untuk anak pertama (atau bisa expand untuk multiple anak)
  const anakIds = anak.map(a => a.id);

  const [{ data: recentDailyReports }, { data: recentPortofolio }, { data: recentLaporan }, { count: unreadNotif }] = await Promise.all([
    supabase.from("daily_reports").select("*, siswa(nama)").in("siswa_id", anakIds)
      .eq("status", "terkirim").order("tanggal", { ascending: false }).limit(3),
    supabase.from("portofolio").select("*, siswa(nama), portofolio_media(id, url, tipe)")
      .in("siswa_id", anakIds).eq("status", "terkirim").order("tanggal", { ascending: false }).limit(3),
    supabase.from("laporan_triwulan").select("*, siswa(nama)")
      .in("siswa_id", anakIds).eq("status", "terkirim").order("created_at", { ascending: false }).limit(2),
    supabase.from("notifikasi").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("dibaca", false),
  ]);

  const latestReport = recentDailyReports?.[0];

  // Server component: timestamp dinamis per request, bukan render murni.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">Assalamu&apos;alaikum 👋</h1>
        <p className="text-sm text-gray-500 mt-1">{format(new Date(nowMs), "EEEE, d MMMM yyyy", { locale: id })}</p>
      </div>

      {/* Anak cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {anak.map(a => {
          const usia = a.tanggal_lahir
            ? Math.floor((nowMs - new Date(a.tanggal_lahir).getTime()) / (1000*60*60*24*365))
            : null;
          return (
            <div key={a.id} className="card" style={{ borderLeft: "4px solid var(--primary-mid)" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-pale flex items-center justify-center text-primary font-bold">
                  {a.nama.split(" ").map((w: string) => w[0]).slice(0,2).join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{a.nama}</div>
                  <div className="text-sm text-gray-400">{a.kelas}{usia ? ` · ${usia} tahun` : ""}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Notifikasi Baru", value: unreadNotif ?? 0, icon: "🔔", href: "/ortu/notifikasi", color: "bg-amber-pale" },
          { label: "Portofolio Bulan Ini", value: recentPortofolio?.length ?? 0, icon: "📷", href: "/ortu/portofolio", color: "bg-teal-pale" },
          { label: "Laporan Tersedia", value: recentLaporan?.length ?? 0, icon: "📋", href: "/ortu/laporan", color: "bg-logo-green-pale" },
        ].map(s => (
          <Link key={s.href} href={s.href} className={`card ${s.color} hover:shadow-md transition-shadow`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Latest daily report */}
      {latestReport && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">📋 Laporan Harian Terbaru</h3>
            <Link href="/ortu/portofolio" className="text-xs text-primary-mid hover:underline">Lihat semua →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: latestReport.mood_datang === "senang" ? "😊" : latestReport.mood_datang === "sedih" ? "😢" : "😐", label: "Mood Datang", value: latestReport.mood_datang ?? "–" },
              { icon: "🍽️", label: "Makan Siang", value: latestReport.makan_siang ?? "–" },
              { icon: "💤", label: "Tidur Siang", value: latestReport.tidur_siang ?? "–" },
              { icon: "🌡️", label: "Suhu", value: latestReport.suhu_tubuh ? `${latestReport.suhu_tubuh}°C` : "–" },
            ].map(item => (
              <div key={item.label} className="text-center bg-cream rounded-xl p-3">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                <div className="text-sm font-medium text-gray-700 capitalize">{item.value}</div>
              </div>
            ))}
          </div>
          {latestReport.catatan_ortu && (
            <div className="mt-4 bg-primary-pale rounded-xl px-4 py-3">
              <p className="text-xs text-primary font-semibold mb-1">📝 Pesan dari Guru:</p>
              <p className="text-sm text-gray-700">{latestReport.catatan_ortu}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent portofolio */}
      {recentPortofolio && recentPortofolio.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">📷 Portofolio Terbaru</h3>
            <Link href="/ortu/portofolio" className="text-xs text-primary-mid hover:underline">Lihat semua →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recentPortofolio.slice(0,3).map((p: Portofolio) => {
              const foto = p.portofolio_media?.find((m: PortofolioMedia) => m.tipe === "foto");
              return (
                <div key={p.id} className="rounded-xl overflow-hidden bg-primary-pale aspect-square flex items-center justify-center relative">
                  {foto ? (
                    <img src={foto.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📷</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 text-center">
                    {format(new Date(p.tanggal), "d MMM", { locale: id })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
