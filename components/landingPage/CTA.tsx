import Link from "next/link";
import { Megaphone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">

        <div
          className="
            text-center
            border
            border-red-100
            rounded-3xl
            p-10
            bg-gradient-to-b
            from-red-50
            to-white
          "
        >

          <div
            className="
              mx-auto
              w-14
              h-14
              rounded-2xl
              bg-red-100
              flex
              items-center
              justify-center
            "
          >
            <Megaphone
              size={28}
              className="text-red-600"
            />
          </div>

          <h2
            className="
              mt-6
              text-3xl
              md:text-4xl
              font-bold
              text-gray-900
            "
          >
            Jangan Hanya Melihat.
            <br />
            Laporkan Sekarang.
          </h2>

          <p
            className="
              mt-4
              text-gray-600
              max-w-xl
              mx-auto
              leading-relaxed
            "
          >
            Ada jalan rusak, lampu jalan mati,
            sampah menumpuk, atau masalah lainnya?
            Sampaikan laporanmu dan bantu
            menciptakan perubahan nyata.
          </p>

          <Link
            href="/register"
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              px-6
              py-3
              rounded-xl
              bg-red-600
              text-white
              font-semibold
              hover:bg-red-700
              transition
            "
          >
            Buat Laporan
          </Link>

        </div>

      </div>
    </section>
  );
}