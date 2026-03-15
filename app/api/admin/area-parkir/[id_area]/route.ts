import { NextResponse, NextRequest } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_area: string }> }
) {
  try {
    const { id_area } = await params;

    const [rows]: any = await db.execute(
      "SELECT id_area, nama_area, kapasitas, terisi FROM tb_area_parkir WHERE id_area = ?",
      [ id_area]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Area tidak ditemukan" },
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
  { params }: { params: Promise<{ id_area: string }> }
) {
  try {
    const { id_area } = await params;
    const actorId = req.headers.get("X-User-ID");

    const [rows]: any = await db.execute(
      "SELECT nama_area FROM tb_area_parkir WHERE id_area = ?",
      [id_area]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Area tidak ditemukan" },
        { status: 404 }
      );
    }

    const namaArea = rows[0].nama_area;

    // 1. "Orphan" records di tb_transaksi agar tidak menghalangi DELETE
    await db.execute(
      "UPDATE tb_transaksi SET id_area = NULL WHERE id_area = ?",
      [id_area]
    );

    const [result]: any = await db.execute(
      "DELETE FROM tb_area_parkir WHERE id_area = ?",
      [id_area]
    );

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
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
    if (!id_area || !nama_area || !kapasitas || !terisi) {
      return NextResponse.json(
        { message: "Field wajib (ID, Nama Area, Kapasitas, Terisi) harus diisi" },
        { status: 400 },
      );
    }

    // 2. Setup query data
    let query = "UPDATE tb_area_parkir SET nama_area = ?, kapasitas = ?, terisi = ?";
    let params = [nama_area, kapasitas, terisi];

    query += " WHERE id_area = ?";
    params.push(id_area);

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
      `Mengupdate Area [${nama_area}] (ID: ${id_area}). Kapasitas baru: ${kapasitas}`
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
        { message: "Area sudah ada" },
        { status: 400 },
      );
    }

    console.error("Update Area API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
