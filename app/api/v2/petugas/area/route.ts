import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("tb_area_parkir")
    .select("id_area, nama_area, kapasitas, terisi");

  if (error) {
    console.error("Fetch Area Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data area parkir" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}