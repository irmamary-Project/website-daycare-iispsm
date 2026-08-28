import { NextResponse } from "next/server";

export async function GET() {
  const uploadUrl = process.env.NEXT_UPLOAD_URL;
  if (!uploadUrl) {
    return NextResponse.json({ error: "Upload URL not configured" }, { status: 500 });
  }
  return NextResponse.json({ uploadUrl });
}
