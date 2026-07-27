import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "@/styles/energia-theme.css"
import OrtuSidebarClient from "@/components/ortu/SidebarClient";

export default async function OrtuLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "ortu" && profile?.role !== "admin") redirect("/guru/dashboard");

  const { count } = await supabase.from("notifikasi")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id).eq("dibaca", false);

  const { data: anak } = await supabase.from("siswa")
    .select("id, nama, kelas").eq("ortu_id", user.id).eq("status", "aktif");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--cream)" }}>
      <OrtuSidebarClient profile={profile} unreadCount={count ?? 0} anak={anak ?? []} />
      {/* pt-14 = tinggi mobile topbar (56px), lg:pt-0 = desktop tidak perlu */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
