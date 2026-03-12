import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";   

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_area, kapasitas, terisi } = body;

    // 1. Validasi input
    if (!nama_area || !kapasitas || !terisi) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Simpan ke database (tb_tarif) menggunakan MySQL
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO tb_area (nama_area, kapasitas, terisi) VALUES (?, ?, ?)",
                            [nama_area, kapasitas, terisi]
    );

    return NextResponse.json(
      { 
        message: "Area berhasil ditambahkan",
        userId: result.insertId 
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Cek jika username duplikat (Error code MySQL 1062)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return NextResponse.json(
        { message: "Area sudah ada" },
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
    const [rows] = await db.execute("SELECT * FROM tb_area");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

