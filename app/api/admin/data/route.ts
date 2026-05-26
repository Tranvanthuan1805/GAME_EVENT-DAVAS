import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { isAuthenticated, AUTH_COOKIE } from "@/lib/admin-auth";
import type { Registration } from "@/app/api/register/route";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!isAuthenticated(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await kv.lrange<Registration>("duo:registrations", 0, -1);
    return NextResponse.json({ success: true, data: items ?? [] });
  } catch (e) {
    console.error("[kv:data]", e);
    return NextResponse.json({ success: true, data: [], kvError: true });
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!isAuthenticated(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await kv.del("duo:registrations");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
