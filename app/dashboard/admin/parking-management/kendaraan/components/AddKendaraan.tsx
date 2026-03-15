"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddKendaraanPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    plat_nomor: "",
    jenis_kendaraan: "",
    warna: "",
    pemilik: "",
    id_user: "",
  });
  const [users, setUsers] = useState<any[]>([]);
  
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Auto-fill id_user if it exists
        if (parsedUser.id) {
          setFormData((prev) => ({ ...prev, id_user: parsedUser.id.toString() }));
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/kendaraan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": user?.id?.toString() || "",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Kendaraan berhasil ditambahkan!",
        });
        setFormData({
          plat_nomor: "",
          jenis_kendaraan: "",
          warna: "",
          pemilik: "",
          id_user: "",
        });
        
        // Refresh halaman untuk memperbarui tabel
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: result.message || "Terjadi kesalahan saat registrasi.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Gagal menghubungi server. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch API GET id_User
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/user");
      if (!response.ok) throw new Error("Gagal mengambil data user");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
    useEffect(() => {
      fetchUsers();
    }, []);
  return (
    <>
      <div className="bg-zinc-900 p-4 m-3 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tambahkan Kendaraan</h1>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500 text-green-500"
                : "bg-red-500/10 border border-red-500 text-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="plat_nomor"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                Plat Nomor
              </label>
              <input
                type="text"
                name="plat_nomor"
                id="plat_nomor"
                value={formData.plat_nomor}
                onChange={handleChange}
                placeholder="Masukkan Plat Nomor Kendaraan"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="jenis_kendaraan"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                Jenis Kendaraan
              </label>

              <select
                name="jenis_kendaraan"
                id="jenis_kendaraan"
                value={formData.jenis_kendaraan}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                required
              >
                <option value="" disabled>
                  Pilih Jenis Kendaraan
                </option>
                <option value="motor">Motor</option>
                <option value="mobil">Mobil</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="warna"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                Warna Kendaraan
              </label>
              <input
                type="text"
                name="warna"
                id="warna"
                value={formData.warna}
                onChange={handleChange}
                placeholder="Masukkan Warna Kendaraan"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="pemilik"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                Pemilik Kendaraan
              </label>
              <input
                type="text"
                name="pemilik"
                id="pemilik"
                value={formData.pemilik}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap Pemilik Kendaraan"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>
          </div>

            <div className="hidden">
              <label
                htmlFor="id_user"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                ID User Yang Menambahkan
              </label>
              <input
                type="text"
                name="id_user"
                id="id_user"
                value={formData.id_user || "..."}
                onChange={handleChange}
                // placeholder="ID User Yang Menambahkan"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                readOnly
              />
            </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Tambahkan Kendaraan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
