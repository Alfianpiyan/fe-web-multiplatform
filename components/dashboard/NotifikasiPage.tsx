"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  MessageSquare, 
  FileText, 
  AlertCircle,
  Clock,
  Trash2,
  Check
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
// 🌟 IMPORT SERVICE NOTIFIKASI
import { 
  getMyNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  deleteAllNotifications
} from "@/services/notificationService";

interface Notifikasi {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: number | boolean; // MySQL biasanya mengembalikan boolean sebagai 0 atau 1
  created_at: string; // Sesuai dengan SELECT * database kamu
  laporan_id?: number;
}

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data asli dari backend saat halaman dimuat
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getMyNotifications();
      // Mengambil data sesuai struktur res.status(200).json({ data: notifications })
      setNotifications(response.data?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data notifikasi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Menandai satu notifikasi telah dibaca
  const handleMarkAsRead = async (notif: Notifikasi) => {
    // Jika sudah dibaca (is_read true / 1), tidak usah hit API lagi
    if (notif.is_read === true || notif.is_read === 1) return;

    try {
      await markNotificationAsRead(notif.id);
      // Update state lokal biar instan tanpa reload halaman
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  // Menandai semua notifikasi telah dibaca
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    }
  };

  // Menghapus satu notifikasi
  const handleDeleteNotif = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Gagal menghapus notifikasi:", error);
    }
  };

  // Menghapus semua notifikasi milik user
  const handleDeleteAllNotif = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat notifikasi?")) return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Gagal menghapus semua notifikasi:", error);
    }
  };

  // Memilih ikon berdasarkan text keyword tipe
  const getIcon = (type: string) => {
    const cleanType = type?.toLowerCase() || "";
    if (cleanType.includes("status") || cleanType.includes("laporan")) {
      return <FileText size={18} className="text-blue-600" />;
    } else if (cleanType.includes("comment") || cleanType.includes("tanggapan") || cleanType.includes("pesan")) {
      return <MessageSquare size={18} className="text-amber-600" />;
    }
    return <AlertCircle size={18} className="text-red-600" />;
  };

  const unreadCount = notifications.filter((n) => n.is_read === false || n.is_read === 0).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1 text-slate-900">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
        <DashboardHeader
          title="Notifikasi"
          description="Pantau pembaruan status laporan dan tanggapan langsung dari petugas."
        />
        
        {/* PANEL TOMBOL AKSI MASSAL */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 md:mt-4 self-start">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                <Check size={14} />
                Baca Semua
              </button>
            )}
            <button
              onClick={handleDeleteAllNotif}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all border border-red-100"
            >
              <Trash2 size={14} />
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* SKELETON LOADING */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        /* KONDISI JIKA KOSONG */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
            <Bell size={24} />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Belum ada pemberitahuan atau riwayat aktivitas saat ini.
          </p>
        </div>
      ) : (
        /* DAFTAR LIST NOTIFIKASI */
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isUnread = notif.is_read === false || notif.is_read === 0;
            return (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif)}
                className={`group bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 transition-all shadow-sm relative ${
                  isUnread 
                    ? "bg-gradient-to-r from-red-50/20 to-transparent border-l-4 border-l-red-600 cursor-pointer" 
                    : "opacity-85 hover:border-slate-300"
                }`}
              >
                {/* Bulatan Ikon Kiri */}
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  notif.type?.includes("status") ? "bg-blue-50" :
                  notif.type?.includes("comment") ? "bg-amber-50" : "bg-red-50"
                }`}>
                  {getIcon(notif.type || notif.title)}
                </div>

                {/* Konten Teks Tengah */}
                <div className="flex-1 min-w-0 pr-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold truncate ${isUnread ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </h3>
                    {/* Bulatan Merah Unread */}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed break-words">
                    {notif.message}
                  </p>

                  {/* Info Waktu (`created_at` dari Database) */}
                  <div className="flex items-center gap-1 text-xs text-slate-400 pt-1">
                    <Clock size={12} />
                    <span>
                      {notif.created_at 
                        ? new Date(notif.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) + " WIB"
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Tombol Hapus Satuan */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Mencegah terpicunya handleMarkAsRead
                    handleDeleteNotif(notif.id);
                  }}
                  className="absolute right-4 top-5 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}