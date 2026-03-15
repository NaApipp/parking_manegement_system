import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_tarif: string }> }
) {
  try {
    const { id_tarif } = await params;

    const [rows]: any = await db.execute(
      "SELECT id_tarif, jenis_kendaraan, tarif_per_jam FROM tb_tarif WHERE id_tarif = ?",
      [ id_tarif]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tarif tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
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

    const [rows]: any = await db.execute(
      "SELECT jenis_kendaraan FROM tb_tarif WHERE id_tarif = ?",
      [id_tarif]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Tarif tidak ditemukan" },
        { status: 404 }
      );
    }

    const jenisKendaraan = rows[0].jenis_kendaraan;

    // 1. "Orphan" records di tb_transaksi agar tidak menghalangi DELETE
    await db.execute(
      "UPDATE tb_transaksi SET id_tarif = NULL WHERE id_tarif = ?",
      [id_tarif]
    );

    const [result]: any = await db.execute(
      "DELETE FROM tb_tarif WHERE id_tarif = ?",
      [id_tarif]
    );

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
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
    if (!id_tarif || !jenis_kendaraan || !tarif_per_jam) {
      return NextResponse.json(
        { message: "Field wajib (ID, Jenis Kendaraan, Tarif Perjam) harus diisi" },
        { status: 400 },
      );
    }

    // 2. Setup query data
    let query = "UPDATE tb_tarif SET jenis_kendaraan = ?, tarif_per_jam = ?";
    let params = [jenis_kendaraan, tarif_per_jam];

    query += " WHERE id_tarif = ?";
    params.push(id_tarif);

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
      `Mengupdate Tarif [${jenis_kendaraan}] (ID: ${id_tarif}). Tarif baru: ${tarif_per_jam}`
    );

    // 3. Update ke database
    const [result] = await db.execute<ResultSetHeader>(query, params);

    return NextResponse.json(
      { 
        message: "Update berhasil",
        affectedRows: result.affectedRows
      },
      { status: 200 },
    );
  } catch (error: any) {
    // Cek jika username duplikat (Error code MySQL 1062)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return NextResponse.json(
        { message: "Tarif sudah ada" },
        { status: 400 },
      );
    }

    console.error("Update Tarif API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
