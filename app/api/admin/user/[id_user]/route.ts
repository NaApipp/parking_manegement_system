import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import db from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { logActivity } from "@/app/lib/logActivity";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  try {
    const { id_user } = await params;

    const [rows]: any = await db.execute(
      "SELECT nama_lengkap, username, role, status_aktif FROM tb_user WHERE id_user = ?",
      [id_user]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
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
  { params }: { params: Promise<{ id_user: string }> }
) {
  try {
    const { id_user } = await params;
    const actorId = req.headers.get("X-User-ID");

    // 1. Cegah hapus diri sendiri jika actorId sama dengan id_user yang akan dihapus
    if (actorId && actorId === id_user) {
      return NextResponse.json(
        { message: "Anda tidak dapat menghapus akun Anda sendiri yang sedang digunakan." },
        { status: 400 }
      );
    }

    // 2. Ambil info user sebelum dihapus (untuk log Nama)
    const [userRows]: any = await db.execute(
      "SELECT nama_lengkap FROM tb_user WHERE id_user = ?",
      [id_user]
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const userName = userRows[0].nama_lengkap;

    // 3. "Orphan" records di tabel lain agar tidak menghalangi DELETE
    await db.execute(
      "UPDATE tb_log_aktivitas SET id_user = NULL WHERE id_user = ?",
      [id_user]
    );

    await db.execute(
      "UPDATE tb_kendaraan SET id_user = NULL WHERE id_user = ?",
      [id_user]
    );

    await db.execute(
      "UPDATE tb_transaksi SET id_user = NULL WHERE id_user = ?",
      [id_user]
    );

    // 4. Simpan log aktivitas penghapusan dengan ID Aktor yang login
    await logActivity(
      actorId ? Number(actorId) : null, 
      `Menghapus User [${userName}] (ID: ${id_user}) dari database`
    );

    // 5. Eksekusi penghapusan user
    await db.execute(
      "DELETE FROM tb_user WHERE id_user = ?",
      [id_user]
    );

    return NextResponse.json({
      message: "User berhasil dihapus, log aktivitas telah dicatat.",
    });
  } catch (error: any) {
    console.error("Delete User Error:", error);

    return NextResponse.json(
      { message: "Error deleting user", error: error.message || error },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_user, nama_lengkap, username, password, role, status_aktif } = body;

    // 1. Validasi input dasar
    if (!id_user || !nama_lengkap || !username || !role || status_aktif === undefined) {
      return NextResponse.json(
        { message: "Field wajib (ID, Nama, Username, Role, Status) harus diisi" },
        { status: 400 },
      );
    }

    // 2. Setup query data
    const status_val = (status_aktif === 'TRUE' || status_aktif === true || status_aktif === 1 || status_aktif === '1') ? 1 : 0;
    
    let query = "UPDATE tb_user SET nama_lengkap = ?, username = ?, role = ?, status_aktif = ?";
    let params = [nama_lengkap, username, role, status_val];

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas dengan ID Aktor
    await logActivity(
      actorId ? Number(actorId) : null, 
      `Mengupdate user [${nama_lengkap}] (ID: ${id_user}). Status Aktif: ${status_val}`
    );

    // 3. Hash password jika disediakan
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id_user = ?";
    params.push(id_user);

    // 4. Update ke database
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
        { message: "Username sudah digunakan" },
        { status: 400 },
      );
    }

    console.error("Update User API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
