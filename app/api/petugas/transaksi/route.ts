import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id_kendaraan,
      waktu_masuk,
      waktu_keluar,
      id_tarif,
      durasi_jam,
      biaya_total,
      status,
      id_user,
      id_area,
    } = body;

    // 1. Validasi input
    if (
      !id_kendaraan ||
      !waktu_masuk ||
      !id_tarif ||  
      !status ||
      !id_user 
    ) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Simpan ke database (tb_tarif) menggunakan MySQL
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO tb_transaksi (id_kendaraan, waktu_masuk, waktu_keluar, id_tarif, durasi_jam, biaya_total, status,  id_user, id_area ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id_kendaraan,
        waktu_masuk,
        waktu_keluar || null,
        id_tarif || null,
        durasi_jam || null,
        biaya_total || null,
        status,
        id_user,
        id_area || null,
      ],
    );

    return NextResponse.json(
      {
        message: "Transaksi berhasil ditambahkan",
        userId: result.insertId,
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Cek jika username duplikat (Error code MySQL 1062)
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return NextResponse.json(
        { message: "Transaksi sudah ada" },
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
export async function GET(request: Request) {
  try {
    const [rows] = await db.execute("SELECT * FROM tb_transaksi");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
