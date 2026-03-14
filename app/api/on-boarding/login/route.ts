import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password harus diisi" },
        { status: 400 },
      );
    }

    // 2. Cari user di database menggunakan MySQL query
    console.log("Login Debug: Mencari username:", username);

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM tb_user WHERE username = ?",
      [username]
    );


    if (rows.length === 0) {
      console.log("Login Debug: User tidak ditemukan untuk username:", username);
      return NextResponse.json(
        { message: "Username atau password salah" },
        { status: 401 },
      );
    }

    if (rows.length > 1) {
      console.log(`Login Debug: Ditemukan ${rows.length} user dengan username yang sama!`);
      return NextResponse.json(
        { message: "Terjadi kesalahan sistem (data duplikat). Hubungi admin." },
        { status: 500 },
      );
    }

    const user = rows[0];

    // 3. Cek status aktif
    // Catatan: Pastikan di MySQL kolom status_aktif bertipe VARCHAR atau BOOLEAN yang sesuai
    if (user.status_aktif !== "TRUE" && user.status_aktif !== 1 && user.status_aktif !== true) {
      console.log("Login Debug: User ditemukan tapi tidak aktif:", username);
      return NextResponse.json(
        { message: "Akun Anda tidak aktif. Silakan hubungi admin." },
        { status: 403 },
      );
    }

    // 4. Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Login Debug: Password salah untuk username:", username);
      return NextResponse.json(
        { message: "Username atau password salah" },
        { status: 401 },
      );
    }

    // 5. Tentukan redirect path berdasarkan role
    let redirectTo = "/dashboard";
    switch (user.role) {
      case "admin":
        redirectTo = "/dashboard/admin";
        break;
      case "petugas":
        redirectTo = "/dashboard/petugas";
        break;
      case "owner":
        redirectTo = "/dashboard/owner";
        break;
      default:
        redirectTo = "/dashboard/user";
    }

    // simpan log aktivitas
    await logActivity(user.id_user, "Telah Login");

    return NextResponse.json(
      {
        message: "Login berhasil",
        redirectTo,
        user: {
          id: user.id_user,
          nama: user.nama_lengkap,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
