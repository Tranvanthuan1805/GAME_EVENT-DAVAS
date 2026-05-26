"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const RANKS = {
  vi: [
    { min: 90, label: "XUẤT SẮC", emoji: "🏆", color: "#ffd700", msg: "Bạn là chuyên gia DAVAS! Tuyệt vời!" },
    { min: 70, label: "GIỎI", emoji: "🥇", color: "#00ff88", msg: "Kiến thức tốt! Tiếp tục phát huy!" },
    { min: 50, label: "KHÁ", emoji: "🥈", color: "#00d4ff", msg: "Không tệ! Hãy thử lại để tốt hơn!" },
    { min: 0,  label: "CỐ GẮNG HƠN", emoji: "💪", color: "#ff9900", msg: "Hãy tìm hiểu thêm về DAVAS 2026!" },
  ],
  en: [
    { min: 90, label: "EXCELLENT", emoji: "🏆", color: "#ffd700", msg: "You're a DAVAS expert! Amazing!" },
    { min: 70, label: "GREAT", emoji: "🥇", color: "#00ff88", msg: "Great knowledge! Keep it up!" },
    { min: 50, label: "GOOD", emoji: "🥈", color: "#00d4ff", msg: "Not bad! Try again to do better!" },
    { min: 0,  label: "KEEP TRYING", emoji: "💪", color: "#ff9900", msg: "Learn more about DAVAS 2026!" },
  ],
};

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 3,
  size: 8 + Math.random() * 16,
  char: ["⭐", "✨", "🌟", "💫"][Math.floor(Math.random() * 4)],
}));

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const score = parseInt(params.get("score") || "0");
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [player, setPlayer] = useState<{ name?: string; type?: string } | null>(null);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("duo_player");
      if (p) setPlayer(JSON.parse(p));
    }
    setTimeout(() => setShowStars(true), 300);
  }, []);

  const ranks = RANKS[lang];
  const rank = ranks.find(r => score >= r.min) || ranks[ranks.length - 1];

  const t = {
    vi: {
      congrats: "Chúc mừng",
      yourScore: "Điểm của bạn",
      outOf: "/ 100",
      playAgain: "CHƠI LẠI",
      home: "VỀ TRANG CHỦ",
      shareText: "Tham gia game tại sự kiện DAVAS 2026!",
      thankYou: "Cảm ơn bạn đã tham gia DUO GAME!",
      seeYou: "Hẹn gặp lại tại DAVAS 2026 🎉",
      business: "Doanh nghiệp",
      individual: "Cá nhân",
    },
    en: {
      congrats: "Congratulations",
      yourScore: "Your score",
      outOf: "/ 100",
      playAgain: "PLAY AGAIN",
      home: "HOME",
      shareText: "Join the game at DAVAS 2026!",
      thankYou: "Thank you for playing DUO GAME!",
      seeYou: "See you at DAVAS 2026 🎉",
      business: "Business",
      individual: "Individual",
    },
  }[lang];

  return (
    <div className="ocean-bg min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Star particles */}
      {showStars && score >= 50 && STARS.map(s => (
        <div
          key={s.id}
          className="star-particle"
          style={{
            left: `${s.left}%`,
            top: "-30px",
            fontSize: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {s.char}
        </div>
      ))}

      {/* Lang toggle */}
      <div className="absolute top-6 right-6 lang-toggle z-10">
        <button className={`lang-btn ${lang === "vi" ? "active" : ""}`} onClick={() => setLang("vi")}>🇻🇳 VI</button>
        <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>🇺🇸 EN</button>
      </div>

      {/* Main result card */}
      <div className="glass-card w-full max-w-md p-8 text-center animate-pop-in relative z-10">

        {/* Dolphin */}
        <div className="text-6xl mb-2 animate-float inline-block">🐬</div>

        {/* Congrats */}
        <h2 className="text-neon text-xl font-bold mb-1">{t.congrats}</h2>
        {player?.name && (
          <p className="text-white/70 text-sm mb-4">
            {player.name}
            {player.type && (
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}
              >
                {player.type === "business" ? t.business : t.individual}
              </span>
            )}
          </p>
        )}

        {/* Score circle */}
        <div className="relative inline-block mb-4">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
            <circle
              cx="80" cy="80" r="68"
              fill="none"
              stroke={rank.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (1 - score / 100)}
              transform="rotate(-90 80 80)"
              style={{ filter: `drop-shadow(0 0 8px ${rank.color})`, transition: "stroke-dashoffset 1.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-5xl font-black"
              style={{ color: rank.color, textShadow: `0 0 20px ${rank.color}` }}
            >
              {score}
            </span>
            <span className="text-white/50 text-sm font-medium">{t.outOf}</span>
          </div>
        </div>

        {/* Rank badge */}
        <div
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-3 font-black text-lg"
          style={{
            background: `${rank.color}20`,
            border: `2px solid ${rank.color}60`,
            color: rank.color,
            boxShadow: `0 0 24px ${rank.color}30`,
          }}
        >
          <span>{rank.emoji}</span>
          <span>{rank.label}</span>
        </div>

        <p className="text-white/70 text-sm mb-6">{rank.msg}</p>

        {/* Score breakdown */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white/50 text-xs mb-1">{t.yourScore}</p>
          <p className="text-white font-bold text-lg">
            <span style={{ color: rank.color }}>{score}</span>
            <span className="text-white/40">{t.outOf}</span>
            <span className="text-white/60 text-sm ml-2">({score / 10}/10 {lang === "vi" ? "câu đúng" : "correct"})</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="btn-neon py-4 text-base"
            onClick={() => {
              if (typeof window !== "undefined") {
                const player = localStorage.getItem("duo_player");
                if (player) localStorage.setItem("duo_player", player);
              }
              router.push("/game");
            }}
          >
            🎮 {t.playAgain}
          </button>
          <button
            className="btn-outline py-3 text-sm"
            onClick={() => router.push("/")}
          >
            🏠 {t.home}
          </button>
        </div>

        {/* Thank you */}
        <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-white/60 text-sm">{t.thankYou}</p>
          <p className="text-cyan-400 text-sm font-semibold mt-1">{t.seeYou}</p>
          <div className="flex items-center justify-center gap-1 mt-3 opacity-40">
            <span className="text-sm">🐬</span>
            <span className="text-white/50 text-xs font-bold">DUO TECH · DAVAS 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="ocean-bg min-h-screen flex items-center justify-center">
        <div className="text-neon text-2xl font-bold animate-pulse">🐬 Loading...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
