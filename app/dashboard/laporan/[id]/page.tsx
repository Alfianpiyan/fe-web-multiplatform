"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Send,
  User as UserIcon
} from "lucide-react";

// Hubungkan dengan file service satu pintu kita
import { getDetailLaporan, createPublicComment, getPublicComments } from "@/services/laporanService";

interface LaporanDetail {
  id: number;
  title: string;
  report_description: string;
  city: string;
  location_description: string;
  status: string;
  visibility: string;
  created_at: string;
  userName?: string;
  kategori?: string;
  images?: Array<{ id: number; image_url: string }>;
}

interface Diskusi {
  id: number;
  user_id?: number;
  user_name: string;
  role: string;
  message: string;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetailLaporanPage({ params }: PageProps) {
  // Unwrapping params sesuai aturan Next.js terbaru
  const { id } = use(params);

  const [laporan, setLaporan] = useState<LaporanDetail | null>(null);
  const [buktiImages, setBuktiImages] = useState<any[]>([]);
  const [diskusiList, setDiskusiList] = useState<Diskusi[]>([]);
  const [inputPesan, setInputPesan] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulasi data user login (Sesuaikan dengan implementasi Auth/Context kamu sendiri)
  const [currentUser, setCurrentUser] = useState<any>({
    id: 1,
    userName: "Kayla",
    role: "user"
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Ambil Data Detail Laporan
      const responseDetail = await getDetailLaporan(id);
      const dataLaporan = responseDetail.data?.data || responseDetail.data;
      setLaporan(dataLaporan);

      // 🔍 AMANKAN DATA GAMBAR BUKTI (Mencegah error .startsWith atau crash)
      if (dataLaporan && Array.isArray(dataLaporan.images)) {
        setBuktiImages(dataLaporan.images);
      } else {
        setBuktiImages([]);
      }

      // 2. Ambil Data Komentar / Diskusi Publik
      const responseKomentar = await getPublicComments(id);
      const dataKomentar = responseKomentar.data?.data || responseKomentar.data || [];
      setDiskusiList(Array.isArray(dataKomentar) ? dataKomentar : []);

    } catch (error) {
      console.error("❌ Gagal memuat halaman detail aduan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKirimKomentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPesan.trim()) return;

    try {
      const response = await createPublicComment(id, inputPesan);
      
      // ✅ PERBAIKAN RED UNDERLINE PADA 'user':
      // Gunakan properti fallback yang aman agar TS tidak protes properti undefined
      const namaPengirim = currentUser?.userName || currentUser?.name || "Anonim";
      
      setDiskusiList((prev) => [
        ...prev,
        response.data?.data || {
          id: Date.now(),
          user_id: currentUser?.id,
          user_name: namaPengirim,
          role: currentUser?.role || "user",
          message: inputPesan,
          created_at: new Date().toISOString(),
        },
      ]);
      
      setInputPesan("");
    } catch (error) {
      console.error("Gagal mengirim pesan diskusi:", error);
      alert("Gagal mengirim komentar, silakan coba lagi.");
    }
  };

  const statusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "diperiksa": return "bg-blue-100 text-blue-700 border-blue-200";
      case "tindak_lanjut": return "bg-orange-100 text-orange-700 border-orange-200";
      case "selesai": return "bg-green-100 text-green-700 border-green-200";
      case "ditolak": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-neutral-500 font-medium bg-neutral-50">
        <div className="animate-pulse">Memuat detail penanganan aduan...</div>
      </div>
    );
  }

  if (!laporan) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-neutral-500 bg-neutral-50 space-y-4">
        <p className="font-bold text-lg">Waduh, Data Aduan Tidak Ditemukan!</p>
        <Link href="/dashboard/admin/laporan" className="text-sm text-blue-600 hover:underline">Kembali ke list dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 p-4 sm:p-8 text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Tombol Kembali */}
        <Link 
          href="/dashboard/admin/laporan" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-4 py-2 rounded-xl shadow-sm transition-all w-fit"
        >
          <ChevronLeft size={16} />
          <span>Kembali</span>
        </Link>

        {/* Judul & ID Aduan */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 capitalize">{laporan.title}</h1>
          <p className="text-sm font-bold text-neutral-400">ID Aduan: <span className="text-neutral-600">#LY-{laporan.id}</span></p>
        </div>

        {/* Grid Layout Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* KOLOM KIRI: Detail Informasi & Deskripsi (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Box Informasi Detail */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-lg border">
                  📂 {laporan.kategori || "Fasilitas Umum"}
                </span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border capitalize tracking-wide ${statusColor(laporan.status)}`}>
                  ⏱️ {laporan.status?.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-neutral-800 text-lg">Deskripsi Kejadian</h3>
                <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">{laporan.report_description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-50 rounded-xl border text-neutral-500 shrink-0"><MapPin size={18} /></div>
                  <div>
                    <p className="font-bold text-neutral-800">{laporan.city || "Kota Bandung"}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{laporan.location_description || "Lokasi spesifik tidak diisi"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-50 rounded-xl border text-neutral-500 shrink-0"><Calendar size={18} /></div>
                  <div>
                    <p className="font-bold text-neutral-800">Waktu Kejadian</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {laporan.created_at ? new Date(laporan.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box Sektor Diskusi / Komentar */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-800 text-lg flex items-center gap-2">
                <MessageSquare size={18} className="text-neutral-500" />
                <span>Ruang Diskusi Publik</span>
              </h3>

              {/* Form Input Komentar */}
              <form onSubmit={handleKirimKomentar} className="flex gap-2">
                <input
                  type="text"
                  value={inputPesan}
                  onChange={(e) => setInputPesan(e.target.value)}
                  placeholder="Tulis tanggapan atau pertanyaan publik mengenai aduan ini..."
                  className="flex-1 bg-neutral-50 border border-neutral-200 text-sm rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button 
                  type="submit" 
                  className="bg-neutral-900 hover:bg-neutral-800 text-white p-3 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </form>

              {/* List Komentar-komentar */}
              <div className="space-y-3 pt-2 max-h-80 overflow-y-auto pr-1">
                {diskusiList.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic text-center py-4">Belum ada diskusi terbuka pada laporan ini.</p>
                ) : (
                  diskusiList.map((chat) => (
                    <div key={chat.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-800 text-xs sm:text-sm">{chat.user_name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 font-bold rounded capitalize ${
                            chat.role === "admin" || chat.role === "superadmin" ? "bg-red-100 text-red-700" : "bg-neutral-200 text-neutral-600"
                          }`}>
                            {chat.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(chat.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{chat.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Lampiran Bukti Foto (Span 1) */}
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <UserIcon size={14} />
              <span>Lampiran Bukti User</span>
            </h3>

            {buktiImages.length === 0 ? (
              <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/50">
                <svg className="w-8 h-8 mb-2 stroke-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium text-center">Tidak ada lampiran foto bukti dari pelapor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {buktiImages.map((img) => (
                  <div key={img.id} className="relative group overflow-hidden rounded-xl border border-neutral-200/70 aspect-video bg-neutral-100">
                    <img
                      src={img.image_url} 
                      alt="Bukti Pengaduan"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=600&auto=format&fit=crop"; 
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}