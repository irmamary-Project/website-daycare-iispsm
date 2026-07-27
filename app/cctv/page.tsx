import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LiveCCTVClient from "@/components/cctv/LiveCCTVClient";

// Keep this page out of search engines and AI/LLM crawlers. This is
// belt-and-suspenders on top of middleware auth + robots.ts, since this
// page shows a live feed of children at the daycare.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default async function CCTVPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middleware.ts already redirects unauthenticated visitors, but a page
  // should never assume a request reached it legitimately just because
  // middleware normally runs first.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Any authenticated role (guru, admin, ortu) may view — this page is
  // intentionally outside /guru and /ortu so it isn't restricted to one
  // role, per requirement "live cctv berlaku untuk semua role".
  if (!profile?.role) redirect("/login");

  return (
    <main className="min-h-screen p-6" style={{ background: "var(--cream)" }}>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Live CCTV</h1>
      <LiveCCTVClient />
    </main>
  );
}
