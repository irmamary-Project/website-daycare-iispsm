import type jsPDF from "jspdf";
import type { DailyReport, Portofolio, LaporanTriwulan } from "@/types";
import { FITRAH_LIST, CAPAIAN_OPTIONS } from "@/types";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const PAGE_W = 210;
const MARGIN_L = 20;
const MARGIN_R = 20;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

function fmtDate(d: string) {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function fmtDateTime(d: string) {
  const date = new Date(d);
  return `${fmtDate(d)} ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
}

async function getDoc(): Promise<typeof jsPDF> {
  const { default: JsPdf } = await import("jspdf");
  return JsPdf;
}

function header(doc: jsPDF, title: string, subtitle: string, meta: string, y: number): number {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, PAGE_W / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, PAGE_W / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(meta, PAGE_W / 2, y, { align: "center" });
  y += 6;

  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 6;

  return y;
}

function field(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text(label + ":", MARGIN_L, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const maxW = CONTENT_W - 45;
  const lines = doc.splitTextToSize(value, maxW);
  doc.text(lines, MARGIN_L + 40, y);
  y += Math.max(lines.length * 5, 6);

  return y;
}

function sectionDivider(doc: jsPDF, y: number): number {
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  return y + 4;
}

function textBlock(doc: jsPDF, label: string, text: string, y: number): number {
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text(label + ":", MARGIN_L, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const lines = doc.splitTextToSize(text, CONTENT_W);
  doc.text(lines, MARGIN_L, y);
  y += lines.length * 5 + 2;

  return y;
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 285) {
    doc.addPage();
    return 25;
  }
  return y;
}

export async function generateDailyReportPDF(report: DailyReport & { siswa?: { nama: string; kelas: string } }) {
  const JsPdf = await getDoc();
  const doc = new JsPdf("p", "mm", "a4");
  let y = 25;

  const fitrahMap = Object.fromEntries(FITRAH_LIST.map(f => [f.key, f]));

  y = header(doc, "Daily Report", "IIS PSM Daycare & Preschool Magetan",
    `${report.siswa?.kelas ?? "-"} · ${fmtDate(report.tanggal)} · ${report.sesi ?? "-"}`, y);

  const fields: [string, string][] = [
    ["Nama Siswa", report.siswa?.nama ?? "-"],
    ["Kehadiran", report.kehadiran],
    ["Mood Datang", report.mood_datang ? report.mood_datang : "-"],
    ["Mood Pulang", report.mood_pulang ? report.mood_pulang : "-"],
    ["Kondisi Kesehatan", report.kondisi_kesehatan ?? "-"],
    ["Suhu Tubuh", report.suhu_tubuh ? `${report.suhu_tubuh}°C` : "-"],
    ["Sarapan", report.sarapan ?? "-"],
    ["Snack Pagi", report.snack_pagi ?? "-"],
    ["Makan Siang", report.makan_siang ?? "-"],
    ["Snack Sore", report.snack_sore ?? "-"],
    ["Minum", report.minum_gelas ? `${report.minum_gelas} gelas` : "-"],
    ["Tidur Siang", report.tidur_siang ?? "-"],
    ["Durasi Tidur", report.durasi_tidur ?? "-"],
    ["BAK", report.bak_kali ? `${report.bak_kali} kali` : "-"],
    ["BAB", report.bab ?? "-"],
    ["Ibadah & Aktivitas", report.ibadah_checklist?.length ? report.ibadah_checklist.join(", ") : "-"],
    ["Fitrah Distimulasi", report.fitrah_distimulasi?.length
      ? report.fitrah_distimulasi.map((f: string) => `${fitrahMap[f]?.label ?? f}`).join(", ")
      : "-"],
  ];

  for (const [label, value] of fields) {
    y = checkPageBreak(doc, y, 10);
    y = field(doc, label, value, y);
  }

  if (report.observasi_guru) {
    y = checkPageBreak(doc, y, 20);
    y = sectionDivider(doc, y);
    y = textBlock(doc, "Observasi Guru", report.observasi_guru, y);
  }

  if (report.catatan_ortu) {
    y = checkPageBreak(doc, y, 20);
    y = sectionDivider(doc, y);
    y = textBlock(doc, "Catatan untuk Orang Tua", report.catatan_ortu, y);
  }

  y = checkPageBreak(doc, y, 15);
  y = sectionDivider(doc, y);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const statusParts = [`Status: ${report.status === "terkirim" ? "Terkirim ✓" : "Draft"}`];
  if (report.dikirim_at) statusParts.push(`Dikirim: ${fmtDateTime(report.dikirim_at)}`);
  doc.text(statusParts.join("  ·  "), PAGE_W - MARGIN_R, y, { align: "right" });

  return doc;
}

export async function generatePortfolioPDF(porto: Portofolio & { siswa?: { nama: string; kelas: string }; portofolio_media?: { nama_file?: string; tipe: string }[] }) {
  const JsPdf = await getDoc();
  const doc = new JsPdf("p", "mm", "a4");
  let y = 25;

  const fitrahMap = Object.fromEntries(FITRAH_LIST.map(f => [f.key, f]));

  y = header(doc, "Portofolio", "IIS PSM Daycare & Preschool Magetan",
    `${porto.siswa?.kelas ?? "-"} · ${fmtDate(porto.tanggal)}${porto.sesi ? ` · ${porto.sesi}` : ""}`, y);

  y = field(doc, "Nama Siswa", porto.siswa?.nama ?? "-", y);
  y = field(doc, "Fitrah Distimulasi", porto.fitrah?.length
    ? porto.fitrah.map((f: string) => `${fitrahMap[f]?.label ?? f}`).join(", ")
    : "-", y);

  if (porto.observasi) {
    y = checkPageBreak(doc, y, 20);
    y = sectionDivider(doc, y);
    y = textBlock(doc, "Observasi", porto.observasi, y);
  }

  if (porto.catatan_ortu) {
    y = checkPageBreak(doc, y, 20);
    y = sectionDivider(doc, y);
    y = textBlock(doc, "Catatan untuk Orang Tua", porto.catatan_ortu, y);
  }

  if (porto.portofolio_media && porto.portofolio_media.length > 0) {
    y = checkPageBreak(doc, y, 10);
    y = sectionDivider(doc, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(`Media (${porto.portofolio_media.length} file):`, MARGIN_L, y);
    y += 6;

    const fotoItems = porto.portofolio_media.filter(m => m.tipe === "foto");
    const videoItems = porto.portofolio_media.filter(m => m.tipe !== "foto");

    const imgW = (CONTENT_W - 4) / 2;

    for (const m of fotoItems) {
      y = checkPageBreak(doc, y, imgW + 10);
      try {
        const resp = await fetch(m.url, { signal: AbortSignal.timeout(8000) });
        const blob = await resp.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        doc.addImage(base64, "JPEG", MARGIN_L, y, imgW, imgW);
        if (m.nama_file) {
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text(m.nama_file, MARGIN_L, y + imgW + 4);
        }
        y += imgW + 8;
      } catch {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text(`[Gagal memuat: ${m.nama_file ?? "Foto"}]`, MARGIN_L, y);
        y += 6;
      }
    }

    if (videoItems.length > 0) {
      y = checkPageBreak(doc, y, 6 + videoItems.length * 5);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      for (const m of videoItems) {
        doc.text(`🎬 ${m.nama_file ?? "Video"}`, MARGIN_L, y);
        y += 5;
      }
    }
  }

  y = checkPageBreak(doc, y, 15);
  y = sectionDivider(doc, y);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const statusParts = [`Status: ${porto.status === "terkirim" ? "Terkirim ✓" : "Draft"}`];
  if (porto.dikirim_at) statusParts.push(`Dikirim: ${fmtDateTime(porto.dikirim_at)}`);
  doc.text(statusParts.join("  ·  "), PAGE_W - MARGIN_R, y, { align: "right" });

  return doc;
}

function fmtTime(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function fmtDateShort(d: string): string {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

function drawTable(
  doc: jsPDF,
  headers: string[],
  colWidths: number[],
  rows: string[][],
  startY: number
): number {
  const tableW = colWidths.reduce((a, b) => a + b, 0);
  const cellPad = 1.5;
  const lineH = 4.3;
  const headerH = 8;

  let y = startY;

  const drawHeader = () => {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.setFillColor(235, 235, 235);
    doc.rect(MARGIN_L, y, tableW, headerH, "F");
    doc.setDrawColor(180, 180, 180);
    doc.line(MARGIN_L, y + headerH, MARGIN_L + tableW, y + headerH);
    let cx = MARGIN_L;
    headers.forEach((h, i) => {
      doc.text(h, cx + cellPad, y + headerH - 2.5);
      cx += colWidths[i];
    });
    y += headerH;
  };

  drawHeader();

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);

  for (const row of rows) {
    const linesPerCol: string[][] = row.map((cell, i) => {
      const res = doc.splitTextToSize(cell, colWidths[i] - cellPad * 2);
      return Array.isArray(res) ? res : [res];
    });
    const rowH = Math.max(...linesPerCol.map((l) => l.length)) * lineH + cellPad * 2;

    if (y + rowH > 285) {
      doc.addPage();
      y = 25;
      drawHeader();
    }

    let cx = MARGIN_L;
    for (let i = 0; i < row.length; i++) {
      const lines = linesPerCol[i];
      const baseY = y + rowH - cellPad;
      lines.forEach((ln, li) => {
        doc.text(ln, cx + cellPad, baseY - (lines.length - 1 - li) * lineH);
      });
      cx += colWidths[i];
    }

    doc.setDrawColor(225, 225, 225);
    doc.line(MARGIN_L, y + rowH, MARGIN_L + tableW, y + rowH);
    y += rowH;
  }

  return y + 3;
}

export interface AbsensiRekapRecord {
  guru_id: string;
  tanggal: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  keterangan: string | null;
  guru_name: string;
}

export async function generateAbsensiRekapPDF(params: {
  startDate: string;
  endDate: string;
  guruList: { id: string; full_name: string }[];
  records: AbsensiRekapRecord[];
}) {
  const JsPdf = await getDoc();
  const doc = new JsPdf("p", "mm", "a4");
  let y = 25;

  const { startDate, endDate, guruList, records } = params;
  const periode =
    startDate === endDate
      ? fmtDate(startDate)
      : `${fmtDate(startDate)} - ${fmtDate(endDate)}`;

  y = header(doc, "Rekap Absensi", "IIS PSM Daycare & Preschool Magetan", `Periode: ${periode}`, y);

  // ── Ringkasan per guru ──
  const emptyCounts = { Hadir: 0, Izin: 0, Sakit: 0, Alpha: 0, Cuti: 0 };
  const countsByGuru = new Map<string, typeof emptyCounts>();
  for (const g of guruList) countsByGuru.set(g.id, { ...emptyCounts });
  for (const r of records) {
    const counts = countsByGuru.get(r.guru_id) ?? { ...emptyCounts };
    if (r.status in counts) counts[r.status as keyof typeof emptyCounts]++;
    countsByGuru.set(r.guru_id, counts);
  }

  const summaryRows = guruList.map((g) => {
    const c = countsByGuru.get(g.id) ?? { ...emptyCounts };
    const total = c.Hadir + c.Izin + c.Sakit + c.Alpha + c.Cuti;
    return [g.full_name, String(c.Hadir), String(c.Izin), String(c.Sakit), String(c.Alpha), String(c.Cuti), String(total)];
  });

  y = checkPageBreak(doc, y, 16);
  y += 4;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Ringkasan Per Guru", MARGIN_L, y);
  y += 6;

  y = drawTable(doc, ["Guru", "Hadir", "Izin", "Sakit", "Alpha", "Cuti", "Total"],
    [56, 19, 19, 19, 19, 19, 19], summaryRows, y);

  // ── Rincian per hari ──
  const detailRows = [...records]
    .sort((a, b) =>
      a.tanggal === b.tanggal ? a.guru_name.localeCompare(b.guru_name) : a.tanggal.localeCompare(b.tanggal)
    )
    .map((r) => [
      fmtDateShort(r.tanggal),
      r.guru_name,
      r.status,
      fmtTime(r.check_in),
      fmtTime(r.check_out),
      r.keterangan || "-",
    ]);

  y = checkPageBreak(doc, y, 16);
  y += 4;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Rincian Per Hari", MARGIN_L, y);
  y += 6;

  y = drawTable(doc, ["Tanggal", "Guru", "Status", "Masuk", "Pulang", "Keterangan"],
    [28, 45, 20, 18, 18, 41], detailRows, y);

  y = checkPageBreak(doc, y, 10);
  y = sectionDivider(doc, y);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Dibuat: ${fmtDateTime(new Date().toISOString())}`, PAGE_W - MARGIN_R, y, { align: "right" });

  return doc;
}

