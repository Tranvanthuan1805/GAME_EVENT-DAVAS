import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { isAuthenticated, AUTH_COOKIE } from "@/lib/admin-auth";
import type { Registration } from "@/app/api/register/route";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!isAuthenticated(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!redis) {
    return NextResponse.json({ success: true, data: [], redisError: true });
  }

  try {
    const raw = await redis.lrange("duo:registrations", 0, -1);
    const data: Registration[] = raw.map(item =>
      typeof item === "string" ? JSON.parse(item) : item
    );
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[redis:data]", e);
    return NextResponse.json({ success: true, data: [], redisError: true });
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!isAuthenticated(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!redis) return NextResponse.json({ success: false, error: "no_redis" });

  try {
    await redis.del("duo:registrations");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
