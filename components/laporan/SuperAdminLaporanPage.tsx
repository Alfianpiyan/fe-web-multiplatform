"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, PlusCircle, MapPin, Eye, X, SlidersHorizontal } from "lucide-react";
import Swal from "sweetalert2";

import {
  getAllLaporan,
  getAllAdmins,
  createAdminAccount,
  AdminAccount,
} from "@/services/adminService";

interface LaporanItem {
  id: number;
  title: string;
  status: string;
  visibility?: "public" | "private";
  city: string;
  created_at: string;
  kategori?: string;
}

const daftarKota = ["Bandung", "Bogor", "Depok", "Bekasi", "Jakarta", "Tangerang"];

export default function SuperAdminLaporanPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLaporan, setLoadingLaporan] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAdmin, setFormAdmin] = useState({ userName: "", email: "", password: "", city: "" });

  const fetchAdmins = async () => {
    try {
      const res = await getAllAdmins();
      setAdmins(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Gagal memuat daftar admin:", error);
      setAdmins([]);
    }
  };

  const fetchLaporanByCity = async (city: string) => {
    try {
      setLoadingLaporan(true);
      const res = await getAllLaporan(city || undefined);
      const data = res.data?.data || [];
      // Superadmin cuma boleh lihat laporan yang udah berstatus publik
      const onlyPublic = Array.isArray(data)
        ? data.filter((item: LaporanItem) => item.visibility === "public")
        : [];
      setLaporan(onlyPublic);
    } catch (error) {
      console.error("Gagal memuat laporan:", error);
      setLaporan([]);
    } finally {
      setLoadingLaporan(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchAdmins(), fetchLaporanByCity("")]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) fetchLaporanByCity(selectedCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formAdmin.userName.trim() || !formAdmin.email.trim() || !formAdmin.password.trim() || !formAdmin.city) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Nama, email, password, dan wilayah wajib diisi.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createAdminAccount(formAdmin);

      await Swal.fire({
        icon: "success",
        title: "Admin Berhasil Dibuat",
        text: `Akun admin untuk wilayah ${formAdmin.city} berhasil dibuat.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setFormAdmin({ userName: "", email: "", password: "", city: "" });
      setIsModalOpen(false);
      fetchAdmins();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Admin",
        text: error?.response?.data?.message || "Terjadi kesalahan saat membuat akun admin.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-neutral-500 font-medium">
        <div className="animate-pulse">Memuat data manajemen wilayah...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 relative text-neutral-900">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600 tracking-tight">Manajemen Wilayah & Admin</h1>
          <p className="text-neutral-500 mt-1">Kelola akun admin per wilayah dan pantau laporan publik.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Tambah Admin</span>
        </button>
      </div>

      {/* DAFTAR ADMIN */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg text-neutral-800 flex items-center gap-2">
          <Users size={18} className="text-neutral-500" />
          Daftar Admin ({admins.length})
        </h2>

        {admins.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center text-neutral-400 text-sm shadow-sm">
            Belum ada admin yang terdaftar.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((admin) => (
              <div key={admin.id} className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-neutral-800">{admin.userName}</p>
                    <p className="text-xs text-neutral-400">{admin.email}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1 shrink-0">
                    <MapPin size={12} />
                    {admin.city}
                  </span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Laporan dikelola</span>
                  <span className="text-lg font-extrabold text-neutral-800">{admin.total_laporan}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MONITORING LAPORAN PUBLIK */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-bold text-lg text-neutral-800">Laporan Publik per Wilayah</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-sm flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={16} className="text-neutral-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-sm font-medium text-neutral-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="">Semua Wilayah</option>
              {daftarKota.map((kota) => (
                <option key={kota} value={kota}>{kota}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {loadingLaporan ? (
            <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center text-neutral-400 text-sm shadow-sm animate-pulse">
              Memuat laporan...
            </div>
          ) : laporan.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center text-neutral-400 text-sm shadow-sm">
              Belum ada laporan publik untuk wilayah ini.
            </div>
          ) : (
            laporan.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/laporan/${item.id}`}
                className="block bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-md hover:border-red-100 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-semibold text-neutral-800 truncate">{item.title}</h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {item.city} • {item.kategori || "Umum"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold border bg-green-100 text-green-700 border-green-200 capitalize">
                      {item.status}
                    </span>
                    <Eye size={16} className="text-neutral-400" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* MODAL TAMBAH ADMIN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-md p-6 relative z-10">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">Tambah Admin Wilayah</h3>
              <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Nama Admin</label>
                <input
                  type="text"
                  value={formAdmin.userName}
                  onChange={(e) => setFormAdmin({ ...formAdmin, userName: e.target.value })}
                  className="border p-2.5 rounded-xl w-full text-sm text-neutral-800"
                  placeholder="Nama lengkap admin"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Email</label>
                <input
                  type="email"
                  value={formAdmin.email}
                  onChange={(e) => setFormAdmin({ ...formAdmin, email: e.target.value })}
                  className="border p-2.5 rounded-xl w-full text-sm text-neutral-800"
                  placeholder="email@domain.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Password</label>
                <input
                  type="password"
                  value={formAdmin.password}
                  onChange={(e) => setFormAdmin({ ...formAdmin, password: e.target.value })}
                  className="border p-2.5 rounded-xl w-full text-sm text-neutral-800"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Wilayah yang Dikelola</label>
                <select
                  value={formAdmin.city}
                  onChange={(e) => setFormAdmin({ ...formAdmin, city: e.target.value })}
                  className="border p-2.5 rounded-xl w-full text-sm text-neutral-800 bg-transparent cursor-pointer"
                  required
                >
                  <option value="">-- Pilih Wilayah --</option>
                  {daftarKota.map((kota) => (
                    <option key={kota} value={kota}>{kota}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-100 text-neutral-700">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white disabled:bg-neutral-400">
                  {isSubmitting ? "Menyimpan..." : "Simpan Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}