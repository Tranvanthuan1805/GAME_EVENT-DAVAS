"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getRandomQuestions, Question } from "@/data/questions";

const TOTAL = 10;
const SECONDS = 20;
const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

export default function GamePage() {
  const router = useRouter();
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const qs = getRandomQuestions(TOTAL);
    setQuestions(qs);
    // redirect if no player info
    if (typeof window !== "undefined" && !localStorage.getItem("duo_player")) {
      router.replace("/register");
    }
  }, [router]);

  // timer
  useEffect(() => {
    if (questions.length === 0 || answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions, answered]);

  const handleTimeout = () => {
    if (answered) return;
    setAnswered(true);
    setSelected(-1); // no selection
    setTimeout(() => nextQuestion(), 2000);
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    clearInterval(timerRef.current!);
    setAnswered(true);
    setSelected(idx);
    if (idx === questions[current].correct) {
      setScore(s => s + 10);
    }
    setTimeout(() => nextQuestion(), 1800);
  };

  const nextQuestion = () => {
    if (current + 1 >= TOTAL) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(SECONDS);
    }
  };

  useEffect(() => {
    if (showResult && typeof window !== "undefined") {
      const player = JSON.parse(localStorage.getItem("duo_player") || "{}");
      localStorage.setItem("duo_result", JSON.stringify({ score, player, date: new Date().toISOString() }));
      router.push(`/result?score=${score}`);
    }
  }, [showResult, score, router]);

  if (questions.length === 0) {
    return (
      <div className="ocean-bg min-h-screen flex items-center justify-center">
        <div className="text-neon text-2xl font-bold animate-pulse">🐬 Đang tải câu hỏi...</div>
      </div>
    );
  }

  const q = questions[current];
  const opts = lang === "vi" ? q.options : q.optionsEn;
  const questionText = lang === "vi" ? q.question : q.questionEn;
  const catText = lang === "vi" ? q.category : q.categoryEn;
  const progress = ((current) / TOTAL) * 100;
  const timerPct = timeLeft / SECONDS;
  const strokeDash = CIRCUMFERENCE * (1 - timerPct);
  const timerColor = timerPct > 0.5 ? "#00d4ff" : timerPct > 0.25 ? "#ffd700" : "#ff4545";

  return (
    <div className="ocean-bg min-h-screen flex flex-col items-center justify-center px-4 py-6">
      {/* Top bar */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between gap-3">
        {/* Progress */}
        <div className="flex-1">
          <div className="flex justify-between text-xs text-white/60 mb-1 font-medium">
            <span>{lang === "vi" ? `Câu ${current + 1} / ${TOTAL}` : `Q ${current + 1} / ${TOTAL}`}</span>
            <span className="cat-badge">{catText}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress + (1 / TOTAL) * 100}%` }} />
          </div>
        </div>
        {/* Score */}
        <div className="score-badge whitespace-nowrap">
          🏆 {score}
        </div>
        {/* Lang toggle */}
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === "vi" ? "active" : ""}`} onClick={() => setLang("vi")}>VI</button>
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>

      {/* Game card */}
      <div className="glass-card w-full max-w-xl p-6 md:p-8 animate-fade-in">

        {/* Timer + Question */}
        <div className="flex items-start gap-5 mb-6">
          {/* Timer circle */}
          <div className="flex-shrink-0">
            <svg width="72" height="72" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={timerColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDash}
                transform="rotate(-90 60 60)"
                style={{ filter: `drop-shadow(0 0 6px ${timerColor})`, transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
              />
              <text x="60" y="68" textAnchor="middle" fill={timerColor} fontSize="28" fontWeight="800" fontFamily="sans-serif">
                {timeLeft}
              </text>
            </svg>
          </div>

          {/* Question text */}
          <div className="flex-1">
            <p
              className="text-white font-bold leading-snug"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}
            >
              {questionText}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {opts.map((opt, idx) => {
            const isCorrect = idx === q.correct;
            const isSelected = idx === selected;
            let cls = "option-btn";
            if (answered) {
              if (isCorrect) cls += " reveal-correct";
              if (isSelected && !isCorrect) cls += " wrong";
            }

            return (
              <button
                key={idx}
                className={cls}
                disabled={answered}
                onClick={() => handleSelect(idx)}
              >
                <span className="opt-label">
                  {["A", "B", "C", "D"][idx]}
                </span>
                <span className="flex-1">{opt.replace(/^[A-D]\. /, "")}</span>
                {answered && isCorrect && (
                  <span className="text-green-400 text-lg ml-1">✓</span>
                )}
                {answered && isSelected && !isCorrect && (
                  <span className="text-red-400 text-lg ml-1">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Timeout message */}
        {answered && selected === -1 && (
          <div className="mt-4 text-center text-yellow-400 font-bold animate-fade-in">
            ⏰ {lang === "vi" ? "Hết giờ! Đáp án đúng được tô sáng" : "Time's up! Correct answer highlighted"}
          </div>
        )}
      </div>

      {/* Bottom DUO branding */}
      <div className="mt-4 flex items-center gap-2 opacity-40">
        <span className="text-base">🐬</span>
        <span className="text-white/60 text-xs font-bold tracking-wider">DUO GAME · DAVAS 2026</span>
      </div>
    </div>
  );
}
