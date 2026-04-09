import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jenis_kendaraan, tarif_per_jam } = body;

    // 1. Validasi input
    if (!jenis_kendaraan || tarif_per_jam === undefined) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Simpan ke database menggunakan Supabase
    const { data, error } = await supabase
      .from("tb_tarif")
      .insert([
        { jenis_kendaraan, tarif_per_jam }
      ])
      .select("id_tarif")
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Tarif sudah ada" },
          { status: 400 },
        );
      }
      throw error;
    }

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menambahkan tarif baru [${jenis_kendaraan}]. Tarif per Jam: ${tarif_per_jam}`
    );

    return NextResponse.json(
      { 
        message: "Tarif berhasil ditambahkan",
        id_tarif: data.id_tarif 
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Tarif POST Error:", error);
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
      .from("tb_tarif")
      .select("*")
      .order("id_tarif", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tariffs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
