import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_tarif: string }> }
) {
  try {
    const { id_tarif } = await params;

    const { data, error } = await supabase
      .from("tb_tarif")
      .select("id_tarif, jenis_kendaraan, tarif_per_jam")
      .eq("id_tarif", id_tarif)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Tarif tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching tariff:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id_tarif: string }> }
) {
  try {
    const { id_tarif } = await params;
    const actorId = req.headers.get("X-User-ID");

    // Fetch tariff for logging
    const { data: tariff, error: fetchError } = await supabase
      .from("tb_tarif")
      .select("jenis_kendaraan")
      .eq("id_tarif", id_tarif)
      .single();

    if (fetchError || !tariff) {
      return NextResponse.json(
        { message: "Tarif tidak ditemukan" },
        { status: 404 }
      );
    }

    const jenisKendaraan = tariff.jenis_kendaraan;

    // 1. "Orphan" records di tb_transaksi agar tidak menghalangi DELETE
    await supabase
      .from("tb_transaksi")
      .update({ id_tarif: null })
      .eq("id_tarif", id_tarif);

    // 2. Hapus tarif
    const { error: deleteError } = await supabase
      .from("tb_tarif")
      .delete()
      .eq("id_tarif", id_tarif);

    if (deleteError) throw deleteError;

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menghapus Tarif [${jenisKendaraan}] (ID: ${id_tarif})`
    );
    
    return NextResponse.json({
      message: "Tarif berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete Tarif Error:", error);
    return NextResponse.json(
      { message: "Error deleting tarif", error: error.message || error },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_tarif, jenis_kendaraan, tarif_per_jam } = body;

    // 1. Validasi input dasar
    if (!id_tarif || !jenis_kendaraan || tarif_per_jam === undefined) {
      return NextResponse.json(
        { message: "Field wajib (ID, Jenis Kendaraan, Tarif Perjam) harus diisi" },
        { status: 400 },
      );
    }

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Mengupdate Tarif [${jenis_kendaraan}] (ID: ${id_tarif}). Tarif baru: ${tarif_per_jam}`
    );

    // 2. Update ke database menggunakan Supabase
    const { error } = await supabase
      .from("tb_tarif")
      .update({
        jenis_kendaraan,
        tarif_per_jam
      })
      .eq("id_tarif", id_tarif);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Tarif sudah ada" },
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
    console.error("Update Tarif API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
