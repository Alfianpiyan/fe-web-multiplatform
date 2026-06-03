import Link from "next/link";

export default function Hero() {
    return (
        <section
            id="hero"
            className="
                min-h-screen
                flex
                items-center
                bg-white
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    lg:px-8
                    grid
                    lg:grid-cols-2
                    gap-12
                    items-center
                "
            >
                <div>

                    <span
                        className="
                            inline-block
                            px-4
                            py-2
                            rounded-full
                            bg-red-50
                            text-[#ff295e]
                            font-medium
                            text-sm
                            mb-5
                        "
                    >
                        Platform Pengaduan Masyarakat
                    </span>

                    <h1
                        className="
                            text-5xl
                            lg:text-6xl
                            font-bold
                            leading-tight
                            text-gray-900
                        "
                    >
                        Laporkan Masalah di
                        <span className="text-[#ff295e]">
                            {" "}Sekitarmu
                        </span>
                        <br />
                        Dengan Cepat dan Mudah
                    </h1>

                    <p
                        className="
                            mt-6
                            text-lg
                            text-gray-600
                            leading-relaxed
                            max-w-xl
                        "
                    >
                        LaporYuk membantu masyarakat
                        menyampaikan laporan terkait
                        fasilitas umum, kebersihan,
                        keamanan, kesehatan, dan
                        pelayanan publik secara
                        transparan dan terpantau.
                    </p>

                    <div className="mt-8 flex gap-4">

                        <Link
                            href="/register"
                            className="
                                px-7 py-4
                                rounded-xl
                                bg-[#ff295e]
                                text-white
                                font-semibold
                                hover:bg-[#e91e56]
                                transition
                            "
                        >
                            Buat Laporan
                        </Link>

                        <Link
                            href="/laporan"
                            className="
                                px-7 py-4
                                rounded-xl
                                border
                                border-gray-300
                                font-semibold
                                hover:border-[#ff295e]
                                hover:text-[#ff295e]
                                transition
                            "
                        >
                            Lihat Laporan
                        </Link>

                    </div>
                </div>

                <div className="flex justify-center">
                    <img
                        src="/hero.png"
                        alt="LaporYuk" 
                        className="
                            w-full
                            max-w-[650px]
                            animate-float
                        "
                    />
                </div>
            </div>
        </section>
    );
}