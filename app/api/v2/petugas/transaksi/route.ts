import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

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

    // Simpan ke database menggunakan Supabase
    const { data, error } = await supabase
      .from("tb_transaksi")
      .insert([
        {
          id_kendaraan,
          waktu_masuk,
          waktu_keluar: waktu_keluar || null,
          id_tarif: id_tarif || null,
          durasi_jam: durasi_jam || null,
          biaya_total: biaya_total || null,
          status,
          id_user,
          id_area: id_area || null,
        },
      ])
      .select("id_parkir")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Transaksi sudah ada" },
          { status: 400 },
        );
      }
      throw error;
    }

    // simpan log aktivitas
    await logActivity(id_user, `Telah Masuk ke sistem, pada pukul: ${waktu_masuk} menggunakan ID Tarif: ${id_tarif} Status: ${status} ID Petugas: ${id_user}`);

    return NextResponse.json(
      {
        message: "Transaksi berhasil ditambahkan",
        id_parkir: data.id_parkir,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Transaction POST Error:", error);
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
      .from("tb_transaksi")
      .select(`
        *,
        tb_kendaraan (
          plat_nomor
        )
      `)
      .order("id_parkir", { ascending: true });

    if (error) throw error;

    // Supabase returns nested object for JOIN, usually it's transformed to match old MySQL structure if needed
    // but often frontend can handle the nested object. If flat structure is strictly needed:
    const formattedData = data.map((item: any) => ({
      ...item,
      plat_nomor: item.tb_kendaraan?.plat_nomor || null
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
