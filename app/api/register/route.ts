import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export interface Registration {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  lang: string;
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const reg: Registration = {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    name: (data.name ?? "").trim(),
    phone: (data.phone ?? "").trim(),
    email: (data.email ?? "").trim(),
    type: data.type === "business" ? "Doanh nghiệp" : "Cá nhân",
    lang: data.lang === "vi" ? "Tiếng Việt" : "English",
  };

  try {
    if (redis) {
      await redis.lpush("duo:registrations", JSON.stringify(reg));
    }
  } catch (e) {
    console.error("[redis:register]", e);
  }

  return NextResponse.json({ success: true });
}
