"use client";

import Link from "next/link";
import PDFExportButton from "@/components/riwayat/PDFExportButton";

export default function DailyDetailClient({ children, data }: { children: React.ReactNode; data: any }) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/guru/riwayat"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Kembali ke Riwayat
        </Link>
        <PDFExportButton type="daily" data={data} filename="daily-report" />
      </div>
      {children}
    </div>
  );
}
