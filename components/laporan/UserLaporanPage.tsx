"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  PlusCircle,
  Search,
  Clock3,
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { getMyLaporan } from "@/services/laporanService";

interface Laporan {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function UserLaporan() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, []);

 const fetchLaporan = async () => {
  try {
    const response = await getMyLaporan();

    setLaporan(
      Array.isArray(response.data.data)
        ? response.data.data
        : []
    );
  } catch (error) {
    console.error(error);
    setLaporan([]);
  } finally {
    setLoading(false);
  }
};

  const pending = laporan.filter(
    (item) => item.status === "pending"
  ).length;

  const diperiksa = laporan.filter(
    (item) => item.status === "diperiksa"
  ).length;

  const tindakLanjut = laporan.filter(
    (item) => item.status === "tindak_lanjut"
  ).length;

  const selesai = laporan.filter(
    (item) => item.status === "selesai"
  ).length;

  const filtered = laporan.filter((item) =>
    item.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "diperiksa":
        return "bg-blue-100 text-blue-700";

      case "tindak_lanjut":
        return "bg-orange-100 text-orange-700";

      case "selesai":
        return "bg-green-100 text-green-700";

      case "ditolak":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Memuat laporan...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-600">
            Laporan Saya
          </h1>

          <p className="text-neutral-900">
            Kelola laporan yang pernah Anda buat
          </p>
        </div>

        <Link
          href="/dashboard/laporan/create"
          className="
            flex items-center gap-2
            bg-red-600
            hover:bg-red-700
            text-white
            px-5 py-3
            rounded-xl
          "
        >
          <PlusCircle size={18} />
          Buat Laporan
        </Link>
      </div>

      {/* Statistik */}
      <div className="grid md:grid-cols-4 gap-5 text-neutral-900">
        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock3 size={24} />}
        />

        <StatCard
          title="Diperiksa"
          value={diperiksa}
          icon={<ClipboardCheck size={24} />}
        />

        <StatCard
          title="Tindak Lanjut"
          value={tindakLanjut}
          icon={<Wrench size={24} />}
        />

        <StatCard
          title="Selesai"
          value={selesai}
          icon={<CheckCircle2 size={24} />}
        />
      </div>

      {/* Search */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="relative">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-neutral-900
            "
          />

          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              border
              rounded-xl
              pl-10
              pr-4
              py-3
            "
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white text-neutral-900 border rounded-2xl p-6 text-center">
            Belum ada laporan
          </div>
        ) : (
          filtered.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/laporan/${item.id}`}
              className="
                block
                bg-white
                border
                rounded-2xl
                p-5
                hover:shadow-md
                transition
              "
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.title}
                  </h2>

                  <p className="text-sm text-neutral-900">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm
                      ${statusColor(item.status)}
                    `}
                  >
                    {item.status}
                  </span>

                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div>{icon}</div>

      <h2 className="text-3xl font-bold mt-4">
        {value}
      </h2>

      <p className="text-slate-600 mt-1">
        {title}
      </p>
    </div>
  );
}