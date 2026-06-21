import api from "../src/lib/api";

// ==========================================
// 🧩 TIPE DATA
// ==========================================

export interface AdminAccount {
  id: number;
  userName: string;
  email: string;
  city: string;
  total_laporan: number;
}

export interface CreateAdminPayload {
  userName: string;
  email: string;
  password: string;
  city: string;
}

// ==========================================
// 📋 LAYANAN ADMINISTRASI: LAPORAN
// ==========================================

// 🌟 Sekarang menerima parameter city opsional.
// Dipanggil tanpa argumen (admin biasa) -> backend otomatis filter ke kota admin tsb.
// Dipanggil dengan city (superadmin) -> backend filter sesuai kota yang dipilih.
// Dipanggil dengan city = "" / undefined oleh superadmin -> tampilkan semua kota.
export const getAllLaporan = (city?: string) => {
  return api.get("/laporan/semua", {
    params: city ? { city } : undefined,
  });
};

export const searchLaporanAdmin = (keyword: string) => {
  // Menghasilkan: /api/laporan/search
  return api.get(`/laporan/search?keyword=${keyword}`);
};

export const updateStatusLaporan = (id: number | string, status: string, visibility?: string) => {
  // Pastikan parameter 'visibility' ikut dimasukkan ke dalam body data request POST/PATCH
  return api.patch(`/laporan/${id}/status`, {
    status,
    visibility,
  });
};

// ==========================================
// 👤 LAYANAN ADMINISTRASI: AKUN ADMIN (KHUSUS SUPERADMIN)
// ==========================================

// 🌟 Mengambil daftar seluruh admin beserta total laporan di wilayahnya
export const getAllAdmins = () => {
  return api.get("/laporan/admins");
};

// 🌟 Membuat akun admin baru lengkap dengan wilayah yang dikelola
export const createAdminAccount = (data: CreateAdminPayload) => {
  return api.post("/laporan/createAdmin", { ...data, role: "admin" });
};

// ==========================================
// 📂 LAYANAN ADMINISTRASI: KATEGORI
// ==========================================

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

export const deleteKategori = (id: number) => {
  // Menghasilkan URL: https://.../api/laporan/kategori/ID_KATEGORI
  return api.delete(`/laporan/kategori/${id}`);
};