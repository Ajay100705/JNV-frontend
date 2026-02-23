import api from "../api/axios";

// create a teacher
export const addTeacher = async (formData: FormData) => {
  const response = await api.post(
    "/teachers/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// get all teachers
export const getTeachers = async () => {
  const response = await api.get("/teachers/");
  return response.data;
};

// delete a teacher
export const deleteTeacher = async (id: number) => {
  const response = await api.delete(`/teachers/${id}/`);
  return response.data;
};

// update a teacher
export const updateTeacher = async (id: number, formData: FormData) => {
  const response = await api.put(`/teachers/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};