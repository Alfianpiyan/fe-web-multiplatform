import api from "../src/lib/api"; // Sesuaikan dengan path instance atau config Axios kamu

/** ==========================================
 * 1. FITUR UTAMA & SUBSCRIPTION LAPORAN
 * ========================================== */

// Mengambil seluruh daftar laporan publik yang transparan (Feed Publik)
export const getPublicLaporan = () => {
  return api.get("/laporan");
};

// Mengambil daftar laporan milik user yang sedang login saja
export const getMyLaporan = () => {
  return api.get("/laporan/me");
};

// Mengambil detail laporan private/auth (Digunakan oleh user/admin untuk halaman detail)
export const getDetailLaporan = (id: string | number) => {
  return api.get(`/laporan/detail/${id}`);
};

// Mengambil detail laporan khusus milik saya sendiri (Rute alternatif me/:id)
export const getMyDetailLaporan = (id: string | number) => {
  return api.get(`/laporan/me/${id}`);
};

// Mengambil detail laporan publik tanpa guard ketat (Rute /:id paling bawah di backend)
export const getPublicDetailLaporan = (id: string | number) => {
  return api.get(`/laporan/${id}`);
};

// Mengambil riwayat log perkembangan status laporan (Timeline)
export const getLaporanTimeline = (id: string | number) => {
  return api.get(`/laporan/${id}/timeline`);
};


/** ==========================================
 * 2. FITUR DRAF / PENGONSERAN ADUAN
 * ========================================== */

// Membuat aduan baru (bisa langsung jadi draf atau laporan tergantung logika backend)
export const createLaporan = (formData: FormData) => {
  return api.post("/laporan/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

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


/** ==========================================
 * 3. DOKUMENTASI PROGRESS LAPANGAN (ADMIN & USER)
 * ========================================== */

// Admin mengunggah foto perkembangan penanganan lapangan (Gunakan middleware array images)
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
export const updateProgressDescription = (id: string | number, description: string) => {
  return api.patch(`/laporan/${id}/progress`, { description });
};

// Admin menghapus salah satu foto progres di lapangan berdasarkan ID Gambar
export const deleteProgressImage = (imageId: string | number) => {
  return api.delete(`/laporan/progress-image/${imageId}`);
};


/** ==========================================
 * 4. DISKUSI PRIVATE (INTERNAL COMMENT)
 * ========================================== */

// Mengambil seluruh riwayat obrolan diskusi privat antara pelapor dan petugas
export const getDiskusiLaporan = (id: string | number) => {
  return api.get(`/laporan/${id}/internal-comment`);
};

// Mengirim pesan obrolan privat baru ke dalam room laporan
export const kirimPesanDiskusi = (id: string | number, message: string) => {
  // CATATAN: Sesuaikan key body 'comment' dengan apa yang di-destructure di controller backend-mu
  return api.post(`/laporan/${id}/internal-comment`, { comment: message });
};

// Menghapus salah satu pesan obrolan privat
export const deleteInternalComment = (commentId: string | number) => {
  return api.delete(`/laporan/internal-comment/${commentId}`);
};


/** ==========================================
 * 5. KOMENTAR PUBLIK (FEEDBACK MASYARAKAT)
 * ========================================== */

// Masyarakat memberikan komentar terbuka di laporan publik
export const createPublicComment = (id: string | number, comment: string) => {
  return api.post(`/laporan/${id}/comment`, { comment });
};

// Mengambil seluruh daftar komentar publik dari masyarakat luas
export const getPublicComments = (id: string | number) => {
  return api.get(`/laporan/${id}/comment`);
};

// Menghapus komentar publik tertentu
export const deletePublicComment = (commentId: string | number) => {
  return api.delete(`/laporan/comment/${commentId}`);
};