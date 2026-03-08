import api from "@/api/axios";

export const getTeachers = () =>
  api.get("/academic/principal/teachers/");

export const getClassRooms = () =>
  api.get("/classes/classrooms/");

export const assignClassTeacher = (data: any) =>
  api.post("/academic/principal/assign-class-teacher/", data);

export const getClassTeachers = async () => {
  const res = await api.get("/academic/principal/class-teachers/");
  return res.data;
};

export const deleteClassTeacher = async (id: number) => {
  return api.delete(`/academic/principal/class-teachers/${id}/`);
};

