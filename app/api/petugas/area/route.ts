import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  const [rows] = await db.execute(
    "SELECT id_area,nama_area,kapasitas,terisi FROM tb_area_parkir"
  );

  return NextResponse.json(rows);
}