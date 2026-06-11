"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Clock3,
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter,
  FolderPlus,
  Trash2,
  ListFilter,
} from "lucide-react";

import { getAllLaporan, getAllKategori, createKategori, deleteKategori } from "@/services/adminService";

interface Laporan {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface Kategori {
  id: number;
  kategori: string;
}

export default function AdminLaporan() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [newKategori, setNewKategori] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [responseLaporan, responseKategori] = await Promise.all([
        getAllLaporan(),
        getAllKategori(),
      ]);

      setLaporan(
        Array.isArray(responseLaporan.data?.data)
          ? responseLaporan.data.data
          : []
      );
      
      setKategoriList(
        Array.isArray(responseKategori.data?.data)
          ? responseKategori.data.data
          : []
      );
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
      setLaporan([]);
      setKategoriList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKategori = async () => {
    if (!newKategori.trim()) return;
    try {
      await createKategori({ kategori: newKategori });
      setNewKategori("");
      // Refresh data kategori setelah berhasil ditambahkan
      const responseKategori = await getAllKategori();
      setKategoriList(
        Array.isArray(responseKategori.data?.data) ? responseKategori.data.data : []
      );
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
    }
  };

  const handleDeleteKategori = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;
    try {
      await deleteKategori(id);
      // Refresh data kategori setelah berhasil dihapus
      const responseKategori = await getAllKategori();
      setKategoriList(
        Array.isArray(responseKategori.data?.data) ? responseKategori.data.data : []
      );
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
    }
  };

  // Menghitung statistik berdasarkan semua laporan masuk (Sama seperti user page)
  const pending = laporan.filter((item) => item.status === "pending").length;
  const diperiksa = laporan.filter((item) => item.status === "diperiksa" || item.status === "diverifikasi").length;
  const tindakLanjut = laporan.filter((item) => item.status === "tindak_lanjut").length;
  const selesai = laporan.filter((item) => item.status === "selesai").length;
  const ditolak = laporan.filter((item) => item.status === "ditolak").length;

  // Logika Filter Sinkron
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

  // Helper warna badge status (Sama persis dengan user page)
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

  // Helper merapikan teks enum status database (Sama persis dengan user page)
  const formatStatusText = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-neutral-500 font-medium">
        <div className="animate-pulse">Memuat dashboard manajemen laporan...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600 tracking-tight">
            Manajemen Laporan Masyarakat
          </h1>
          <p className="text-neutral-500 mt-1">
            Validasi, tinjau status aduan masuk, dan kelola kategori layanan aduan
          </p>
        </div>
      </div>

      {/* Fitur Tambahan: Manajemen Kategori */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-800 font-semibold text-base">
          <FolderPlus size={18} className="text-red-600" />
          <h2>Kelola Kategori Aduan</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Ketik nama kategori baru (contoh: Infrastruktur, Keamanan)..."
            value={newKategori}
            onChange={(e) => setNewKategori(e.target.value)}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-all text-neutral-800"
          />
          <button
            onClick={handleAddKategori}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            Tambah Kategori
          </button>
        </div>

        {/* Badge List Kategori */}
        <div className="flex flex-wrap gap-2 pt-1">
          {kategoriList.length === 0 ? (
            <p className="text-xs italic text-neutral-400">Belum ada kategori yang dibuat.</p>
          ) : (
            kategoriList.map((kat) => (
              <div
                key={kat.id}
                className="bg-neutral-100 text-neutral-700 border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all"
              >
                <span>{kat.kategori}</span>
                <button
                  onClick={() => handleDeleteKategori(kat.id)}
                  className="text-neutral-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistik Atas (Sama seperti user page) */}
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

      {/* Bar Pencarian & Dropdown Filter Bersandingan (Sama seperti user page) */}
      <div className="flex gap-3 items-center">
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 flex-1 shadow-sm flex items-center relative">
          <Search size={18} className="absolute left-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari aduan masuk berdasarkan judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-neutral-800 rounded-xl pl-10 pr-2 py-1 text-sm focus:outline-none placeholder:text-neutral-400"
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-sm flex items-center gap-2 shrink-0">
          <Filter size={16} className="text-neutral-400" />
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

      {/* List Laporan Admin */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white text-neutral-500 border border-neutral-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="font-medium">Tidak ada laporan masuk ditemukan</p>
            <p className="text-xs text-neutral-400 mt-1">
              {statusFilter !== "all" 
                ? `Tidak ada laporan masuk berstatus "${formatStatusText(statusFilter)}" yang cocok.` 
                : "Belum ada laporan dari masyarakat atau kata kunci salah."}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/admin/laporan/${item.id}`} // Sesuaikan rute ke halaman review/detail admin kamu
              className="block bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-md hover:border-red-100 transition-all duration-200 shadow-sm"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h2 className="font-semibold text-neutral-800 text-base sm:text-lg truncate">
                    {item.title || <span className="text-neutral-400 italic font-normal text-sm">(Tanpa Judul)</span>}
                  </h2>
                  <p className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                    <span>Masuk pada:</span>
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

// Komponen StatCard (Sama persis dengan user page)
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