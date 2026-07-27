import type { Config } from "tailwindcss";

export default {
  content: [
    // Covers semua file di root-level folders
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Tambahan: kalau pakai src/ folder
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary Navy (dari logo Energia) ──
        primary: {
          DEFAULT: "#1A237E",
          mid:     "#3949AB",
          light:   "#5C6BC0",
          pale:    "#E8EAF6",
          border:  "#C5CAE9",
        },
        // ── Orange / Gold (dari logo) ──
        gold: {
          DEFAULT: "#FF9800",
          dark:    "#F57C00",
          pale:    "#FFF3E0",
        },
        // ── Warna-warni logo ──
        teal: {
          DEFAULT: "#00BCD4",
          pale:    "#E0F7FA",
        },
        magenta: {
          DEFAULT: "#E91E8C",
          pale:    "#FCE4EC",
        },
        "logo-green": {
          DEFAULT: "#4CAF50",
          pale:    "#E8F5E9",
        },
        purple: {
          DEFAULT: "#673AB7",
          pale:    "#F3E5F5",
        },
        amber: {
          DEFAULT: "#FFC107",
          pale:    "#FFF9C4",
        },
        // ── Backgrounds ──
        cream: {
          DEFAULT: "#F8F9FF",
          2:       "#FFFBF5",
        },

        // ── Legacy aliases (agar kode lama tidak error) ──
        green: {
          dark:   "#1A237E",
          mid:    "#3949AB",
          light:  "#5C6BC0",
          pale:   "#E8EAF6",
          border: "#C5CAE9",
        },
      },

      fontFamily: {
        sans:    ["Nunito", "sans-serif"],
        display: ["Fredoka", "sans-serif"],
        // Legacy alias
        serif:   ["Fredoka", "sans-serif"],
      },

      borderRadius: {
        sm:  "8px",
        DEFAULT: "12px",
        lg:  "20px",
        xl:  "28px",
      },

      boxShadow: {
        sm:  "0 2px 8px rgba(26,35,126,0.08)",
        md:  "0 8px 24px rgba(26,35,126,0.12)",
        lg:  "0 16px 48px rgba(26,35,126,0.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;