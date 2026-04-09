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
  FileText,
} from "lucide-react";

interface DetailTransaksi {
  id_parkir: string;
  id_area: string;
  id_kendaraan: number;
  waktu_masuk: string;
  waktu_keluar: string;
  id_tarif: number;
  durasi_jam: number;
  biaya_total: number;
  status: string;
  id_user: number;
}

export default function EditUserPage({
  params: paramsPromise,
}: {
  params: Promise<{ id_parkir: string }>;
}) {
  const router = useRouter();
  const [id_parkir, setIdParkir] = useState<string | null>(null);
  const [formData, setFormData] = useState<DetailTransaksi>({
    id_parkir: "",
    id_area: "",
    id_kendaraan: 0,
    waktu_masuk: "",
    waktu_keluar: "",
    id_tarif: 0,
    durasi_jam: 0,
    biaya_total: 0,
    status: "Keluar",
    id_user: 0,
  });
  const [kendaraan, setKendaraan] = useState<any[]>([]);
  const [tarif, setTarif] = useState<any[]>([]);
  const [area, setArea] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Unwrap params
  useEffect(() => {
    paramsPromise.then((p) => setIdParkir(p.id_parkir));
  }, [paramsPromise]);

  // FETCHING DATA API
  const fetchData = async () => {
    try {
      setLoading(true);

      const [resK, resT, resA] = await Promise.all([
        fetch("/api/v2/petugas/kendaraan"),
        fetch("/api/v2/petugas/tarif"),
        fetch("/api/v2/petugas/area"),
      ]);
      const [dataK, dataT, dataA] = await Promise.all([
        resK.json(),
        resT.json(),
        resA.json(),
      ]);

      setKendaraan(dataK);
      setTarif(dataT);
      setArea(dataA);

      const response = await fetch(`/api/v2/petugas/transaksi/${id_parkir}`);
      const json = await response.json();

      if (json.success) {
        const formatDateTimeLocal = (dateString: string) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          return date.toLocaleString("sv-SE").slice(0, 16).replace(" ", "T");
        };

        setFormData({
          id_parkir: json.data.id_parkir || "",
          id_area: json.data.id_area || "",
          id_kendaraan: json.data.id_kendaraan || "",
          waktu_masuk: formatDateTimeLocal(json.data.waktu_masuk),
          waktu_keluar: formatDateTimeLocal(json.data.waktu_keluar),
          id_tarif: json.data.id_tarif || "",
          durasi_jam: json.data.durasi_jam || "",
          biaya_total: json.data.biaya_total || "",
          status: json.data.status || "",
          id_user: json.data.id_user || "",
        });
      } else {
        setMessage({
          type: "error",
          text: json.message || "Gagal mengambil data detail",
        });
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_parkir) fetchData();
  }, [id_parkir]);

  // Logic Hitung Durasi Otomatis
  useEffect(() => {
    if (formData.waktu_masuk && formData.waktu_keluar) {
      const masuk = new Date(formData.waktu_masuk);
      const keluar = new Date(formData.waktu_keluar);

      if (!isNaN(masuk.getTime()) && !isNaN(keluar.getTime())) {
        const diffMs = keluar.getTime() - masuk.getTime();
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Bulatkan ke atas (umum untuk parkir)

        if (diffHours >= 0 && diffHours !== formData.durasi_jam) {
          setFormData((prev) => ({ ...prev, durasi_jam: diffHours }));
        }
      }
    }
  }, [formData.waktu_masuk, formData.waktu_keluar]);

  // Logic Hitung Biaya Total
  useEffect(() => {
    const selectedTarif = tarif.find(
      (t) => Number(t.id_tarif) === Number(formData.id_tarif),
    );
    if (selectedTarif) {
      const tarifPerJam = Number(selectedTarif.tarif_per_jam);
      const durasi = Number(formData.durasi_jam);
      if (!isNaN(tarifPerJam) && !isNaN(durasi)) {
        setFormData((prev) => ({
          ...prev,
          biaya_total: tarifPerJam * durasi,
        }));
      }
    }
  }, [formData.id_tarif, formData.durasi_jam, tarif]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status_aktif" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setMessage(null);

      const response = await fetch(`/api/v2/petugas/transaksi/${id_parkir}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        alert("Data transaksi berhasil diupdate");
        router.push(`/dashboard/petugas/kelola-transaksi/${id_parkir}`);
      } else {
        setMessage({
          type: "error",
          text: json.message || "Gagal mengupdate data",
        });
      }
    } catch (err) {
      console.error("Error updating area:", err);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan koneksi saat update",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
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
            Input Parkir Kaluar
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

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Kendaraan */}
            <div className="space-y-1.5">
              <InputLabel icon={Car}>Kendaraan</InputLabel>
              <select
                name="id_kendaraan"
                value={formData.id_kendaraan}
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
                value={formData.waktu_masuk}
                onChange={handleChange}
                className={InputClass}
                required
                readOnly
              />
            </div>

            {/* Tarif */}
            <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Tarif</InputLabel>
              <select
                name="id_tarif"
                value={formData.id_tarif}
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
            <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Durasi (Jam)</InputLabel>
              <input
                type="text"
                name="durasi_jam"
                value={formData.durasi_jam}
                onChange={handleChange}
                className={InputClass}
                placeholder="0"
                required
              />
            </div>

            {/* Biaya Total */}
            <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Biaya Total</InputLabel>
              <input
                type="text"
                name="biaya_total"
                value={formData.biaya_total}
                onChange={handleChange}
                className={InputClass}
                placeholder="0"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <InputLabel icon={Receipt}>Status</InputLabel>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={InputClass}
                required
              >
                <option value="">Pilih Status</option>
                <option value="Masuk">Masuk</option>
                <option value="Keluar">Keluar</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-zinc-300">
            {/* ID Petugas */}
            <div className="space-y-1.5">
              <InputLabel icon={MapPin}>ID Petugas</InputLabel>
              <input
                name="id_user"
                value={formData.id_user}
                className={`${InputClass} bg-gray-50 dark:bg-zinc-800`}
                readOnly
              />
            </div>
            {/* Area Parkir */}
            <div className="space-y-1.5">
              <InputLabel icon={MapPin}>Area Parkir</InputLabel>
              <select
                name="id_area"
                value={formData.id_area}
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
            </div>
          </div>

          {/* Waktu Keluar (Optional for Entry) */}
          <div className="space-y-1.5">
            <InputLabel icon={Clock}>Waktu Keluar</InputLabel>
            <input
              type="datetime-local"
              name="waktu_keluar"
              value={formData.waktu_keluar || ""}
              onChange={handleChange}
              className={InputClass}
            />
          </div>

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
                  <Send className="h-4 w-4" /> Update Transaksi
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                window.open(`/api/v2/petugas/transaksi/${id_parkir}/pdf`);
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
