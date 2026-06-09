
"use client";

import { useEffect, useState } from "react";

import {
  FileText,
  Bell,
  Clock3,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import DashboardCard from "./DashboardCard";
import DashboardHeader from "./DashboardHeader";

import {
  getUserDashboard,
} from "@/services/dashboardService";

export default function UserDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response =
        await getUserDashboard();

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) {
    return (
      <div>
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Dashboard"
        description="Pantau seluruh laporan yang telah Anda kirim."
      />

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
    </div>
  );
}