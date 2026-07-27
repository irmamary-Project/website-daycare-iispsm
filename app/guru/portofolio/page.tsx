import { createClient } from "@/lib/supabase/server";
import PortofolioClient from "./PortofolioClient";

export default async function PortofolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: siswaList } = await supabase.from("siswa").select("id, nama, kelas").eq("status", "aktif").order("nama");
  return <PortofolioClient siswaList={siswaList ?? []} guruId={user.id} />;
}
