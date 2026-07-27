import { createClient } from "@/lib/supabase/server";
import NotifikasiClient from "./NotifikasiClient";

export default async function NotifikasiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: notifikasi } = await supabase
    .from("notifikasi")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <NotifikasiClient notifikasi={notifikasi ?? []} userId={user.id} />;
}
