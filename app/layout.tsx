import type { Metadata } from "next";
import "./globals.css";
import { OG_IMAGE_URL } from "@/lib/constants";

const SITE_URL = "https://energiakidsdaycare.my.id";

export const metadata: Metadata = {
  title: "IIS PSM Daycare & Preschool Magetan | Usia Dini Islami",
  description: "Daycare & prasekolah Islami di Magetan untuk usia 3 bulan–6 tahun. Kurikulum 8 Fitrah & Sensori Integrasi untuk tumbuh kembang anak optimal.",
  keywords: [
    "daycare magetan",
    "preschool magetan",
    "penitipan anak magetan",
    "sekolah islam magetan",
    "playgroup magetan",
    "TK islam magetan",
    "IIS PSM",
    "sensori integrasi anak"
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "IIS PSM Daycare & Preschool Magetan | Usia Dini Islami",
    description: "Daycare & prasekolah Islami di Magetan untuk usia 3 bulan–6 tahun. Kurikulum 8 Fitrah & Sensori Integrasi.",
    url: SITE_URL,
    siteName: "IIS PSM Daycare & Preschool",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Kegiatan Belajar di IIS PSM Daycare & Preschool Magetan",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IIS PSM Daycare & Preschool Magetan | Usia Dini Islami",
    description: "Daycare & prasekolah Islami di Magetan. Kurikulum 8 Fitrah & Sensori Integrasi.",
    images: [OG_IMAGE_URL],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}#organization`,
  name: "IIS PSM Daycare & Preschool",
  alternateName: "Energia Kids Daycare",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon1.png`,
  },
  description: "Daycare dan prasekolah Islami di Magetan untuk usia 3 bulan hingga 6 tahun dengan kurikulum 8 Fitrah dan Sensori Integrasi.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ruko Candirejo Commercial Park no B5",
    addressLocality: "Magetan",
    addressRegion: "Jawa Timur",
    postalCode: "63315",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -7.6581,
    longitude: 111.4722,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-816-1578-4070",
    contactType: "customer service",
    availableLanguage: ["Indonesian"],
  },
  sameAs: [],
  speaks: "id",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Berapa usia minimal masuk di IIS PSM Daycare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IIS PSM Daycare menerima anak mulai dari usia 3 bulan hingga 6 tahun. Tersedia program Infant (3 bulan–1 tahun), Toddler (1–3 tahun), KB/Preschool 1 (4 tahun), TK A/Preschool 2 (5 tahun), dan TK B/Preschool 3 (6 tahun).",
      },
    },
    {
      "@type": "Question",
      name: "Apa kurikulum yang digunakan di IIS PSM Daycare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kami menggunakan Kurikulum 8 Aspek Fitrah yang mencakup: Keimanan, Belajar, Bakat, Seksualitas, Jasmani, Bahasa, Sosialitas, dan Adab. Dilengkapi dengan stimulasi 4 Level Sensori Integrasi untuk mengoptimalkan perkembangan anak.",
      },
    },
    {
      "@type": "Question",
      name: "Jam operasional IIS PSM Daycare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IIS PSM Daycare beroperasi dari Senin hingga Jumat, pukul 07.00–16.00 WIB. Tersedia sesi Pagi, Siang, dan Full Day.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara mendaftarkan anak di IIS PSM Daycare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cara mendaftar sangat mudah: kunjungi halaman Penerimaan Siswa Baru di website kami, isi data orang tua dan data anak, laluSubmit pendaftaran. Tim kami akan menghubungi Anda untuk langkah selanjutnya.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah IIS PSM Daycare memiliki fasilitas keamanan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, kami memiliki 100% CCTV coverage, lingkungan belajar yang aman dan nyaman, serta dekat dengan Puskesmas untuk akses kesehatan yang mudah.",
      },
    },
    {
      "@type": "Question",
      name: "Di mana lokasi IIS PSM Daycare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IIS PSM Daycare beralamat di Ruko Candirejo Commercial Park no B5, Magetan, Jawa Timur. Kami juga berlokasi dekat dengan masjid untuk membangun kebiasaan sholat sejak dini.",
      },
    },
  ],
};

const courseSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Infant Care",
    description: "Perawatan penuh kasih untuk bayi usia 3 bulan–1 tahun. Fokus pada perkembangan fisik, stimulasi sensorik, dan rasa aman secara emosional.",
    provider: { "@type": "Organization", name: "IIS PSM Daycare" },
    educationalLevel: "0-1 tahun",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Toddler Program",
    description: "Belajar melalui bermain yang kreatif untuk anak usia 1–3 tahun. Mengembangkan bahasa, kemampuan sosial, dan mengenalkan nilai-nilai Islam.",
    provider: { "@type": "Organization", name: "IIS PSM Daycare" },
    educationalLevel: "1-3 tahun",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "KB / Preschool 1",
    description: "Lingkungan belajar terstruktur namun menyenangkan untuk anak usia 4 tahun. Mempersiapkan anak secara akademis dan spiritual.",
    provider: { "@type": "Organization", name: "IIS PSM Daycare" },
    educationalLevel: "4 tahun",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "TK A / Preschool 2",
    description: "Program TK komprehensif untuk anak usia 5 tahun. Membangun fondasi membaca, matematika, sains, dan karakter Islami yang kuat.",
    provider: { "@type": "Organization", name: "IIS PSM Daycare" },
    educationalLevel: "5 tahun",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "TK B / Preschool 3",
    description: "Persiapan masuk SD untuk anak usia 6 tahun dengan kurikulum holistik — akademik, karakter Islami, dan kesiapan sosial-emosional.",
    provider: { "@type": "Organization", name: "IIS PSM Daycare" },
    educationalLevel: "6 tahun",
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {courseSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
