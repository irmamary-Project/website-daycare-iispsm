import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdmissionApprovalClient from "./AdmissionApprovalClient";
import { type AdmissionSiswa } from "@/types";

export default async function AdminAdmissionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/guru/dashboard");

  const { data: pending } = await supabase
    .from("siswa")
    .select("*, profiles!siswa_ortu_id_fkey(full_name, email, phone)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: ditolak } = await supabase
    .from("siswa")
    .select("*, profiles!siswa_ortu_id_fkey(full_name, email, phone)")
    .eq("status", "ditolak")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-primary mb-1">📋 Persetujuan Pendaftaran</h1>
        <p className="text-sm text-gray-500">Setujui atau tolak pendaftaran siswa baru</p>
      </div>

      {(!pending || pending.length === 0) && (!ditolak || ditolak.length === 0) ? (
        <div className="card text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-sm">Tidak ada pendaftaran yang perlu diproses.</p>
          <p className="text-xs mt-1">Semua pendaftar sudah diproses.</p>
        </div>
      ) : (
        <>
          {pending && pending.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-lg font-bold text-primary mb-3">
                Menunggu Persetujuan <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full ml-2">{pending.length}</span>
              </h2>
              <div className="space-y-4">
                {pending.map((siswa: AdmissionSiswa) => (
                  <AdmissionApprovalClient key={siswa.id} siswa={siswa} />
                ))}
              </div>
            </div>
          )}

          {ditolak && ditolak.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-gray-500 mb-3">
                Ditolak <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full ml-2">{ditolak.length}</span>
              </h2>
              <div className="space-y-3">
                {ditolak.map((siswa: AdmissionSiswa) => (
                  <div key={siswa.id} className="card bg-red-50 border-red-200 !p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-800">{siswa.nama}</span>
                        <span className="text-sm text-gray-500 ml-2">({siswa.kelas})</span>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {siswa.profiles?.full_name} · {siswa.profiles?.email}
                        </div>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Ditolak</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
