"use client";

import { useEffect, useState } from "react";
import {
  createLaporan,
  getDraftLaporan,
  submitLaporan,
  updateDraftLaporan,
  uploadLaporanImages,
} from "@/src/lib/laporan";
import { getAllKategori } from "@/services/adminService"; // 🌟 Import service kategori kamu

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("./LocationPicker"),
  { ssr: false }
);

interface Kategori {
  id: number;
  kategori: string;
}

export default function CreateLaporanForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]); // 🌟 State list kategori dari DB
  const [draftId, setDraftId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    kategori_id: 0,
    title: "",
    report_description: "",
    city: "",
    location_description: "",
    latitude: "",
    longitude: "",
    waktu_kejadian: "",
  });

  // 🌟 Daftar kota yang didukung oleh sistem aplikasi pengaduan
  const daftarKota = [
    "Bandung",
    "Bogor",
    "Depok",
    "Bekasi",
    "Jakarta",
    "Tangerang"
  ];

  useEffect(() => {
    initForm();
  }, []);

  const initForm = async () => {
    try {
      // Ambil list kategori dan draf secara bersamaan
      const [resKategori, resDraft] = await Promise.all([
        getAllKategori().catch(() => ({ data: { data: [] } })),
        getDraftLaporan()
      ]);

      setKategoriList(Array.isArray(resKategori.data?.data) ? resKategori.data.data : []);

      const draft = resDraft.data?.[0];

      if (draft) {
        setDraftId(draft.id);
        
        let formattedDate = "";
        if (draft.waktu_kejadian) {
          const dateObj = new Date(draft.waktu_kejadian);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().slice(0, 16);
          }
        }

        setForm({
          kategori_id: draft.kategori_id || 0,
          title: draft.title || "",
          report_description: draft.report_description || "",
          city: draft.city || "",
          location_description: draft.location_description || "",
          latitude: draft.latitude?.toString() || "",
          longitude: draft.longitude?.toString() || "",
          waktu_kejadian: formattedDate,
        });

        if (draft.images && Array.isArray(draft.images)) {
          const savedPreviews = draft.images.map((img: any) => img.url || img);
          setPreviewImages(savedPreviews);
        }
      } else {
        const created = await createLaporan({});
        setDraftId(created.data.data.laporan_id);
      }
    } catch (err) {
      console.log("Gagal memuat draf laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveField = async (key: keyof typeof form, value: any) => {
    const processedValue = key === "kategori_id"
      ? (value ? parseInt(value, 10) : 0)
      : value;

    const newData = {
      ...form,
      [key]: processedValue,
    };

    setForm(newData);

    if (!draftId) return;

    try {
      await updateDraftLaporan(draftId, newData);
    } catch (error) {
      console.log(`Gagal auto-save field [${key}]:`, error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert("Maksimal berkas foto bukti yang diizinkan adalah 5 gambar.");
      return;
    }

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async () => {
    if (!draftId || isSubmitting) return;

    // Validasi input kota sebelum kirim final
    if (!form.city) {
      alert("Silakan pilih kota lokasi kejadian terlebih dahulu!");
      return;
    }

    try {
      setIsSubmitting(true);

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append("images", image); 
        });

        console.log("Sedang memproses upload seluruh gambar bukti...");
        await uploadLaporanImages(draftId, formData);
        console.log("Upload gambar sukses!");
      }

      console.log("Sedang mengirimkan berkas laporan final...");
      await submitLaporan(draftId);

      alert("Laporan aduan masyarakat berhasil dikirim beserta seluruh gambar!");
      
      setForm({
        kategori_id: 0,
        title: "",
        report_description: "",
        city: "",
        location_description: "",
        latitude: "",
        longitude: "",
        waktu_kejadian: "",
      });
      setImages([]);
      setPreviewImages([]);
      
      router.push("/dashboard/laporan");
      window.location.href = "/dashboard/laporan"; 
    } catch (err: any) {
      console.error("Gagal mengirim berkas aduan:", err);
      alert(
        err?.response?.data?.message || 
        "Gagal memproses laporan. Pastikan berkas gambar tidak korup dan berukuran wajar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px] text-neutral-500 font-medium">
        <div className="animate-pulse">Memuat lembar draf aduan...</div>
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-neutral-900">
      {/* Bagian Atas / Judul Halaman */}
      <div>
        <h1 className="text-3xl font-bold text-red-600 tracking-tight">
          Buat Laporan
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Isi laporan aduan dengan teliti, data tersimpan otomatis sebagai draf.
        </p>
      </div>

      {/* Grid Utama Layout 3 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* PANEL KIRI (Ambil porsi lebar 2/3 halaman) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Pengisian Teks Laporan */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-xl text-neutral-800 border-b pb-2">
              Informasi Laporan
            </h2>

            <div className="space-y-4">
              {/* Dropdown Kategori Berdasarkan Database */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Kategori Aduan</label>
                <select
                  value={form.kategori_id}
                  onChange={(e) => saveField("kategori_id", e.target.value)}
                  className="w-full bg-transparent border border-neutral-200 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm cursor-pointer"
                >
                  <option value={0}>-- Pilih Kategori Masalah --</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Judul Laporan</label>
                <input
                  value={form.title}
                  onChange={(e) => saveField("title", e.target.value)}
                  placeholder="Masukkan judul laporan aduan yang jelas..."
                  className="w-full border border-neutral-200 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Deskripsi Kronologi Kejadian</label>
                <textarea
                  rows={5}
                  value={form.report_description}
                  onChange={(e) => saveField("report_description", e.target.value)}
                  placeholder="Rincikan kronologi kejadian perkara secara lengkap..."
                  className="w-full border border-neutral-200 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 🌟 TRANSFORMASI: Input Text Kota Diubah Menjadi Dropdown Select Pilihan Kota */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Kota / Kabupaten Kejadian</label>
                  <select
                    value={form.city}
                    onChange={(e) => saveField("city", e.target.value)}
                    className="w-full bg-transparent border border-neutral-200 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm cursor-pointer"
                  >
                    <option value="">-- Pilih Wilayah Kota --</option>
                    {daftarKota.map((kota) => (
                      <option key={kota} value={kota}>
                        {kota}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Waktu Kejadian</label>
                  <input
                    type="datetime-local"
                    value={form.waktu_kejadian}
                    onChange={(e) => saveField("waktu_kejadian", e.target.value)}
                    className="w-full border border-neutral-200 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Lokasi Detail / Patokan Alamat</label>
                <input
                  value={form.location_description}
                  onChange={(e) => saveField("location_description", e.target.value)}
                  placeholder="Contoh: Di depan ruko No. 45 dekat alun-alun kota"
                  className="w-full border border-neutral-200 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Card Upload Gambar & Pratinjau */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="font-bold text-xl text-neutral-800">Bukti Lampiran Gambar</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Unggah foto sebagai dokumen pendukung aduan (Maksimal 5 gambar).</p>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="upload-image"
            />

            <label
              htmlFor="upload-image"
              className="cursor-pointer border-2 border-dashed border-red-300 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 bg-red-50/10 transition-all group"
            >
              <span className="text-red-600 font-bold group-hover:text-red-700 text-sm transition-colors">
                Klik di sini untuk mengunggah berkas gambar bukti
              </span>
              <span className="text-neutral-400 text-xs">
                Maksimal 5 berkas gambar pendukung
              </span>
            </label>

            {/* Kotak Preview Gambar Terpilih */}
            {previewImages.length > 0 && (
              <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50/50 space-y-3">
                <h3 className="font-semibold text-neutral-700 text-xs tracking-wider uppercase">
                  Pratinjau Gambar Terpilih ({previewImages.length}/5)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {previewImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-white group shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPreviews = previewImages.filter((_, i) => i !== index);
                          const updatedImages = images.filter((_, i) => i !== index);
                          setPreviewImages(updatedPreviews);
                          setImages(updatedImages);
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-all shadow-md"
                        title="Hapus gambar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL KANAN: SIDEBAR PETA & SUBMIT */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4 relative z-10">
            <div>
              <h2 className="font-bold text-lg text-neutral-800">
                Lokasi Geografis Kejadian
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Cari alamat atau klik titik di peta secara presisi.</p>
            </div>
            
            {/* Wrapper Komponen Map */}
            <div className="rounded-xl overflow-hidden border border-neutral-100 shadow-inner">
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={(lat, lng) => {
                  const latStr = lat.toString();
                  const lngStr = lng.toString();

                  setForm((prev) => ({
                    ...prev,
                    latitude: latStr,
                    longitude: lngStr,
                  }));

                  if (!draftId) return;

                  updateDraftLaporan(draftId, {
                    ...form,
                    latitude: latStr,
                    longitude: lngStr,
                  }).catch((err) => console.log("Gagal mencatat titik peta koordinat:", err));
                }}
              />
            </div>

            {/* Note Kebijakan Informasi */}
            <div className="bg-neutral-50 rounded-xl p-3.5 text-xs text-neutral-500 space-y-1 border border-neutral-100">
              <p className="font-bold text-neutral-700">💡 Sistem Pengarsipan:</p>
              <p className="leading-relaxed">
                Setiap kolom yang diubah otomatis tersimpan ke server cloud. Anda dapat menutup atau meninggalkan halaman ini sewaktu-waktu tanpa kehilangan data masukan.
              </p>
            </div>

            {/* Tombol Eksekusi Aksi Pengiriman */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white tracking-wide transition-all shadow-sm ${
                isSubmitting 
                  ? "bg-neutral-400 cursor-not-allowed text-neutral-200" 
                  : "bg-red-600 hover:bg-red-700 active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? "Sedang Mengirim Laporan..." : "Kirim Laporan Sekarang"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}