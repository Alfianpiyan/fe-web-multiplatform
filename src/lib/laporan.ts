import api from "./api";
import axios from "axios";

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
// 1. FITUR UMUM & ALUR PENGADUAN USER
// ========================================================

export const createLaporan = (data: Partial<LaporanData>) => {
  return api.post("/laporan/create", data);
};

export const getMyDraftLaporan = () => {
  return api.get("/laporan/draft/me");
};

export const getMyLaporan = () => {
  return api.get("/laporan/me");
};

export const getDraftLaporan = async () => {
  const response = await api.get("/laporan/draft/me");
  return response.data;
};

export const updateDraftLaporan = (
  id: number | string,
  data: Partial<LaporanData>
) => {
  return api.patch(`/laporan/draft/${id}`, data);
};

export const deleteDraftLaporan = (id: number | string) => {
  return api.delete(`/laporan/draft/${id}`);
};

export const uploadLaporanImages = (
  id: number | string,
  formData: FormData
) => {
  return api.post(`/laporan/upload-images/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const submitLaporan = async (id: number | string, formData: any) => {
  return await api.patch(`/laporan/submit/${id}`, formData);
};

export const getPublicLaporan = () => {
  return api.get("/laporan");
};

export const getLaporanTimeline = (id: number | string) => {
  return api.get(`/laporan/${id}/timeline`);
};


// ========================================================
// 2. FITUR AMBIL DATA DETAIL (USER vs ADMIN)
// ========================================================

// Dipakai oleh USER biasa untuk melihat detail aduan miliknya sendiri
export const getMyDetailLaporan = (id: number | string) => {
  return api.get(`/laporan/me/${id}`);
};

// Dipakai oleh ADMIN / PETUGAS untuk melihat detail laporan privat di panel admin
export const getDetailLaporanAdmin = (id: number | string) => {
  return api.get(`/laporan/detail/${id}`);
};

// Dipakai untuk mengambil detail dasar publik
export const getDetailLaporan = (id: number | string) => {
  return api.get(`/laporan/${id}`);
};


// ========================================================
// 3. FITUR DISKUSI / KOMENTAR (PUBLIK & INTERNAL PETUGAS)
// ========================================================

// Komentar Publik (Bisa diakses user biasa dan admin)
export const createPublicComment = (id: number | string, message: string) => {
  return api.post(`/laporan/${id}/comment`, { message });
};

export const getPublicComments = (id: number | string) => {
  return api.get(`/laporan/${id}/comment`);
};

export const deletePublicComment = (commentId: number | string) => {
  return api.delete(`/laporan/comment/${commentId}`);
};

// Komentar Internal Penanganan (Hanya untuk internal petugas/admin)
export const createInternalComment = (id: number | string, message: string) => {
  return api.post(`/laporan/${id}/internal-comment`, { message });
};

export const getInternalComments = (id: number | string) => {
  return api.get(`/laporan/${id}/internal-comment`);
};

export const deleteInternalComment = (commentId: number | string) => {
  return api.delete(`/laporan/internal-comment/${commentId}`);
};


// ========================================================
// 4. FITUR PROGRESS DOKUMENTASI LAPANGAN (Hanya Admin)
// ========================================================

// Petugas mengunggah bukti gambar penanganan lapangan
export const uploadProgressImage = (id: number | string, formData: FormData) => {
  return api.post(`/laporan/${id}/progress`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Mengambil list galeri progress (Bisa dibaca publik/user untuk transparansi)
export const getProgressImages = (id: number | string) => {
  return api.get(`/laporan/${id}/progress`);
};

// Memperbarui teks keterangan deskripsi perkembangan progress penanganan
export const updateProgressDescription = (id: number | string, description: string) => {
  return api.patch(`/laporan/${id}/progress`, { description });
};

// Menghapus foto progress yang salah upload
export const deleteProgressImage = (imageId: number | string) => {
  return api.delete(`/laporan/progress-image/${imageId}`);
};

/* 💡 Optional: Jika backend kamu menyediakan fitur ubah status langsung (misal: pending -> selesai)
export const updateStatusLaporan = (id: number | string, status: string) => {
  return api.put(`/laporan/${id}/status`, { status });
};
*/