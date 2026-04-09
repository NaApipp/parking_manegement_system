"use client";

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface TransaksiData {
  id_parkir: number;
  id_kendaraan: number;
  waktu_masuk: string;
  waktu_keluar: string | null;
  id_tarif: number;
  durasi_jam: number;
  biaya_total: number;
  status: string;
  id_user: number;
  id_area: number;
  plat_nomor?: string;
  nama_area?: string;
  jenis_kendaraan?: string;
}

export default function KelolaTransaksiPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransaksiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // HandleEdit
  const handleEdit = (id_parkir: number) => {
    router.push(`/dashboard/petugas/kelola-transaksi/${id_parkir}`);
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/v2/petugas/transaksi");
      if (!response.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
        Error: {error}
      </div>
    );
  }

  const filteredTransactions = transactions.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.id_parkir?.toString().toLowerCase().includes(query) 
      // item.id_kendaraan?.toString().toLowerCase().includes(query) ||
      // item.status?.toLowerCase().includes(query) ||
      // item.id_user?.toString().toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full space-y-6 mt-9">
      <div className="flex flex-row items-center justify-between m-4">
        <h1 className="font-bold text-3xl text-gray-800 dark:text-white">
          Data Transaksi Parkir
        </h1>
        <form className="form relative" onSubmit={(e) => e.preventDefault()}>
          <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
              className="w-5 h-5 text-gray-700"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                stroke-width="1.333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <input
            className="input rounded-full px-8 py-3 border-2 border-gray-200 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
            placeholder="Cari ID Parkir Yang Tersedia..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
              onClick={() => setSearchQuery("")}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            </button>
          )}
        </form>

      </div>

      <div className="overflow-hidden m-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Kendaraan
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Tanggal Masuk
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Petugas (ID)
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-center text-gray-700 dark:text-zinc-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 dark:text-zinc-400"
                  >
                    Tidak ada data transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr
                    key={item.id_parkir}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {item.id_parkir}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      {item.plat_nomor || item.id_kendaraan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {new Date(item.waktu_masuk).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {item.id_user}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          item.status === "masuk"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEdit(item.id_parkir)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-90"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
