import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tb_log_aktivitas")
      .select(`
        *,
        tb_user (
          username,
          nama_lengkap
        )
      `)
      .order("waktu_aktivitas", { ascending: false });

    if (error) throw error;

    // Menyamakan struktur dengan output sebelumnya (MySQL JOIN)
    const formattedData = data.map((item: any) => ({
      ...item,
      username: item.tb_user?.username || null,
      nama_lengkap: item.tb_user?.nama_lengkap || null
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching log aktivitas:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}