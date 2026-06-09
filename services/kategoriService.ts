import api from "./api";

export const getAllKategori = () => {
    return api.get("/kategori");
};