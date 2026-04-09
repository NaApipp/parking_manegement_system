import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("tb_kendaraan")
    .select("id_kendaraan, plat_nomor");

  if (error) {
    console.error("Fetch Kendaraan Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data kendaraan" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}