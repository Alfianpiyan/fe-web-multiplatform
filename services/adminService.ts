import api from "../src/lib/api";

export const getAllLaporanAdmin = () => {
  return api.get("/admin");
};

export const reviewLaporan = (
  id: number,
  data: Record<string, any>
) => {
  return api.patch(`/admin/review/${id}`, data);
};

export const verifyLaporan = (id: number) => {
  return api.patch(`/admin/${id}/verifikasi`);
};

export const rejectLaporan = (
  id: number,
  data: Record<string, any>
) => {
  return api.patch(`/admin/${id}/tolak`, data);
};

export const updateStatusLaporan = (
  id: number,
  data: Record<string, any>
) => {
  return api.patch(`/admin/${id}/status`, data);
};

export const createKategori = (
  data: Record<string, any>
) => {
  return api.post("/kategori", data);
};

export const updateKategori = (
  id: number,
  data: Record<string, any>
) => {
  return api.patch(`/kategori/${id}`, data);
};

export const deleteKategori = (id: number) => {
  return api.delete(`/kategori/${id}`);
};