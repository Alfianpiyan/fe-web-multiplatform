"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Clock3, ShieldCheck, CheckCircle2, Bell, Eye, ArrowRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import DashboardHeader from "./DashboardHeader";
import api from "@/src/lib/AxiosInstance";

import { getPublicLaporan } from "@/services/laporanService";

interface Laporan {
  id: number;
  title: string;
  status: string;
  created_at: string;
  kategori?: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Ambil data statistik card
      const statsResponse = await api.get("/dashboard/admin");
      setData(statsResponse.data.data);

      // Ambil data dari service yang terbukti bersih dan valid
      const reportsResponse = await getPublicLaporan();
      const dataLaporan = reportsResponse?.data?.data || reportsResponse?.data || reportsResponse || [];

      if (Array.isArray(dataLaporan)) {
        // Filter di frontend: Hanya ambil yang berstatus 'pending' dan batasi maksimal 5 baris
        const hanyaPending = dataLaporan.filter((report: any) => report.status === "pending");
        setRecentReports(hanyaPending.slice(0, 5));
      } else {
        setRecentReports([]);
      }

    } catch (error) {
      console.error("Gagal memuat data dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-slate-500 font-medium">
        <div className="animate-pulse">Memuat data pusat kendali...</div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-500 font-medium">Gagal memuat data dashboard.</div>;

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-slate-900">

      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-200 pb-5">
        <DashboardHeader
          title="Dashboard Admin"
          description="Pantau statistik wilayah dan segera tindak lanjuti aduan masuk."
        />
        <button
          onClick={fetchDashboardData}
          className="self-start sm:self-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2"
        >
          Refresh Data
        </button>
      </div>

      {/* 1. GRID STATISTIK UTAMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardCard title="Total Laporan" value={data.total_laporan || 0} icon={FileText} variant="blue" />
        <DashboardCard title="Pending" value={data.pending || 0} icon={Clock3} variant="default" />
        <DashboardCard title="Diperiksa" value={data.diperiksa || 0} icon={ShieldCheck} variant="warning" />
        <DashboardCard title="Diverifikasi" value={data.diverifikasi || 0} icon={ShieldCheck} variant="warning" />
        <DashboardCard title="Tindak Lanjut" value={data.tindak_lanjut || 0} icon={Clock3} variant="blue" />
        <DashboardCard title="Selesai" value={data.selesai || 0} icon={CheckCircle2} variant="success" />
      </div>

      {/* LAYOUT KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2. TABEL ADUAN TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Perlu Tindak Lanjut Segera</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daftar aduan masyarakat yang belum diproses.</p>
              </div>
              <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {data.pending || 0} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              {recentReports.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                      <th className="p-4">Judul Aduan</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {recentReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-semibold text-slate-900 max-w-[200px] truncate">
                          {report.title?.trim() ? report.title : <span className="text-slate-400 italic font-normal">Tanpa Judul</span>}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                            {report.kategori?.name || "Umum"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                          {new Date(report.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="p-4 text-center">
                          {/* MENGGUNAKAN NEXT/LINK UNTUK AMBIL DETAIL STRUKTUR DINAMIS */}
                          <Link
                            href={`/dashboard/laporan/${report.id}`}
                            className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                  Semua aduan masyarakat sudah diperiksa! Kerja bagus.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/laporan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Buka Halaman Kelola Laporan <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* 3. SIDEBAR KANAN */}
        <div className="space-y-6">
          {/* Box Notifikasi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Notifikasi Masuk</h4>
                <p className="text-xs text-slate-500">Pemberitahuan sistem terbaru.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">
              <span className="block text-3xl font-extrabold text-slate-900">{data.unread_notifications || 0}</span>
              <span className="text-xs text-slate-500 font-medium mt-1 block">Pemberitahuan Belum Dibaca</span>
            </div>
          </div>

          {/* Box Akses Cepat */}
          
        </div>

      </div>

    </div>
  );
}