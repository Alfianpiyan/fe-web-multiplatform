"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { login as loginService } from "@/services/authService";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginService({
        email,
        password,
      });

      const { token, user } = response.data;

      // 1. Simpan ke Context (yang juga akan simpan ke localStorage)
      login(token, user);

      // 2. Redirect SEMUA role ke satu pintu dashboard
      // Logika role sudah ditangani di dashboard/page.tsx
      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Login gagal, silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-red-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ff295e]">Masuk</h1>
          <p className="text-gray-500 mt-2">Selamat datang kembali</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff295e] text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff295e] text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#ff295e] text-white font-semibold hover:bg-[#e91e56] transition disabled:opacity-70"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#ff295e] font-semibold">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}