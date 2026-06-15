import api from "../src/lib/api"; // Sesuaikan dengan path instance atau config Axios kamu

export interface LaporanData {
  kategori_id?: number | null;
  title?: string | null;
  report_description?: string | null;
  city?: string | null;
  location_description?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  waktu_kejadian?: string | null;
}

// ========================================================
// 1. FITUR AMBIL DATA DETAIL (USER vs ADMIN)
// ========================================================

// 👥 Dipakai oleh USER biasa untuk melihat detail aduan miliknya sendiri (GET: /api/laporan/me/:id)
export const getMyDetailLaporan = (id: number | string) => {
  return api.get(`/laporan/me/${id}`);
};

// 🕵️ Dipakai oleh ADMIN / PETUGAS untuk melihat detail laporan privat di panel admin (GET: /api/laporan/detail/:id)
export const getDetailLaporanAdmin = (id: string | number) => {
  return api.get(`/laporan/${id}`); 
};

// 🌐 Dipakai untuk mengambil detail dasar publik (GET: /api/laporan/:id)
export const getDetailLaporan = (id: number | string) => {
  return api.get(`/laporan/${id}`);
};

// 📜 Mengambil riwayat log perkembangan status laporan (Timeline)
export const getLaporanTimeline = (id: string | number) => {
  return api.get(`/laporan/${id}/timeline`);
};


// ========================================================
// 2. FITUR UTAMA & FEED PENGADUAN USER
// ========================================================

// Mengambil seluruh daftar laporan publik yang transparan (Feed Publik)
export const getPublicLaporan = () => {
  return api.get("/laporan");
};

// Mengambil daftar laporan milik user yang sedang login saja
export const getMyLaporan = () => {
  return api.get("/laporan/me");
};

// Membuat aduan baru resmi
export const createLaporan = (formData: FormData) => {
  return api.post("/laporan/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


// ========================================================
// 3. FITUR DRAF / PENGONSERAN ADUAN
// ========================================================

// Mengambil seluruh draf aduan milik saya yang belum di-submit
export const getMyDraftLaporan = () => {
  return api.get("/laporan/draft/me");
};

// Memperbarui isi konten draf laporan
export const updateDraftLaporan = (id: string | number, data: any) => {
  return api.patch(`/laporan/draft/${id}`, data);
};

// Menghapus draf aduan yang tidak jadi dikirim
export const deleteDraftLaporan = (id: string | number) => {
  return api.delete(`/laporan/draft/${id}`);
};

// Men-submit/menerbitkan draf laporan resmi agar masuk ke antrean petugas
export const submitLaporan = (id: string | number) => {
  return api.patch(`/laporan/submit/${id}`);
};

// Mengunggah banyak gambar/bukti lampiran tambahan ke laporan tertentu
export const uploadLaporanImages = (id: string | number, formData: FormData) => {
  return api.post(`/laporan/upload-images/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


// ========================================================
// 4. DISKUSI PRIVATE (INTERNAL COMMENT PETUGAS)
// ========================================================

// Mengambil seluruh riwayat obrolan diskusi privat antara pelapor dan petugas
// Mengambil seluruh riwayat obrolan diskusi privat antara pelapor dan petugas
export const getInternalComments = (id: string | number) => {
  return api.get(`/laporan/${id}/internal-comment`);
};

// Mengirim pesan obrolan privat baru ke dalam room laporan
export const createInternalComment = (id: string | number, text: string) => {
  return api.post(`/laporan/${id}/internal-comment`, { 
    komentar: text,
    message: text,
    text: text
  });
};
// Menghapus salah satu pesan obrolan privat
export const deleteInternalComment = (commentId: string | number) => {
  return api.delete(`/laporan/internal-comment/${commentId}`);
};


// ========================================================
// 5. KOMENTAR PUBLIK (FEEDBACK MASYARAKAT)
// ========================================================

// Masyarakat memberikan komentar terbuka di laporan publik (Key body disesuaikan dengan backend: { message })
export const createPublicComment = async (id: string | number, teksKomentar: string) => {
  return await api.post(`/laporan/${id}/comment`, { 
    komentar: teksKomentar // 🚀 PASTIKAN KEY-NYA ADALAH "komentar"
  });
};

// Mengambil seluruh daftar komentar publik dari masyarakat luas
export const getPublicComments = (id: string | number) => {
  return api.get(`/laporan/${id}/comment`);
};

// Menghapus komentar publik tertentu
export const deletePublicComment = (commentId: string | number) => {
  return api.delete(`/laporan/comment/${commentId}`);
};


// ========================================================
// 6. DOKUMENTASI PROGRESS LAPANGAN (Hanya Admin)
// ========================================================

// Admin mengunggah foto perkembangan penanganan lapangan
export const uploadProgressImage = (id: string | number, formData: FormData) => {
  return api.post(`/laporan/${id}/progress`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Mengambil seluruh daftar foto dokumentasi progres yang sudah dikerjakan
export const getProgressImages = (id: string | number) => {
  return api.get(`/laporan/${id}/progress`);
};

// Admin memperbarui deskripsi atau teks keterangan progres penanganan
// Admin memperbarui deskripsi atau teks keterangan progres penanganan berdasarkan ID baris progres
export const updateProgressDescription = (progressId: string | number, description: string) => {
  return api.patch(`/laporan/progress/${progressId}`, { description });
};

// Admin menghapus salah satu foto progres di lapangan berdasarkan ID Gambar
export const deleteProgressImage = (imageId: string | number) => {
  return api.delete(`/laporan/progress-image/${imageId}`);
};