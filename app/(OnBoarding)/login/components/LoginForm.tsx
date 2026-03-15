"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonCopy from "@/app/components/ButtonCopy";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/on-boarding/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Login berhasil! Mengalihkan..." });

        // Simpan data user ke sessionStorage
        sessionStorage.setItem("user", JSON.stringify(result.user));

        // Redirect berdasarkan response API
        setTimeout(() => {
          router.push(result.redirectTo || "/dashboard");
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Username atau password salah.",
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
    <div className="flex flex-col justify-center min-h-screen">
      <div className="flex items-center justify-center bg-zinc-950">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              Login
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
              Masuk ke sistem manajemen parkir
            </p>
          </div>

          {message && (
            <div
              className={`rounded-lg p-4 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Login"}
              </button>
            </div>

            {/* <AlertDemoUser /> */}
          </form>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <AlertDemoUser />
      </div>
    </div>
  );
}

function AlertDemoUser() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm w-full max-w-2xl shadow-xl">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-bold text-zinc-100">
            Account Untuk Demo dan Testing
          </h3>
          <div className="mt-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Admin */}
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#EAEFD3] mb-2 text-center">
                  User Admin
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">User:</span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      user_admin <ButtonCopy text="user_admin" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Pass:</span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      user_admin <ButtonCopy text="user_admin" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Petugas */}
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 text-center">
                  User Petugas
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">User:</span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      user_petugas <ButtonCopy text="user_petugas" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Pass:</span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      user_petugas <ButtonCopy text="user_petugas" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Owner */}
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2 text-center">
                  User Owner
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">User:</span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      user_owner <ButtonCopy text="user_owner" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Pass:</span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      user_owner <ButtonCopy text="user_owner" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
