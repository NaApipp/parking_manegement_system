import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  const [rows] = await db.execute(
    "SELECT id_kendaraan, plat_nomor FROM tb_kendaraan"
  );

  return NextResponse.json(rows);
}