import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";
import { logActivity } from "@/app/lib/logActivityV2";

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_lengkap, username, password, role, status_aktif } = body;

    // 1. Validasi input
    if (!nama_lengkap || !username || !password || !role || status_aktif === undefined) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke database menggunakan Supabase
    const { data, error } = await supabase
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
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 400 },
        );
      }
      throw error;
    }

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menambahkan user baru [${nama_lengkap}] dengan Role ${role}. ID baru: ${data.id_user}`
    );

    return NextResponse.json(
      { 
        message: "Registrasi berhasil",
        userId: data.id_user 
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("User POST Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tb_user")
      .select("*")
      .order("id_user", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
