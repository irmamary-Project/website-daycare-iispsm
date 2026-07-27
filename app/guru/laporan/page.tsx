import { createClient } from "@/lib/supabase/server";
import LaporanClient from "./LaporanClient";

export default async function LaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: siswaList } = await supabase.from("siswa").select("id, nama, kelas").eq("status", "aktif").order("nama");
  return <LaporanClient siswaList={siswaList ?? []} guruId={user.id} />;
}
