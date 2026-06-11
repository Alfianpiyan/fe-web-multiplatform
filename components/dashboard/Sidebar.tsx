"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Swal from "sweetalert2"; // 1. Import SweetAlert2
import { useAuth } from "@/src/context/AuthContext";
import { menuByRole } from "@/src/utils/getRoleMenus";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role = user?.role || "user";
  const menus = menuByRole[role] || menuByRole.user;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin keluar?",
      text: "Anda akan diarahkan ke halaman login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Warna red-600
      cancelButtonColor: "#64748b", // Warna slate-500
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      logout(); // Panggil fungsi logout dari AuthContext
    }
    console.log("Tombol Logout diklik!")
  };

  const menuClass = (href: string) => {
    // 🌟 KUNCI PERBAIKAN: Pisahkan aturan sub-route untuk menghindari kecocokan ganda
    const isActive =
      href === "/dashboard/laporan"
        ? pathname === href // Menu "Laporan Saya" wajib sama persis URL-nya
        : pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

    return `
      flex items-center gap-3
      px-4 py-3
      rounded-xl
      transition-all
      font-medium
      ${
        isActive
          ? "bg-red-600 text-white shadow-md"
          : "text-slate-700 hover:bg-red-50 hover:text-red-600"
      }
    `;
  };

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="LaporYuk"
            width={100}
            height={100}
            priority
            className=""
          />

          <div>
            <h1 className="text-2xl font-bold text-red-600">
              LaporYuk
            </h1>
            <p className="text-sm text-slate-700">
              Sistem Pengaduan Masyarakat
            </p>
          </div>
        </div>
      </div>

      {/* USER INFO */}
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">
          {user?.userName}
        </h3>
        <p className="text-sm text-red-600 capitalize">
          {role}
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={menuClass(menu.href)}
              >
                <Icon size={20} />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout} // 2. Panggil fungsi handleLogout baru
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-red-600
            text-white
            py-3
            rounded-xl
            font-medium
            hover:bg-red-700
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}