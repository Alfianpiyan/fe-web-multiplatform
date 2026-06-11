"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  IdCard, 
  LogOut, 
  KeyRound, 
  CheckCircle2 
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader"; // Sesuaikan path komponen header kamu

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // State formal jika kedepannya kamu mau tambah fitur update profile
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
  });

  const role = user?.role || "user";

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-1 text-slate-900">
      {/* HEADER HALAMAN */}
      <DashboardHeader
        title="Profil Saya"
        description="Manajemen informasi data diri dan pengaturan keamanan akun Anda."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* KARTU AVATAR / RINGKASAN PROFIL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-inner group">
            <User size={44} className="text-red-600 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-800 truncate">
              {user?.userName || "Nama Pengguna"}
            </h2>
            <p className="text-xs font-semibold px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full inline-block capitalize mt-1 border border-red-100">
              {role} LaporYuk
            </p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Akun Anda terdaftar aktif sebagai masyarakat pelapor yang sah dalam sistem pengaduan.
          </p>
          
          <div className="pt-2">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
            >
              <LogOut size={16} />
              Keluar dari Akun
            </button>
          </div>
        </div>

        {/* FORM INFORMASI DETAIL AKUN */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800 tracking-tight">
              Informasi Personal
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Data resmi akun yang digunakan untuk validasi laporan aduan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field Nama */}
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500">
                <User size={16} className="text-slate-400" />
                <span className="text-xs font-medium">Nama Lengkap</span>
              </div>
              <p className="font-semibold text-sm text-slate-800">
                {user?.userName || "-"}
              </p>
            </div>

            {/* Field Email */}
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail size={16} className="text-slate-400" />
                <span className="text-xs font-medium">Alamat Email</span>
              </div>
              <p className="font-semibold text-sm text-slate-800 truncate">
                {user?.email || "-"}
              </p>
            </div>

            {/* Field Otoritas / Role */}
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Shield size={16} className="text-slate-400" />
                <span className="text-xs font-medium">Hak Akses Sistem</span>
              </div>
              <p className="font-semibold text-sm text-slate-800 capitalize flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-600" />
                {role}
              </p>
            </div>

            {/* Field ID Akun (Opsional/Dummy Identitas) */}
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500">
                <IdCard size={16} className="text-slate-400" />
                <span className="text-xs font-medium">User ID Status</span>
              </div>
              <p className="font-mono text-xs font-semibold text-slate-700">
                LY-{user?.id || "N/A"}-{role.toUpperCase()}
              </p>
            </div>
          </div>

          {/* SECTION KEAMANAN AKUN */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-800 tracking-tight flex items-center gap-2">
                <KeyRound size={18} className="text-slate-400" />
                Keamanan & Password
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gunakan password yang kuat demi menjaga kerahasiaan data laporan Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50/30">
              <div>
                <p className="text-sm font-semibold text-slate-800">Kata Sandi Akun</p>
                <p className="text-xs text-slate-500 mt-0.5">Terakhir diubah: Sudah dikunci oleh sistem enkripsi</p>
              </div>
              <button
                type="button"
                onClick={() => alert("Fitur ubah password dapat kamu integrasikan dengan endpoint API auth/update-password ya, bre!")}
                className="px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm text-center"
              >
                Ubah Password
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}