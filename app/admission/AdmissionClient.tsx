"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LOGO_URL } from "@/lib/constants";
import Link from "next/link";
import { KELAS_LIST } from "@/types";

const STEPS = ["Data Orang Tua", "Data Anak", "Konfirmasi"];

export default function AdmissionClient() {
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  // Orang tua
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Anak
  const [anakNama, setAnakNama] = useState("");
  const [anakJK, setAnakJK] = useState<"L" | "P">("L");
  const [anakLahir, setAnakLahir] = useState("");
  const [anakKelas, setAnakKelas] = useState(KELAS_LIST[0]);

  function next() {
    if (step === 0 && (!email || !password || !fullName)) {
      setMsg("Lengkapi semua data orang tua.");
      return;
    }
    if (step === 1 && (!anakNama || !anakLahir)) {
      setMsg("Lengkapi data anak.");
      return;
    }
    setMsg("");
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  }

  function prev() {
    setMsg("");
    setStep(s => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSaving(true);
    setMsg("");

    // 1. Coba login dulu (cek apakah email sudah terdaftar)
    const { data: loginData } = await supabase.auth.signInWithPassword({ email, password });
    let userId = loginData?.user?.id;

    // 2. Kalau belum punya akun, buat baru
    if (!userId) {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: "ortu" } },
      });

      if (authErr) {
        setMsg("Gagal buat akun: " + authErr.message);
        setSaving(false);
        return;
      }

      userId = authData.user?.id;

      // Email confirmation aktif — user.id bisa null
      if (!userId && authData.user === null) {
        // Supabase butuh konfirmasi email dulu
        // Kita tetap lanjut dengan cara: sign in ulang setelah user klik link email
        setMsg("Akun dibuat! Silakan cek email untuk verifikasi, lalu kembali ke halaman ini dan klik 'Daftar Sekarang' lagi dengan email & password yang sama.");
        setSaving(false);
        return;
      }

      if (!userId) {
        setMsg("Gagal mendapatkan user ID. Silakan coba lagi.");
        setSaving(false);
        return;
      }

      // Update profile dengan phone
      if (phone) {
        await supabase.from("profiles").update({ phone }).eq("id", userId);
      }
    } else {
      // Sudah login — update profile jika perlu
      if (phone) {
        await supabase.from("profiles").update({ phone, full_name: fullName }).eq("id", userId);
      }
    }

    // 3. Cek apakah siswa sudah ada (hindari duplikat)
    const { data: existingSiswa } = await supabase
      .from("siswa").select("id").eq("ortu_id", userId).eq("nama", anakNama).single();

    if (existingSiswa) {
      setMsg("Data anak ini sudah terdaftar di akun Anda.");
      setSaving(false);
      return;
    }

    // 4. Insert data siswa
    const { error: siswaErr } = await supabase.from("siswa").insert({
      nama: anakNama,
      jenis_kelamin: anakJK,
      tanggal_lahir: anakLahir || null,
      kelas: anakKelas,
      ortu_id: userId,
      status: "aktif",
    });

    if (siswaErr) {
      setMsg("Gagal simpan data siswa: " + siswaErr.message);
      setSaving(false);
      return;
    }

    setDone(true);
    setSaving(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--cream)" }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "Fredoka, sans-serif", color: "var(--primary)" }}>
            Pendaftaran Berhasil!
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-body)" }}>
            Akun untuk <strong>{fullName}</strong> telah dibuat. Data anak <strong>{anakNama}</strong> sudah tercatat.
            Silakan cek email untuk verifikasi, lalu login ke portal orang tua.
          </p>
          <Link href="/login" className="inline-block px-6 py-3 rounded-full text-sm font-bold text-white transition-all"
            style={{ background: "var(--primary)" }}>
            Login ke Portal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--primary-border)",
        padding: "0 48px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "80px",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <img src={LOGO_URL} alt="IIS PSM" style={{ height: "48px", borderRadius: "50%" }} />
          <div>
            <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: "16px", color: "var(--primary)" }}>Energia Kids Daycare</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "11px", color: "var(--text-muted)" }}>Penerimaan Siswa Baru</div>
          </div>
        </Link>
        <Link href="/login" style={{ fontSize: "13px", color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontFamily: "Nunito, sans-serif" }}>
          Sudah punya akun? Login
        </Link>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: "32px", fontWeight: 600, color: "var(--primary)", marginBottom: "8px" }}>
            Penerimaan Siswa Baru
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Daftarkan putra-putri Anda di IIS PSM Daycare & Preschool
          </p>
        </div>

        {/* STEPPER */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 700,
                background: i <= step ? "var(--primary)" : "var(--primary-pale)",
                color: i <= step ? "white" : "var(--text-muted)",
                fontFamily: "Nunito, sans-serif",
              }}>{i + 1}</div>
              <span className="hidden sm:inline" style={{
                fontSize: "12px", fontWeight: 600, fontFamily: "Nunito, sans-serif",
                color: i <= step ? "var(--primary)" : "var(--text-muted)",
              }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: "32px", height: "2px", background: i < step ? "var(--primary)" : "var(--primary-border)", borderRadius: "1px" }} />}
            </div>
          ))}
        </div>

        {/* ERROR */}
        {msg && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", marginBottom: "20px", fontFamily: "Nunito, sans-serif" }}>
            {msg}
          </div>
        )}

        {/* STEP 0: Data Orang Tua */}
        {step === 0 && (
          <div style={{ background: "white", border: "1px solid var(--primary-border)", borderRadius: "16px", padding: "28px" }}>
            <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: "18px", fontWeight: 600, color: "var(--primary)", marginBottom: "20px" }}>
              👨‍👩‍👧 Data Orang Tua
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Nama Lengkap *</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama lengkap orang tua"
                  style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>No. HP / WhatsApp</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xx-xxxx-xxxx" type="tel"
                  style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Email *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" type="email" required
                  style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Password *</label>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 karakter" type="password" required minLength={8}
                  style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }} />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "Nunito, sans-serif" }}>Password ini akan digunakan untuk login ke portal orang tua.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Data Anak */}
        {step === 1 && (
          <div style={{ background: "white", border: "1px solid var(--primary-border)", borderRadius: "16px", padding: "28px" }}>
            <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: "18px", fontWeight: 600, color: "var(--primary)", marginBottom: "20px" }}>
              🧒 Data Anak
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Nama Lengkap Anak *</label>
                <input value={anakNama} onChange={e => setAnakNama(e.target.value)} placeholder="Nama lengkap siswa"
                  style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Jenis Kelamin</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {(["L", "P"] as const).map(jk => (
                      <button key={jk} type="button" onClick={() => setAnakJK(jk)} style={{
                        padding: "10px", borderRadius: "12px", border: `2px solid ${anakJK === jk ? "var(--primary)" : "var(--primary-border)"}`,
                        background: anakJK === jk ? "var(--primary-pale)" : "white",
                        color: "var(--primary)", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "Nunito, sans-serif",
                      }}>
                        {jk === "L" ? "👨 Laki-laki" : "👩 Perempuan"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Tanggal Lahir *</label>
                  <input type="date" value={anakLahir} onChange={e => setAnakLahir(e.target.value)}
                    style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", display: "block", fontFamily: "Nunito, sans-serif" }}>Kelas / Program *</label>
                <select value={anakKelas} onChange={e => setAnakKelas(e.target.value)}
                  style={{ width: "100%", border: "1px solid var(--primary-border)", borderRadius: "12px", padding: "10px 14px", fontSize: "14px", fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box", background: "white" }}>
                  {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Konfirmasi */}
        {step === 2 && (
          <div style={{ background: "white", border: "1px solid var(--primary-border)", borderRadius: "16px", padding: "28px" }}>
            <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: "18px", fontWeight: 600, color: "var(--primary)", marginBottom: "20px" }}>
              ✅ Konfirmasi Data
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontFamily: "Nunito, sans-serif" }}>Data Orang Tua</div>
              <div style={{ background: "var(--primary-pale)", borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)", fontFamily: "Nunito, sans-serif" }}>{fullName}</div>
                <div style={{ fontSize: "12px", color: "var(--text-body)", fontFamily: "Nunito, sans-serif" }}>{email}</div>
                {phone && <div style={{ fontSize: "12px", color: "var(--text-body)", fontFamily: "Nunito, sans-serif" }}>{phone}</div>}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontFamily: "Nunito, sans-serif" }}>Data Anak</div>
              <div style={{ background: "var(--cream)", borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)", fontFamily: "Nunito, sans-serif" }}>{anakNama}</div>
                <div style={{ fontSize: "12px", color: "var(--text-body)", fontFamily: "Nunito, sans-serif" }}>
                  {anakJK === "L" ? "Laki-laki" : "Perempuan"} · {anakKelas}
                </div>
                {anakLahir && <div style={{ fontSize: "12px", color: "var(--text-body)", fontFamily: "Nunito, sans-serif" }}>Lahir: {new Date(anakLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>}
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          {step > 0 && (
            <button onClick={prev} style={{
              flex: "0 0 auto", padding: "12px 24px", borderRadius: "24px",
              border: "2px solid var(--primary-border)", background: "white",
              color: "var(--primary)", fontWeight: 700, fontSize: "14px", cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
            }}>← Kembali</button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={next} style={{
              flex: 1, padding: "12px 24px", borderRadius: "24px",
              border: "none", background: "var(--primary)",
              color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
            }}>Selanjutnya →</button>
          ) : (
            <button onClick={handleSubmit} disabled={saving} style={{
              flex: 1, padding: "12px 24px", borderRadius: "24px",
              border: "none", background: saving ? "var(--text-muted)" : "var(--gold)",
              color: "white", fontWeight: 700, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "Nunito, sans-serif",
            }}>{saving ? "Mendaftarkan..." : "🚀 Daftar Sekarang"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
