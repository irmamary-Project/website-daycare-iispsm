"use client";

import { useRef } from "react";
import { generateDailyReportPDF, generatePortfolioPDF, generateLaporanPDF } from "@/lib/pdf";
import type { DailyReport, Portofolio, LaporanTriwulan } from "@/types";

type ReportType = "daily" | "portofolio" | "laporan";

export default function PDFExportButton({
  type,
  data,
  filename,
}: {
  type: ReportType;
  data: any;
  filename: string;
}) {
  const loadingRef = useRef(false);

  async function handleExport() {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      let doc;
      switch (type) {
        case "daily":
          doc = await generateDailyReportPDF(data as DailyReport & { siswa?: { nama: string; kelas: string } });
          break;
        case "portofolio":
          doc = await generatePortfolioPDF(data as Portofolio & { siswa?: { nama: string; kelas: string } });
          break;
        case "laporan":
          doc = await generateLaporanPDF(data as LaporanTriwulan & { siswa?: { nama: string; kelas: string } });
          break;
      }
      doc!.save(`${filename}.pdf`);
    } finally {
      loadingRef.current = false;
    }
  }

  return (
    <button
      onClick={handleExport}
      className="btn-primary flex items-center gap-2"
    >
      <span>📄</span>
      Export PDF
    </button>
  );
}
