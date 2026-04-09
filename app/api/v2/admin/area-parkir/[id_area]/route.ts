import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_area: string }> }
) {
  try {
    const { id_area } = await params;

    const { data, error } = await supabase
      .from("tb_area_parkir")
      .select("id_area, nama_area, kapasitas, terisi")
      .eq("id_area", id_area)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Area tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching area:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id_area: string }> }
) {
  try {
    const { id_area } = await params;
    const actorId = req.headers.get("X-User-ID");

    // Fetch area name for logging
    const { data: area, error: fetchError } = await supabase
      .from("tb_area_parkir")
      .select("nama_area")
      .eq("id_area", id_area)
      .maybeSingle();

    if (fetchError || !area) {
      return NextResponse.json(
        { message: "Area tidak ditemukan" },
        { status: 404 }
      );
    }

    const namaArea = area.nama_area;

    // 1. "Orphan" records di tb_transaksi agar tidak menghalangi DELETE
    // Di PostgreSQL, kita tidak bisa melakukan cascade manual seperti ini dengan Supabase client sekaligus, 
    // tapi kita bisa lakukan update terpisah.
    await supabase
      .from("tb_transaksi")
      .update({ id_area: null })
      .eq("id_area", id_area);

    // 2. Hapus area
    const { error: deleteError } = await supabase
      .from("tb_area_parkir")
      .delete()
      .eq("id_area", id_area);

    if (deleteError) throw deleteError;

    // simpan log aktivitas dengan ID Aktor menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menghapus Area [${namaArea}] (ID: ${id_area})`
    );

    return NextResponse.json({
      message: "Area berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete Area Error:", error);
    return NextResponse.json(
      { message: "Error deleting area", error: error.message || error },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_area, nama_area, kapasitas, terisi } = body;

    // 1. Validasi input dasar
    if (!id_area || !nama_area || kapasitas === undefined || terisi === undefined) {
      return NextResponse.json(
        { message: "Field wajib (ID, Nama Area, Kapasitas, Terisi) harus diisi" },
        { status: 400 },
      );
    }

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Mengupdate Area [${nama_area}] (ID: ${id_area}). Kapasitas baru: ${kapasitas}`
    );

    // 2. Update ke database menggunakan Supabase
    const { error } = await supabase
      .from("tb_area_parkir")
      .update({
        nama_area,
        kapasitas,
        terisi
      })
      .eq("id_area", id_area);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Area sudah ada" },
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
    console.error("Update Area API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
