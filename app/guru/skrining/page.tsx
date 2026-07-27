import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SkriningForm from "./form";

export default async function SkriningPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: siswaList } = await supabase
    .from("siswa")
    .select("id, nama, jenis_kelamin, tanggal_lahir, kelas")
    .eq("status", "aktif")
    .order("nama");

  return <SkriningForm siswaList={siswaList ?? []} />;
}
