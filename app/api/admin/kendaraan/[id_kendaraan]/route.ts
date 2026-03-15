import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_kendaraan: string }> }
) {
  try {
    const { id_kendaraan } = await params;

    const [rows]: any = await db.execute(
      "SELECT id_kendaraan, plat_nomor, jenis_kendaraan, warna, pemilik FROM tb_kendaraan WHERE id_kendaraan = ?",
      [ id_kendaraan]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kendaraan tidak ditemukan" },
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
  { params }: { params: Promise<{ id_kendaraan: string }> }
) {
  try {
    const { id_kendaraan } = await params;
    const actorId = req.headers.get("X-User-ID");

    const [rows]: any = await db.execute(
      "SELECT plat_nomor FROM tb_kendaraan WHERE id_kendaraan = ?",
      [id_kendaraan]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Kendaraan tidak ditemukan" },
        { status: 404 }
      );
    }

    const platNomor = rows[0].plat_nomor;

    // 1. "Orphan" records di tb_transaksi agar tidak menghalangi DELETE
    await db.execute(
      "UPDATE tb_transaksi SET id_kendaraan = NULL WHERE id_kendaraan = ?",
      [id_kendaraan]
    );

    const [result]: any = await db.execute(
      "DELETE FROM tb_kendaraan WHERE id_kendaraan = ?",
      [id_kendaraan]
    );

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
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

    // 2. Setup query data
    let query = "UPDATE tb_kendaraan SET plat_nomor = ?, jenis_kendaraan = ?, warna = ?, pemilik = ?";
    let params = [plat_nomor, jenis_kendaraan, warna, pemilik];

    query += " WHERE id_kendaraan = ?";
    params.push(id_kendaraan);

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
      `Mengupdate Kendaraan [${plat_nomor}] (ID: ${id_kendaraan}).`
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
        { message: "Plat nomor sudah ada" },
        { status: 400 },
      );
    }

    console.error("Update Kendaraan API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
