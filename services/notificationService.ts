import api from "../src/lib/api"; // Sesuaikan dengan path instance axios kamu

export const getMyNotifications = () => {
  return api.get("/notifications");
};

export const getUnreadNotifications = () => {
  return api.get("/notifications/unread");
};

export const getUnreadNotificationCount = () => {
  return api.get("/notifications/unread/count");
};

export const markNotificationAsRead = (id: number | string) => {
  return api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return api.patch("/notifications/read-all");
};

export const deleteNotification = (id: number | string) => {
  return api.delete(`/notifications/${id}`);
};

export const deleteAllNotifications = () => {
  return api.delete("/notifications");
};