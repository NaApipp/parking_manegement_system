import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jenis_kendaraan, tarif_per_jam } = body;

    // 1. Validasi input
    if (!jenis_kendaraan || !tarif_per_jam) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Simpan ke database (tb_tarif) menggunakan MySQL
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO tb_tarif (jenis_kendaraan, tarif_per_jam) VALUES (?, ?)",
                            [jenis_kendaraan, tarif_per_jam]
    );

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
      `Menambahkan tarif baru [${jenis_kendaraan}]. Tarif per Jam: ${tarif_per_jam}`
    );

    return NextResponse.json(
      { 
        message: "Tarif berhasil ditambahkan",
        userId: result.insertId 
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Cek jika username duplikat (Error code MySQL 1062)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return NextResponse.json(
        { message: "Tarif sudah ada" },
        { status: 400 },
      );
    }

    console.error("Registration API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET
export async function GET(request:Request) {
  try {
    const [rows] = await db.execute("SELECT * FROM tb_tarif");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

