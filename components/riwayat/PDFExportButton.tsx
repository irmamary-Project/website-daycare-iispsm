"use client";

import { useRef } from "react";

export default function PDFExportButton({
  targetId,
  filename,
}: {
  targetId: string;
  filename: string;
}) {
  const loadingRef = useRef(false);

  async function handleExport() {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const [jsPDF, html2canvas] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);

    const el = document.getElementById(targetId);
    if (!el) return;

    const canvas = await html2canvas.default(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF.default("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${filename}.pdf`);
    loadingRef.current = false;
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
