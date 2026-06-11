import api from "../src/lib/api"; // Sesuaikan path import api kamu

// Laporan
export const getAllLaporan = () => {
  return api.get("/admin/laporan"); // Sesuaikan dengan route di backend-mu
};

export const searchLaporanAdmin = (keyword: string) => {
  return api.get(`/admin/laporan/search?keyword=${keyword}`);
};

export const reviewLaporan = (id: number, data: { kategori_id: number; notes: string }) => {
  return api.patch(`/admin/laporan/${id}/review`, data);
};

export const verifyLaporan = (id: number) => {
  return api.patch(`/admin/laporan/${id}/verifikasi`);
};

export const rejectLaporan = (id: number, data: { alasan_penolakan: string }) => {
  return api.patch(`/admin/laporan/${id}/tolak`, data);
};

export const updateStatusLaporan = (id: number, data: { status: string; visibility?: string; alasan_penolakan?: string }) => {
  return api.patch(`/admin/laporan/${id}/status`, data);
};

// Kategori
export const getAllKategori = () => {
  return api.get("/kategori");
};

export const createKategori = (data: { kategori: string }) => {
  return api.post("/kategori", data);
};

export const updateKategori = (id: number, data: { kategori: string }) => {
  return api.patch(`/kategori/${id}`, data);
};

export const deleteKategori = (id: number) => {
  return api.delete(`/kategori/${id}`);
};