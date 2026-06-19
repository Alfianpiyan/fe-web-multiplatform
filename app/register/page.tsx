"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { register } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!userName.trim()) newErrors.userName = "Nama lengkap tidak boleh kosong.";
    if (!email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!password) {
      newErrors.password = "Password tidak boleh kosong.";
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
    }
    if (!telepon.trim()) newErrors.telepon = "Nomor telepon tidak boleh kosong.";
    if (!alamat.trim()) newErrors.alamat = "Alamat tidak boleh kosong.";

    return newErrors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await register({ userName, email, password, telepon, alamat });

      setSuccess("Registrasi berhasil, silakan login.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full border-2 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition text-sm font-medium ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-neutral-200 focus:border-[#ff295e]"
    }`;

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
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
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Daftar Akun</h1>
            <p className="text-neutral-400 mt-1 text-sm">Buat akun untuk mulai melapor</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3" noValidate>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (errors.userName) setErrors((prev) => ({ ...prev, userName: "" }));
                }}
                className={inputClass("userName")}
              />
              {errors.userName && (
                <p className="text-red-500 text-xs pl-1">{errors.userName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Email
              </label>
              <input
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs pl-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={inputClass("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs pl-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={telepon}
                onChange={(e) => {
                  setTelepon(e.target.value);
                  if (errors.telepon) setErrors((prev) => ({ ...prev, telepon: "" }));
                }}
                className={inputClass("telepon")}
              />
              {errors.telepon && (
                <p className="text-red-500 text-xs pl-1">{errors.telepon}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-1">
                Alamat
              </label>
              <textarea
                placeholder="Tulis alamat lengkap..."
                value={alamat}
                onChange={(e) => {
                  setAlamat(e.target.value);
                  if (errors.alamat) setErrors((prev) => ({ ...prev, alamat: "" }));
                }}
                rows={3}
                className={inputClass("alamat") + " resize-none"}
              />
              {errors.alamat && (
                <p className="text-red-500 text-xs pl-1">{errors.alamat}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#ff295e] text-white font-bold text-sm hover:bg-[#e91e56] active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-lg shadow-[#ff295e]/30"
            >
              {loading ? "Memproses..." : "Buat Akun"}
            </button>

          </form>

          <p className="text-center text-sm text-neutral-500 pt-1">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#ff295e] font-bold hover:underline">
              Masuk
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}