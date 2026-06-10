import api from "./api";

export const getKategori = async () => {
  const response = await api.get("/admin/kategori");
  return response.data;
};