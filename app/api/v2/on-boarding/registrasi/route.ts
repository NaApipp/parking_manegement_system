import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";
import { logActivity } from "@/app/lib/logActivityV2";

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

    // 3. Simpan ke database (tb_user) menggunakan Supabase
    // .select() digunakan untuk mengembalikan data yang baru saja dimasukkan (termasuk ID)
    const { data: newUser, error } = await supabase
      .from("tb_user")
      .insert([
        { 
          nama_lengkap, 
          username, 
          password: hashedPassword, 
          role, 
          status_aktif 
        }
      ])
      .select("id_user")
      .single();
    
    if (error) {
      // Cek jika username duplikat (Error code PostgreSQL 23505)
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 400 },
        );
      }
      throw error;
    }
    
    // simpan log aktivitas
    await logActivity(newUser.id_user, "Telah Di Tambahkan dengan Role " + role);
    
    return NextResponse.json(
      { 
        message: "Registrasi berhasil",
        userId: newUser.id_user 
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
