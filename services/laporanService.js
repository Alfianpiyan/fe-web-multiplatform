import api from "./api";

export const createLaporan = (data) => {
    return api.post("/laporan/create", data);
};

export const getMyDraftLaporan = () => {
    return api.get("/laporan/draft/me");
};

export const updateDraftLaporan = (id, data) => {
    return api.patch(`/laporan/draft/${id}`, data);
};

export const deleteDraftLaporan = (id) => {
    return api.delete(`/laporan/draft/${id}`);
};

export const submitLaporan = (id) => {
    return api.patch(`/laporan/submit/${id}`);
};

export const getMyLaporan = () => {
    return api.get("/laporan/me");
};

export const getPublicLaporan = () => {
    return api.get("/laporan");
};

export const getDetailLaporan = (id) => {
    return api.get(`/laporan/${id}`);
};

export const getDetailLaporanPrivate = (id) => {
    return api.get(`/laporan/detail/${id}`);
};

export const getMyDetailLaporan = (id) => {
    return api.get(`/laporan/me/${id}`);
};

export const getLaporanTimeline = (id) => {
    return api.get(`/laporan/${id}/timeline`);
};

export const createInternalComment = (id, komentar) => {
    return api.post(`/laporan/${id}/internal-comment`, {
        komentar,
    });
};

export const uploadProgressImages = (
    id,
    formData
) => {
    return api.post(
        `/laporan/${id}/progress`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};

export const getProgressImages = (id) => {
    return api.get(`/laporan/${id}/progress`);
};