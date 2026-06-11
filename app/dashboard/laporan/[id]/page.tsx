"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  Clock, 
  Image as ImageIcon, 
  Send, 
  ArrowLeft,
  UploadCloud,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { 
  getDetailLaporan, 
  uploadProgressImage, 
  getDiskusiLaporan, 
  kirimPesanDiskusi,
  getProgressImages
} from "@/services/laporanService";

export default function DetailLaporanPage() {
const { id } = useParams() as { id: string };

  const router = useRouter();
  const { user } = useAuth(); // Ambil data user login global
  const isAdmin = user?.role === "admin"; // Cek role

  const [laporan, setLaporan] = useState<any>(null);
  const [progressImages, setProgressImages] = useState<string[]>([]);
  const [diskusi, setDiskusi] = useState<any[]>([]);
  const [inputPesan, setInputPesan] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load seluruh data dari backend
 const loadData = async () => {
  try {
    setLoading(true);
    
    // Kita panggil 3 data sekaligus secara paralel
    const [resDetail, resDiskusi, resProgress] = await Promise.all([
      getDetailLaporan(id),
      getDiskusiLaporan(id),
      getProgressImages(id) // Ambil data foto progres dari tabel progress
    ]);
    
    // Set data detail laporan
    setLaporan(resDetail.data?.data || resDetail.data);
    
    // Set data diskusi private (internal-comment)
    setDiskusi(resDiskusi.data?.data || []);
    
    // Set data progress gambar dari endpoint progress tersendiri
    setProgressImages(resProgress.data?.data || []);
    
  } catch (error) {
    console.error("Gagal memuat seluruh data komponen laporan:", error);
  } finally {
    setLoading(false);

    
    console.log("ID yang dikirim ke backend:", id);
    // Tambahkan baris ini di dalam loadData atau sebelum return JSX
console.log("Isi data laporan yang diterima:", laporan);
console.log("Path gambar yang terbaca:", laporan?.image_url || laporan?.images || laporan?.image);
}
};

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // Auto-scroll diskusi ke bagian paling bawah tiap ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [diskusi]);

  // Fungsi Kirim Pesan Diskusi
  const handleKirimPesan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPesan.trim()) return;

    try {
      const response = await kirimPesanDiskusi(id, inputPesan);
      // Append pesan baru ke state lokal biar instan muncul di layar
      setDiskusi((prev) => [...prev, response.data?.data || {
        id: Date.now(),
        user_id: user?.id,
        user_name: user?.userName,
        role: user?.role,
        message: inputPesan,
        created_at: new Date().toISOString()
      }]);
      setInputPesan("");
    } catch (error) {
      console.error("Gagal mengirim pesan diskusi:", error);
    }
  };

  // Fungsi Admin Upload Gambar Progres
  const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("image", files[0]);

    try {
      setUploading(true);
      const response = await uploadProgressImage(id, formData);
      // Ambil URL gambar baru hasil return backend, masukkan ke daftar preview
      const newImageUrl = response.data?.data?.url || response.data?.url;
      if (newImageUrl) {
        setProgressImages((prev) => [...prev, newImageUrl]);
      }
    } catch (error) {
      console.error("Gagal mengunggah foto progres:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-slate-500 font-medium">
        <div className="animate-pulse">Memuat detail data laporan...</div>
      </div>
    );
  }

  if (!laporan) {
    return (
      <div className="text-center p-8 bg-white border rounded-2xl text-slate-500">
        Laporan tidak ditemukan atau Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1 text-slate-900">
      {/* TOMBOL KEMBALI */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* HEADER */}
      <DashboardHeader 
        title={laporan.title} 
        description={`ID Aduan: #LY-${laporan.id}`}
      />

      {/* GRID UTAMA INFO ADUAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: DETAIL TEKS LAPORAN */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg flex items-center gap-1">
              <Tag size={12} /> {laporan.kategori?.name || "Aduan Umum"}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize flex items-center gap-1 ${
              laporan.status === 'selesai' ? 'bg-green-100 text-green-700' :
              laporan.status === 'tindak_lanjut' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock size={12} /> {laporan.status || "Pending"}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-800">Deskripsi Kejadian</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {laporan.report_description}
            </p>
          </div>

          {/* META DATA LOKASI & WAKTU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><MapPin size={14}/> Lokasi</span>
              <p className="font-semibold text-slate-800">{laporan.city || "-"}</p>
              <p className="text-xs text-slate-500 leading-tight">{laporan.location_description || "Tidak ada detail patokan"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Calendar size={14}/> Waktu Kejadian</span>
              <p className="font-semibold text-slate-800">
                {laporan.waktu_kejadian ? new Date(laporan.waktu_kejadian).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FOTO UTAMA BUKTI ADUAN */}
        {/* KOLOM KANAN: FOTO UTAMA BUKTI ADUAN */}
<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
  <h3 className="font-bold text-sm text-slate-500 tracking-wider uppercase flex items-center gap-1">
    <ImageIcon size={16} /> Lampiran Bukti User
  </h3>
  
  {(() => {
    // 1. Ambil data mentah dari field yang mungkin muncul di backend
    const rawImage = laporan.image_url || laporan.images || laporan.image;
    
    if (!rawImage) {
      return (
        <div className="aspect-video w-full rounded-xl border border-dashed flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 text-xs">
          <ImageIcon size={28} className="mb-1 text-slate-300" />
          Tidak ada lampiran foto bukti dari user.
        </div>
      );
    }

    // 2. Normalisasi data (menangani string array, JSON string, atau string biasa)
    let imageUrl = "";
    if (typeof rawImage === "string") {
      try {
        if (rawImage.startsWith("[")) {
          const parsed = JSON.parse(rawImage);
          imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
        } else {
          imageUrl = rawImage;
        }
      } catch (e) {
        imageUrl = rawImage;
      }
    } else if (Array.isArray(rawImage)) {
      imageUrl = rawImage[0];
    } else {
      imageUrl = String(rawImage);
    }

    // 3. Pengecekan aman: Tambahkan base URL jika path bersifat relatif
    if (typeof imageUrl === "string" && imageUrl.length > 0) {
       const isFullUrl = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
       
       if (!isFullUrl) {
         const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
         const prefix = imageUrl.startsWith("/") ? "" : "/";
         imageUrl = `${backendUrl}${prefix}${imageUrl}`;
       }
    }

    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-slate-100 group">
        <img 
          src={imageUrl} 
          alt="Bukti Laporan Awal dari User" 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Gambar fallback jika URL benar-benar tidak ditemukan
            e.currentTarget.src = "https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=500";
          }}
        />
      </div>
    );
  })()}
</div>
      </div>

      {/* 🌟 SECTION 1: PROGRESS GAMBAR PERBAIKAN 🌟 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              📂 Dokumentasi Progres Lapangan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bukti visual penanganan aduan yang diunggah oleh dinas terkait.
            </p>
          </div>

          {/* HANYA ADMIN YANG BISA UPLOAD */}
          {isAdmin && (
            <label className={`cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <UploadCloud size={16} />
              {uploading ? "Mengunggah..." : "Tambah Foto Progres"}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleUploadProgress} 
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* PREVIEW DAFTAR GAMBAR PROGRESS */}
        {progressImages.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl text-center text-sm text-slate-400 bg-slate-50/30">
            Belum ada dokumentasi progres penanganan yang di-upload oleh petugas lapangan.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {progressImages.map((imgUrl, idx) => (
              <div key={idx} className="aspect-square bg-slate-100 border rounded-xl overflow-hidden shadow-sm group relative">
                <img src={imgUrl} alt={`Progres ${idx+1}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                  Progres #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 SECTION 2: DISKUSI PRIVATE 🌟 */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
        {/* Header Chat */}
        <div className="p-4 bg-slate-900 text-white flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Diskusi Penanganan Privat</h3>
            <p className="text-[11px] text-slate-300">Ruang komunikasi tertutup antara Pelapor & Petugas Administrasi</p>
          </div>
        </div>

        {/* Kolom Room Chat Pesan */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 space-y-3">
          {diskusi.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 space-y-1">
              <MessageSquare size={32} className="text-slate-300" />
              <p className="font-semibold">Ruang obrolan kosong.</p>
              <p>Mulai diskusi untuk menanyakan kejelasan kendala atau konfirmasi perbaikan lapangan.</p>
            </div>
          ) : (
            diskusi.map((chat) => {
              // Cek apakah pesan dikirim oleh diri kita sendiri yang sedang login
              const isMe = chat.user_id === user?.id;
              return (
                <div key={chat.id} className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}>
                  {/* Nama Pengirim di Atas Balon Chat */}
                  <span className="text-[10px] text-slate-400 font-bold mb-0.5 px-1 flex items-center gap-1">
                    <UserIcon size={10} /> {chat.user_name} 
                    <span className="text-[9px] font-medium capitalize px-1 bg-slate-200 text-slate-600 rounded">({chat.role})</span>
                  </span>
                  
                  {/* Balon Chat */}
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isMe 
                      ? "bg-red-600 text-white rounded-tr-none shadow-sm" 
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-inner"
                  }`}>
                    <p className="break-words">{chat.message}</p>
                    
                    {/* Waktu Kirim */}
                    <p className={`text-[9px] mt-1 text-right ${isMe ? "text-red-200" : "text-slate-400"}`}>
                      {new Date(chat.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Kirim Pesan */}
        <form onSubmit={handleKirimPesan} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputPesan}
            onChange={(e) => setInputPesan(e.target.value)}
            placeholder="Tulis pesan diskusi penanganan di sini..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputPesan.trim()}
            className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all shadow-sm flex items-center justify-center flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}