import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_parkir: string }> },
) {
  try {
    const { id_parkir } = await params;

    const { data, error } = await supabase
      .from("tb_transaksi")
      .select("id_parkir, id_kendaraan, waktu_masuk, waktu_keluar, id_tarif, durasi_jam, biaya_total, status, id_user, id_area")
      .eq("id_parkir", id_parkir)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id_parkir,
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

    // 1. Validasi input dasar
    if (
      !id_parkir ||
      !id_kendaraan ||
      !waktu_masuk ||
      !waktu_keluar ||
      !id_tarif ||
      durasi_jam === undefined ||
      biaya_total === undefined ||
      !status ||
      !id_user ||
      !id_area
    ) {
      return NextResponse.json(
        {
          message:
            "Field wajib (ID, Kendaraan, Waktu Masuk, Waktu Keluar, Tarif, Durasi Jam, Biaya Total, Status, User, Area) harus diisi",
        },
        { status: 400 },
      );
    }

    // simpan log aktivitas
    await logActivity(
      id_user,
      `Update keluar: ID Parkir ${id_parkir}, Kendaraan ${id_kendaraan}, Biaya ${biaya_total}`
    );

    // 2. Update ke database menggunakan Supabase
    const { error } = await supabase
      .from("tb_transaksi")
      .update({
        id_kendaraan,
        waktu_masuk,
        waktu_keluar,
        id_tarif,
        durasi_jam,
        biaya_total,
        status,
        id_user,
        id_area,
      })
      .eq("id_parkir", id_parkir);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Transaksi sudah ada" },
          { status: 400 },
        );
      }
      throw error;
    }

    return NextResponse.json(
      {
        message: "Update berhasil",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Update Transaksi API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
