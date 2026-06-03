"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Mail,
  Phone,
  MapPin,
  ChevronUp,
} from "lucide-react";

import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main Footer */}
        <div className="py-16 grid lg:grid-cols-4 gap-10">

          {/* Logo & Description */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <Image
                src="/logo.png"
                alt="LaporYuk"
                width={50}
                height={50}
                className="object-contain"
              />

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  LaporYuk
                </h3>

                <p className="text-sm text-red-500">
                  LAPOR YUK, BIAR AMAN
                </p>
              </div>

            </div>

            <p className="mt-5 text-gray-600 max-w-md leading-relaxed">
              Platform pengaduan masyarakat yang membantu
              warga menyampaikan laporan secara cepat,
              transparan, dan mudah dipantau hingga proses
              penyelesaiannya.
            </p>

          </div>

          {/* Navigation */}
          <div>

            <h4 className="font-semibold text-gray-900 mb-4">
              Navigasi
            </h4>

            <div className="space-y-3">

              <Link
                href="#"
                className="block text-gray-600 hover:text-red-600 transition"
              >
                Beranda
              </Link>

              <Link
                href="#kategori"
                className="block text-gray-600 hover:text-red-600 transition"
              >
                Kategori
              </Link>

              <Link
                href="#cara-kerja"
                className="block text-gray-600 hover:text-red-600 transition"
              >
                Cara Kerja
              </Link>

              <Link
                href="#statistik"
                className="block text-gray-600 hover:text-red-600 transition"
              >
                Statistik
              </Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h4 className="font-semibold text-gray-900 mb-4">
              Kontak
            </h4>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-red-600"
                />
                <span className="text-gray-600">
                  support@laporyuk.id
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-red-600"
                />
                <span className="text-gray-600">
                  +62 812 3456 7890
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin
                  size={18}
                  className="text-red-600"
                />
                <span className="text-gray-600">
                  Indonesia
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div
          className="
            border-t
            border-gray-200
            py-6
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-4
          "
        >

          <p className="text-sm text-gray-500">
            © 2026 LaporYuk. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <Link
              href="https://github.com"
              target="_blank"
              className="
                text-gray-500
                hover:text-red-600
                transition
              "
            >
              <FaGithub size={20} />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              className="
                text-gray-500
                hover:text-red-600
                transition
              "
            >
              <FaInstagram size={20} />
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              className="
                text-gray-500
                hover:text-red-600
                transition
              "
            >
              <FaLinkedin size={20} />
            </Link>

            <button
              onClick={scrollToTop}
              className="
                w-10
                h-10
                rounded-xl
                bg-red-600
                text-white
                flex
                items-center
                justify-center
                hover:bg-red-700
                transition
              "
            >
              <ChevronUp size={18} />
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
}