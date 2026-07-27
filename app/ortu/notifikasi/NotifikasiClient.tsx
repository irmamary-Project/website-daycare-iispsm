"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notifikasi } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const TIPE_CONFIG: Record<string, { icon: string; color: string }> = {
  daily_report: { icon: "✅", color: "bg-green-50 text-green-700" },
  portofolio:   { icon: "📷", color: "bg-blue-50 text-blue-700" },
  laporan:      { icon: "📋", color: "bg-orange-50 text-orange-700" },
  pengumuman:   { icon: "📣", color: "bg-yellow-50 text-yellow-700" },
  sistem:       { icon: "⚙️", color: "bg-gray-50 text-gray-700" },
};

export default function NotifikasiClient({ notifikasi: initial, userId }: { notifikasi: Notifikasi[]; userId: string }) {
  const supabase = createClient();
  const [notifikasi, setNotifikasi] = useState(initial);
  const [marking, setMarking] = useState(false);

  async function markAllRead() {
    setMarking(true);
    await supabase.from("notifikasi").update({ dibaca: true }).eq("user_id", userId).eq("dibaca", false);
    setNotifikasi(prev => prev.map(n => ({ ...n, dibaca: true })));
    setMarking(false);
  }

  async function markOneRead(id: string) {
    await supabase.from("notifikasi").update({ dibaca: true }).eq("id", id);
    setNotifikasi(prev => prev.map(n => n.id === id ? { ...n, dibaca: true } : n));
  }

  const unreadCount = notifikasi.filter(n => !n.dibaca).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">🔔 Notifikasi</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} disabled={marking} className="btn-outline text-sm">
            {marking ? "Menandai..." : "✓ Tandai Semua Dibaca"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifikasi.map(n => {
          const cfg = TIPE_CONFIG[n.tipe] ?? TIPE_CONFIG.sistem;
          return (
            <div
              key={n.id}
              onClick={() => !n.dibaca && markOneRead(n.id)}
              className={`card flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${
                !n.dibaca ? "border-[var(--primary-mid)] bg-[#f0f1fa]" : "opacity-70"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${!n.dibaca ? "text-gray-900" : "text-gray-600"}`}>
                    {n.judul}
                  </p>
                  {!n.dibaca && (
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-mid)] flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.pesan}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(n.created_at), "EEEE, d MMM yyyy · HH:mm", { locale: id })}
                </p>
              </div>
            </div>
          );
        })}
        {notifikasi.length === 0 && (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔔</div>
            <p>Belum ada notifikasi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
