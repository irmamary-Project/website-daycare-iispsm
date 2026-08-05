"use client";
import { useState } from "react";
import Image from "next/image";
import Link from 'next/link'
import { LOGO_URL, FACILITIES_IMG_URL, GALLERY_BASE_URL } from '@/lib/constants';
import "./landing-page.css";

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
