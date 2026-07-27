import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DataSiswaClient from "./DataSiswaClient";

export default async function DataSiswaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  const { data: siswaList } = await supabase
    .from("siswa")
    .select("*, ortu:profiles!siswa_ortu_id_fkey(id, full_name, phone)")
    .order("nama");

  // All orang tua profiles (for linking)
  const { data: ortuList } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "ortu")
    .order("full_name");

  return <DataSiswaClient siswaList={siswaList ?? []} ortuList={ortuList ?? []} isAdmin={profile?.role === "admin"} />;
}
