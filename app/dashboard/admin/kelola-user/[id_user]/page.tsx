"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserDetail {
  nama_lengkap: string;
  username: string;
  role: string;
  status_aktif: number | string;
}

export default function EditUserPage({
  params: paramsPromise,
}: {
  params: Promise<{ id_user: string }>;
}) {
  const router = useRouter();
  const [id_user, setIdUser] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserDetail>({
    nama_lengkap: "",
    username: "",
    role: "",
    status_aktif: 1,
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    paramsPromise.then((p) => setIdUser(p.id_user));
  }, [paramsPromise]);

  // FETCHING DATA API
  const fetchDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v2/admin/user/${id}`);
      const json = await response.json();

      if (json.success) {
        setFormData({
          nama_lengkap: json.data.nama_lengkap || "",
          username: json.data.username || "",
          role: json.data.role || "",
          status_aktif: json.data.status_aktif,
        });
      } else {
        setError(json.message || "Gagal mengambil data detail");
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_user) fetchDetail(id_user);
  }, [id_user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status_aktif" ? Number(value) : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError(null);

      // Get logged in user from session
      let actorId = "";
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          actorId = parsed.id?.toString() || "";
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }

      const response = await fetch(`/api/v2/admin/user/${id_user}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": actorId,
        },
        body: JSON.stringify({
          id_user,
          ...formData,
          password: password.trim() !== "" ? password : undefined,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        alert("Data user berhasil diupdate");
        router.push("/dashboard/admin/kelola-user");
      } else {
        setError(json.message || "Gagal mengupdate data");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Terjadi kesalahan koneksi saat update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 shadow-xl border border-slate-800">
        <div className="flex flex-col gap-4 p-8">
          <p className="text-center text-3xl font-bold text-gray-200 mb-2">Update User</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 ml-1">Nama Lengkap</label>
              <input
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="bg-slate-950 w-full rounded-lg border border-slate-700 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="Nama Lengkap"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 ml-1">Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-slate-950 w-full rounded-lg border border-slate-700 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 ml-1">Password (Kosongkan jika tidak ingin diubah)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 w-full rounded-lg border border-slate-700 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="Password Baru"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 ml-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-slate-950 w-full rounded-lg border border-slate-700 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="petugas">Petugas</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 ml-1">Status Keaktifan</label>
              <select
                name="status_aktif"
                value={formData.status_aktif}
                onChange={handleChange}
                className="bg-slate-950 w-full rounded-lg border border-slate-700 px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              >
                <option value={1}>Aktif</option>
                <option value={0}>Tidak Aktif</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-3.5 text-center text-sm font-bold uppercase text-white transition duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {updating ? "Memproses..." : "Update Data User"}
          </button>
        </div>
      </div>
    </div>
  );
}
