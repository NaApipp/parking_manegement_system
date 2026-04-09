import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("tb_tarif")
    .select("id_tarif, jenis_kendaraan, tarif_masuk, tarif_per_jam");

  if (error) {
    console.error("Fetch Tarif Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data tarif" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}