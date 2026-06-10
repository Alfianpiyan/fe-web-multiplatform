"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createLaporan,
  getDraftLaporan,
  submitLaporan,
  updateDraftLaporan,
  uploadLaporanImages,
} from "@/services/laporanService";

import { getKategori } from "@/src/lib/kategori";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("./LocationPicker"),
  {
    ssr: false,
  }
);



export default function CreateLaporanForm() {

    const [images, setImages] = useState<File[]>([]);

    const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [draftId, setDraftId] =
    useState<number | null>(null);

  const [kategori, setKategori] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

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

  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      const res = await getDraftLaporan();

      const draft = res.data?.[0];

      if (draft) {
        setDraftId(draft.id);

        setForm({
          kategori_id:
            draft.kategori_id || "",
          title: draft.title || "",
          report_description:
            draft.report_description ||
            "",
          city: draft.city || "",
          location_description:
            draft.location_description ||
            "",
          latitude:
            draft.latitude || "",
          longitude:
            draft.longitude || "",
          waktu_kejadian:
            draft.waktu_kejadian || "",
        });
      } else {
        const created =
          await createLaporan({});

        setDraftId(
          created.data.data.laporan_id
        );
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const saveField = async (key: keyof typeof form, value: string) => {
  // Jika yang diubah adalah kategori_id, konversi string ke number. Jika kosong, set null.
  const processedValue = key === "kategori_id" 
    ? (value ? parseInt(value, 10) : null) 
    : value;

  const newData = {
    ...form,
    [key]: processedValue,
  };

  // @ts-ignore (Mengabaikan peringatan tipe data sementara pada local state jika diperlukan)
  setForm(newData);

  if (!draftId) return;

  try {
    await updateDraftLaporan(draftId, newData);
  } catch (error) {
    console.log("Gagal auto-save field:", error);
  }
};

 const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!e.target.files) return;

  const files = Array.from(
    e.target.files
  );

  setImages(files);

  const previews = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreviewImages(previews);
};

  const handleSubmit =
    async () => {
      if (!draftId) return;

      try {
        await submitLaporan(
          draftId
        );

        alert(
          "Laporan berhasil dikirim"
        );
      } catch (err: any) {
        alert(
          err?.response?.data
            ?.message ||
            "Gagal submit"
        );
      }
    };

  if (loading)
    return (
      <p className="text-black">
        Loading...
      </p>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Buat Laporan
        </h1>

        <p className="text-black">
          Isi laporan dengan
          lengkap.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-xl text-black">
            Informasi Laporan
          </h2>
          <input
            value={form.title}
            onChange={(e) =>
              saveField(
                "title",
                e.target.value
              )
            }
            placeholder="Judul laporan"
            className="w-full border p-3 rounded-lg text-black"
          />

          <textarea
            rows={5}
            value={
              form.report_description
            }
            onChange={(e) =>
              saveField(
                "report_description",
                e.target.value
              )
            }
            placeholder="Deskripsi laporan"
            className="w-full border p-3 rounded-lg text-black"
          />

          <input
            value={form.city}
            onChange={(e) =>
              saveField(
                "city",
                e.target.value
              )
            }
            placeholder="Kota"
            className="w-full border p-3 rounded-lg text-black"
          />

          <input
            value={
              form.location_description
            }
            onChange={(e) =>
              saveField(
                "location_description",
                e.target.value
              )
            }
            placeholder="Lokasi detail"
            className="w-full border p-3 rounded-lg text-black"
          />

          <input
            type="datetime-local"
            value={
              form.waktu_kejadian
            }
            onChange={(e) =>
              saveField(
                "waktu_kejadian",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg text-black"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="upload-image"
            />
        </div>

        <label
  htmlFor="upload-image"
  className="
    cursor-pointer
    border-2
    border-dashed
    border-red-500
    rounded-2xl
    p-8
    flex
    flex-col
    items-center
    justify-center
    gap-3
    bg-white
  "
>
  <span className="text-red-600 font-semibold">
    Klik untuk upload gambar
  </span>

  <span className="text-black text-sm">
    Maksimal 5 gambar
  </span>
</label>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-bold text-xl text-black mb-4">
            Lokasi Kejadian
          </h2>
        <LocationPicker
        latitude={form.latitude}
        longitude={form.longitude}
        onChange={(
            lat,
            lng
        ) => {
            saveField(
            "latitude",
            lat.toString()
            );

            saveField(
            "longitude",
            lng.toString()
            );
        }}
        />
        </div>
      </div>

      <button
        onClick={
          handleSubmit
        }
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold"
      >
        Kirim Laporan
      </button>
    </div>
  );
}