"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { type AdmissionSiswa } from "@/types";

export { type AdmissionSiswa };

export default function AdmissionApprovalClient({ siswa }: { siswa: AdmissionSiswa }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    const { error } = await supabase
      .from("siswa")
      .update({ status: "aktif" })
      .eq("id", siswa.id);

    if (!error) {
      router.refresh();
    }
    setLoading(null);
  }

  async function handleReject() {
    setLoading("reject");
    const { error } = await supabase
      .from("siswa")
      .update({ status: "ditolak" })
      .eq("id", siswa.id);

    if (!error) {
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div className="card !p-4 border-l-4 border-l-yellow-400">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800">{siswa.nama}</span>
            <span className="text-xs bg-primary-pale text-primary px-2 py-0.5 rounded-full">{siswa.kelas}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
            <div>👤 {siswa.profiles?.full_name}</div>
            <div>📧 {siswa.profiles?.email}</div>
            {siswa.profiles?.phone && <div>📞 {siswa.profiles?.phone}</div>}
            <div>👶 {siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}{siswa.tanggal_lahir ? ` · ${new Date(siswa.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : ""}</div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            disabled={loading !== null}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {loading === "reject" ? "..." : "Tolak"}
          </button>
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading === "approve" ? "..." : "Setujui"}
          </button>
        </div>
      </div>
    </div>
  );
}
