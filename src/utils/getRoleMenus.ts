import { BarChart3, Bell, FileText, LayoutDashboard, PlusCircle, User, Users } from "lucide-react";

export const menuByRole = {
  user: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Buat Laporan",
      href: "/dashboard/laporan/create",
      icon: PlusCircle,
    },
    {
      name: "Laporan Saya",
      href: "/dashboard/laporan",
      icon: FileText,
    },
    {
      name: "Notifikasi",
      href: "/dashboard/notifikasi",
      icon: Bell,
    },
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: User,
    },
  ],

  admin: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kelola Laporan",
      href: "/dashboard/laporan",
      icon: FileText,
    },
    {
      name: "Notifikasi",
      href: "/dashboard/notifikasi",
      icon: Bell,
    },
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: User,
    },
  ],

  superadmin: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kelola Laporan",
      href: "/dashboard/laporan",
      icon: FileText,
    },
    {
      name: "Kelola Admin",
      href: "/dashboard/admin",
      icon: Users,
    },
    {
      name: "Statistik",
      href: "/dashboard/statistik",
      icon: BarChart3,
    },
    {
      name: "Notifikasi",
      href: "/dashboard/notifikasi",
      icon: Bell,
    },
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: Users,
    },
  ],
};