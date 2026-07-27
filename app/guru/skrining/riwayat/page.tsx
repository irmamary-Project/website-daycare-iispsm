import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RiwayatSkriningClient from "./RiwayatClient";

export default async function RiwayatSkriningPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: screenings } = await supabase
    .from("kpsp_screenings")
    .select("*, siswa(nama, kelas, tanggal_lahir)")
    .order("created_at", { ascending: false });

  return <RiwayatSkriningClient screenings={screenings ?? []} />;
}
