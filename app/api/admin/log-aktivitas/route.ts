import db from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT tb_log_aktivitas.*, tb_user.username, tb_user.nama_lengkap 
            FROM tb_log_aktivitas 
            LEFT JOIN tb_user ON tb_log_aktivitas.id_user = tb_user.id_user
            ORDER BY tb_log_aktivitas.waktu_aktivitas DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching log aktivitas:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}