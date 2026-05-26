"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Registration {
  id?: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  lang: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "business" | "individual">("all");
  const [kvError, setKvError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) { router.refresh(); return; }
      const json = await res.json();
      setData(json.data ?? []);
      setKvError(!!json.kvError);
      setLastUpdate(new Date().toLocaleTimeString("vi-VN"));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 30_000);
    return () => clearInterval(t);
  }, [fetchData]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const exportCSV = () => {
    const BOM = "﻿";
    const header = "STT,Thời gian,Họ tên,Điện thoại,Email,Loại,Ngôn ngữ";
    const rows = data.map((r, i) =>
      `${i + 1},"${r.timestamp}","${r.name}","${r.phone}","${r.email}","${r.type}","${r.lang}"`
    );
    const blob = new Blob([BOM + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `davas2026-registrations-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
  };

  const filtered = data.filter(r => {
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filterType === "all" ||
      (filterType === "business" && r.type === "Doanh nghiệp") ||
      (filterType === "individual" && r.type === "Cá nhân");
    return matchSearch && matchType;
  });

  const bizCount = data.filter(r => r.type === "Doanh nghiệp").length;
  const indCount = data.filter(r => r.type === "Cá nhân").length;

  return (
    <div className="ocean-bg min-h-screen flex flex-col">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-3"
        style={{
          background: "rgba(5,15,35,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,212,255,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐬</span>
          <div>
            <p className="text-neon font-black text-base leading-tight">DUO GAME ADMIN</p>
            <p className="text-white/40 text-xs leading-none">DAVAS 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {lastUpdate && (
            <span className="text-white/35 text-xs hidden md:inline">
              Cập nhật {lastUpdate}
            </span>
          )}
          <button onClick={fetchData} className="btn-outline text-xs px-3 py-1.5">
            ↻ Làm mới
          </button>
          <button
            onClick={exportCSV}
            className="btn-outline text-xs px-3 py-1.5"
            style={{ color: "#00ff88", borderColor: "#00ff88" }}
          >
            ⬇ Xuất CSV
          </button>
          <button
            onClick={logout}
            className="btn-outline text-xs px-3 py-1.5"
            style={{ color: "#ff6b6b", borderColor: "#ff6b6b" }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
        {/* KV warning */}
        {kvError && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm"
            style={{ background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffb347" }}
          >
            ⚠️ Database chưa được kết nối. Chạy <code className="font-mono bg-white/10 px-1 rounded">vercel kv create duo-game-db</code> rồi redeploy để lưu dữ liệu.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-5">
          {[
            { label: "Tổng đăng ký", value: data.length, color: "#00d4ff", icon: "👥", key: "all" },
            { label: "Doanh nghiệp", value: bizCount, color: "#ffd700", icon: "🏢", key: "business" },
            { label: "Cá nhân", value: indCount, color: "#00ff88", icon: "👤", key: "individual" },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilterType(prev => prev === s.key ? "all" : s.key as typeof filterType)}
              className="glass-card p-4 text-center transition-all duration-200 cursor-pointer"
              style={{
                border: filterType === s.key ? `2px solid ${s.color}` : "1px solid rgba(255,255,255,0.1)",
                boxShadow: filterType === s.key ? `0 0 20px ${s.color}30` : "none",
              }}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black text-3xl" style={{ color: s.color, textShadow: `0 0 16px ${s.color}60` }}>
                {loading ? "—" : s.value}
              </div>
              <div className="text-white/55 text-xs mt-1">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            className="input-field"
            placeholder="🔍 Tìm kiếm theo tên, số điện thoại, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-neon font-bold animate-pulse text-lg">
              🐬 Đang tải dữ liệu...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              {data.length === 0
                ? "Chưa có người đăng ký nào"
                : "Không tìm thấy kết quả phù hợp"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "rgba(0,212,255,0.07)",
                      borderBottom: "1px solid rgba(0,212,255,0.2)",
                    }}
                  >
                    {["#", "Thời gian", "Họ tên", "Điện thoại", "Email", "Loại", "Ngôn ngữ"].map(h => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 whitespace-nowrap font-semibold"
                        style={{ color: "rgba(0,212,255,0.9)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id ?? i}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-white/35">{i + 1}</td>
                      <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{r.timestamp}</td>
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-white/80">{r.phone}</td>
                      <td className="px-4 py-3 text-white/70 max-w-[180px] truncate">{r.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                          style={{
                            background:
                              r.type === "Doanh nghiệp"
                                ? "rgba(255,215,0,0.15)"
                                : "rgba(0,255,136,0.12)",
                            color: r.type === "Doanh nghiệp" ? "#ffd700" : "#00ff88",
                            border: `1px solid ${r.type === "Doanh nghiệp" ? "rgba(255,215,0,0.3)" : "rgba(0,255,136,0.25)"}`,
                          }}
                        >
                          {r.type === "Doanh nghiệp" ? "🏢 DN" : "👤 CN"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/45 text-xs">{r.lang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-white/35 text-xs">
                Hiển thị {filtered.length}/{data.length} đăng ký
              </span>
              <span className="text-white/25 text-xs">↻ Tự động làm mới mỗi 30 giây</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
