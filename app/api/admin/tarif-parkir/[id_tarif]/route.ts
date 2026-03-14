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

    const [result]: any = await db.execute(
      "DELETE FROM tb_tarif WHERE id_tarif = ?",
      [id_tarif]
    );

    // simpan log aktivitas
    await logActivity(Number(id_tarif), "Telah di hapus dari database")
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Tarif tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Tarif berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting tarif", error },
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

    // simpan log aktivitas
    await logActivity(Number(id_tarif), "Telah di update. Jenis Kendaraan: " + jenis_kendaraan + "Tarif per Jam: " + tarif_per_jam)

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
