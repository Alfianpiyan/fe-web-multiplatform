"use client";

import { useAuth } from "@/src/context/AuthContext";

import UserLaporan from "@/components/laporan/UserLaporanPage";
import AdminLaporan from "@/components/laporan/AdminLaporanPage";
// import SuperAdminLaporan from "@/components/laporan/SuperAdminLaporan";

export default function LaporanPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "user":
      return <UserLaporan />;

    case "admin":
      return <AdminLaporan />;

    case "superadmin":
      return <SuperAdminLaporan />;

    default:
      return null;
  }
}