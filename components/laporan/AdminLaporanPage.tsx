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
  SlidersHorizontal,
  FolderPlus,
  Trash2,
  X,
  Pencil,
  Timer,
  ScanSearch,
  Hammer,
  BadgeCheck,
  Ban,
  Globe,
  Lock,
} from "lucide-react";

import { getPublicLaporan } from "@/services/laporanService";
import { updateStatusLaporan } from "@/services/adminService";
import { getAllKategori, createKategori, deleteKategori, updateKategori } from "@/services/adminService";

interface Laporan {
  id: number;
  title: string;
  status: string;
  created_at: string;
  visibility?: "public" | "private";
}

interface Kategori {
  id: number;
  kategori: string;
  description?: string;
}

export default function AdminLaporan() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");
  const [deskripsiKategoriBaru, setDeskripsiKategoriBaru] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const responseLaporan = await getPublicLaporan();
      const resKategori = await getAllKategori();

      const dataLaporan = responseLaporan?.data?.data || responseLaporan?.data || responseLaporan || [];
      setLaporan(Array.isArray(dataLaporan) ? dataLaporan : []);

      const dataKategori = resKategori?.data?.data || resKategori?.data || resKategori || [];
      setKategoriList(Array.isArray(dataKategori) ? dataKategori : []);
    } catch (error) {
      console.error("Gagal fetch dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: number, currentStatus: string) => {
    const newVisibility = e.target.value;
    try {
      await updateStatusLaporan(id, currentStatus, newVisibility);
      alert("Visibilitas laporan berhasil diperbarui!");
      setLaporan((prevLaporan) =>
        prevLaporan.map((item) =>
          item.id === id ? { ...item, visibility: newVisibility as "public" | "private" } : item
        )
      );
    } catch (error: any) {
      alert("Gagal memperbarui visibilitas");
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const statusBaru = e.target.value;
    const laporanSaatIni = laporan.find((item) => item.id === id);
    const visibilityDefault = statusBaru === "selesai" ? (laporanSaatIni?.visibility || "public") : undefined;

    try {
      await updateStatusLaporan(id, statusBaru, visibilityDefault);
      alert("Status laporan berhasil diperbarui!");
      setLaporan((prevLaporan) =>
        prevLaporan.map((item) =>
          item.id === id
            ? {
                ...item,
                status: statusBaru,
                visibility: visibilityDefault ? (visibilityDefault as "public" | "private") : item.visibility,
              }
            : item
        )
      );
    } catch (error: any) {
      const pesanError = error.response?.data?.message || "Gagal memperbarui status";
      alert(`Waduh: ${pesanError}`);
      e.target.value = laporanSaatIni?.status || "pending";
    }
  };

  const handleSubmitKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategoriBaru.trim()) return;

    try {
      if (isEditMode && selectedKategoriId) {
        await updateKategori(selectedKategoriId, {
          kategori: namaKategoriBaru,
          description: deskripsiKategoriBaru,
        });
        alert("Kategori berhasil diperbarui!");
      } else {
        await createKategori({
          kategori: namaKategoriBaru,
          description: deskripsiKategoriBaru,
        });
        alert("Kategori baru berhasil ditambahkan!");
      }

      handleCloseModal();
      fetchAdminData();
    } catch (error: any) {
      const pesanError = error.response?.data?.message || "Gagal memproses kategori";
      alert(`Waduh: ${pesanError}`);
    }
  };

  const handleOpenEditModal = (item: Kategori) => {
    setIsEditMode(true);
    setSelectedKategoriId(item.id);
    setNamaKategoriBaru(item.kategori);
    setDeskripsiKategoriBaru(item.description || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedKategoriId(null);
    setNamaKategoriBaru("");
    setDeskripsiKategoriBaru("");
  };

  const handleDeleteKategori = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus kategori ini?")) return;
    try {
      await deleteKategori(id);
      alert("Kategori berhasil dihapus!");
      fetchAdminData();
    } catch (error: any) {
      alert("Gagal menghapus kategori");
    }
  };

  const pending = laporan.filter((item) => item.status === "pending").length;
  const diperiksa = laporan.filter((item) => item.status === "diperiksa" || item.status === "diverifikasi").length;
  const tindakLanjut = laporan.filter((item) => item.status === "tindak_lanjut").length;
  const selesai = laporan.filter((item) => item.status === "selesai").length;
  const ditolak = laporan.filter((item) => item.status === "ditolak").length;

  const filtered = laporan.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
    const s = item.status?.toLowerCase();

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "diperiksa") return matchesSearch && (s === "diperiksa" || s === "diverifikasi");
    return matchesSearch && s === statusFilter.toLowerCase();
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "diperiksa":
      case "diverifikasi": return "bg-blue-100 text-blue-700 border-blue-200";
      case "tindak_lanjut": return "bg-orange-100 text-orange-700 border-orange-200";
      case "selesai": return "bg-green-100 text-green-700 border-green-200";
      case "ditolak": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-neutral-500 font-medium">
        <div className="animate-pulse">Memuat dashboard manajemen laporan...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 relative text-neutral-900">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600 tracking-tight">Manajemen Laporan Masyarakat</h1>
          <p className="text-neutral-500 mt-1">Validasi, tinjau status aduan masuk, dan kelola kategori layanan</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] self-start sm:self-auto"
        >
          <FolderPlus size={16} />
          <span>Kelola Kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Pending" value={pending} icon={<Clock3 size={22} />} iconColor="text-yellow-600" bgColor="bg-yellow-50" />
        <StatCard title="Diperiksa" value={diperiksa} icon={<ClipboardCheck size={22} />} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="Tindak Lanjut" value={tindakLanjut} icon={<Wrench size={22} />} iconColor="text-orange-600" bgColor="bg-orange-50" />
        <StatCard title="Selesai" value={selesai} icon={<CheckCircle2 size={22} />} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="Ditolak" value={ditolak} icon={<XCircle size={22} />} iconColor="text-red-600" bgColor="bg-red-50" />
      </div>

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
            <p className="font-medium">Tidak ada laporan masuk ditemukan</p>
          </div>
        ) : (
          filtered.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/laporan/${item.id}`}
              className="block bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-md hover:border-red-100 transition-all duration-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h2 className="font-semibold text-neutral-800 text-base sm:text-lg truncate">
                    {item.title}
                  </h2>
                  <p className="text-xs font-medium text-neutral-400">
                    Masuk pada: {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>

                <div
                  className="flex flex-wrap items-center gap-2 self-end sm:self-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(e, item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide border cursor-pointer focus:outline-none transition-all shadow-sm ${statusColor(item.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="diperiksa">Diperiksa</option>
                    <option value="tindak_lanjut">Tindak Lanjut</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>

                  {item.status === "selesai" && (
                    <select
                      value={item.visibility || "public"}
                      onChange={(e) => handleVisibilityChange(e, item.id, item.status)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 cursor-pointer focus:outline-none transition-all shadow-sm animate-in fade-in slide-in-from-left-2 duration-200"
                    >
                      <option value="public">Publik (Semua Orang)</option>
                      <option value="private">Privat (Internal)</option>
                    </select>
                  )}

                  <ChevronRight size={18} className="text-neutral-400 hidden sm:block ml-1" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-lg p-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">{isEditMode ? "Edit Kategori" : "Kelola Kategori"}</h3>
              <button onClick={handleCloseModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitKategori} className="space-y-4 mb-5">
              <input
                type="text"
                placeholder="Nama Kategori"
                value={namaKategoriBaru}
                onChange={(e) => setNamaKategoriBaru(e.target.value)}
                className="border p-2.5 rounded-xl w-full text-sm text-neutral-800"
                required
              />
              <textarea
                placeholder="Deskripsi Kategori"
                value={deskripsiKategoriBaru}
                onChange={(e) => setDeskripsiKategoriBaru(e.target.value)}
                className="border p-2.5 rounded-xl w-full h-20 text-sm text-neutral-800"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-100 text-neutral-700">Batal</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white">Simpan</button>
              </div>
            </form>

            <div className="border-t pt-3 max-h-60 overflow-y-auto space-y-1">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Daftar Aktif</p>
              {kategoriList.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">Belum ada kategori yang terdaftar.</p>
              ) : (
                kategoriList.map((kat) => (
                  <div key={kat.id} className="flex justify-between items-center py-2 px-1 border-b hover:bg-neutral-50 rounded-lg text-sm">
                    <span className="font-medium text-neutral-700">{kat.kategori}</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => handleOpenEditModal(kat)} title="Edit">
                        <Pencil size={14} className="text-blue-500 hover:text-blue-700" />
                      </button>
                      <button type="button" onClick={() => handleDeleteKategori(kat.id)} title="Hapus">
                        <Trash2 size={14} className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, iconColor, bgColor }: any) {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
      <div className={`p-2 rounded-xl w-fit ${bgColor} ${iconColor}`}>{icon}</div>
      <div className="mt-4 text-2xl font-extrabold text-neutral-800">{value}</div>
      <p className="text-xs text-neutral-400 font-medium">{title}</p>
    </div>
  );
}