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

      const response = await loginService({ email, password });
      const { token, user } = response.data;

      login(token, user);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error?.response?.data?.message || "Login gagal, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-white border border-neutral-200 rounded-3xl shadow-2xl p-8 space-y-4">

          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-500 hover:text-[#ff295e] transition font-medium text-sm"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Masuk</h1>
            <p className="text-neutral-400 mt-1 text-sm">Selamat datang kembali</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#ff295e] transition text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#ff295e] transition text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#ff295e] text-white font-bold text-sm hover:bg-[#e91e56] active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-lg shadow-[#ff295e]/30"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

          </form>

          <p className="text-center text-sm text-neutral-500 pt-1">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#ff295e] font-bold hover:underline">
              Daftar
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}