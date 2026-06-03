"use client";

import { useState } from "react";

import {
  FileText,
  Clock3,
  BadgeCheck,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Buat Laporan",
    description:
      "Laporkan permasalahan yang terjadi di sekitar Anda dengan melampirkan foto, lokasi, dan deskripsi kejadian.",
  },
  {
    icon: Clock3,
    title: "Pending",
    description:
      "Laporan berhasil diterima dan sedang menunggu proses review dari admin terkait.",
  },
  {
    icon: BadgeCheck,
    title: "Diverifikasi",
    description:
      "Admin melakukan pengecekan dan memastikan laporan yang dikirim valid serta dapat diproses.",
  },
  {
    icon: Wrench,
    title: "Ditindaklanjuti",
    description:
      "Instansi atau pihak terkait mulai menangani permasalahan yang telah dilaporkan.",
  },
  {
    icon: CheckCircle2,
    title: "Selesai",
    description:
      "Permasalahan berhasil ditangani dan laporan dinyatakan selesai.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="cara-kerja"
      className="py-24  bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">

          <span
            className="
              inline-flex
              px-4
              py-2
              rounded-full
              bg-red-50
              text-red-600
              text-sm
              font-medium
            "
          >
            Cara Kerja
          </span>

          <h2
            className="
              mt-5
              text-4xl
              md:text-5xl
              font-bold
              text-gray-900
            "
          >
            Proses Laporan
            <span className="text-red-600">
              {" "}LaporYuk
            </span>
          </h2>

          <p
            className="
              mt-4
              text-gray-500
              max-w-2xl
              mx-auto
            "
          >
            Setiap laporan akan dipantau hingga
            selesai agar masyarakat mendapatkan
            transparansi proses yang jelas.
          </p>

        </div>

        {/* Stepper */}
        <div className="relative mb-14">

          {/* Garis */}
          <div
            className="
              hidden
              md:block
              absolute
              top-7
              left-0
              right-0
              h-[2px]
              bg-gray-200
            "
          />

          <div
            className="
              relative
              grid
              grid-cols-2
              md:grid-cols-5
              gap-6
            "
          >
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <button
                  key={index}
                  onClick={() =>
                    setActiveStep(index)
                  }
                  className="
                    flex
                    flex-col
                    items-center
                    text-center
                  "
                >
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300
                      z-10
                      ${
                        activeStep === index
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-white border border-gray-200 text-gray-500"
                      }
                    `}
                  >
                    <Icon size={24} />
                  </div>

                  <span
                    className={`
                      mt-3
                      text-sm
                      font-medium
                      transition
                      ${
                        activeStep === index
                          ? "text-red-600"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Card */}
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            p-8
            md:p-10
            shadow-sm
          "
        >
          <div className="flex items-center gap-4 mb-5">

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-red-50
                flex
                items-center
                justify-center
              "
            >
              {(() => {
                const Icon =
                  steps[activeStep].icon;

                return (
                  <Icon
                    size={30}
                    className="text-red-600"
                  />
                );
              })()}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Langkah {activeStep + 1}
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                "
              >
                {steps[activeStep].title}
              </h3>
            </div>

          </div>

          <p
            className="
              text-gray-600
              leading-relaxed
              text-lg
            "
          >
            {steps[activeStep].description}
          </p>
        </div>

      </div>
    </section>
  );
}