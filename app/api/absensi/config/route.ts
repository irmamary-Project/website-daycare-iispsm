import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("geofence_config")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: "Config not found" }, { status: 500 });
  }

  return NextResponse.json(data);
}
