import { NextResponse, NextRequest } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_area: string }> }
) {
  try {
    const { id_area } = await params;

    const [rows]: any = await db.execute(
      "SELECT id_area, nama_area, kapasitas, terisi FROM tb_area WHERE id_area = ?",
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

    const [result]: any = await db.execute(
      "DELETE FROM tb_area WHERE id_area = ?",
      [id_area]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Area tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Area berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting area", error },
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
    let query = "UPDATE tb_area SET nama_area = ?, kapasitas = ?, terisi = ?";
    let params = [nama_area, kapasitas, terisi];

    query += " WHERE id_area = ?";
    params.push(id_area);

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
