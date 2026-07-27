"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { LOGO_URL } from "@/lib/constants";
import Image from 'next/image';

const NAV = [
  { href: "/ortu/dashboard",  icon: "🏠", label: "Beranda" },
  { href: "/ortu/portofolio", icon: "📷", label: "Portofolio" },
  { href: "/ortu/laporan",    icon: "📋", label: "Laporan Perkembangan" },
  { href: "/ortu/notifikasi", icon: "🔔", label: "Notifikasi" },
  { href: "/cctv",            icon: "📹", label: "Live CCTV" },
];

const LG = 1024; // breakpoint laptop

export default function OrtuSidebarClient({
  profile,
  unreadCount,
  anak,
}: {
  profile: Profile;
  unreadCount: number;
  anak: { id: string; nama: string; kelas: string }[];
}) {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop]   = useState(false);

  // Deteksi ukuran layar — tidak bergantung Tailwind
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= LG);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Tutup drawer kalau resize ke desktop
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  /* ── SHARED SIDEBAR CONTENT ── */
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      {/* BRAND */}
      <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              flexShrink: 0,
            }}>
              <Image
                src={LOGO_URL}
                alt="IIS PSM Magetan"
                width={36} height={36}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "15px", color: "white", lineHeight: 1.2 }}>
                Portal Orang Tua
              </div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "1px" }}>
                Energia Kids Daycare
              </div>
            </div>
          </div>
          {/* Close — hanya tampil di mobile drawer */}
          {onClose && (
            <button onClick={onClose} aria-label="Tutup menu" style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.5)", padding: "4px",
              display: "flex", alignItems: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ANAK */}
      {anak.length > 0 && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "10px", fontWeight: 700,
            letterSpacing: "1.5px", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)", marginBottom: "10px",
          }}>
            Anak Saya
          </div>
          {anak.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "var(--gold, #FF9800)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Fredoka', sans-serif", fontSize: "12px", fontWeight: 600,
                color: "white", flexShrink: 0,
              }}>
                {a.nama.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "13px", fontWeight: 600, color: "white", lineHeight: 1.3 }}>
                  {a.nama}
                </div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                  {a.kelas}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NAV */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px", marginBottom: "2px",
                textDecoration: "none",
                fontFamily: "'Nunito', sans-serif", fontSize: "13px", fontWeight: 600,
                color: isActive ? "white" : "rgba(255,255,255,0.6)",
                background: isActive ? "rgba(255,255,255,0.16)" : "transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              <span style={{
                width: "3px", height: "20px", borderRadius: "2px",
                background: isActive ? "var(--gold, #FF9800)" : "transparent",
                flexShrink: 0, transition: "all 0.2s",
              }} />
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.label === "Notifikasi" && unreadCount > 0 && (
                <span style={{
                  background: "#EF5350", color: "white",
                  fontFamily: "'Nunito', sans-serif", fontSize: "11px", fontWeight: 700,
                  borderRadius: "10px", padding: "2px 7px", minWidth: "20px", textAlign: "center",
                }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* USER / LOGOUT */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", marginBottom: "4px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "var(--gold, #FF9800)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fredoka', sans-serif", fontSize: "13px", fontWeight: 600,
            color: "white", flexShrink: 0,
          }}>
            {profile.full_name?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Nunito', sans-serif", fontSize: "13px", fontWeight: 600, color: "white",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {profile.full_name}
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              Orang Tua
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 12px", borderRadius: "10px",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif", fontSize: "13px", fontWeight: 600,
            color: "rgba(255,255,255,0.45)", transition: "all 0.2s", textAlign: "left",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(239,83,80,0.15)";
            (e.currentTarget as HTMLElement).style.color = "#EF9A9A";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "none";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── MOBILE TOPBAR — hanya tampil kalau bukan desktop ── */}
      {!isDesktop && (
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
          background: "var(--primary, #1A237E)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", height: "56px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              <Image
                src={LOGO_URL}
                alt="IIS PSM Magetan" width={30} height={30}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "14px", color: "white", lineHeight: 1.2 }}>
                Portal Orang Tua
              </div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                Energia Kids Daycare
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.7)", padding: "8px",
              display: "flex", alignItems: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 5h16M3 11h16M3 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </header>
      )}

      {/* ── MOBILE OVERLAY ── */}
      {!isDesktop && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      {!isDesktop && (
        <aside style={{
          position: "fixed", top: 0, left: 0, zIndex: 60,
          width: "256px", height: "100%",
          background: "var(--primary, #1A237E)",
          display: "flex", flexDirection: "column",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}>
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </aside>
      )}

      {/* ── DESKTOP SIDEBAR — hanya tampil kalau desktop ── */}
      {isDesktop && (
        <aside style={{
          width: "240px", flexShrink: 0,
          background: "var(--primary, #1A237E)",
          display: "flex", flexDirection: "column",
          minHeight: "100vh", position: "sticky", top: 0,
        }}>
          <SidebarContent />
        </aside>
      )}
    </>
  );
}