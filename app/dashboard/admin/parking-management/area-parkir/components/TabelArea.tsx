"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, Motorbike, Shuffle, Edit, Trash2 } from "lucide-react";
// import HandleDelete from "./components/HandleDelete";

interface UserData {
  id_area: number;
  nama_area: string;
  kapasitas: number;
  terisi: number;
}

export default function TabelArea() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HandleEdit
  const handleEdit = (id_area: number) => {
    router.push(`/dashboard/admin/parking-management/area-parkir/${id_area}`);
  };

  // HandleDelete
  const handleDelete = async (id_area: number) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus Area ini?",
    );
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`/api/admin/area-parkir/${id_area}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Area berhasil dihapus");

      // refresh data / reload list
      fetchArea();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus Area");
    }
  };

  const fetchArea = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/area-parkir");
      if (!response.ok) throw new Error("Gagal mengambil data Area");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArea();
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

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center flex-col items-center gap-2">
        <h1 className="font-bold text-3xl text-gray-800 dark:text-white">
          Data Area
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm"></div>
      </div>

      <div className="overflow-hidden m-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  ID Area
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Nama Area
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Kapasitas
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Terisi
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
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500 dark:text-zinc-400"
                  >
                    Tidak ada data area tersedia.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id_area}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-100 uppercase">
                      {user.nama_area}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {user.kapasitas}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      {user.terisi}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(user.id_area)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-90"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_area)}
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
