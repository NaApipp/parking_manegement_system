import { NextResponse, NextRequest } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_parkir: string }> }
) {
  try {
    const { id_parkir } = await params;

    const [rows]: any = await db.execute(
      "SELECT id_parkir, id_kendaraan, waktu_masuk, waktu_keluar, id_tarif, durasi_jam, biaya_total, status, id_user, id_area FROM tb_transaksi WHERE id_parkir = ?",
      [ id_parkir]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
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

// UPDATE
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_parkir, id_kendaraan, waktu_masuk, waktu_keluar, id_tarif, durasi_jam, biaya_total, status, id_user, id_area } = body;

    // 1. Validasi input dasar
    if (!id_parkir || !id_kendaraan || !waktu_masuk || !waktu_keluar || !id_tarif || !durasi_jam || !biaya_total || !status || !id_user || !id_area) {
      return NextResponse.json(
        { message: "Field wajib (ID, Kendaraan, Waktu Masuk, Waktu Keluar, Tarif, Durasi Jam, Biaya Total, Status, User, Area) harus diisi" },
        { status: 400 },
      );
    }

    // 2. Setup query data
    let query = "UPDATE tb_transaksi SET id_kendaraan = ?, waktu_masuk = ?, waktu_keluar = ?, id_tarif = ?, durasi_jam = ?, biaya_total = ?, status = ?, id_user = ?, id_area = ?";
    let params = [id_kendaraan, waktu_masuk, waktu_keluar, id_tarif, durasi_jam, biaya_total, status, id_user, id_area];

    query += " WHERE id_parkir = ?";
    params.push(id_parkir);

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
        { message: "Transaksi sudah ada" },
        { status: 400 },
      );
    }

    console.error("Update Transaksi API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
