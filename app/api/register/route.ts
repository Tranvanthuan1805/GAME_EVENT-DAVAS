import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const scriptUrl = process.env.SHEET_API_URL;

  if (!scriptUrl) {
    // Game still works without the sheet configured
    return NextResponse.json({ success: true, note: "sheet_not_configured" });
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        timestamp: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        name: data.name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        type: data.type === "business" ? "Doanh nghiệp" : "Cá nhân",
        lang: data.lang === "vi" ? "Tiếng Việt" : "English",
      }),
    });

    const text = await res.text();
    return NextResponse.json({ success: true, sheetResponse: text });
  } catch (err) {
    // Never block the game – sheet write is best-effort
    console.error("[sheet]", err);
    return NextResponse.json({ success: true, sheetError: String(err) });
  }
}
