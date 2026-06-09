"use client";

import { useAuth } from "@/src/context/AuthContext";

import UserDashboard from "@/components/dashboard/UserDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SuperAdminDashboard from "@/components/dashboard/SuperAdmindasboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-6">
        Memuat dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        User tidak ditemukan
      </div>
    );
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  if (user.role === "superadmin") {
    return <SuperAdminDashboard />;
  }

  return <UserDashboard />;
}