"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  MapPin,
  Receipt,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";

export default function FormTransaksi() {
  const router = useRouter();
  const [kendaraan, setKendaraan] = useState<any[]>([]);
  const [tarif, setTarif] = useState<any[]>([]);
  const [area, setArea] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [form, setForm] = useState({
    id_kendaraan: "",
    waktu_masuk: new Date().toLocaleString("sv-SE").slice(0, 16).replace(" ", "T"),
    waktu_keluar: "",
    id_tarif: "",
    durasi_jam: "0",
    biaya_total: "0",
    status: "masuk",
    id_user: "",
    id_area: "",
  });

  useEffect(() => {
    // Get user from session
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.id) {
          setForm((prev) => ({ ...prev, id_user: parsed.id.toString() }));
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    // Fetch master data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [resK, resT, resA] = await Promise.all([
          fetch("/api/v2/petugas/kendaraan"),
          fetch("/api/v2/petugas/tarif"),
          fetch("/api/v2/petugas/area"),
        ]);

        const [dataK, dataT, dataA] = await Promise.all([
          resK.ok ? resK.json() : [],
          resT.ok ? resT.json() : [],
          resA.ok ? resA.json() : [],
        ]);

        setKendaraan(Array.isArray(dataK) ? dataK : []);
        setTarif(Array.isArray(dataT) ? dataT : []);
        setArea(Array.isArray(dataA) ? dataA : []);
      } catch (err) {
        console.error("Failed to fetch master data", err);
        setMessage({ type: "error", text: "Gagal mengambil data master" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_kendaraan || !form.id_tarif || !form.status ) {
      setMessage({ type: "error", text: "Mohon lengkapi semua data" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/v2/petugas/transaksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Transaksi berhasil disimpan!" });
        setForm((prev) => ({
          ...prev,
          id_kendaraan: "",
          id_tarif: "",
          id_area: "",
        }));

        // Refresh area data to update capacity display
        const resA = await fetch("/api/v2/petugas/area");
        if (resA.ok) {
          const dataA = await resA.json();
          setArea(Array.isArray(dataA) ? dataA : []);
        }
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal menyimpan transaksi",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const InputLabel = ({
    children,
    icon: Icon,
  }: {
    children: React.ReactNode;
    icon: any;
  }) => (
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
      <Icon className="h-4 w-4 text-blue-500" />
      {children}
    </label>
  );

  const InputClass =
    "block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-500";

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Input Parkir Masuk
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Silakan lengkapi detail transaksi di bawah ini.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Kendaraan */}
            <div className="space-y-1.5">
              <InputLabel icon={Car}>Kendaraan</InputLabel>
              <select
                name="id_kendaraan"
                value={form.id_kendaraan}
                onChange={handleChange}
                className={InputClass}
                required
              >
                <option value="">Pilih Plat Nomor</option>
                {kendaraan.map((k) => (
                  <option key={k.id_kendaraan} value={k.id_kendaraan}>
                    {k.plat_nomor}
                  </option>
                ))}
              </select>
            </div>

            {/* Waktu Masuk */}
            <div className="space-y-1.5">
              <InputLabel icon={Clock}>Waktu Masuk</InputLabel>
              <input
                type="datetime-local"
                name="waktu_masuk"
                value={form.waktu_masuk}
                onChange={handleChange}
                className={InputClass}
                required
              />
            </div>

            {/* Tarif */}
            <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Tarif</InputLabel>
              <select
                name="id_tarif"
                value={form.id_tarif}
                onChange={handleChange}
                className={InputClass}
                required
              >
                <option value="">Pilih Tarif</option>
                {tarif.map((t) => (
                  <option key={t.id_tarif} value={t.id_tarif}>
                    {t.jenis_kendaraan} - {t.tarif_per_jam} Ribu
                  </option>
                ))}
              </select>
            </div>

            {/* Durasi */}
            {/* <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Durasi (Jam)</InputLabel>
              <input
                type="text"
                name="durasi_jam"
                value={form.durasi_jam}
                onChange={handleChange}
                className={InputClass}
                placeholder="0"
                required
              />
            </div> */}

            {/* Biaya Total */}
            {/* <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Biaya Total</InputLabel>
              <input
                type="text"
                name="biaya_total"
                value={form.biaya_total}
                onChange={handleChange}
                className={InputClass}
                placeholder="0"
                required
              />
            </div> */}

            {/* Status */}
            <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Status</InputLabel>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={InputClass}
                required
              >
                <option value="">Pilih Status</option>
                <option value="masuk">Masuk</option>
                <option value="keluar">Keluar</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-zinc-300">
            {/* ID Petugas */}
            <div className="space-y-1.5">
              <InputLabel icon={MapPin}>ID Petugas</InputLabel>
              <input
                name="id_user"
                value={form.id_user}
                className={`${InputClass} bg-gray-50 dark:bg-zinc-800`}
                readOnly
              />
            </div>
            {/* Area Parkir */}
            {/* <div className="space-y-1.5">
              <InputLabel icon={MapPin}>Area Parkir</InputLabel>
              <select
                name="id_area"
                value={form.id_area}
                onChange={handleChange}
                className={InputClass}
                required
              >
                <option value="">Pilih Area</option>
                {area.map((a) => (
                  <option key={a.id_area} value={a.id_area}>
                    {a.nama_area}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          {/* Waktu Keluar (Optional for Entry) */}
          {/* <div className="space-y-1.5">
            <InputLabel icon={Clock}>Waktu Keluar</InputLabel>
            <input
              type="datetime-local"
              name="waktu_keluar"
              value={form.waktu_keluar || ""}
              onChange={handleChange}
              className={InputClass}
            />
          </div> */}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Simpan Transaksi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
