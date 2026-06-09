"use client";

import { useEffect, useState } from "react";

import {
  Users,
  UserCog,
  FileText,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import DashboardCard from "./DashboardCard";
import DashboardHeader from "./DashboardHeader";

import {
  getSuperAdminDashboard,
} from "@/services/dashboardService";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response =
        await getSuperAdminDashboard();

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) {
    return <div>Memuat dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Dashboard Super Admin"
        description="Monitoring seluruh sistem LaporYuk."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard
          title="Total User"
          value={data.total_users}
          icon={Users}
        />

        <DashboardCard
          title="Total Admin"
          value={data.total_admins}
          icon={UserCog}
        />

        <DashboardCard
          title="Total Laporan"
          value={data.total_laporan}
          icon={FileText}
        />

        <DashboardCard
          title="Selesai"
          value={data.selesai}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        <DashboardCard
          title="Pending"
          value={data.pending}
          icon={Clock3}
        />

        <DashboardCard
          title="Diperiksa"
          value={data.diperiksa}
          icon={Clock3}
        />

        <DashboardCard
          title="Diverifikasi"
          value={data.diverifikasi}
          icon={Clock3}
        />

        <DashboardCard
          title="Tindak Lanjut"
          value={data.tindak_lanjut}
          icon={Clock3}
        />
      </div>
    </div>
  );
}