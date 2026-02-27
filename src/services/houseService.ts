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





