"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  UserCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
// import HandleDelete from "./components/HandleDelete";

interface UserData {
  id_user: number;
  nama_lengkap: string;
  username: string;
  role: string;
  status_aktif: number | boolean | string;
}

export default function TabelData() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HandleEdit
  const handleEdit = (id_user: number) => {
    router.push(`/dashboard/admin/kelola-user/${id_user}`);
  };

  // HandleDelete
  const handleDelete = async (id_user: number) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus user ini?",
    );
    if (!confirmDelete) return;

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
      const response = await fetch(`/api/v2/admin/user/${id_user}`, {
        method: "DELETE",
        headers: {
          "X-User-ID": actorId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("User berhasil dihapus");

      // refresh data / reload list
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal menghapus user");
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/v2/admin/user");
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

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4 text-rose-500" />;
      case "petugas":
        return <UserCircle className="w-4 h-4 text-blue-500" />;
      case "owner":
        return <User className="w-4 h-4 text-amber-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const isStatusActive = (status: any) => {
    return (
      status === 1 || status === "1" || status === true || status === "TRUE"
    );
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
          Data User
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm"></div>
      </div>

      <div className="overflow-hidden m-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  No
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Nama Lengkap
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Username
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Role
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
                    key={user.id_user}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      {user.nama_lengkap}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">
                      @{user.username}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 w-fit">
                        {getRoleIcon(user.role)}
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isStatusActive(user.status_aktif) ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Aktif</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium text-sm">
                          <XCircle className="w-4 h-4" />
                          <span>Tidak Aktif</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEdit(user.id_user)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-90"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_user)}
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
