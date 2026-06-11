"use client";

import { useEffect, useState } from "react";
import { FileText, Clock3, ShieldCheck, CheckCircle2, Bell } from "lucide-react";
import DashboardCard from "./DashboardCard";
import DashboardHeader from "./DashboardHeader";
import api from "@/src/lib/AxiosInstance"; // Import interceptor

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Menggunakan api (interceptor)
      const response = await api.get("/dashboard/admin"); 
      setData(response.data);
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    }
  };

  if (!data) return <div className="p-6">Memuat dashboard...</div>;

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Dashboard Admin"
        description="Kelola laporan masyarakat di wilayah Anda."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <DashboardCard title="Total Laporan" value={data.total_laporan} icon={FileText} />
        <DashboardCard title="Pending" value={data.pending} icon={Clock3} />
        <DashboardCard title="Diperiksa" value={data.diperiksa} icon={ShieldCheck} />
        <DashboardCard title="Diverifikasi" value={data.diverifikasi} icon={ShieldCheck} />
        <DashboardCard title="Tindak Lanjut" value={data.tindak_lanjut} icon={Clock3} />
        <DashboardCard title="Selesai" value={data.selesai} icon={CheckCircle2} />
      </div>
      <DashboardCard title="Notifikasi" value={data.unread_notifications} icon={Bell} />
    </div>
  );
}