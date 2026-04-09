import { supabase } from "./supabase"

export async function logActivity(id_user: string | number | null, aktivitas: string) {
  const { error } = await supabase
    .from("tb_log_aktivitas")
    .insert([
      { 
        id_user, 
        aktivitas, 
        waktu_aktivitas: new Date().toISOString() 
      }
    ])

  if (error) {
    console.error("Failed to log activity:", error)
  }
}