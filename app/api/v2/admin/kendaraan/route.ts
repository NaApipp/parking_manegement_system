import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plat_nomor, jenis_kendaraan, warna, pemilik, id_user } = body;
    const plat_nomor_upper = plat_nomor?.toUpperCase();

    // 1. Validasi input
    if (!plat_nomor || !jenis_kendaraan || !warna || !pemilik || !id_user) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Simpan ke database menggunakan Supabase
    const { data, error } = await supabase
      .from("tb_kendaraan")
      .insert([
        { plat_nomor: plat_nomor_upper, jenis_kendaraan, warna, pemilik, id_user }
      ])
      .select("id_kendaraan")
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Kendaraan sudah ada" },
          { status: 400 },
        );
      }
      throw error;
    }

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      id_user, 
      `Menambahkan kendaraan baru. Identitas Kendaraan: ${plat_nomor_upper} Jenis Kendaraan: ${jenis_kendaraan} Warna: ${warna} Pemilik: ${pemilik}`
    );

    return NextResponse.json(
      { 
        message: "Kendaraan berhasil ditambahkan",
        id_kendaraan: data.id_kendaraan 
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Kendaraan POST Error:", error);
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
      .from("tb_kendaraan")
      .select("*")
      .order("id_kendaraan", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
