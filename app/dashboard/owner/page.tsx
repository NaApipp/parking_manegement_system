"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonLogout from "@/app/components/ButtonLogout"

interface TransaksiData {
  id_parkir: number;
  id_kendaraan: number;
  waktu_masuk: string;
  waktu_keluar: string | null;
  id_tarif: number;
  durasi_jam: number;
  biaya_total: number;
  status: string;
  id_user: number;
  id_area: number;
  plat_nomor?: string;
  nama_area?: string;
  jenis_kendaraan?: string;
}

export default function KelolaTransaksiPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransaksiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/v2/petugas/transaksi");
      if (!response.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Reset ke halaman 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

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

  const filteredTransactions = transactions.filter((item) => {
    const query = searchQuery.toLowerCase();
    
    // 1. Text Search (ID Parkir)
    const matchesSearch = item.id_parkir?.toString().toLowerCase().includes(query);

    // 2. Date Filter
    let matchesDate = true;
    if (startDate && endDate) {
      const getIsoDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toISOString().split('T')[0];
      };

      const start = new Date(startDate).toISOString().split('T')[0];
      const end = new Date(endDate).toISOString().split('T')[0];
      const itemWaktuMasuk = getIsoDate(item.waktu_masuk);
      const itemWaktuKeluar = getIsoDate(item.waktu_keluar);

      // Cek apakah ada aktivitas masuk ATAU keluar dalam rentang tanggal
      const checkMasuk = itemWaktuMasuk ? (itemWaktuMasuk >= start && itemWaktuMasuk <= end) : false;
      const checkKeluar = itemWaktuKeluar ? (itemWaktuKeluar >= start && itemWaktuKeluar <= end) : false;

      matchesDate = checkMasuk || checkKeluar;
    }

    return matchesSearch && matchesDate;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full space-y-6 mt-9 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
        <h1 className="font-bold text-3xl text-gray-800 dark:text-white">
          Laporan Transaksi Parkir
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Filter Tanggal */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
            <div className="flex flex-col px-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Mulai</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none p-0 text-sm focus:ring-0 outline-none dark:text-white cursor-pointer"
              />
            </div>
            <div className="h-8 w-[1px] bg-gray-100 dark:bg-zinc-800"></div>
            <div className="flex flex-col px-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Selesai</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none p-0 text-sm focus:ring-0 outline-none dark:text-white cursor-pointer"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                title="Hapus Filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>
        
        {/* Search By ID */}
          <form className="form relative w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
            <button className="absolute left-3 -translate-y-1/2 top-1/2 p-1">
              <svg
                width="17"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
                className="w-4 h-4 text-gray-500"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <input
              className="input w-full sm:w-64 rounded-2xl px-10 py-3 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-sm text-sm dark:text-white"
              placeholder="Cari ID Parkir..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Button LogOut */}
          <ButtonLogout />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mt-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase text-gray-400 mb-2">Total Transaksi</p>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white">
            {filteredTransactions.length} <span className="text-sm font-medium text-gray-400">Data</span>
          </h2>
        </div>
      </div>

      <div className="overflow-hidden m-4 rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  ID Parkir
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Kendaraan
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Waktu Masuk
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Waktu Keluar
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500 dark:text-zinc-400"
                  >
                    Tidak ada data transaksi dalam rentang waktu ini.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.id_parkir}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-400">
                      #{item.id_parkir}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[17px] text-gray-400 uppercase font-bold">
                          ID: {item.id_kendaraan}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 dark:text-zinc-300">
                          {new Date(item.waktu_masuk).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.waktu_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 dark:text-zinc-300">
                          {item.waktu_keluar ? new Date(item.waktu_keluar).toLocaleDateString('id-ID') : '-'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.waktu_keluar ? new Date(item.waktu_keluar).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          item.status.toLowerCase() === "masuk"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
            <div className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTransactions.length)} dari {filteredTransactions.length} data
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Tampilkan hanya beberapa halaman jika terlalu banyak
                  if (
                    totalPages > 5 &&
                    pageNumber !== 1 &&
                    pageNumber !== totalPages &&
                    Math.abs(pageNumber - currentPage) > 1
                  ) {
                    if (Math.abs(pageNumber - currentPage) === 2) return <span key={pageNumber} className="text-gray-400">...</span>;
                    return null;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                          : "text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
