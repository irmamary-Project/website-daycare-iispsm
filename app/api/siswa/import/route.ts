import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface ImportRow {
  nama: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  kelas: string;
  ortu_nama: string;
  ortu_phone: string;
  status: string;
  catatan: string;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): ImportRow[] {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, "_"));

  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ""; });
    return {
      nama: row.nama || "",
      jenis_kelamin: row.jenis_kelamin || "L",
      tanggal_lahir: row.tanggal_lahir || "",
      kelas: row.kelas || "",
      ortu_nama: row.ortu_nama || "",
      ortu_phone: row.ortu_phone || "",
      status: row.status || "aktif",
      catatan: row.catatan || "",
    };
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cek admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { csv } = body;

  if (!csv || typeof csv !== "string") {
    return NextResponse.json({ error: "CSV kosong" }, { status: 400 });
  }

  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Tidak ada data yang bisa diimport" }, { status: 400 });
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    if (!row.nama.trim()) {
      skipped++;
      continue;
    }

    // Cari ortu by nama atau phone
    let ortuId: string | null = null;
    if (row.ortu_nama || row.ortu_phone) {
      const { data: ortu } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "ortu")
        .or(`full_name.eq.${row.ortu_nama},phone.eq.${row.ortu_phone}`)
        .limit(1)
        .single();
      ortuId = ortu?.id ?? null;
    }

    const payload = {
      nama: row.nama.trim(),
      jenis_kelamin: row.jenis_kelamin.toUpperCase() === "P" ? "P" : "L",
      tanggal_lahir: row.tanggal_lahir || null,
      kelas: row.kelas || "KB Preschool 1",
      ortu_id: ortuId,
      status: ["aktif", "cuti", "alumni"].includes(row.status) ? row.status : "aktif",
      catatan: row.catatan || null,
    };

    const { error } = await supabase.from("siswa").insert(payload);
    if (error) {
      errors.push(`${row.nama}: ${error.message}`);
    } else {
      imported++;
    }
  }

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  });
}
