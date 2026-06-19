"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Send,
  User as UserIcon,
  Image as ImageIcon,
  CheckCircle,
  FolderOpen
} from "lucide-react";

// 🌟 Import SweetAlert2
import Swal from "sweetalert2";

import { 
  getDetailLaporan, 
  getDetailLaporanAdmin,
  getMyDetailLaporan,
  createPublicComment, 
  getPublicComments,
  createInternalComment,
  getInternalComments,
  uploadProgressImage,
  getProgressImages
} from "@/services/laporanService";

interface LaporanDetail {
  id: number;
  user_id: number;
  title: string;
  report_description: string;
  city: string;
  location_description: string;
  status: string;
  visibility: string;
  created_at: string;
  userName?: string;
  kategori?: string;
  kategori_id?: number;
  images?: Array<{ id: number; image_url: string }>;
}

interface ChatMessage {
  id: number;
  user_name?: string;
  userName?: string;
  role: string;
  message: string;
  komentar: string;
}

interface ProgressImage {
  id: number;
  image_url: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetailLaporanPage({ params }: PageProps) {
  const { id } = use(params);

  const [laporan, setLaporan] = useState<LaporanDetail | null>(null);
  const [buktiImages, setBuktiImages] = useState<any[]>([]);
  const [progressImages, setProgressImages] = useState<ProgressImage[]>([]);
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  
  const [inputPesan, setInputPesan] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.role === "admin" || parsedUser.role === "superadmin") {
            setIsAdmin(true);
          }
        } catch (e) {
          console.error("Gagal membaca session user", e);
        }
      } else {
        if (window.location.pathname.includes("/admin/")) {
          setIsAdmin(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [id, isAdmin]);
const loadAllData = async () => {
  try {
    setLoading(true);
    setErrorStatus(null);
    
    let responseDetail;
    
    // 🟢 Menggunakan getDetailLaporan(id) secara seragam di awal sebagai jalur aman
    try {
      responseDetail = await getDetailLaporan(id);
    } catch (err) {
      // Jika endpoint umum gagal/403, baru lempar ke fallback sesuai role
      if (isAdmin) {
        responseDetail = await getDetailLaporanAdmin(id);
      } else {
        responseDetail = await getMyDetailLaporan(id);
      }
    }

    const dataLaporan = responseDetail?.data?.data || responseDetail?.data;
    if (!dataLaporan) throw new Error("Data kosong atau tidak ditemukan");
    setLaporan(dataLaporan);

    // Set Bukti Gambar awal
    setBuktiImages(dataLaporan.before_images || dataLaporan.images || dataLaporan.attachments || []);

    // Ambil Progres Lapangan
    if (dataLaporan.progress_images) {
      setProgressImages(dataLaporan.progress_images);
    } else {
      try {
        const responseProgress = await getProgressImages(id);
        const resProgressData = responseProgress.data?.data || responseProgress.data || [];
        setProgressImages(Array.isArray(resProgressData) ? resProgressData : []);
      } catch (e) { 
        console.log("Belum ada progress"); 
        setProgressImages([]);
      }
    }

    // Ambil Komentar / Obrolan dengan aman
    try {
      if (dataLaporan?.visibility === "public") {
        const responseKomentar = await getPublicComments(id);
        const freshComments = responseKomentar.data?.data || responseKomentar.data || [];
        setChatList(Array.isArray(freshComments) ? freshComments : []);
      } else {
        const responseInternal = await getInternalComments(id);
        const freshInternal = responseInternal.data?.data || responseInternal.data || [];
        setChatList(Array.isArray(freshInternal) ? freshInternal : []);
      }
    } catch (chatError) {
      console.error("Gagal memuat chat dari API:", chatError);
      setChatList([]);
    }

  } catch (error: any) {
    console.error("❌ Gagal memuat data:", error);
    setErrorStatus(error?.response?.status || "ERROR");
  } finally {
    setLoading(false);
  }
};
const handleKirimPesan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPesan.trim()) return;

    const pesanSementera = inputPesan.trim();

    try {
      // 🌟 PERBAIKAN 2: Pastikan parameter kedua dikirim langsung sebagai string mentah 
      // karena di dalam `laporanService.ts` fungsi kamu menerima (id, message: string)
      if (laporan?.visibility === "public") {
        await createPublicComment(id, pesanSementera);
      } else {
        await createInternalComment(id, pesanSementera);
      }
      
      setInputPesan("");
      
      // Refresh list obrolan secara mandiri
      try {
        const resChat = laporan?.visibility === "public" 
          ? await getPublicComments(id) 
          : await getInternalComments(id);
          
        const freshChatData = resChat.data?.data || resChat.data || [];
        setChatList(Array.isArray(freshChatData) ? freshChatData : []);
      } catch (fetchChatError) {
        console.error("Pesan terkirim, namun gagal me-refresh list obrolan:", fetchChatError);
      }

    } catch (error: any) {
      console.error("❌ Gagal mengirim tanggapan ke server:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Kirim",
        text: error?.response?.data?.message || "Komentar atau pesan penanganan gagal dikirim ke server.",
        confirmButtonColor: "#dc2626",
      });
    }
  };
  // 🌟 PROSES UNGHAH PROGRESS LAPANGAN DENGAN VALIDASI SWEETALERT2
  const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validasi Ukuran File (Contoh: Batas maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Ukuran Berkas Terlalu Besar",
        text: "Maksimal ukuran foto dokumentasi yang diizinkan adalah 2MB.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadLoading(true);
      await uploadProgressImage(id, formData);
      
      // Menggunakan SweetAlert2 Sukses menggantikan alert konvensional
      Swal.fire({
        icon: "success",
        title: "Dokumentasi Disimpan",
        text: "Foto perkembangan lapangan berhasil diunggah ke pelaporan.",
        timer: 2000,
        showConfirmButton: false,
      });
      


    const resProgress = await getProgressImages(id);
    setProgressImages(resProgress.data?.data || resProgress.data || []);
      // Otomatis muat ulang status terbaru dari server
      loadAllData();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunggah",
        text: "Terjadi kesalahan sistem saat mencoba mengunggah dokumentasi.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploadLoading(false);
    }
  };
  

  const statusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "diperiksa": 
    case "diverifikasi": return "bg-blue-100 text-blue-700"; // Tambahkan ini
    case "tindak_lanjut": return "bg-orange-100 text-orange-700";
    case "selesai": return "bg-green-100 text-green-700";
    case "ditolak": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-700";
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-neutral-500 font-medium bg-neutral-50">
        <div className="animate-pulse">Menghubungkan ke server LaporYuk...</div>
      </div>
    );
  }

  if (errorStatus || !laporan) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-neutral-500 bg-neutral-50 space-y-4">
        <p className="font-bold text-lg text-neutral-800">Waduh, Data Aduan Tidak Ditemukan!</p>
        <p className="text-xs text-neutral-400">Kode Status: {errorStatus || "404"} • Cek otorisasi akun/middleware backend kamu.</p>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline font-semibold">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 p-4 sm:p-8 text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 bg-white border px-4 py-2 rounded-xl shadow-sm transition-all w-fit"
        >
          <ChevronLeft size={16} />
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* SECTION 1: DETAIL INFORMASI UTAMA LAPORAN */}
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 capitalize">{laporan.title}</h1>
              <p className="text-sm font-bold text-neutral-400">
                ID Laporan: <span className="text-neutral-600">#LY-{laporan.id}</span>
                {laporan.visibility === "public" && ` • Pelapor: ${laporan.userName || "Masyarakat"}`}
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border capitalize tracking-wide ${statusColor(laporan.status)}`}>
              ⏱️ {laporan.status?.replace("_", " ")}
            </span>
          </div>

          <div className="space-y-2 border-t pt-4">
            <h3 className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Deskripsi Kejadian</h3>
            <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">{laporan.report_description}</p>
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

        {/* Layout Utama Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* KOLOM KIRI */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <FolderOpen size={14} />
                <span>Kategori Layanan</span>
              </h3>
              <span className="inline-flex bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100">
                📂 {laporan.kategori || "Fasilitas Umum"}
              </span>
            </div>

            {/* SECTION: RUANG DISKUSI CHAT */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-800 text-base flex items-center gap-2">
                <MessageSquare size={18} className="text-neutral-500" />
                <span>{laporan?.visibility === "public" ? "💬 Kolom Komentar Terbuka (Publik)" : "🔒 Obrolan Internal Petugas (Private)"}</span>
              </h3>

              <form onSubmit={handleKirimPesan} className="flex gap-2">
                <input
                  type="text"
                  value={inputPesan}
                  onChange={(e) => setInputPesan(e.target.value)}
                  placeholder={laporan?.visibility === "public" ? "Ketik komentar publik..." : "Tulis progres internal petugas..."}
                  className="flex-1 bg-neutral-50 border border-neutral-200 text-sm rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button type="submit" className="bg-neutral-900 hover:bg-neutral-800 text-white p-3 rounded-xl transition-all shadow-sm shrink-0 active:scale-95">
                  <Send size={16} />
                </button>
              </form>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {chatList.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic text-center py-4">Belum ada tanggapan atau catatan penanganan.</p>
                ) : (
                  chatList.map((chat) => (
                    <div key={chat.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-sm space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-800 text-xs">{chat.user_name || chat.userName || "Petugas / Anonim"}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 font-extrabold rounded uppercase ${
                          chat.role === "admin" || chat.role === "superadmin" ? "bg-red-100 text-red-700" : "bg-neutral-200 text-neutral-600"
                        }`}>
                          {chat.role || "user"}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                        {/* 🌟 Gunakan urutan properti message lalu komentar sesuai controller */}
                        {chat.message || chat.komentar}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <UserIcon size={14} />
                <span>📷 Lampiran Bukti Pelapor</span>
              </h3>
              {buktiImages.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">Tidak ada lampiran foto bukti awal.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {buktiImages.map((img, index) => (
                    <div key={img.id || index} className="relative rounded-xl overflow-hidden border border-neutral-100 aspect-video bg-neutral-50">
                      <img 
                        src={img.image_url || img} 
                        alt="Bukti Pelapor" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if(typeof img === 'string') e.currentTarget.src = img;
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🌟 Hasil Perkembangan Lapangan (Hanya muncul jika status Tindak Lanjut atau Selesai) */}
{/* 🌟 Hasil Perkembangan Lapangan (Hanya muncul jika status Tindak Lanjut atau Selesai) */}
{["tindak_lanjut", "selesai"].includes(laporan?.status?.toLowerCase() || "") ? (
  <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4">
    <div className="flex justify-between items-center border-b pb-2">
      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
        <CheckCircle size={14} className="text-emerald-500" />
        <span>🛠️ Hasil Perkembangan Lapangan</span>
      </h3>
      {isAdmin && (
        <label className="bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer shadow-sm transition-all flex items-center gap-1">
          <ImageIcon size={12} />
          <span>{uploadLoading ? "..." : "+ Foto"}</span>
          <input type="file" accept="image/*" onChange={handleUploadProgress} disabled={uploadLoading} className="hidden" />
        </label>
      )}
    </div>

    {progressImages.length === 0 ? (
      <p className="text-xs text-neutral-400 italic py-2">Belum ada bukti perkembangan lapangan.</p>
    ) : (
      <div className="grid grid-cols-1 gap-2.5">
        {progressImages.map((img, index) => (
          <div key={img.id || index} className="relative rounded-xl overflow-hidden border border-neutral-100 aspect-video bg-neutral-50">
            <img src={img.image_url} alt="Progres Petugas" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    )}
  </div>
) : (
  /* Jika status belum masuk tindak lanjut, infokan ke admin saja. */
  isAdmin && (
    <div className="bg-yellow-50/50 border border-yellow-200/60 rounded-2xl p-4 text-xs text-yellow-700 shadow-sm leading-relaxed">
      💡 <strong>Info Admin:</strong> Fitur unggah dokumentasi progress lapangan dikunci otomatis karena status aduan saat ini masih berupa <strong>{(laporan?.status || "").replace("_", " ")}</strong>. Silakan ubah status ke <em>Tindak Lanjut</em> terlebih dahulu untuk membuka akses.
    </div>
  )
)}
          </div>

        </div>

      </div>
    </div>
  );
}