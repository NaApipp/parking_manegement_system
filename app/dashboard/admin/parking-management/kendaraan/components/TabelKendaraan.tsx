"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, Motorbike, Shuffle, Edit, Trash2 } from "lucide-react";
// import HandleDelete from "./components/HandleDelete";

interface UserData {
  id_kendaraan: number;
  plat_nomor: string;
  jenis_kendaraan: string;
  warna: string;
  pemilik: string;
  id_user: string;
}

export default function TabelKendaraan() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HandleEdit
  const handleEdit = (id_kendaraan: number) => {
    router.push(`/dashboard/admin/parking-management/kendaraan/${id_kendaraan}`);
  };

  // HandleDelete
  const handleDelete = async (id_kendaraan: number) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus kendaraan ini?",
    );
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`/api/admin/kendaraan/${id_kendaraan}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Kendaraan berhasil dihapus");

      // refresh data / reload list
      fetchKendaraan();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus kendaraan");
    }
  };

  const fetchKendaraan = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/kendaraan");
      if (!response.ok) throw new Error("Gagal mengambil data kendaraan");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKendaraan();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "mobil":
        return <Car className="w-4 h-4 text-rose-500" />;
      case "motor":
        return <Motorbike className="w-4 h-4 text-blue-500" />;
      default:
        return <Shuffle className="w-4 h-4 text-gray-500" />;
    }
  };


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

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center flex-col items-center gap-2">
        <h1 className="font-bold text-3xl text-gray-800 dark:text-white">
          Data Kendaraan
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm"></div>
      </div>

      <div className="overflow-hidden m-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  ID Kendaraan
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Plat Nomor
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Jenis Kendaraan 
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Warna Kendaraan 
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Nama Pemilik
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  ID User Yang Merubah
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500 dark:text-zinc-400"
                  >
                    Tidak ada data kendaraan tersedia.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id_kendaraan}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-100 uppercase">
                      {user.plat_nomor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {user.jenis_kendaraan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {user.warna}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {user.pemilik}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 text-center">
                      {user.id_user}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(user.id_kendaraan)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-90"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_kendaraan)}
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all active:scale-90"
                        >
                          <Trash2 className="w-4 h-4" />
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
