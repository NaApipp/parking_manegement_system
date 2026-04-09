import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_area, kapasitas, terisi } = body;

    // 1. Validasi input
    if (!nama_area || kapasitas === undefined || terisi === undefined) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Simpan ke database menggunakan Supabase
    const { data, error } = await supabase
      .from("tb_area_parkir")
      .insert([
        { nama_area, kapasitas, terisi }
      ])
      .select("id_area")
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Area sudah ada" },
          { status: 400 },
        );
      }
      throw error;
    }

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menambahkan Area parkir [${nama_area}] dengan kapasitas ${kapasitas}`
    );
    
    return NextResponse.json(
      { 
        message: "Area berhasil ditambahkan",
        id_area: data.id_area 
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Area Parkir POST Error:", error);
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
      .from("tb_area_parkir")
      .select("*")
      .order("id_area", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching areas:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
