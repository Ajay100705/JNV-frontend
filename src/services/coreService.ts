import api from "../api/axios";

// get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get("/core/dashboard-stats/");
  return response.data;
};

// get house wise student count
export const getHouseWiseStudents = async () => {
  const response = await api.get("/core/house-wise-students/");
  return response.data;
};

