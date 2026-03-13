"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (  
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950">
      <Sidebar>
        <li className="gap-3">
          <Link
            href="/dashboard/petugas"
            className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Transaksi
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/petugas/kelola-transaksi"
            className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Kelola Transaksi
          </Link>
        </li>
      </Sidebar>
      <main className="flex-1 ml-64 overflow-y-auto">{children}</main>
    </div>
  );
}