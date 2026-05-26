"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  type: "business" | "individual" | "";
}

const ERRORS_VI = {
  name: "Vui lòng nhập họ và tên",
  phone: "Số điện thoại không hợp lệ (10 số)",
  email: "Email không hợp lệ",
  type: "Vui lòng chọn loại người tham gia",
};

const ERRORS_EN = {
  name: "Please enter your full name",
  phone: "Invalid phone number (10 digits)",
  email: "Invalid email address",
  type: "Please select participant type",
};

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [form, setForm] = useState<FormData>({ name: "", phone: "", email: "", type: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const ERRORS = lang === "vi" ? ERRORS_VI : ERRORS_EN;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = ERRORS.name;
    if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ""))) e.phone = ERRORS.phone;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = ERRORS.email;
    if (!form.type) e.type = ERRORS.type;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setSubmitting(true);

    const payload = { ...form, lang, registeredAt: new Date().toISOString() };

    if (typeof window !== "undefined") {
      localStorage.setItem("duo_player", JSON.stringify(payload));
    }

    // Fire-and-forget: send to Google Sheet, don't block navigation on failure
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    setTimeout(() => router.push("/game"), 500);
  };

  const field = (key: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const t = {
    vi: {
      back: "← Quay lại",
      title: "Đăng ký thông tin",
      subtitle: "Điền thông tin trước khi bắt đầu chơi",
      name: "Họ và tên *",
      namePh: "Nguyễn Văn A",
      phone: "Số điện thoại *",
      phonePh: "0901 234 567",
      email: "Email *",
      emailPh: "example@gmail.com",
      type: "Bạn là *",
      typePh: "-- Chọn loại --",
      business: "🏢 Doanh nghiệp (Business)",
      individual: "👤 Cá nhân (Individual)",
      submit: "VÀO CHƠI NGAY",
      submitting: "ĐANG VÀO...",
      note: "Thông tin của bạn được bảo mật hoàn toàn",
    },
    en: {
      back: "← Back",
      title: "Register Info",
      subtitle: "Fill in your details before playing",
      name: "Full name *",
      namePh: "John Doe",
      phone: "Phone number *",
      phonePh: "0901 234 567",
      email: "Email *",
      emailPh: "example@gmail.com",
      type: "You are *",
      typePh: "-- Select type --",
      business: "🏢 Business",
      individual: "👤 Individual",
      submit: "PLAY NOW",
      submitting: "LOADING...",
      note: "Your information is completely secure",
    },
  }[lang];

  return (
    <div className="ocean-bg min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button className="btn-outline text-sm px-4 py-2" onClick={() => router.push("/")}>
          {t.back}
        </button>
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === "vi" ? "active" : ""}`} onClick={() => setLang("vi")}>🇻🇳 VI</button>
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>🇺🇸 EN</button>
        </div>
      </div>

      {/* Card */}
      <div className="glass-card w-full max-w-md p-8 animate-slide-up">
        {/* Icon + Title */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-float inline-block">🐬</div>
          <h1 className="text-2xl font-black text-neon mb-1">{t.title}</h1>
          <p className="text-white/60 text-sm">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">{t.name}</label>
            <input
              className="input-field"
              placeholder={t.namePh}
              value={form.name}
              onChange={e => field("name", e.target.value)}
              maxLength={60}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">{t.phone}</label>
            <input
              className="input-field"
              placeholder={t.phonePh}
              type="tel"
              value={form.phone}
              onChange={e => field("phone", e.target.value)}
              maxLength={15}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">{t.email}</label>
            <input
              className="input-field"
              placeholder={t.emailPh}
              type="email"
              value={form.email}
              onChange={e => field("email", e.target.value)}
              maxLength={80}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">{t.type}</label>
            <div className="flex gap-3">
              {(["business", "individual"] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => field("type", v)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: form.type === v ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${form.type === v ? "#00d4ff" : "rgba(255,255,255,0.15)"}`,
                    color: form.type === v ? "#00d4ff" : "rgba(255,255,255,0.7)",
                    boxShadow: form.type === v ? "0 0 16px rgba(0,212,255,0.3)" : "none",
                  }}
                >
                  {v === "business" ? t.business : t.individual}
                </button>
              ))}
            </div>
            {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-neon py-4 text-base mt-2"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            🎮 {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <p className="text-center text-white/35 text-xs mt-4">
          🔒 {t.note}
        </p>
      </div>
    </div>
  );
}
