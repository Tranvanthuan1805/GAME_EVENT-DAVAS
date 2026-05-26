"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError("❌ Sai tên đăng nhập hoặc mật khẩu");
        setLoading(false);
      }
    } catch {
      setError("Lỗi kết nối, thử lại");
      setLoading(false);
    }
  };

  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-sm p-8 animate-pop-in text-center">
        <div className="text-6xl mb-3 animate-float inline-block">🐬</div>
        <h1 className="text-2xl font-black text-neon mb-0.5">DUO GAME ADMIN</h1>
        <p className="text-white/50 text-sm mb-7">DAVAS 2026 · Bảng điều khiển</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Tên đăng nhập
            </label>
            <input
              className="input-field"
              placeholder="admin"
              autoComplete="username"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                className="input-field pr-12"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors text-sm"
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-sm text-center py-2 px-3 rounded-xl animate-fade-in"
              style={{ background: "rgba(255,69,69,0.15)", border: "1px solid rgba(255,69,69,0.3)", color: "#ff8080" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !user || !pass}
            className="btn-neon py-4 mt-1 text-base"
            style={{ opacity: loading || !user || !pass ? 0.6 : 1 }}
          >
            {loading ? "⏳ Đang đăng nhập..." : "🔐 ĐĂNG NHẬP"}
          </button>
        </form>

        <p className="text-white/25 text-xs mt-5">
          Chỉ dành cho ban tổ chức DAVAS 2026
        </p>
      </div>
    </div>
  );
}
