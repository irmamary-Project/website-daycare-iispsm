import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GuruSidebarClient from "@/components/guru/SidebarClient";

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "guru" && profile?.role !== "admin") redirect("/ortu/dashboard");

  const { count } = await supabase.from("notifikasi")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id).eq("dibaca", false);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--cream)" }}>
      <GuruSidebarClient profile={profile} unreadCount={count ?? 0} />
      {/* pt-14 = tinggi mobile topbar (56px), lg:pt-0 = desktop tidak perlu */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
