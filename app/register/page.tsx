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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            await register({
                userName,
                email,
                password,
                telepon,
                alamat
            });

            setSuccess(
                "Registrasi berhasil, silakan login."
            );

            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Registrasi gagal"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div
            className="
                min-h-screen
                bg-gradient-to-br
                from-white
                via-pink-50
                to-red-50
                flex
                items-center
                justify-center
                px-4
            "
        >

            <Link
                href="/"
                className="
                    absolute
                    top-6
                    left-6
                    flex
                    items-center
                    gap-2
                    text-gray-700
                    hover:text-[#ff295e]
                    transition
                "
            >
                <ArrowLeft size={20} />
                <span>Kembali</span>
            </Link>

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-8
                "
            >

                <div className="text-center mb-8">

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Daftar Akun
                    </h1>

                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >
                        Buat akun untuk mulai melapor
                    </p>

                </div>

                {error && (
                    <div
                        className="
                            mb-4
                            bg-red-100
                            text-red-600
                            px-4
                            py-3
                            rounded-xl
                        "
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="
                            mb-4
                            bg-green-100
                            text-green-700
                            px-4
                            py-3
                            rounded-xl
                        "
                    >
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={userName}
                        onChange={(e) =>
                            setUserName(
                                e.target.value
                            )
                        }
                        required
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:border-[#ff295e]
                        "
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        required
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:border-[#ff295e]
                        "
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:border-[#ff295e]
                        "
                    />

                    <input
                        type="text"
                        placeholder="Nomor Telepon"
                        value={telepon}
                        onChange={(e) =>
                            setTelepon(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:border-[#ff295e]
                        "
                    />

                    <textarea
                        placeholder="Alamat"
                        value={alamat}
                        onChange={(e) =>
                            setAlamat(
                                e.target.value
                            )
                        }
                        rows={3}
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:border-[#ff295e]
                        "
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            py-3
                            rounded-xl
                            bg-[#ff295e]
                            text-white
                            font-semibold
                            hover:bg-[#e91e56]
                            transition
                            disabled:opacity-50
                        "
                    >
                        {
                            loading
                                ? "Loading..."
                                : "Daftar"
                        }
                    </button>

                </form>

                <div
                    className="
                        mt-6
                        text-center
                        text-sm
                        text-gray-600
                    "
                >
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="
                            text-[#ff295e]
                            font-semibold
                        "
                    >
                        Masuk
                    </Link>
                </div>

            </div>

        </div>
    );
}