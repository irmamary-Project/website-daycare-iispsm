import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GuruSidebarClient from "@/components/guru/SidebarClient";
import OrtuSidebarClient from "@/components/ortu/SidebarClient";

export default async function CCTVLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile?.role) redirect("/login");

  const { count } = await supabase.from("notifikasi")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id).eq("dibaca", false);

  const role = profile.role;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--cream)" }}>
      {role === "ortu" ? (
        <OrtuSidebarClient
          profile={profile}
          unreadCount={count ?? 0}
          anak={[]}
        />
      ) : (
        <GuruSidebarClient profile={profile} />
      )}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