export async function generateLaporanPDF(laporan: LaporanTriwulan & { siswa?: { nama: string; kelas: string } }) {
  const JsPdf = await getDoc();
  const doc = new JsPdf("p", "mm", "a4");
  let y = 25;

  const capaianLabel = Object.fromEntries(CAPAIAN_OPTIONS.map(o => [o.value, o.label]));
  const fitrahKeys = FITRAH_LIST.map(f => f.key);

  y = header(doc, "Laporan Perkembangan Triwulan", "IIS PSM Daycare & Preschool Magetan",
    `${laporan.siswa?.kelas ?? "-"} · ${laporan.periode} ${laporan.tahun}`, y);

  y = field(doc, "Nama Siswa", laporan.siswa?.nama ?? "-", y);
  y = field(doc, "Periode", `${laporan.periode} ${laporan.tahun}`, y);

  y = checkPageBreak(doc, y, 10);
  y += 2;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Penilaian 8 Fitrah", MARGIN_L, y);
  y += 7;

  const colW = [50, 55, CONTENT_W - 105];
  const colX = [MARGIN_L, MARGIN_L + colW[0], MARGIN_L + colW[0] + colW[1]];

  doc.setDrawColor(180, 180, 180);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("Fitrah", colX[0], y);
  doc.text("Capaian", colX[1], y);
  doc.text("Catatan", colX[2], y);
  y += 1;
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);

  for (const key of fitrahKeys) {
    y = checkPageBreak(doc, y, 7);
    const col = `fitrah_${key}` as keyof typeof laporan;
    const data = laporan[col] as { capaian?: string; catatan?: string } | null;
    const f = FITRAH_LIST.find(f => f.key === key);

    doc.setFont("helvetica", "bold");
    doc.text(f?.label ?? key, colX[0], y);
    doc.setFont("helvetica", "normal");
    doc.text(data?.capaian ? (capaianLabel[data.capaian] ?? data.capaian) : "-", colX[1], y);

    const note = data?.catatan ?? "-";
    const noteLines = doc.splitTextToSize(note, colW[2]);
    doc.text(noteLines, colX[2], y);
    y += Math.max(noteLines.length * 4.5, 6);
  }

  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 6;

  if (laporan.catatan_umum) {
    y = checkPageBreak(doc, y, 20);
    y = textBlock(doc, "Catatan Umum", laporan.catatan_umum, y);
  }

  if (laporan.rekomendasi) {
    y = checkPageBreak(doc, y, 20);
    y = textBlock(doc, "Rekomendasi", laporan.rekomendasi, y);
  }

  y = checkPageBreak(doc, y, 15);
  y = sectionDivider(doc, y);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const statusParts = [`Status: ${laporan.status === "terkirim" ? "Terkirim ✓" : "Draft"}`];
  if (laporan.dikirim_at) statusParts.push(`Dikirim: ${fmtDateTime(laporan.dikirim_at)}`);
  doc.text(statusParts.join("  ·  "), PAGE_W - MARGIN_R, y, { align: "right" });

  return doc;
}
