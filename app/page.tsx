"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 20 + Math.random() * 60,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 10,
}));

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const t = {
    vi: {
      subtitle: "Sự kiện DAVAS 2026",
      tagline: "Ý tưởng thăng hoa · Dòng vốn lan tỏa",
      desc: "Thách thức kiến thức của bạn về Startup, Đầu tư & DAVAS 2026",
      start: "BẮT ĐẦU CHƠI",
      questions: "26 câu hỏi · 10 câu/lượt",
      timer: "⏱ 20 giây/câu",
      score: "🏆 Điểm cao",
      powered: "Powered by",
    },
    en: {
      subtitle: "DAVAS 2026 Event",
      tagline: "Ideas Soar · Capital Flows",
      desc: "Test your knowledge of Startups, Investment & DAVAS 2026",
      start: "START PLAYING",
      questions: "26 questions · 10 per round",
      timer: "⏱ 20 sec/question",
      score: "🏆 High score",
      powered: "Powered by",
    },
  }[lang];

  return (
    <div className="ocean-bg min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Bubbles */}
      {mounted && BUBBLES.map((b) => (
        <div
          key={b.id}
          className="bubble animate-bubble"
          style={{
            width: b.size, height: b.size,
            left: `${b.left}%`,
            bottom: "-80px",
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}

      {/* Language toggle */}
      <div className="absolute top-6 right-6 lang-toggle z-10">
        <button className={`lang-btn ${lang === "vi" ? "active" : ""}`} onClick={() => setLang("vi")}>🇻🇳 VI</button>
        <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>🇺🇸 EN</button>
      </div>

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">

        {/* Dolphin icon */}
        <div className="animate-float mb-2 select-none">
          <span style={{ fontSize: "clamp(80px, 18vw, 120px)", lineHeight: 1, filter: "drop-shadow(0 0 30px rgba(0,212,255,0.6))" }}>
            🐬
          </span>
        </div>

        {/* Title */}
        <div className="mb-1">
          <h1
            className="font-black text-neon"
            style={{
              fontSize: "clamp(3rem, 10vw, 5rem)",
              letterSpacing: "-1px",
              textShadow: "0 0 30px rgba(0,212,255,0.9), 0 0 60px rgba(0,212,255,0.4)",
            }}
          >
            DUO GAME
          </h1>
        </div>

        {/* DAVAS badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-3"
          style={{
            background: "rgba(255,215,0,0.1)",
            border: "1.5px solid rgba(255,215,0,0.5)",
            boxShadow: "0 0 20px rgba(255,215,0,0.2)",
          }}
        >
          <span style={{ fontSize: "1rem" }}>⭐</span>
          <span className="text-gold font-bold text-sm tracking-wider uppercase">{t.subtitle}</span>
          <span style={{ fontSize: "1rem" }}>⭐</span>
        </div>

        {/* Tagline */}
        <p className="text-cyan-400 font-semibold text-base mb-3 opacity-90">
          {t.tagline}
        </p>

        {/* Description */}
        <p className="text-white/70 text-sm mb-8 max-w-sm leading-relaxed">
          {t.desc}
        </p>

        {/* Stats row */}
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {[t.questions, t.timer, t.score].map((s, i) => (
            <div key={i} className="glass-card px-4 py-2 text-sm text-white/80 font-medium">
              {s}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className="btn-neon text-lg px-12 py-4 mb-6 w-full max-w-xs animate-glow"
          onClick={() => router.push("/register")}
        >
          🎮 {t.start}
        </button>

        {/* Powered by */}
        <div className="flex items-center gap-2 opacity-60">
          <span className="text-white/50 text-xs">{t.powered}</span>
          <span className="text-white/80 text-sm font-bold tracking-wider">DUO TECH</span>
          <span style={{ fontSize: "1.1rem" }}>🐬</span>
        </div>

      </div>

      {/* Bottom wave decoration */}
      <div
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,212,255,0.04), transparent)",
        }}
      />
    </div>
  );
}
