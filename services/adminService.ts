import api from "../src/lib/api";

// ==========================================
// 📋 LAYANAN ADMINISTRASI: LAPORAN
// ==========================================

export const getAllLaporan = () => {
  return api.get("/laporan"); 
};

export const searchLaporanAdmin = (keyword: string) => {
  // Menghasilkan: /api/laporan/search
  return api.get(`/laporan/search?keyword=${keyword}`);
};

export const reviewLaporan = (id: number, data: { kategori_id: number; notes: string }) => {
  // Menghasilkan: /api/laporan/review/:id
  return api.patch(`/laporan/review/${id}`, data);
};


// ==========================================
// 📂 LAYANAN ADMINISTRASI: KATEGORI
// ==========================================

// services/adminService.ts

// 🌟 Mengambil kategori sekarang jalurnya seragam dan bersih
export const getAllKategori = () => {
  return api.get("/laporan/public/kategori"); // 👈 Sesuaikan ke /public/kategori
};
// Menambah kategori baru
export const createKategori = (data: { kategori: string; description: string }) => {
  return api.post("/laporan/kategori", data); 
};


export const updateKategori = (id: number, data: { kategori: string; description: string }) => {
  return api.patch(`/laporan/kategori/${id}`, data);
};

// services/adminService.ts

export const deleteKategori = (id: number) => {
  // Menghasilkan URL: https://.../api/laporan/kategori/ID_KATEGORI
  return api.delete(`/laporan/kategori/${id}`);
};