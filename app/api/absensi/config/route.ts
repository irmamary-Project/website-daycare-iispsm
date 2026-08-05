import { NextResponse } from "next/server";
import { getUser, withApi, apiError } from "@/lib/auth";

export const GET = withApi(async () => {
  const { supabase } = await getUser();

  const { data, error } = await supabase
    .from("geofence_config")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return apiError(404, "Config not found");
  }

  return NextResponse.json(data);
});
