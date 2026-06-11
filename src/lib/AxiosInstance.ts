import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// 🌟 TAMBAHKAN INI: Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Pastikan key-nya sama dengan di AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Pasang token ke header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor (Sudah ada, ini bagus untuk deteksi 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Token ditolak server, logout paksa!");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;