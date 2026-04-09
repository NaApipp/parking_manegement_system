import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_kendaraan: string }> }
) {
  try {
    const { id_kendaraan } = await params;

    const { data, error } = await supabase
      .from("tb_kendaraan")
      .select("id_kendaraan, plat_nomor, jenis_kendaraan, warna, pemilik")
      .eq("id_kendaraan", id_kendaraan)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Kendaraan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id_kendaraan: string }> }
) {
  try {
    const { id_kendaraan } = await params;
    const actorId = req.headers.get("X-User-ID");

    // Fetch plate number for logging
    const { data: vehicle, error: fetchError } = await supabase
      .from("tb_kendaraan")
      .select("plat_nomor")
      .eq("id_kendaraan", id_kendaraan)
      .single();

    if (fetchError || !vehicle) {
      return NextResponse.json(
        { message: "Kendaraan tidak ditemukan" },
        { status: 404 }
      );
    }

    const platNomor = vehicle.plat_nomor;

    // 1. "Orphan" records di tb_transaksi agar tidak menghalangi DELETE
    await supabase
      .from("tb_transaksi")
      .update({ id_kendaraan: null })
      .eq("id_kendaraan", id_kendaraan);

    // 2. Hapus kendaraan
    const { error: deleteError } = await supabase
      .from("tb_kendaraan")
      .delete()
      .eq("id_kendaraan", id_kendaraan);

    if (deleteError) throw deleteError;

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menghapus Kendaraan [${platNomor}] (ID: ${id_kendaraan})`
    );

    return NextResponse.json({
      message: "Kendaraan berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete Kendaraan Error:", error);
    return NextResponse.json(
      { message: "Error deleting kendaraan", error: error.message || error },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_kendaraan, plat_nomor, jenis_kendaraan, warna, pemilik } = body;

    // 1. Validasi input dasar
    if (!id_kendaraan || !plat_nomor || !jenis_kendaraan || !warna || !pemilik) {
      return NextResponse.json(
        { message: "Field wajib (ID, Plat Nomor, Jenis Kendaraan, Warna, Pemilik) harus diisi" },
        { status: 400 },
      );
    }

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Mengupdate Kendaraan [${plat_nomor}] (ID: ${id_kendaraan}).`
    );

    // 2. Update ke database menggunakan Supabase
    const { error } = await supabase
      .from("tb_kendaraan")
      .update({
        plat_nomor,
        jenis_kendaraan,
        warna,
        pemilik
      })
      .eq("id_kendaraan", id_kendaraan);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Plat nomor sudah ada" },
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
    console.error("Update Kendaraan API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
