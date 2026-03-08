import api from "../api/axios";

// create house master
export const assignHouseMaster = (data: {
  teacher: number;
  house: number;
}) => api.post("/houses/house-masters/", data);

// get all house masters
export const getTeachers = () => api.get("/teachers/");
export const getHouses = () => api.get("/houses/houses/");
export const getHouseMasters = () => api.get("/houses/house-masters/");

// delete house master
export const deleteHouseMaster = (id: number) =>
  api.delete(`/houses/house-masters/${id}/`);

// update house master
export const updateHouseMaster = (id: number, data: {
  teacher: number;
  house: number;
}) => api.put(`/houses/house-masters/${id}/`, data);

// get house master dashboard stats
export const getHouseMasterStats = async () => {
  const res = await api.get("/houses/house-dashboard/");
  return res.data;
};

// get students of a house
export const getHouseStudents = async () => {
  const res = await api.get("/houses/house-students/");
  return res.data;
};

//  today leave students
export const getTodayLeaveStudents = async () => {
  const res = await api.get("/houses/today-leave-students/");
  return res.data;
};



