import api from "../src/lib/api";

export interface LaporanData {
  kategori_id?: number | null;

  title?: string | null;

  report_description?: string | null;

  city?: string | null;

  location_description?: string | null;

  latitude?: string | null;

  longitude?: string | null;

  waktu_kejadian?: string | null;
}
export const createLaporan = (
  data: Partial<LaporanData>
) => {
  return api.post("/laporan/create", data);
};

export const getMyDraftLaporan = () => {
  return api.get("/laporan/draft/me");
};

export const getMyLaporan = () => {
  return api.get("/laporan/me");
};

export const getDraftLaporan = async () => {
  const response = await api.get(
    "/laporan/draft/me"
  );

  return response.data;
};

export const updateDraftLaporan = (
  id: number | string,
  data: Partial<LaporanData>
) => {
  return api.patch(
    `/laporan/draft/${id}`,
    data
  );
};

export const uploadLaporanImages = (
  id: number | string,
  formData: FormData
) => {
  return api.post(
    `/laporan/upload-images/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

export const submitLaporan = (
  id: number | string
) => {
  return api.patch(
    `/laporan/submit/${id}`
  );
};