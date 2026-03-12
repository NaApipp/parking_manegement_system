"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { User } from "lucide-react";
import { User } from "lucide";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  //   Handle Logout
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 flex h-screen w-64 flex-col justify-between border-e bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="px-4 py-6 overflow-y-auto">
        <span className="ml-4 flex items-center gap-1 text-gray-700 dark:text-gray-200">
          <p className="text-xl font-medium tracking-widest uppercase">
            Parking Management
          </p>
        </span>

        {/* Dynamic Menu */}
        <ul className="mt-6 space-y-1">
          {children}

          {/* Common Logout Button */}
          <li>
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:inherit] hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                Logout
              </button>
            </form>
          </li>
        </ul>
      </div>

      {/* Profile Info */}
      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
          {/* User Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-icon lucide-user"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>

          <div>
            <p className="text-xs">
              <strong className="block font-medium text-gray-900 dark:text-white ">
                {user?.username || "Loading..."}
              </strong>

              <span className="truncate block max-w-[140px]">
                {user?.role || "..."}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
