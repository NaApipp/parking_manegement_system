import db from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.execute("SELECT * FROM tb_log_aktivitas");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching log aktivitas:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}