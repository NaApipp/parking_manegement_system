"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserDetail {
  id_kendaraan: string;
  plat_nomor: string;
  jenis_kendaraan: string;
  warna: string;
  pemilik: string;
//   id_user: string;
}

export default function EditKendaraanPage({
  params: paramsPromise,
}: {
  params: Promise<{ id_kendaraan: string }>;
}) {
  const router = useRouter();
  const [id_kendaraan, setIdKendaraan] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserDetail>({
    id_kendaraan: "",
    plat_nomor: "",
    jenis_kendaraan: "",
    warna: "",
    pemilik: "",
//     id_user: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    paramsPromise.then((p) => setIdKendaraan(p.id_kendaraan));
  }, [paramsPromise]);

  // FETCHING DATA API
  const fetchDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/kendaraan/${id_kendaraan}`);
      const json = await response.json();

      if (json.success) {
        setFormData({
          id_kendaraan: json.data.id_kendaraan || "",
          plat_nomor: json.data.plat_nomor || "",
          jenis_kendaraan: json.data.jenis_kendaraan || "",
          warna: json.data.warna || "",
          pemilik: json.data.pemilik || "",
        //   id_user: json.data.id_user || "",
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
    if (id_kendaraan) fetchDetail(id_kendaraan);
  }, [id_kendaraan]);

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

      const response = await fetch(`/api/admin/kendaraan/${id_kendaraan}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        alert("Data kendaraan berhasil diupdate");
        router.push("/dashboard/admin/parking-management/kendaraan");
      } else {
        setError(json.message || "Gagal mengupdate data");
      }
    } catch (err) {
      console.error("Error updating area:", err);
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
          <p className="text-center text-3xl font-bold text-gray-200 mb-2">Update Kendaraan</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 ml-1">Plat Nomor</label>
              <input
                name="plat_nomor"
                id="plat_nomor"
                value={formData.plat_nomor}
                onChange={handleChange}
                placeholder="Masukkan Nama Area"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 ml-1">Jenis Kendaraan</label>
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
              <label className="text-xs text-gray-400 ml-1">Warna</label>
              <input
                name="warna"
                value={formData.warna}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                placeholder="Masukkan Warna Kendaraan"
              />  
            </div>
            <div>
              <label className="text-xs text-gray-400 ml-1">Nama Pemilik</label>
              <input
                name="pemilik"
                value={formData.pemilik}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                placeholder="Masukkan Nama Pemilik"
              />  
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-3.5 text-center text-sm font-bold uppercase text-white transition duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {updating ? "Memproses..." : "Update Data Kendaraan"}
          </button>
        </div>
      </div>
    </div>
  );
}
