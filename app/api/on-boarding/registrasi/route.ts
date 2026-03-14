import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_lengkap, username, password, role, status_aktif } = body;

    // 1. Validasi input
    if (!nama_lengkap || !username || !password || !role || !status_aktif) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke database (tb_user) menggunakan MySQL
    // id_user biasanya AUTO_INCREMENT di MySQL, jadi tidak perlu dikirim
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO tb_user (nama_lengkap, username, password, role, status_aktif) VALUES (?, ?, ?, ?, ?)",
      [nama_lengkap, username, hashedPassword, role, status_aktif]
    );
    
    // simpan log aktivitas
    await logActivity(result.insertId, "Telah Di Tambahkan dengan Role " + role);
    
    return NextResponse.json(
      { 
        message: "Registrasi berhasil",
        userId: result.insertId 
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Cek jika username duplikat (Error code MySQL 1062)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
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

