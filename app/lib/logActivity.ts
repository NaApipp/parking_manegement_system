import db from "./db"

export async function logActivity(id_user: number | null, aktivitas: string) {
  await db.execute(
    `INSERT INTO tb_log_aktivitas (id_user, aktivitas, waktu_aktivitas)
     VALUES (?, ?, NOW())`,
    [id_user, aktivitas]
  )
}