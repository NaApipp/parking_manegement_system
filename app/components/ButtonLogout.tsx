"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ButtonLogout() {
  const router = useRouter();

  //   Handle Logout
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.removeItem("user");
    router.push("/login");
  };
    return (
        <form onSubmit={handleLogout} className="">
            <button
                type="submit"
                className="flex flex-row items-center w-full rounded-lg bg-red-500 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium [text-align:inherit] cursor-pointer"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </button>
        </form>
    )
    

}