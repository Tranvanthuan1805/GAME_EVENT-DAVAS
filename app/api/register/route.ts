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

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function notifyTelegram(reg: Registration): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const icon = reg.type === "Doanh nghiệp" ? "🏢" : "👤";
  const text = [
    `🐬 <b>Đăng ký mới · DUO GAME DAVAS 2026</b>`,
    ``,
    `📛 <b>Họ tên:</b> ${esc(reg.name)}`,
    `📱 <b>SĐT:</b> <code>${esc(reg.phone)}</code>`,
    `📧 <b>Email:</b> ${esc(reg.email)}`,
    `${icon} <b>Loại:</b> ${reg.type}`,
    `🌐 <b>Ngôn ngữ:</b> ${reg.lang}`,
    `⏰ <b>Thời gian:</b> ${reg.timestamp}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[telegram] failed:", res.status, err);
  }
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

  // Await both in parallel — Vercel sẽ không kill function trước khi hoàn thành
  await Promise.allSettled([
    notifyTelegram(reg),
    redis
      ? redis.lpush("duo:registrations", JSON.stringify(reg)).catch((e) =>
          console.error("[redis]", e)
        )
      : Promise.resolve(),
  ]);

  return NextResponse.json({ success: true });
}
