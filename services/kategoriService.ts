// services/kategoriService.ts

import api from "../src/lib/api";

export const getAllKategori = async () => {
  const response =
    await api.get("/admin/public/kategori");

  return response.data;
};