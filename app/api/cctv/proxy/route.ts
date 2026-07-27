import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CAMERA_URLS: Record<string, string | undefined> = {
  atas: process.env.CCTV_STREAM_URL_1,
  bawah: process.env.CCTV_STREAM_URL_2,
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cam = searchParams.get("cam");
  const seg = searchParams.get("seg");

  if (!cam || !CAMERA_URLS[cam]) {
    return NextResponse.json({ error: "Invalid camera" }, { status: 400 });
  }

  const baseUrl = CAMERA_URLS[cam]!;
  const dir = baseUrl.substring(0, baseUrl.lastIndexOf("/") + 1);

  if (seg) {
    const segmentUrl = new URL(seg, dir).toString();
    const segRes = await fetch(segmentUrl);
    if (!segRes.ok) {
      return new NextResponse(null, { status: segRes.status });
    }
    const buffer = await segRes.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": segRes.headers.get("content-type") || "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const m3u8Res = await fetch(baseUrl);
  if (!m3u8Res.ok) {
    return NextResponse.json({ error: "Stream unavailable" }, { status: 502 });
  }

  const text = await m3u8Res.text();
  const proxyPath = `/api/cctv/proxy?cam=${cam}`;

  const rewritten = text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("<")) return line;
      const absoluteUrl = new URL(trimmed, dir).toString();
      if (absoluteUrl.endsWith(".m3u8")) {
        return proxyPath;
      }
      return `${proxyPath}&seg=${encodeURIComponent(absoluteUrl)}`;
    })
    .join("\n");

  return new NextResponse(rewritten, {
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
}
