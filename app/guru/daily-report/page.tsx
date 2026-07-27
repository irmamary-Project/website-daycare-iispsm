import { createClient } from "@/lib/supabase/server";
import DailyReportClient from "./DailyReportClient";

export default async function DailyReportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: siswaList } = await supabase
    .from("siswa").select("id, nama, kelas").eq("status", "aktif").order("nama");

  return <DailyReportClient siswaList={siswaList ?? []} guruId={user.id} />;
}
