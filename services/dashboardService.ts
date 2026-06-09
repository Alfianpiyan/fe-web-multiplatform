import api from "./api";

export const getUserDashboard = async () => {
  const response = await api.get("/dashboard/user");

  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard/admin");

  return response.data;
};

export const getSuperAdminDashboard = async () => {
  const response = await api.get("/dashboard/superadmin");

  return response.data;
};