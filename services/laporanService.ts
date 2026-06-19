import api from "../src/lib/api"; // Sesuaikan jika ditaruh di folder yang sama dengan instance axios

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
// 1. FITUR UTAMA & FEED PENGADUAN USER
// ========================================================

// 👥 Mengambil daftar laporan milik user yang sedang login saja (GET: /api/laporan/me)
export const getMyLaporan = () => {
  return api.get("/laporan/me");
};

// 🌐 Mengambil seluruh daftar laporan publik yang transparan (GET: /api/laporan)
export const getPublicLaporan = () => {
  return api.get("/laporan");
};

// 📝 Membuat aduan baru resmi (POST: /api/laporan/create)
export const createLaporan = (formData: FormData | Partial<LaporanData>) => {
  // Jika mengirim data via multipart/form-data (ada gambarnya)
  if (formData instanceof FormData) {
    return api.post("/laporan/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  // Jika input teks biasa
  return api.post("/laporan/create", formData);
};


// ========================================================
// 2. FITUR DRAF / PENGONSERAN ADUAN USER
// ========================================================

// Mengambil seluruh draf aduan milik saya (GET: /api/laporan/draft/me)
export const getMyDraftLaporan = () => {
  return api.get("/laporan/draft/me");
};

// Memperbarui isi konten draf laporan (PATCH: /api/laporan/draft/:id)
export const updateDraftLaporan = (id: string | number, data: Partial<LaporanData>) => {
  return api.patch(`/laporan/draft/${id}`, data);
};

// Menghapus draf aduan (DELETE: /api/laporan/draft/:id)
export const deleteDraftLaporan = (id: string | number) => {
  return api.delete(`/laporan/draft/${id}`);
};

// Men-submit draf laporan resmi agar masuk antrean (PATCH: /api/laporan/submit/:id)
export const submitLaporan = (id: string | number, formData?: any) => {
  return api.patch(`/laporan/submit/${id}`, formData || {});
};

// Mengunggah gambar/bukti lampiran tambahan (POST: /api/laporan/upload-images/:id)
export const uploadLaporanImages = (id: string | number, formData: FormData) => {
  return api.post(`/laporan/upload-images/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


// ========================================================
// 3. FITUR AMBIL DATA DETAIL (SINKRON DENGAN BACKEND ROUTER)
// ========================================================

// 👥 USER mengecek detail aduannya sendiri (GET: /api/laporan/me/:id)
export const getMyDetailLaporan = (id: number | string) => {
  return api.get(`/laporan/me/${id}`);
};

// 🕵️ ADMIN / PETUGAS melihat detail privat di panel admin (GET: /api/laporan/detail/:id)
export const getDetailLaporanAdmin = (id: string | number) => {
  return api.get(`/laporan/detail/${id}`);
};

// 🌐 Mengambil detail dasar publik (GET: /api/laporan/:id)
export const getDetailLaporan = (id: number | string) => {
  return api.get(`/laporan/${id}`);
};

// 📜 Mengambil riwayat log perkembangan status laporan (GET: /api/laporan/:id/timeline)
export const getLaporanTimeline = (id: string | number) => {
  return api.get(`/laporan/${id}/timeline`);
};


// ========================================================
// 4. DISKUSI / KOMENTAR (PUBLIK & INTERNAL PETUGAS)
// ========================================================

// --- Komentar Publik ---
export const createPublicComment = (id: string | number, message: string) => {
  return api.post(`/laporan/${id}/comment`, { komentar: message}); // Sesuai backend controller { message }
};

export const getPublicComments = (id: string | number) => {
  return api.get(`/laporan/${id}/comment`);
};

export const deletePublicComment = (commentId: string | number) => {
  return api.delete(`/laporan/comment/${commentId}`);
};

// --- Komentar Internal (Hanya Admin / Petugas) ---
export const createInternalComment = (id: string | number, message: string) => {
  return api.post(`/laporan/${id}/internal-comment`, {komentar: message });
};

export const getInternalComments = (id: string | number) => {
  return api.get(`/laporan/${id}/internal-comment`);
};

export const deleteInternalComment = (commentId: string | number) => {
  return api.delete(`/laporan/internal-comment/${commentId}`);
};


// ========================================================
// 5. DOKUMENTASI PROGRESS LAPANGAN (Hanya Petugas/Admin)
// ========================================================

// Petugas mengunggah bukti gambar lapangan (POST: /api/laporan/:id/progress)
export const uploadProgressImage = (id: string | number, formData: FormData) => {
  return api.post(`/laporan/${id}/progress`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Mengambil list galeri progress (GET: /api/laporan/:id/progress)
export const getProgressImages = (id: string | number) => {
  return api.get(`/laporan/${id}/progress`);
};

// Memperbarui teks keterangan deskripsi progress (PATCH: /api/laporan/progress/:progressId)
export const updateProgressDescription = (progressId: string | number, description: string) => {
  return api.patch(`/laporan/progress/${progressId}`, { description });
};

// Menghapus foto progress lapangan (DELETE: /api/laporan/progress-image/:imageId)
export const deleteProgressImage = (imageId: string | number) => {
  return api.delete(`/laporan/progress-image/${imageId}`);
};