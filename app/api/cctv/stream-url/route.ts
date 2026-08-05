import { NextResponse } from "next/server";
import { getUser, withApi, apiError } from "@/lib/auth";

// -----------------------------------------------------------------------------
// GET /api/cctv/stream-url
//
// Returns the list of CCTV cameras (name + HLS .m3u8 URL) for the Live CCTV
// page. This route is intentionally SERVER-ONLY:
//   - The real stream URLs live only in server-side environment variables
//     (CCTV_STREAM_URL_1, CCTV_STREAM_URL_2, ...), never in NEXT_PUBLIC_*
//     vars, never committed to the repo, and never present in the client
//     JS bundle or page source.
//   - Every request re-checks the Supabase session server-side. No session
//     cookie -> 401, no leaked URL. "Semua role" (guru/admin/ortu) yang
//     sudah login boleh akses, sesuai permintaan.
//   - Cache-Control: no-store so browsers/proxies/CDN never cache (and
//     thus never persist) the response containing the stream URLs.
//   - Very small in-memory rate limiter per user to blunt scripted abuse
//     of this endpoint (resets on server restart/redeploy; for stronger
//     guarantees on Vercel use Upstash/Redis-based limiting instead).
// -----------------------------------------------------------------------------

interface Camera {
  id: string;
  name: string;
  url: string;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const hitLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (hitLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  hitLog.set(key, hits);
  return hits.length > RATE_LIMIT_MAX_REQUESTS;
}

export const GET = withApi(async () => {
  const { supabase, user } = await getUser();

  // Defense in depth: middleware.ts already blocks unauthenticated access to
  // every non-public route, but this route checks again independently since
  // API routes should never trust a caller solely because a page redirected
  // them here.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile?.role) {
    return apiError(403, "Forbidden");
  }

  if (isRateLimited(user.id)) {
    return apiError(429, "Too many requests");
  }

  const cameras: Camera[] = [
    {
      id: "atas",
      name: "DayCare - Lantai Atas",
      url: process.env.CCTV_STREAM_URL_1 ?? "",
    },
    {
      id: "bawah",
      name: "DayCare - Lantai Bawah",
      url: process.env.CCTV_STREAM_URL_2 ?? "",
    },
  ].filter((cam) => cam.url);

  if (cameras.length === 0) {
    return apiError(503, "CCTV belum dikonfigurasi. Hubungi admin.");
  }

  return NextResponse.json(
    { cameras },
    {
      headers: {
        // Never cache a response that carries live stream URLs.
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
});
