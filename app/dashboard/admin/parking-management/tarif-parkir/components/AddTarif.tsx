"use client";

import { useState } from "react";

export default function AddTarifPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    jenis_kendaraan: "",
    tarif_per_jam: "",
  });

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

    try {
      const response = await fetch("/api/v2/admin/tarif-parkir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": actorId,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Tarif berhasil ditambahkan!",
        });
        setFormData({
          jenis_kendaraan: "",
          tarif_per_jam: "",
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
  return (
    <>
      <div className="bg-zinc-900 p-4 m-3 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tambahkan Tarif Parkir</h1>
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
                htmlFor="tarif_per_jam"
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                Tarif Per Jam
              </label>
              <input
                type="text"
                name="tarif_per_jam"
                id="tarif_per_jam"
                value={formData.tarif_per_jam}
                onChange={handleChange}
                placeholder="Masukkan Tarif Perjam (10,0)"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Tambahkan Tarif"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
