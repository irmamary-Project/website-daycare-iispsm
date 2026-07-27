"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LOGO_URL } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [role, setRole] = useState<"guru" | "ortu" | "admin">("ortu");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Deteksi implicit flow fallback (#access_token di hash)
  // PKCE flow (?code=) sudah ditangani oleh /auth/callback/route.ts
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    const accessToken = hashParams.get("access_token");

    if (type === "recovery" && accessToken) {
      window.location.replace(`/login/reset-password${window.location.hash}`);
    }
  }, []);

  function resetForm() {
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      router.push(
        profile?.role === "guru" ? "/guru/dashboard" : "/ortu/dashboard"
      );
      router.refresh();
    }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.user && phone) {
      await supabase.from("profiles").update({ phone }).eq("id", data.user.id);
    }
    setSuccess("Akun berhasil dibuat! Silakan login.");
    setMode("login");
    setLoading(false);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ redirectTo ke /auth/callback dengan next=/login/reset-password
    // Server-side callback akan exchange code lalu redirect ke reset-password
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/login/reset-password`,
    });

    if (err) {
      setError(err.message);
    } else {
      setSuccess(
        "Link reset password telah dikirim ke email kamu. Silakan cek inbox atau folder spam."
      );
    }
    setLoading(false);
  }

  const headingMap = {
    login: { title: "Masuk ke Portal", subtitle: "Selamat datang kembali" },
    register: { title: "Daftar Akun Baru", subtitle: "Buat akun untuk orang tua siswa" },
    forgot: { title: "Lupa Password", subtitle: "Kami akan kirim link reset ke email kamu" },
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--cream)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-6 bg-primary">
        <div>
          <div className="flex items-center justify-center mb-5">
            <img
              className="max-w-[255px]"
              src={LOGO_URL}
              alt="Logo IIS"
            />
          </div>
          <h1 className="text-white font-serif text-4xl font-bold leading-tight mb-4">
            Portal Terpadu
            <br />
            Guru & Orang Tua
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Pantau perkembangan si kecil setiap hari — laporan harian,
            portofolio kegiatan, dan laporan 3 bulanan dalam satu platform.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: "📊", title: "Daily Report", desc: "Laporan harian mood, makan, tidur & ibadah" },
            { icon: "📷", title: "Portofolio", desc: "Foto & video kegiatan anak setiap hari" },
            { icon: "📋", title: "Laporan Triwulan", desc: "Perkembangan 8 fitrah per 3 bulan" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-white text-sm font-medium">{f.title}</div>
                <div className="text-white/50 text-xs">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card mb-6">
            <h2 className="font-serif text-2xl font-bold text-primary mb-1">
              {headingMap[mode].title}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {headingMap[mode].subtitle}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
                {success}
              </div>
            )}

            {/* FORM FORGOT PASSWORD */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="email@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                  {loading ? "Mengirim..." : "Kirim Link Reset →"}
                </button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  <button
                    type="button"
                    onClick={() => { setMode("login"); resetForm(); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    ← Kembali ke Login
                  </button>
                </p>
              </form>
            )}

            {/* FORM LOGIN & REGISTER */}
            {mode !== "forgot" && (
              <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
                {mode === "register" && (
                  <>
                    <div>
                      <label className="label">Nama Lengkap</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Nama lengkap orang tua/guru"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["ortu", "guru"] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                              role === r
                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                : "bg-white text-gray-600 border-[var(--primary-border)] hover:border-[var(--primary)]"
                            }`}
                          >
                            {r === "ortu" ? "👨‍👩‍👧 Orang Tua" : "👩‍🏫 Guru"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label">No. HP / WhatsApp</label>
                      <input
                        className="input"
                        type="tel"
                        placeholder="08xx-xxxx-xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="email@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label mb-0">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); resetForm(); }}
                        className="text-xs text-primary hover:underline"
                      >
                        Lupa password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                  {loading ? "Memproses..." : mode === "login" ? "Masuk →" : "Daftar →"}
                </button>
              </form>
            )}

            {mode !== "forgot" && (
              <p className="text-center text-sm text-gray-500 mt-5">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); resetForm(); }}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === "login" ? "Daftar" : "Masuk"}
                </button>
              </p>
            )}
          </div>

          <p className="text-center text-xs text-gray-400">
            © 2026 Energia Kids Daycare · Magetan
          </p>
        </div>
      </div>
    </div>
  );
}
