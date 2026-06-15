"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Search,
  Clock3,
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

import { getMyLaporan } from "@/src/lib/laporan";

interface Laporan {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function UserLaporan() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const response = await getMyLaporan();
      setLaporan(
        Array.isArray(response.data?.data)
          ? response.data.data
          : []
      );
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      setLaporan([]);
    } finally {
      setLoading(false);
    }
  };

  const pending = laporan.filter((item) => item.status === "pending").length;
  const diperiksa = laporan.filter((item) => item.status === "diperiksa" || item.status === "diverifikasi").length;
  const tindakLanjut = laporan.filter((item) => item.status === "tindak_lanjut").length;
  const selesai = laporan.filter((item) => item.status === "selesai").length;
  const ditolak = laporan.filter((item) => item.status === "ditolak").length;

  const filtered = laporan.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "all") {
      return matchesSearch;
    } else if (statusFilter === "diperiksa") {
      return matchesSearch && (item.status === "diperiksa" || item.status === "diverifikasi");
    } else {
      return matchesSearch && item.status === statusFilter;
    }
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "diperiksa":
      case "diverifikasi":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "tindak_lanjut":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "ditolak":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-neutral-500 font-medium">
        <div className="animate-pulse">Memuat daftar laporan Anda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600 tracking-tight">
            Laporan Saya
          </h1>
          <p className="text-neutral-500 mt-1">
            Pantau kemajuan dan kelola draf laporan pengaduan Anda
          </p>
        </div>

        <Link
          href="/dashboard/laporan/create"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl shadow-sm font-semibold transition-all"
        >
          <PlusCircle size={18} />
          Buat Laporan
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock3 size={22} />}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Diperiksa"
          value={diperiksa}
          icon={<ClipboardCheck size={22} />}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Tindak Lanjut"
          value={tindakLanjut}
          icon={<Wrench size={22} />}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Selesai"
          value={selesai}
          icon={<CheckCircle2 size={22} />}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Ditolak"
          value={ditolak}
          icon={<XCircle size={22} />}
          iconColor="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      <div className="flex gap-3 items-center">
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 flex-1 shadow-sm flex items-center relative">
          <Search size={18} className="absolute left-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari laporan berdasarkan judul aduan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-neutral-800 rounded-xl pl-10 pr-2 py-1 text-sm focus:outline-none placeholder:text-neutral-400"
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-sm flex items-center gap-2 shrink-0">
          <SlidersHorizontal size={16} className="text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-neutral-700 focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diperiksa">Diperiksa</option>
            <option value="tindak_lanjut">Tindak Lanjut</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white text-neutral-500 border border-neutral-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="font-medium">Tidak ada laporan ditemukan</p>
            <p className="text-xs text-neutral-400 mt-1">
              {statusFilter !== "all"
                ? `Tidak ada laporan berstatus "${formatStatusText(statusFilter)}" yang cocok dengan kata kunci Anda.`
                : "Coba gunakan kata kunci pencarian yang lain."}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/laporan/${item.id}`}
              className="block bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-md hover:border-red-100 transition-all duration-200 shadow-sm"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h2 className="font-semibold text-neutral-800 text-base sm:text-lg truncate">
                    {item.title || <span className="text-neutral-400 italic font-normal text-sm">(Belum ada judul draf)</span>}
                  </h2>
                  <p className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                    <span>Dibuat pada:</span>
                    <span className="text-neutral-600">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })} WIB
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${statusColor(
                      item.status
                    )}`}
                  >
                    {formatStatusText(item.status)}
                  </span>
                  <ChevronRight size={18} className="text-neutral-400" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconColor,
  bgColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-w-[120px]">
      <div className={`p-2 rounded-xl w-fit ${bgColor} ${iconColor}`}>
        {icon}
      </div>
      <div className="mt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
          {value}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-neutral-400 mt-0.5 whitespace-nowrap">
          {title}
        </p>
      </div>
    </div>
  );
}