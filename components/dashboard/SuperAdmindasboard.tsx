"use client";

import { useEffect, useState } from "react";
import { Users, UserCog, FileText, CheckCircle2, Clock3 } from "lucide-react";
import DashboardCard from "./DashboardCard";
import DashboardHeader from "./DashboardHeader";
import api from "@/src/lib/AxiosInstance"; // Import interceptor

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/superadmin");
      setData(response.data);
    } catch (error) {
      console.error("Gagal memuat data superadmin:", error);
    }
  };

  if (!data) return <div className="p-6">Memuat dashboard...</div>;

  return (
    <div className="space-y-8">
      <DashboardHeader title="Dashboard Super Admin" description="Monitoring seluruh sistem." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total User" value={data.total_users} icon={Users} />
        <DashboardCard title="Total Admin" value={data.total_admins} icon={UserCog} />
        <DashboardCard title="Total Laporan" value={data.total_laporan} icon={FileText} />
        <DashboardCard title="Selesai" value={data.selesai} icon={CheckCircle2} />
      </div>
      {/* ... (Lanjutkan dengan card status lainnya) ... */}
    </div>
  );
}