"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id_log: number;
  id_user: number;
  aktivitas: string;
  waktu_aktivitas: string;
}

export default function TabelData() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/log-aktivitas");
      if (!response.ok) throw new Error("Gagal mengambil data log aktivitas");
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
          Data Log Aktivitas
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm"></div>
      </div>

      <div className="overflow-hidden m-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Id Log
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  ID User
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Aktivitas
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Tanggal & Waktu
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
                    Tidak ada data user tersedia.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id_log}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {user.id_log}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      {user.id_user}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 whitespace-normal break-words max-w-md">
                      {user.aktivitas}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 w-fit">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                          {new Date(user.waktu_aktivitas).toLocaleString("id-ID")}
                        </span>
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
