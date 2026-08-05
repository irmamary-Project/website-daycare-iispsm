"use client";
import { useState } from "react";
import Image from "next/image";
import Link from 'next/link'
import { LOGO_URL, FACILITIES_IMG_URL, GALLERY_BASE_URL } from '@/lib/constants';

const FitrahKurikulum = () => {
  const kurikulumData = [
    {
      icon: '☪️',
      title: 'Fitrah Keimanan',
      tagline: 'Atmosfir Keshalihan & Keteladanan',
      desc: "Menanamkan cinta kepada Allah, Rasul, Al-Qur'an, dan Islam melalui imaji positif & keteladanan — bukan doktrin ketakutan.",
      list: ["Kisah Rasulullah & surga", "Kenalkan Allah di setiap peristiwa", "Doa di awal aktivitas", "Gunakan imaji positif"],
    },
    {
      icon: '🧠',
      title: 'Fitrah Belajar',
      tagline: 'Art of Discovery',
      desc: 'Menumbuhkan perasaan belajar melalui eksplorasi langsung dan stimulasi psikomotorik di alam.',
      list: ["Eksplorasi tubuh & keluarga", "Inspirasi belajar di alam", "Buku bersastra indah", "Dorong abstraksi & imajinasi"],
    },
    {
      icon: '⭐',
      title: 'Fitrah Bakat',
      tagline: 'Mengamati Sifat Unik',
      desc: 'Setiap anak adalah pemimpin. Sifat unik diamati dan dikuatkan dengan label positif sejak dini.',
      list: ["Pelihara hewan & tumbuhan", "Label positif (sang orator)", "Hargai adab & akhlak", "Peran sesuai bakat"],
    },
    {
      icon: '❤️',
      title: 'Fitrah Seksualitas',
      tagline: 'Identitas Gender',
      desc: 'Menguatkan identitas gender melalui kelekatan aman antara anak dengan Ayah dan Bunda.',
      list: ["ASI penuh cinta", "Bermain peran Ayah/Bunda", "Konsep cowok & cewek", "Ajarkan thaharah & malu"],
    },
    {
      icon: '🌿',
      title: 'Fitrah Bahasa',
      tagline: 'Apresiasi Keindahan',
      desc: 'Menguatkan rasa keindahan melalui inderawi (0-2th) dan imajinasi/ekspresi (2-6th).',
      list: ["Sastra & cerita indah", "Bacakan Kitabullah", "Bebas coretan & lukisan", "Bukan paksa akademik"],
    },
    {
      icon: '🤝',
      title: 'Fitrah Sosial',
      tagline: 'Ego Sentris Sehat',
      desc: 'Interaksi sosial sehat melalui bermain dan contoh adab, bukan kepatuhan berbasis takut.',
      list: ["Puasakan masa ego sentris", "Bangun rutinitas cerita", "Label milik privasi", "Suplai ego dari Ayah"],
    },
    {
      icon: '🍽️',
      title: 'Fitrah Jasmani',
      tagline: 'Pola Hidup Fitri',
      desc: 'Pola makan halal-thayyib, tidur fitri, dan gerak aktif untuk stimulasi sensori integrasi.',
      list: ["Makan halal-thayyib", "Tidur cukup sesuai usia", "Gerak aktif & sensorik", "Sensori integrasi 4 level"],
    },
    {
      icon: '🕌',
      title: 'Adab & Akhlak',
      tagline: 'Keteladanan Nyata',
      desc: 'Adab ditanamkan melalui keteladanan orang tua, sehingga anak mencintai keindahan akhlak.',
      list: ["Guru sebagai teladan", "Imaji adab yang indah", "Adab makan & belajar", "Sikap nyata harian"],
    }
  ];

  return (
    <section className="fitrah-kurikulum-section" id="kurikulum">
      <div className="sec-header center">
        <span className="sec-label">Kurikulum Holistik</span>
        <h2 className="sec-title">8 Aspek Fitrah</h2>
        <p className="sec-desc">
          Stimulasi holistik sesuai tahapan tumbuh kembang usia dini. Setiap kegiatan dirancang
          <span className="italic font-medium"> Learning Through Living</span> — bermain adalah belajar.
        </p>
      </div>
      <div className="fitrah-cards-grid">
        {kurikulumData.map((item, idx) => (
          <div key={idx} className="fitrah-card">
            <div className="fc-header">
              <div className="fc-icon">{item.icon}</div>
              <div>
                <div className="fc-name">{item.title}</div>
                <p className="fc-tagline">{item.tagline}</p>
              </div>
            </div>
            <div className="fc-body">
              <p>{item.desc}</p>
              <ul className="fc-list">
                {item.list.map((point, pIdx) => (
                  <li key={pIdx}><span>{point}</span></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="fitrah-quote-bar">
        <p>&quot;Perkembangan manusia memiliki sunnatullah — ada tahapan, ada masa emas bagi setiap fitrah.&quot;</p>
        <span>Tahapan: 0-2 thn · 2-6 thn (Pra Latih) · 7-10 thn (Pra Aqil Baligh 1) · 11-14 thn (Pra Aqil Baligh 2) · &gt;15 thn (Post Aqil Baligh)</span>
      </div>
    </section>
  );
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
/* ── CSS VARIABLES ── */
:root {
  --primary:      #1A237E;
  --primary-mid:  #3949AB;
  --primary-pale: #E8EAF6;
  --primary-border: #C5CAE9;
  --gold:         #FF9800;
  --gold-dark:    #F57C00;
  --magenta:      #E91E8C;
  --teal:         #00BCD4;
  --logo-green:   #4CAF50;
  --purple:       #673AB7;
  --cream:        #F8F9FF;
  --cream2:       #FFFBF5;
  --text:         #1A237E;
  --text-body:    #455A64;
  --text-muted:   #90A4AE;
  --radius:       12px;
  --radius-lg:    20px;

  /* Legacy aliases used in components */
  --green-dark:     #1A237E;
  --green-mid:      #3949AB;
  --green-pale:     #E8EAF6;
  --green-border:   #C5CAE9;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Nunito", sans-serif;
  color: var(--text-body);
  background: #fff;
}

/* ── NAV ── */
nav {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--primary-border);
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.nav-logo {
  width: 155px;
  height: auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 32px;
}
.nav-links a {
  text-decoration: none;
  font-size: 14px;
  color: var(--text-body);
  font-weight: 600;
  transition: color 0.2s;
  font-family: "Nunito", sans-serif;
}
.nav-links a:hover { color: var(--primary); }
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-gold {
  background: var(--gold);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.btn-gold:hover {
  background: var(--gold-dark);
  transform: translateY(-1px);
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
  transition: all 0.3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.mobile-menu {
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 199;
  background: rgba(255,255,255,0.98);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--primary-border);
  padding: 20px 24px 28px;
  flex-direction: column;
  gap: 16px;
}
.mobile-menu.open { display: flex; }
.mobile-menu a,
.mobile-menu button {
  font-size: 15px;
  color: var(--text-body);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  padding: 8px 0;
  text-align: left;
  border-bottom: 1px solid var(--primary-border);
}
.mobile-menu .mobile-daftar {
  background: var(--gold);
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  text-align: center;
  border: none;
  text-decoration: none;
  display: block;
  margin-top: 4px;
}

/* ── HERO ── */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #ffffff;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: transparent;
  z-index: 1;
}
.hero-bg-img {
  position: absolute;
  inset: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-bg-img::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 82% 15%, #E3F2FD 0%, transparent 32%),
    radial-gradient(circle at 92% 78%, #FCE4EC 0%, transparent 28%),
    radial-gradient(circle at 72% 62%, #FFF9C4 0%, transparent 24%),
    radial-gradient(circle at 4%  82%, #E8F5E9 0%, transparent 20%),
    radial-gradient(circle at 60% 5%,  #F3E5F5 0%, transparent 18%);
}
.hero-badge-top {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  background: #FFF3E0;
  border: 1px solid #FFB74D;
  color: #E65100;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 20px;
  border-radius: 20px;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-family: "Nunito", sans-serif;
  text-transform: uppercase;
}
.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF9800;
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 36px 48px;
  max-width: 780px;
}
.hero-title {
  font-family: "Fredoka", sans-serif;
  font-size: 76px;
  line-height: 1.0;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 24px;
}
.hero-title .accent { color: var(--magenta); }
.hero-desc {
  font-size: 17px;
  color: var(--text-body);
  max-width: 540px;
  line-height: 1.7;
  margin-bottom: 10px;
  font-family: "Nunito", sans-serif;
}
.hero-vision {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 30px;
  max-width: 540px;
  font-family: "Nunito", sans-serif;
}
.hero-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.btn-gold-solid {
  background: var(--gold);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.25s;
}
.btn-gold-solid:hover {
  background: var(--gold-dark);
  transform: translateY(-2px);
}
.btn-outline-dark {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 12px 28px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.25s;
}
.btn-outline-dark:hover {
  background: var(--primary-pale);
  border-color: var(--primary-mid);
}
.hero-stats {
  display: flex;
  gap: 0;
  border-top: 1px solid var(--primary-border);
  padding-top: 32px;
  flex-wrap: wrap;
}
.hero-stat {
  padding-right: 40px;
  margin-right: 40px;
  border-right: 1px solid var(--primary-border);
}
.hero-stat:last-child { border-right: none; }
.hero-stat-num {
  font-family: "Fredoka", sans-serif;
  font-size: 38px;
  font-weight: 600;
  color: var(--gold);
  line-height: 1;
}
.hero-stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  font-family: "Nunito", sans-serif;
}

/* ── SECTIONS ── */
section { padding: 96px 64px; }
.sec-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 12px;
  font-family: "Nunito", sans-serif;
  display: block;
}
.sec-title {
  font-family: "Fredoka", sans-serif;
  font-size: 44px;
  font-weight: 600;
  line-height: 1.15;
  margin-bottom: 16px;
  color: var(--primary);
}
.sec-desc {
  font-size: 15px;
  color: var(--text-body);
  line-height: 1.75;
  max-width: 600px;
  font-family: "Nunito", sans-serif;
}
.sec-header { margin-bottom: 56px; }
.sec-header.center { text-align: center; }
.sec-header.center .sec-desc { margin: 0 auto; }

/* ── VISION ── */
.vision-section { background: var(--cream); padding: 96px 64px; }
.vision-box {
  background: var(--primary);
  border-radius: var(--radius-lg);
  padding: 56px 64px;
  text-align: center;
  max-width: 780px;
  margin: 0 auto 64px;
  position: relative;
  overflow: hidden;
}
.vision-box::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(255,152,0,0.12) 0%, transparent 60%);
}
.vision-box .quote {
  font-family: "Fredoka", sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: white;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}
.vision-grid {
  display: flex;
  gap: 20px;
  padding-bottom: 48px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
}
.vision-card {
  margin: 12px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  border: 1px solid var(--primary-border);
  position: relative;
  width: 370px;
}
.vision-name {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--primary);
}
.vision-desc {
  font-size: 13px;
  color: var(--text-body);
  line-height: 1.6;
  margin-bottom: 16px;
  font-family: "Nunito", sans-serif;
}
.mission { margin-bottom: 64px; }
.mission-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.mission-card {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid var(--primary-border);
  border-radius: var(--radius);
  padding: 12px 18px;
  text-align: left;
  width: 500px;
  transition: all 0.25s;
  margin: 12px;
}
.mission-icon { font-size: 24px; margin: 10px; }
.mission-sub {
  font-size: 13px;
  color: var(--text-body);
  margin: 10px;
  font-family: "Nunito", sans-serif;
}
.doe-label { text-align: center; margin-bottom: 8px; }
.doe-title {
  font-family: "Fredoka", sans-serif;
  font-size: 34px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
  color: var(--primary);
}
.doe-desc {
  text-align: center;
  color: var(--text-body);
  font-size: 15px;
  margin-bottom: 40px;
  font-family: "Nunito", sans-serif;
}
.doe-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.doe-card {
  background: white;
  border: 1px solid var(--primary-border);
  border-radius: var(--radius);
  padding: 24px 20px;
  text-align: center;
  width: 140px;
  transition: all 0.25s;
}
.doe-card:hover {
  border-color: var(--primary-mid);
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(26,35,126,0.1);
}
.doe-icon { font-size: 32px; margin-bottom: 10px; }
.doe-name {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--primary);
  margin-bottom: 4px;
}
.doe-sub {
  font-size: 12px;
  color: var(--text-muted);
  font-family: "Nunito", sans-serif;
}

/* ── PROGRAMS ── */
.programs-section { background: var(--cream2); }
.programs-grid {
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.prog-card {
  flex: 0 0 240px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  border: 2px solid transparent;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}
.prog-card:hover {
  border-color: var(--primary-mid);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(26,35,126,0.1);
}
.prog-age-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 16px;
  font-family: "Nunito", sans-serif;
}
.prog-age-badge.teal  { background: #E0F7FA; color: #006064; }
.prog-age-badge.mint  { background: #E8F5E9; color: #1B5E20; }
.prog-age-badge.yellow{ background: #FFF9C4; color: #F57F17; }
.prog-age-badge.orange{ background: #FBE9E7; color: #BF360C; }
.prog-icon { font-size: 36px; margin-bottom: 14px; }
.prog-name {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--primary);
}
.prog-desc {
  font-size: 13px;
  color: var(--text-body);
  line-height: 1.6;
  margin-bottom: 16px;
  font-family: "Nunito", sans-serif;
}

/* ── SENSORI ── */
.sensori-section { background: var(--cream); }
.sensori-explainer {
  background: var(--primary);
  border-radius: var(--radius-lg);
  padding: 32px 40px;
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
.sensori-explainer p {
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  line-height: 1.7;
  font-family: "Nunito", sans-serif;
}
.sensori-checks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.sensori-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}
.check-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255,152,0,0.2);
  border: 1px solid rgba(255,152,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--gold);
  flex-shrink: 0;
}
.sensori-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.sensori-card {
  border-radius: var(--radius);
  padding: 24px 20px;
  position: relative;
  overflow: hidden;
}
.sensori-card.c1 { background: var(--primary-pale); border: 1px solid var(--primary-border); }
.sensori-card.c2 { background: #E0F7FA; border: 1px solid #B2EBF2; }
.sensori-card.c3 { background: var(--primary-mid); color: white; }
.sensori-card.c4 { background: var(--gold); color: white; }
.sensori-num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: 0.6;
  margin-bottom: 4px;
  font-family: "Nunito", sans-serif;
}
.sensori-icon-sm { font-size: 20px; margin-bottom: 10px; }
.sensori-card-title {
  font-family: "Fredoka", sans-serif;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 4px;
}
.sensori-card-sub {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 14px;
  font-style: italic;
  font-family: "Nunito", sans-serif;
}
.sensori-body {
  font-size: 12px;
  line-height: 1.6;
  opacity: 0.85;
  font-family: "Nunito", sans-serif;
}
.sensori-act-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 12px 0 6px;
  font-family: "Nunito", sans-serif;
}
.sensori-act-list { list-style: none; }
.sensori-act-list li {
  font-size: 12px;
  opacity: 0.85;
  padding: 2px 0;
  display: flex;
  gap: 6px;
  font-family: "Nunito", sans-serif;
}
.sensori-act-list li::before { content: "●"; font-size: 7px; margin-top: 5px; opacity: 0.6; }
.gut-brain {
  background: var(--cream2);
  border-radius: var(--radius);
  padding: 28px 32px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.gut-brain .text-part h4 {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--primary);
}
.gut-brain .text-part p {
  font-size: 14px;
  color: var(--text-body);
  max-width: 600px;
  line-height: 1.6;
  font-family: "Nunito", sans-serif;
}
.btn-green {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-green:hover { background: var(--primary-mid); }

/* ── FITRAH KURIKULUM ── */
.fitrah-kurikulum-section { background: #F8F9FF; padding: 96px 64px; }
.fitrah-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}
.fitrah-card {
  background: white;
  border-radius: 14px;
  padding: 24px 20px;
  border: 1.5px solid var(--primary-border);
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.fitrah-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(26,35,126,0.1);
}
.fc-header { display: flex; align-items: flex-start; gap: 12px; }
.fc-icon { font-size: 26px; flex-shrink: 0; margin-top: 2px; }
.fc-name {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--primary);
  line-height: 1.3;
  margin-bottom: 3px;
}
.fc-tagline {
  font-size: 11px;
  color: var(--gold-dark);
  font-weight: 700;
  font-style: italic;
  line-height: 1.3;
  font-family: "Nunito", sans-serif;
}
.fc-body p {
  font-size: 12.5px;
  color: var(--text-body);
  line-height: 1.65;
  margin-bottom: 10px;
  font-family: "Nunito", sans-serif;
}
.fc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 0;
}
.fc-list li {
  font-size: 12px;
  color: var(--text-body);
  padding-left: 14px;
  position: relative;
  line-height: 1.5;
  font-family: "Nunito", sans-serif;
}
.fc-list li::before {
  content: "●";
  color: var(--gold);
  font-size: 7px;
  position: absolute;
  left: 0;
  top: 5px;
}
.fitrah-quote-bar {
  background: var(--primary);
  border-radius: 14px;
  padding: 28px 40px;
  text-align: center;
  color: white;
}
.fitrah-quote-bar p {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.95);
}
.fitrah-quote-bar span {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.3px;
  font-family: "Nunito", sans-serif;
}

/* ── FACILITIES ── */
.facilities-section { background: var(--cream2); }
.fac-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.fac-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 40px;
}
.fac-item { display: flex; gap: 14px; align-items: flex-start; }
.fac-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary-pale);
  border: 1px solid var(--primary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.fac-item-title {
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--primary);
  margin-bottom: 4px;
}
.fac-item-desc {
  font-size: 12px;
  color: var(--text-body);
  line-height: 1.5;
  font-family: "Nunito", sans-serif;
}
.fac-right { position: relative; }
.fac-img-box {
  width: 100%;
  aspect-ratio: 4/5;
  background: var(--primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fac-img-placeholder {
  width: 100%;
  height: 100%;
  background-image: url("${FACILITIES_IMG_URL}");
  background-size: cover;
}
.safe-badge {
  position: absolute;
  bottom: 16px;
  left: -20px;
  background: white;
  border-radius: var(--radius);
  padding: 14px 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.safe-badge .num {
  font-family: "Fredoka", sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: var(--primary);
}
.safe-badge .label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: "Nunito", sans-serif;
}

/* ── GALLERY ── */
.gallery-section { background: var(--cream); }
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 180px);
  gap: 12px;
  margin-top: 0;
}
.gallery-item {
  background: var(--primary-pale);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: transform 0.3s;
  cursor: pointer;
}
.gallery-item:hover { transform: scale(1.03); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

/* ── CONTACT ── */
.contact-section { background: var(--cream2); }
.contact-grid {
  display: grid;
  grid-template-columns: minmax(auto, 500px);
  justify-content: center;
  gap: 40px;
}
.contact-info-card {
  background: var(--primary);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  color: white;
}
.contact-info-card h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 28px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}
.info-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255,152,0,0.2);
  border: 1px solid rgba(255,152,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.info-label {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 3px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.info-val {
  font-size: 14px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}
.open-house-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.btn-sm-dark {
  background: var(--gold);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-sm-dark:hover { background: var(--gold-dark); }
.btn-sm-green {
  background: transparent;
  color: var(--primary);
  border: 2px solid rgba(26,35,126,0.8);
  padding: 9px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-sm-green:hover { border-color: white; background: rgba(255,255,255,0.1); }

/* ── FOOTER ── */
footer {
  background: var(--primary);
  padding: 32px 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
footer .f-brand {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: white;
}
footer .f-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
  font-family: "Nunito", sans-serif;
}
footer .f-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  text-align: right;
  font-family: "Nunito", sans-serif;
  line-height: 1.6;
}

/* ── ANIMATIONS ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-badge-top { animation: fadeUp 0.5s ease both; }
.hero-content > * { animation: fadeUp 0.7s ease both; }
.hero-content > *:nth-child(1) { animation-delay: 0.1s; }
.hero-content > *:nth-child(2) { animation-delay: 0.2s; }
.hero-content > *:nth-child(3) { animation-delay: 0.3s; }
.hero-content > *:nth-child(4) { animation-delay: 0.4s; }
.hero-content > *:nth-child(5) { animation-delay: 0.5s; }

/* ── NOTIFY ── */
.notify {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  background: var(--primary);
  color: white;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-family: "Nunito", sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  transform: translateY(80px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
  pointer-events: none;
}
.notify.show { transform: translateY(0); opacity: 1; }

/* ── RESPONSIVE ── */
@media (max-width: 1200px) {
  .fitrah-cards-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 1024px) {
  nav { padding: 0 32px; }
  .hero-content { padding: 32px; }
  .hero-title { font-size: 58px; }
  section,
  .vision-section,
  .contact-section,
  .sensori-section,
  .facilities-section,
  .gallery-section,
  .programs-section { padding: 72px 32px; }
  footer { padding: 24px 32px; }
  .sensori-grid { grid-template-columns: repeat(2, 1fr); }
  .gallery-grid { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 160px); }
}
@media (max-width: 768px) {
  nav { padding: 0 20px; height: 72px; }
  .nav-links { display: none; }
  .nav-right .btn-gold { display: none; }
  .hamburger { display: flex; }
  .hero-badge-top { font-size: 10px; padding: 6px 14px; top: 24px; }
  .hero-content { padding: 20px; max-width: 100%; }
  .hero-title { font-size: 42px; }
  .hero-desc { font-size: 15px; }
  .hero-actions { gap: 10px; }
  .btn-gold-solid, .btn-outline-dark { padding: 12px 20px; font-size: 14px; }
  .hero-stats { padding-top: 24px; }
  .hero-stat { padding-right: 24px; margin-right: 24px; }
  .hero-stat-num { font-size: 28px; }
  section,
  .vision-section,
  .contact-section,
  .sensori-section,
  .facilities-section,
  .gallery-section,
  .programs-section { padding: 56px 20px; }
  .sec-title { font-size: 34px; }
  .vision-box { padding: 36px 28px; }
  .vision-box .quote { font-size: 20px; }
  .sensori-explainer { grid-template-columns: 1fr; gap: 24px; padding: 24px 20px; }
  .sensori-grid { grid-template-columns: 1fr 1fr; }
  .gut-brain { flex-direction: column; gap: 16px; }
  .fac-grid { grid-template-columns: 1fr; }
  .fac-items { grid-template-columns: 1fr; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, 140px); }
  .fitrah-kurikulum-section { padding: 56px 20px; }
  footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
  footer .f-copy { text-align: left; }
}
@media (max-width: 640px) {
  .fitrah-cards-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hero-title { font-size: 34px; }
  .hero-stats { flex-direction: column; gap: 16px; padding-top: 20px; }
  .hero-stat { border-right: none; padding-right: 0; margin-right: 0; border-bottom: 1px solid var(--primary-border); padding-bottom: 12px; }
  .hero-stat:last-child { border-bottom: none; }
  .sensori-grid { grid-template-columns: 1fr; }
  .sec-title { font-size: 28px; }
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
      `}</style>

      <div className="notify" id="notify"><span id="notify-msg">Tersimpan!</span></div>

      {/* NAV */}
      <nav>
        <a className="nav-brand" href="#">
          <div className="nav-logo">
            <Image src={LOGO_URL} alt="Energia Kids Daycare" width={155} height={155} />
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#vision"     onClick={(e) => { e.preventDefault(); scrollTo("vision"); }}>Vision &amp; Values</a></li>
          <li><a href="#programs"   onClick={(e) => { e.preventDefault(); scrollTo("programs"); }}>Programs</a></li>
          <li><a href="#facilities" onClick={(e) => { e.preventDefault(); scrollTo("facilities"); }}>Facilities</a></li>
          <li><a href="#gallery"    onClick={(e) => { e.preventDefault(); scrollTo("gallery"); }}>Gallery</a></li>
          <li><a href="#contact"    onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact</a></li>
        </ul>
        <div className="nav-right">
          <Link href="/admission">
            <button className="btn-gold">Daftar Sekarang</button>
          </Link>
        </div>
        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <button onClick={() => scrollTo("vision")}>Vision &amp; Values</button>
        <button onClick={() => scrollTo("programs")}>Programs</button>
        <button onClick={() => scrollTo("facilities")}>Facilities</button>
        <button onClick={() => scrollTo("gallery")}>Gallery</button>
        <button onClick={() => scrollTo("contact")}>Contact</button>
        <button className="mobile-daftar" onClick={() => scrollTo("contact")}>Daftar Sekarang</button>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg-img">
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <circle cx="980" cy="130"  r="170" fill="#E3F2FD" opacity="0.75"/>
            <circle cx="1120" cy="620" r="110" fill="#FCE4EC" opacity="0.65"/>
            <circle cx="870"  cy="720" r="85"  fill="#E8F5E9" opacity="0.7"/>
            <circle cx="1020" cy="370" r="95"  fill="#FFF9C4" opacity="0.6"/>
            <circle cx="760"  cy="60"  r="55"  fill="#F3E5F5" opacity="0.6"/>
            <circle cx="430"  cy="750" r="38"  fill="#FFF3E0" opacity="0.6"/>
            <rect   x="60"   y="680"  width="70" height="70" rx="14" fill="#E1F5FE" opacity="0.5"/>
            <rect   x="15"   y="500"  width="50" height="50" rx="10" fill="#FCE4EC" opacity="0.4"/>
          </svg>
        </div>
        <div className="hero-bg"></div>

        <div className="hero-content">
          <div className="hero-title">
            Where Young<br />
            <span className="accent">Khalifah</span> Begins
          </div>
          <p className="hero-desc">
            A nurturing Islamic environment for children aged 3 months – 6 years. We raise faithful, curious, and joyful little ones — rooted in akhlaq, ready for the world.
          </p>
          <p className="hero-vision">
            <em>&ldquo;Sekolah teladan dalam mencetak generasi muda Indonesia yang memiliki pemikiran global dan menjalankan nilai-nilai Islami&rdquo;</em>
          </p>
          <div className="hero-actions">
            <button className="btn-gold-solid" onClick={() => scrollTo("programs")}>Explore Programs</button>
            <button className="btn-outline-dark" onClick={() => scrollTo("contact")}>Daftar Sekarang</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">3bln+</div>
              <div className="hero-stat-label">Usia Minimal Masuk</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">5</div>
              <div className="hero-stat-label">Program Tersedia</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">8</div>
              <div className="hero-stat-label">Aspek Fitrah</div>
            </div>
          </div>
        </div>
      </div>

      {/* VISION */}
      <section className="vision-section" id="vision">
        <div className="sec-header center">
          <div className="sec-label">OUR DIRECTION</div>
          <div className="sec-title">Vision</div>
        </div>
        <div className="vision-box">
          <div className="quote">Terwujudnya generasi HUKMA SHABIYA untuk membangun generasi RABBI RADHIYA</div>
        </div>
        <div className="vision-grid">
          <div className="vision-card">
            <div className="vision-name">HUKMA SHABIYA</div>
            <p className="vision-desc">Generasi yang dikenalkan hikmah dan ilmu agama sejak usia dini — masa golden age yang paling krusial untuk menanamkan fondasi iman dan akhlak.</p>
          </div>
          <div className="vision-card">
            <div className="vision-name">RABBI RADHIYA</div>
            <p className="vision-desc">Generasi yang tumbuh dengan ridha atas aturan Allah — memiliki kepribadian yang kokoh, bertakwa, dan siap menjalani peran peradabannya.</p>
          </div>
        </div>

        <div className="sec-header center">
          <div className="sec-label">OUR MISSION</div>
          <div className="sec-title">Mission</div>
        </div>
        <div className="mission">
          <div className="mission-grid">
            <div className="mission-card"><div className="mission-icon">🕌</div><div className="mission-sub">Menyelenggarakan pendidikan berbasis Al-Qur&apos;an, Sunnah, dan 8 Aspek Fitrah</div></div>
            <div className="mission-card"><div className="mission-icon">🌱</div><div className="mission-sub">Mengoptimalkan tumbuh kembang anak di masa golden age melalui stimulasi 8 aspek fitrah</div></div>
          </div>
          <div className="mission-grid">
            <div className="mission-card"><div className="mission-icon">💛</div><div className="mission-sub">Menciptakan suasana belajar penuh kehangatan, kelembutan, dan kasih sayang</div></div>
            <div className="mission-card"><div className="mission-icon">🤝</div><div className="mission-sub">Menjadi jembatan transisi terbaik menuju jenjang pendidikan selanjutnya</div></div>
          </div>
          <div className="mission-grid">
            <div className="mission-card"><div className="mission-icon">👩‍🏫</div><div className="mission-sub">Membangun tenaga pendidik dan kependidikan yang kompeten dalam pengasuhan, perawatan, dan pendidikan AUD</div></div>
            <div className="mission-card"><div className="mission-icon">📚</div><div className="mission-sub">Menyelenggarakan KBM berkualitas sesuai tugas perkembangan anak</div></div>
          </div>
          <div className="mission-grid">
            <div className="mission-card"><div className="mission-icon">🏡</div><div className="mission-sub">Menciptakan lingkungan sekolah yang aman, nyaman, dan kondusif</div></div>
            <div className="mission-card"><div className="mission-icon">🌐</div><div className="mission-sub">Membangun sinergi aktif antara sekolah dan keluarga</div></div>
          </div>
        </div>

        <div className="sec-header center">
          <div className="sec-label">OUR GOAL</div>
          <div className="sec-title">Tujuan</div>
        </div>
        <div className="vision-box">
          <div className="quote">Membangun generasi Rabbi Radhiya yang tumbuh dan berkembang sesuai fitrahnya</div>
        </div>
        <div className="doe-label sec-label" style={{textAlign:"center"}}>DESIRED OUTCOMES OF EDUCATION</div>
        <div className="doe-title">Khalifah Fil Ard</div>
        <p className="doe-desc">The DOE of the school is to nurture leaders who are faithful, virtuous, competent, globally minded, and contribute meaningfully to society according to their roles.</p>
        <div className="doe-grid">
          <div className="doe-card"><div className="doe-icon">🌿</div><div className="doe-name">Mu&apos;min</div><div className="doe-sub">Faithful</div></div>
          <div className="doe-card"><div className="doe-icon">💠</div><div className="doe-name">Muhsin</div><div className="doe-sub">Virtuous</div></div>
          <div className="doe-card"><div className="doe-icon">🎯</div><div className="doe-name">Mutqin</div><div className="doe-sub">Competent</div></div>
          <div className="doe-card"><div className="doe-icon">🌍</div><div className="doe-name">Global</div><div className="doe-sub">Global Minded</div></div>
          <div className="doe-card"><div className="doe-icon">🌟</div><div className="doe-name">Impactful</div><div className="doe-sub">Meaningful Contribution</div></div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="programs-section" id="programs">
        <div className="sec-header center">
          <div className="sec-label">OUR PROGRAMS</div>
          <div className="sec-title">Daycare &amp; Preschool Classes</div>
          <p className="sec-desc" style={{margin:"0 auto"}}>Program berbasis usia untuk anak 3 bulan – 6 tahun, dirancang memaksimalkan potensi spiritual, intelektual, dan sosial setiap anak.</p>
        </div>
        <div className="programs-grid">
          {[
            {badge:"teal",   age:"3 Bulan – 1 Tahun", icon:"🍼", name:"Infant",  desc:"Perawatan penuh kasih untuk si kecil. Fokus pada perkembangan fisik, stimulasi sensorik, dan rasa aman secara emosional."},
            {badge:"mint",   age:"1 – 3 Tahun",        icon:"🎨", name:"Toddler", desc:"Belajar melalui bermain yang kreatif — mengembangkan bahasa, kemampuan sosial, dan mengenalkan nilai-nilai Islam."},
          ].map((p, i) => (
            <div className="prog-card" key={i}>
              <div className={`prog-age-badge ${p.badge}`}>{p.age}</div>
              <div className="prog-icon">{p.icon}</div>
              <div className="prog-name">{p.name}</div>
              <p className="prog-desc">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="programs-grid">
          {[
            {badge:"yellow", age:"4 Tahun", icon:"📚", name:"Preschool 1 / KB",  desc:"Lingkungan belajar terstruktur namun menyenangkan — mempersiapkan anak secara akademis dan spiritual."},
            {badge:"orange", age:"5 Tahun", icon:"⭐", name:"Preschool 2 / TK A", desc:"Program TK komprehensif membangun fondasi membaca, matematika, sains, dan karakter Islami yang kuat."},
            {badge:"",       age:"6 Tahun", icon:"🎓", name:"Preschool 3 / TK B", desc:"Persiapan masuk SD dengan kurikulum holistik — akademik, karakter Islami, dan kesiapan sosial-emosional."},
          ].map((p, i) => (
            <div className="prog-card" key={i}>
              <div className={`prog-age-badge ${p.badge}`} style={p.badge === "" ? {background:"#F3E5F5",color:"#4A148C"} : {}}>{p.age}</div>
              <div className="prog-icon">{p.icon}</div>
              <div className="prog-name">{p.name}</div>
              <p className="prog-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SENSORI */}
      <section className="sensori-section">
        <div className="sec-header center">
          <div className="sec-label">PROGRAM UNGGULAN</div>
          <div className="sec-title">Stimulasi 4 Level Sensori Integrasi</div>
          <p className="sec-desc" style={{margin:"0 auto"}}>Di Energia Kids Daycare, kami menerapkan pendekatan berbasis Sensori Integrasi — memastikan setiap anak mendapatkan stimulasi yang tepat sesuai tahapan perkembangannya.</p>
        </div>
        <div className="sensori-explainer">
          <div>
            <div style={{fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,152,0,0.9)",marginBottom:"10px",fontFamily:"Nunito,sans-serif",fontWeight:700}}>APA ITU SENSORI INTEGRASI?</div>
            <p>Sensori integrasi adalah proses di mana otak menerima informasi dari indera — sentuhan, penglihatan, pendengaran, dan gerakan tubuh — lalu mengolahnya menjadi respons yang tepat.</p>
          </div>
          <div className="sensori-checks">
            {["Deteksi dini gangguan perkembangan","Stimulasi tepat sesuai usia","Meningkatkan fokus & perilaku","Mendukung kesiapan belajar"].map((c,i)=>(
              <div className="sensori-check" key={i}><div className="check-icon">✓</div>{c}</div>
            ))}
          </div>
        </div>
        <div className="sensori-grid">
          {[
            {cls:"c1",num:"1",icon:"🤲",title:"Tactile",     sub:"Sentuhan & Tekstur",      body:"Stimulasi indera peraba melalui berbagai tekstur, suhu, dan bahan alami untuk membangun kepekaan taktil.",        acts:["Bermain pasir & tanah","Finger painting","Eksplorasi bahan alam"]},
            {cls:"c2",num:"2",icon:"🏃",title:"Vestibular",  sub:"Keseimbangan & Gerakan",   body:"Aktivitas yang mengaktifkan sistem keseimbangan — krusial untuk koordinasi tubuh dan regulasi diri.",             acts:["Ayunan & panjatan","Berguling & melompat","Senam pagi bersama"]},
            {cls:"c3",num:"3",icon:"💪",title:"Proprioceptive",sub:"Posisi & Tekanan Tubuh", body:"Stimulasi deep pressure dan kesadaran posisi tubuh untuk membangun kekuatan otot dan kontrol motorik.",            acts:["Mendorong & menarik","Membawa beban ringan"]},
            {cls:"c4",num:"4",icon:"👁️",title:"Visual & Auditori",sub:"Penglihatan & Pendengaran",body:"Integrasi input visual dan auditori untuk membangun fondasi kemampuan belajar dan perhatian.",              acts:["Musik & gerak","Eksplorasi warna","Cerita interaktif"]},
          ].map((s,i)=>(
            <div className={`sensori-card ${s.cls}`} key={i}>
              <div className="sensori-num">LEVEL {s.num}</div>
              <div className="sensori-icon-sm">{s.icon}</div>
              <div className="sensori-card-title">{s.title}</div>
              <div className="sensori-card-sub">{s.sub}</div>
              <div className="sensori-body">{s.body}</div>
              <div className="sensori-act-label">Contoh Aktivitas</div>
              <ul className="sensori-act-list">{s.acts.map((a,j)=><li key={j}>{a}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="gut-brain">
          <div className="text-part">
            <h4>🧠 Gut-Brain Connection dalam Kurikulum Kami</h4>
            <p>Energia Kids Daycare mengintegrasikan pemahaman tentang hubungan usus-otak dalam pola makan dan aktivitas harian — makanan bergizi, tidur teratur, dan stimulasi sensorik bekerja bersama untuk mendukung perkembangan kognitif optimal.</p>
          </div>
          <button className="btn-green" onClick={() => scrollTo("contact")}>Pelajari Lebih Lanjut →</button>
        </div>
      </section>

      {/* 8 ASPEK FITRAH */}
      <FitrahKurikulum />

      {/* FACILITIES */}
      <section className="facilities-section" id="facilities">
        <div className="fac-grid">
          <div className="fac-left">
            <div className="sec-header">
              <div className="sec-label">FASILITAS</div>
              <div className="sec-title">Safe, Stimulating &amp; Meaningful</div>
              <p className="sec-desc">Setiap sudut sekolah kami dirancang untuk mendukung tumbuh kembang anak — aman, menstimulasi, dan sesuai nilai-nilai Islam.</p>
            </div>
            <div className="fac-items">
              {[
                {icon:"🛡️", title:"Safe Facilities",        desc:"Lingkungan belajar yang aman, nyaman, dan islami untuk mendukung tumbuh kembang anak secara optimal"},
                {icon:"📚", title:"Ruang Kelas",             desc:"Ruang belajar yang nyaman, bersih, dan stimulatif dengan ventilasi udara yang baik."},
                {icon:"💤", title:"Ruang Tidur Siang",       desc:"Ruang tidur bersih, nyaman agar energi tetap terjaga setiap hari."},
                {icon:"🕋", title:"Masjid",                  desc:"Sekolah dekat dengan masjid untuk membangun kebiasaan sholat sejak dini."},
                {icon:"🚑", title:"Puskesmas",                desc:"Sekolah dekat dengan Faskes 1. Mempermudah akses pelayanan kesehatan."},
                {icon:"📖", title:"Ruang Baca dan Literasi", desc:"Perpustakaan mini dengan buku yang beragam dan cerita Islami agar anak cinta ilmu dan buku"},
              ].map((f,i)=>(
                <div className="fac-item" key={i}>
                  <div className="fac-icon-box">{f.icon}</div>
                  <div>
                    <div className="fac-item-title">{f.title}</div>
                    <div className="fac-item-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fac-right">
            <div className="fac-img-box" style={{ position: "relative" }}>
              <Image
                src={FACILITIES_IMG_URL}
                alt="Fasilitas Energia Kids Daycare"
                fill
                style={{ objectFit: "cover", borderRadius: "inherit" }}
              />
              <Link
                href="/login"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: "inherit",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>📹</span>
                <span style={{ fontWeight: 600 }}>Live CCTV untuk Orang Tua &amp; Guru</span>
                <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>Login untuk menonton siaran langsung</span>
              </Link>
            </div>
            <div className="safe-badge">
              <div className="num">100%</div>
              <div className="label">CCTV Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section" id="gallery">
        <div className="sec-header center">
          <div className="sec-label">GALERI</div>
          <div className="sec-title">A Glimpse of Daily Life</div>
          <p className="sec-desc" style={{margin:"0 auto 40px"}}>Sekilas suasana belajar, bermain, dan bertumbuh bersama di Energia Kids Daycare.</p>
        </div>
        <div className="gallery-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `${GALLERY_BASE_URL}/gallery${n}.jpg`).map((src, i) => (
            <div className="gallery-item relative" key={i}>
              <Image src={src} alt={`Gallery item ${i + 1}`} fill sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="sec-header center">
          <div className="sec-label">BERGABUNG</div>
          <div className="sec-title">Mulai Perjalanan Si Kecil Bersama Kami</div>
          <p className="sec-desc" style={{margin:"0 auto 56px"}}>Daftarkan putra-putri Anda sekarang dan berikan mereka fondasi terbaik sejak dini. Hubungi kami, tim kami siap membantu.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-sidebar">
            <div className="contact-info-card" style={{marginBottom:"20px"}}>
              <h3>Informasi Kontak</h3>
              {[
                {icon:"📍", label:"ALAMAT",          val:"Ruko Candirejo Commercial Park no B5, Magetan"},
                {icon:"📱", label:"WHATSAPP",         val:"+62 816-1578-4070"},
                {icon:"📧", label:"EMAIL",            val:"info@iispsm.sch.id"},
                {icon:"⏰", label:"JAM OPERASIONAL", val:"Senin – Jumat, 07.00 – 16.00"},
              ].map((info, i) => (
                <div className="info-item" key={i}>
                  <div className="info-icon">{info.icon}</div>
                  <div>
                    <div className="info-label">{info.label}</div>
                    <div className="info-val">{info.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="open-house-btns">
              <Link className="btn-sm-dark" href="/admission">Daftar Online</Link>
              <Link className="btn-sm-green" href="https://wa.me/6281615784070" target="_blank">Hubungi Kami</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MENGAPA MEMILIH KAMI */}
      <section style={{ padding: "96px 64px", background: "var(--cream2)" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="sec-label">MENGAPA KAMI</span>
          <h2 className="sec-title">Mengapa Memilih IIS PSM Daycare?</h2>
          <p className="sec-desc" style={{ margin: "0 auto" }}>Kami berkomitmen memberikan pendidikan terbaik sesuai fitrah anak.</p>
        </div>
        <div className="stats-grid" style={{ maxWidth: "900px", margin: "0 auto" }}>
          {[
            { num: "8", label: "Aspek Fitrah", desc: "Stimulasi holistik mencakup seluruh aspek perkembangan anak" },
            { num: "5", label: "Program Kelas", desc: "Infant, Toddler, KB, TK A, dan TK B" },
            { num: "4", label: "Level Sensori", desc: "Tactile, Vestibular, Proprioceptive, Visual & Auditori" },
            { num: "100%", label: "CCTV Coverage", desc: "Keamanan anak terpantau sepanjang hari" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "white", borderRadius: "14px", padding: "28px 20px",
              border: "1.5px solid var(--primary-border)", textAlign: "center",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}>
              <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: "36px", fontWeight: 600, color: "var(--gold)", marginBottom: "4px" }}>{s.num}</div>
              <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: "15px", color: "var(--primary)", marginBottom: "6px" }}>{s.label}</div>
              <div style={{ fontSize: "12px", color: "var(--text-body)", lineHeight: 1.5, fontFamily: "Nunito, sans-serif" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "96px 64px", background: "var(--cream)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="sec-label">PERTANYAAN UMUM</span>
            <h2 className="sec-title">FAQ</h2>
          </div>
          {[
            { q: "Berapa usia minimal masuk?", a: "Kami menerima anak mulai usia 3 bulan hingga 6 tahun. Tersedia program Infant (3 bulan–1 tahun), Toddler (1–3 tahun), KB (4 tahun), TK A (5 tahun), dan TK B (6 tahun)." },
            { q: "Apa kurikulum yang digunakan?", a: "Kurikulum 8 Aspek Fitrah: Keimanan, Belajar, Bakat, Seksualitas, Jasmani, Bahasa, Sosialitas, dan Adab. Dilengkapi stimulasi 4 Level Sensori Integrasi." },
            { q: "Jam operasional?", a: "Senin–Jumat, pukul 07.00–16.00 WIB. Tersedia sesi Pagi, Siang, dan Full Day." },
            { q: "Bagaimana cara mendaftar?", a: "Kunjungi halaman Penerimaan Siswa Baru, isi data orang tua dan anak, lalu submit. Tim kami akan menghubungi untuk langkah selanjutnya." },
            { q: "Apakah ada fasilitas keamanan?", a: "Ya, 100% CCTV coverage, lingkungan belajar aman dan nyaman, serta dekat dengan Puskesmas." },
            { q: "Di mana lokasi sekolah?", a: "Ruko Candirejo Commercial Park no B5, Magetan, Jawa Timur. Dekat dengan masjid untuk kebiasaan sholat sejak dini." },
          ].map((item, i) => (
            <details key={i} style={{
              background: "white", borderRadius: "12px", border: "1px solid var(--primary-border)",
              marginBottom: "12px", overflow: "hidden",
            }}>
              <summary style={{
                padding: "16px 20px", cursor: "pointer", fontWeight: 600,
                fontSize: "14px", color: "var(--primary)", fontFamily: "Nunito, sans-serif",
                listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                {item.q}
                <span style={{ fontSize: "18px", color: "var(--text-muted)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <div style={{ padding: "0 20px 16px", fontSize: "13px", color: "var(--text-body)", lineHeight: 1.7, fontFamily: "Nunito, sans-serif" }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="f-brand">Energia - Kids Daycare</div>
          <div className="f-sub">Membangun Generasi Hukma Shabiya · Magetan, Jawa Timur</div>
        </div>
        <h1 className="sr-only">Daycare &amp; Preschool Islami di Magetan — Kurikulum 8 Fitrah &amp; Sensori Integrasi</h1>
        <div style={{display:"flex",gap:"20px",flexWrap:"wrap",alignItems:"center"}}>
          <Link href="/login" style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",textDecoration:"none",fontFamily:"Nunito,sans-serif"}}>Portal Guru & Orang Tua</Link>
          <Link href="/admission" style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",textDecoration:"none",fontFamily:"Nunito,sans-serif"}}>Daftar Online</Link>
        </div>
        <div className="f-copy">© 2026 Islamic International School PSM Magetan · iispsm.sch.id<br/>Jl. Monginsidi No. 52, Candirejo, Magetan</div>
      </footer>
    </>
  );
}