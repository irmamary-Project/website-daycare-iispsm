import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cek admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: siswa } = await supabase
    .from("siswa")
    .select("*, ortu:profiles!siswa_ortu_id_fkey(full_name, phone)")
    .order("nama");

  if (!siswa) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }

  // Build CSV
  const headers = ["nama", "jenis_kelamin", "tanggal_lahir", "kelas", "ortu_nama", "ortu_phone", "status", "catatan"];
  const rows = siswa.map((s: any) => [
    s.nama,
    s.jenis_kelamin ?? "",
    s.tanggal_lahir ?? "",
    s.kelas,
    s.ortu?.full_name ?? "",
    s.ortu?.phone ?? "",
    s.status,
    s.catatan ?? "",
  ]);

  function escapeCsv(val: string) {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }

  const csv = [
    headers.join(","),
    ...rows.map(row => row.map(escapeCsv).join(","))
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="data-siswa-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
