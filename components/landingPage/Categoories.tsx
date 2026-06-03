import {
    TrafficCone,
    Car,
    Trees,
    Shield,
    HeartPulse,
    Building2,
    CloudLightning,
    FileText
} from "lucide-react";

const categories = [
    {
        icon: TrafficCone,
        title: "Fasilitas Umum",
        description:
            "Laporan fasilitas umum rusak atau tidak berfungsi."
    },
    {
        icon: Car,
        title: "Lalu Lintas",
        description:
            "Kemacetan, rambu rusak, dan masalah jalan raya."
    },
    {
        icon: Trees,
        title: "Lingkungan",
        description:
            "Sampah, pencemaran, dan kebersihan lingkungan."
    },
    {
        icon: Shield,
        title: "Keamanan",
        description:
            "Gangguan keamanan dan ketertiban masyarakat."
    },
    {
        icon: HeartPulse,
        title: "Kesehatan",
        description:
            "Fasilitas dan layanan kesehatan masyarakat."
    },
    {
        icon: Building2,
        title: "Pelayanan Publik",
        description:
            "Layanan pemerintahan dan administrasi publik."
    },
    {
        icon: CloudLightning,
        title: "Bencana Alam",
        description:
            "Kejadian bencana yang membutuhkan perhatian."
    },
    {
        icon: FileText,
        title: "Lainnya",
        description:
            "Laporan yang tidak termasuk kategori lainnya."
    }
];

export default function Categories() {
    return (
        <section
            id="kategori"
            className="py-24 bg-gray-50"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <div className="text-center mb-16">

                    <span
                        className="
                            text-[#ff295e]
                            font-semibold
                            uppercase
                            tracking-wider
                        "
                    >
                        Kategori Laporan
                    </span>

                    <h2
                        className="
                            mt-3
                            text-4xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Pilih Kategori Sesuai
                        Permasalahan Anda
                    </h2>

                    <p
                        className="
                            mt-4
                            text-gray-600
                            max-w-2xl
                            mx-auto
                        "
                    >
                        Berbagai kategori laporan tersedia
                        untuk memudahkan masyarakat
                        menyampaikan permasalahan secara
                        tepat dan cepat.
                    </p>

                </div>

                <div
                    className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                    "
                >
                    {categories.map(
                        (category, index) => {
                            const Icon = category.icon;

                            return (
                                <div
                                    key={index}
                                    className="
                                        bg-white
                                        p-6
                                        rounded-3xl
                                        border
                                        border-gray-100
                                        shadow-sm
                                        hover:shadow-xl
                                        hover:-translate-y-2
                                        transition-all
                                        duration-300
                                        cursor-pointer
                                    "
                                >
                                    <div
                                        className="
                                            w-14
                                            h-14
                                            rounded-2xl
                                            bg-red-50
                                            flex
                                            items-center
                                            justify-center
                                            mb-5
                                        "
                                    >
                                        <Icon
                                            size={28}
                                            className="
                                                text-[#ff295e]
                                            "
                                        />
                                    </div>

                                    <h3
                                        className="
                                            text-lg
                                            font-semibold
                                            text-gray-900
                                            mb-2
                                        "
                                    >
                                        {category.title}
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-600
                                            leading-relaxed
                                        "
                                    >
                                        {category.description}
                                    </p>
                                </div>
                            );
                        }
                    )}
                </div>

            </div>
        </section>
    );
}