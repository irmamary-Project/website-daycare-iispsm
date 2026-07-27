"use client";

import Link from "next/link";
import PDFExportButton from "@/components/riwayat/PDFExportButton";

export default function LaporanDetailClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/guru/riwayat"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Kembali ke Riwayat
        </Link>
        <PDFExportButton targetId="laporan-content" filename="laporan-triwulan" />
      </div>
      {children}
    </div>
  );
}
