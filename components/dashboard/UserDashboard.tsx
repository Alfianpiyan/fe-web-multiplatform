"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Bell,
  Clock3,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Eye,
  MapPin,
  Calendar,
  User,
} from "lucide-react";

import DashboardCard from "./DashboardCard";
import DashboardHeader from "./DashboardHeader";

import { getUserDashboard } from "@/services/dashboardService";
// 🌟 IMPORT SERVICE: Ambil getMyLaporan dan getPublicLaporan
import { getPublicLaporan, getMyLaporan } from "@/src/lib/laporan";

export default function UserDashboard() {
  const [data, setData] = useState<any>(null);
  const [latestMyLaporan, setLatestMyLaporan] = useState<any>(null); // State untuk 1 laporan terbaru user
  const [publicFeed, setPublicFeed] = useState<any[]>([]); // State penyimpan feed publik
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboard();
    fetchLatestMyLaporan();
    fetchPublicFeed();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getUserDashboard();
      setData(response.data);
    } catch (error) {
      console.error("Gagal memuat statistik dashboard:", error);
    }
  };

  // 🌟 AMBIL DATA: 1 Laporan terbaru milik user sendiri
  const fetchLatestMyLaporan = async () => {
    try {
      const response = await getMyLaporan();
      const listLaporan = response.data?.data || response.data || [];

      // Karena biasanya API return data terurut dari yang terbaru (descending), 
      // kita ambil index ke-0 (paling atas)
      if (listLaporan.length > 0) {
        setLatestMyLaporan(listLaporan[0]);
      }
    } catch (error) {
      console.error("Gagal memuat laporan terbaru user:", error);
    }
  };

  // AMBIL DATA: Laporan Publik
  const fetchPublicFeed = async () => {
    try {
      setLoadingFeed(true);
      const response = await getPublicLaporan();
      setPublicFeed(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Gagal memuat feed laporan publik:", error);
    } finally {
      setLoadingFeed(false);
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-slate-500 font-medium">
        <div className="animate-pulse">Memuat statistik dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-1 text-slate-900">
      {/* HEADER */}
      <DashboardHeader
        title="Dashboard"
        description="Pantau seluruh laporan yang telah Anda kirim."
      />

      {/* GRID STATISTIK BARIS 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Laporan"
          value={data.total_laporan}
          icon={FileText}
        />
        <DashboardCard
          title="Draft"
          value={data.draft}
          icon={ClipboardList}
        />
        <DashboardCard
          title="Pending"
          value={data.pending}
          icon={Clock3}
        />
        <DashboardCard
          title="Notifikasi"
          value={data.unread_notifications}
          icon={Bell}
        />
      </div>

      {/* GRID STATISTIK BARIS 2 */}
      <div className="grid xl:grid-cols-3 gap-5">
        <DashboardCard
          title="Diperiksa"
          value={data.diperiksa}
          icon={ShieldCheck}
        />
        <DashboardCard
          title="Tindak Lanjut"
          value={data.tindak_lanjut}
          icon={Clock3}
        />
        <DashboardCard
          title="Selesai"
          value={data.selesai}
          icon={CheckCircle2}
        />
      </div>

      {/* 🌟 BAGIAN BARU: 1 LAPORAN TERBARU SAYA 🌟 */}
      {latestMyLaporan && (
        <div className="pt-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              Aduan Terakhir Saya
            </h2>
            <p className="text-sm text-slate-500">
              Laporan terakhir yang baru saja Anda kirimkan ke sistem.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50/50 to-transparent border border-red-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">
                  {latestMyLaporan.kategori?.name || "Aduan Saya"}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${latestMyLaporan.status === 'selesai' ? 'bg-green-100 text-green-700' :
                    latestMyLaporan.status === 'tindak_lanjut' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                  }`}>
                  {latestMyLaporan.status || "Pending"}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 truncate">
                {latestMyLaporan.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {latestMyLaporan.report_description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{latestMyLaporan.city || "Lokasi Kejadian"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  <span>
                    {(() => {
                      // Ambil tanggal dari properti yang ada di dalam objek laporan
                      const rawDate = latestMyLaporan.waktu_kejadian || latestMyLaporan.createdAt || latestMyLaporan.created_at;
                      if (!rawDate) return "Tanggal tidak tercatat";

                      const dateObj = new Date(rawDate);
                      return isNaN(dateObj.getTime())
                        ? "Format tanggal salah"
                        : dateObj.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) + " WIB";
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end md:border-l md:border-slate-200 md:pl-6">
              <a
                href={`/dashboard/laporan/me/${latestMyLaporan.id}`} // Arahkan ke detail privat milik saya sendiri
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Eye size={16} />
                Pantau Progress
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FEED LAPORAN PUBLIK */}
      {/* FEED LAPORAN PUBLIK */}
<div className="pt-4 space-y-4">
  <div>
    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
      Aduan Publik Terbaru
    </h2>
    <p className="text-sm text-slate-500">
      Daftar laporan masyarakat yang bersifat publik dan transparan.
    </p>
  </div>

  {loadingFeed ? (
    /* 🛠️ SKELETON LOADING MENYAMPING */
    <div className="flex flex-nowrap gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 animate-pulse min-w-[300px] md:min-w-[400px] max-w-[400px] flex-shrink-0"
        >
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-16 bg-slate-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  ) : publicFeed.length === 0 ? (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
      Belum ada aduan publik yang diterbitkan saat ini.
    </div>
  ) : (
    /* 🛠️ GRID UTAMA JADI MENYAMPING (FLEX ROW) */
    <div className="flex flex-nowrap gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scroll-smooth snap-x">
      {publicFeed.map((laporan: any) => (
        <div
          key={laporan.id}
          className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group min-w-[300px] md:min-w-[400px] max-w-[400px] flex-shrink-0 snap-contained"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                {laporan.kategori?.name || "Aduan Umum"}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${laporan.status === 'selesai' ? 'bg-green-50 text-green-600' :
                  laporan.status === 'tindak_lanjut' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                }`}>
                {laporan.status || "Pending"}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-1">
                {laporan.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-3 mt-1 leading-relaxed">
                {laporan.report_description}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate max-w-[100px] md:max-w-[120px]">{laporan.city || "Lokasi Rahasia"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {laporan.waktu_kejadian
                    ? new Date(laporan.waktu_kejadian).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                    : "-"}
                </span>
              </div>
            </div>

            <a
              href={`/dashboard/laporan/${laporan.id}`}
              className="flex items-center gap-1 font-semibold text-red-600 hover:text-red-700 transition-colors flex-shrink-0"
            >
              <Eye size={14} />
              Lihat
            </a>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}