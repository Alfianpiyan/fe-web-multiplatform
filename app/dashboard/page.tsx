"use client";

import { useAuth } from "@/src/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute"; // 1. Import komponen kunci
import UserDashboard from "@/components/dashboard/UserDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SuperAdminDashboard from "@/components/dashboard/SuperAdmindasboard";

export default function DashboardPage() {
  const { user } = useAuth(); // Loading sudah dihandle di ProtectedRoute

  // 2. Bungkus dengan ProtectedRoute
  return (
    <ProtectedRoute>
      {/* Di sini, saat komponen ini sampai ke tahap render, 
        kita sudah yakin 'user' pasti ada karena sudah lolos dari ProtectedRoute.
      */}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "superadmin" && <SuperAdminDashboard />}
      {user?.role === "user" && <UserDashboard />}
    </ProtectedRoute>
  );
}