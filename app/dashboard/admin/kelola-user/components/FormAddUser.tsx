'use client';

import { useState } from 'react';

export default function AddUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    role: 'petugas',
    password: '',
    status_aktif: 'TRUE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/v2/admin/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': actorId,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registrasi berhasil! Silakan login.' });
        setFormData({
          nama_lengkap: '',
          username: '',
          role: 'petugas',
          password: '',
          status_aktif: 'TRUE',
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat registrasi.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghubungi server. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
            Tambah User
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
            Silakan lengkapi data di bawah ini untuk menambah user.
          </p>
        </div>

        {message && (
          <div
            className={`rounded-lg p-4 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 grid grid-cols-2 gap-3" > 
            <div>
              <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama_lengkap"
                id="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Pilih username"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                required
              >
                <option value="admin">Admin</option>
                <option value="petugas">Petugas</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                required
              />
            </div>

            {/* <div>
              <label htmlFor="status_aktif" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Status
              </label>
              <select
                name="status_aktif"
                id="status_aktif"
                value={formData.status_aktif}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                required
              >
                <option value="TRUE">Active</option>
                <option value="FALSE">Inactive</option>
              </select>
            </div> */}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Tambah User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}