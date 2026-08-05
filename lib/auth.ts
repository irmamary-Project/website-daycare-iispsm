import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function apiError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

type RouteContext = { params?: Promise<Record<string, string>> };

export function withApi(
  handler: (request: Request, context: RouteContext) => Promise<NextResponse>
) {
  return async (request: Request, context: RouteContext): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (e) {
      if (e instanceof ApiError) {
        return NextResponse.json({ error: e.message }, { status: e.status });
      }
      console.error("API error:", e);
      return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
    }
  };
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new ApiError(401, "Unauthorized");
  return { supabase, user };
}

export async function requireRole(...roles: Role[]) {
  const { supabase, user } = await getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile?.role || !roles.includes(profile.role)) {
    throw new ApiError(403, "Forbidden");
  }
  return { supabase, user, role: profile.role };
}

export function requireAdmin() {
  return requireRole("admin");
}

export async function readBody<T = Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "Body tidak valid");
  }
}
