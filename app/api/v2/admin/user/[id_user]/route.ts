import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { logActivity } from "@/app/lib/logActivityV2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  try {
    const { id_user } = await params;

    const { data, error } = await supabase
      .from("tb_user")
      .select("nama_lengkap, username, role, status_aktif")
      .eq("id_user", id_user)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
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
    const { data: user, error: fetchError } = await supabase
      .from("tb_user")
      .select("nama_lengkap")
      .eq("id_user", id_user)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const userName = user.nama_lengkap;

    // 3. "Orphan" records di tabel lain agar tidak menghalangi DELETE
    await supabase
      .from("tb_log_aktivitas")
      .update({ id_user: null })
      .eq("id_user", id_user);

    await supabase
      .from("tb_kendaraan")
      .update({ id_user: null })
      .eq("id_user", id_user);

    await supabase
      .from("tb_transaksi")
      .update({ id_user: null })
      .eq("id_user", id_user);

    // 4. Simpan log aktivitas penghapusan menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Menghapus User [${userName}] (ID: ${id_user}) dari database`
    );

    // 5. Eksekusi penghapusan user
    const { error: deleteError } = await supabase
      .from("tb_user")
      .delete()
      .eq("id_user", id_user);

    if (deleteError) throw deleteError;

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

    const actorId = request.headers.get("X-User-ID");

    // simpan log aktivitas menggunakan logActivityV2
    await logActivity(
      actorId, 
      `Mengupdate user [${nama_lengkap}] (ID: ${id_user}). Status Aktif: ${status_aktif}`
    );

    // 2. Prepare update data
    const updateData: any = {
      nama_lengkap,
      username,
      role,
      status_aktif
    };

    // 3. Hash password jika disediakan
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // 4. Update ke database menggunakan Supabase
    const { error } = await supabase
      .from("tb_user")
      .update(updateData)
      .eq("id_user", id_user);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
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
    console.error("Update User API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
