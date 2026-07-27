import { createClient } from "@/lib/supabase/server";
import PengumumanClient from "./PengumumanClient";

export default async function PengumumanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: list } = await supabase.from("pengumuman").select("*").order("created_at", { ascending: false });
  return <PengumumanClient list={list ?? []} guruId={user.id} />;
}
