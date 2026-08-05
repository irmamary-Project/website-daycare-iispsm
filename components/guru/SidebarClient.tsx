"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { LOGO_URL } from "@/lib/constants";
import clsx from "clsx";
import Image from 'next/image';

const NAV = [
  { href: "/guru/dashboard",    icon: "📊", label: "Dashboard" },
  { href: "/guru/absensi",      icon: "📍", label: "Absensi" },
  { href: "/guru/data-siswa",   icon: "👤", label: "Data Siswa" },
  { href: "/guru/portofolio",   icon: "📷", label: "Input Portofolio" },
  { href: "/guru/daily-report", icon: "✅", label: "Daily Report" },
  { href: "/guru/laporan",      icon: "📋", label: "Laporan 3 Bulanan" },
  { href: "/guru/riwayat",      icon: "🕘", label: "Riwayat" },
  { href: "/guru/pengumuman",   icon: "📣", label: "Pengumuman" },
  { href: "/guru/skrining",    icon: "🩺", label: "Skrining KPSP" },
  { href: "/cctv",             icon: "📹", label: "Live CCTV" },
];

const ADMIN_NAV = [
  { href: "/guru/admission",       icon: "📋", label: "Persetujuan Daftar" },
  { href: "/guru/absensi/admin",    icon: "👥", label: "Rekap Absensi" },
  { href: "/guru/absensi/geofence", icon: "📍", label: "Atur Geofence" },
];

function SidebarContent({
  profile,
  pathname,
  onClose,
  onLogout,
}: {
  profile: Profile;
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs">
              <Image
                src={LOGO_URL}
                alt="IIS PSM Magetan" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">Portal Guru</div>
              <div className="text-white/40 text-xs">Energia Kids Daycare</div>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            className="lg:hidden text-white/50 hover:text-white p-1"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              pathname.startsWith(item.href)
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white hover:bg-white/8"
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Admin Section */}
        {profile.role === "admin" && (
          <>
            <div className="pt-3 pb-1 px-3">
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">Admin</div>
            </div>
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  pathname.startsWith(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {profile.full_name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{profile.full_name}</div>
            <div className="text-white/40 text-xs">{profile.role === "admin" ? "Admin" : "Guru"}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm transition-all"
        >
          → Keluar
        </button>
      </div>
    </>
  );
}

export default function GuruSidebarClient({
  profile,
}: {
  profile: Profile;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* ── MOBILE TOPBAR ── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs">
            <Image
                src={LOGO_URL}
                alt="IIS PSM Magetan" />
          </div>
          <div>
            <div className="text-white font-semibold text-xs leading-tight">Portal Guru</div>
            <div className="text-white/40 text-xs">Energia Kids Daycare</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white/70 hover:text-white p-2"
          aria-label="Buka menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 5h16M3 11h16M3 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={close}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <aside
        className={clsx(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "var(--primary)" }}
      >
        <SidebarContent profile={profile} pathname={pathname} onClose={close} onLogout={handleLogout} />
      </aside>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className="hidden lg:flex w-60 flex-shrink-0 flex-col min-h-screen sticky top-0"
        style={{ background: "var(--primary)" }}
      >
        <SidebarContent profile={profile} pathname={pathname} onClose={close} onLogout={handleLogout} />
      </aside>
    </>
  );
}
