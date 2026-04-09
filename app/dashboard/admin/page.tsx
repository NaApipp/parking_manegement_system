"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Car, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

// Type data untuk card status
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Function Card Status
const StatCard = ({ title, value, icon, color, description }: StatCardProps) => (
  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-xs font-bold uppercase text-gray-400 mb-1 tracking-wider">{title}</p>
      <h2 className="text-3xl font-black text-zinc-800 dark:text-white mb-1">
        {value}
      </h2>
      <p className="text-[10px] text-gray-400">{description}</p>
    </div>
  </div>
);

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    areas: 0,
    vehicles: 0,
    logs: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

//   Fetch data brerdasarkan user login
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setAdminName(JSON.parse(userData).nama_lengkap || "Admin");
    }

    // Fetch data user, area, kendaraan, dan log aktivitas
    const fetchData = async () => {
      try {
        const [usersRes, areasRes, vehiclesRes, logsRes] = await Promise.all([
          fetch("/api/v2/admin/user"),
          fetch("/api/v2/admin/area-parkir"),
          fetch("/api/v2/admin/kendaraan"),
          fetch("/api/v2/admin/log-aktivitas")
        ]);

        const [users, areas, vehicles, logs] = await Promise.all([
          usersRes.json(),
          areasRes.json(),
          vehiclesRes.json(),
          logsRes.json()
        ]);

        // Update state stats
        setStats({
          users: Array.isArray(users) ? users.length : 0,
          areas: Array.isArray(areas) ? areas.length : 0,
          vehicles: Array.isArray(vehicles) ? vehicles.length : 0,
          logs: Array.isArray(logs) ? logs.length : 0
        });

        // Update state recentLogs
        setRecentLogs(Array.isArray(logs) ? logs.slice(0, 5) : []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

//   Loading Function
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Dashboard <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">
            Halo, <span className="text-zinc-900 dark:text-zinc-200 font-bold">{adminName}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-2 rounded-2xl shadow-sm text-sm font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols- md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Petugas" 
          value={stats.users} 
          icon={<Users className="text-blue-600" size={24} />} 
          color="bg-blue-500"
          description="Total petugas terdaftar di sistem"
        />
        <StatCard 
          title="Area Parkir" 
          value={stats.areas} 
          icon={<MapPin className="text-purple-600" size={24} />} 
          color="bg-purple-500"
          description="Lokasi parkir yang dikelola"
        />
        <StatCard 
          title="Kendaraan" 
          value={stats.vehicles} 
          icon={<Car className="text-orange-600" size={24} />} 
          color="bg-orange-500"
          description="Kendaraan aktif terdaftar"
        />
        <StatCard 
          title="Log Aktivitas" 
          value={stats.logs} 
          icon={<Activity className="text-rose-600" size={24} />} 
          color="bg-rose-500"
          description="Total riwayat aktivitas sistem"
        />
      </div>


    <h1 className="text-xl font-bold text-zinc-800 dark:text-white px-2">Quick Akses</h1>
        {/* Quick Link */}
      <div className="grid grid-cols-4 gap-4">
            <QuickLink 
              title="Tambah Petugas Baru" 
              href="/dashboard/admin/kelola-user" 
              icon={<Users size={18} />} 
              color="text-blue-600" 
              bgColor="bg-blue-500/10"
            />
            <QuickLink 
              title="Atur Tarif Parkir" 
              href="/dashboard/admin/parking-management/tarif-parkir" 
              icon={<TrendingUp size={18} />} 
              color="text-emerald-600" 
              bgColor="bg-emerald-500/10"
            />
            <QuickLink 
              title="Pantau Area Parkir" 
              href="/dashboard/admin/parking-management/area-parkir" 
              icon={<MapPin size={18} />} 
              color="text-purple-600" 
              bgColor="bg-purple-500/10"
            />
            <QuickLink 
              title="Lihat Log Aktivitas" 
              href="/dashboard/admin/log-aktivitas" 
              icon={<Activity size={18} />} 
              color="text-purple-600" 
              bgColor="bg-purple-500/10"
            />
      </div>
    </div>
  );
}



// Components Card untuk Quick Link
function QuickLink({ title, href, icon, color, bgColor }: { title: string, href: string, icon: React.ReactNode, color: string, bgColor: string }) {
  return (
    <Link href={href}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group">
         <div className="flex items-center gap-3">
           <div className={`p-2 rounded-xl ${bgColor} ${color}`}>
             {icon}
           </div>
           <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{title}</span>
         </div>
         <ArrowRight size={14} className="text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
      </div>
    </Link>
  );
}
