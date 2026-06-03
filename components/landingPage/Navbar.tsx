import Image from "next/image";

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 shadow-sm z-50">
            <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

                <a
                    href="#hero"
                    className="flex items-center gap-1"
                >
                    <Image
                        src="/logo2.png"
                        alt="LaporYuk"
                        width={95}
                        height={95}
                        priority
                    />

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            LaporYuk
                        </h1>

                        <p className="text-xs text-[#ff295e] font-medium tracking-wider uppercase">
                            Lapor Yuk, Biar Aman
                        </p>
                    </div>
                </a>

                <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
                    <li>
                        <a
                            href="#hero"
                            className="hover:text-[#ff295e] transition"
                        >
                            Beranda
                        </a>
                    </li>

                    <li>
                        <a
                            href="#kategori"
                            className="hover:text-[#ff295e] transition"
                        >
                            Kategori
                        </a>
                    </li>

                    <li>
                        <a
                            href="#cara-kerja"
                            className="hover:text-[#ff295e] transition"
                        >
                            Cara Kerja
                        </a>
                    </li>

                    <li>
                        <a
                            href="#statistik"
                            className="hover:text-[#ff295e] transition"
                        >
                            Statistik
                        </a>
                    </li>
                </ul>

                <div className="flex items-center gap-4">

                    <button
                        className="
                            hidden md:block
                            text-gray-700
                            font-medium
                            hover:text-[#ff295e]
                            transition
                        "
                    >
                        Masuk
                    </button>

                    <button
                        className="
                            px-6 py-3
                            rounded-xl
                            bg-[#ff295e]
                            text-white
                            font-semibold
                            hover:bg-[#e91e56]
                            transition
                            shadow-md
                        "
                    >
                        Daftar
                    </button>

                </div>

            </nav>
        </header>
    );
}