import api from "../api/axios";

// create a student
export const addStudent = async (formData: FormData) => {

  

  const response = await api.post(
    "/students/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// get all students
export const getStudents = async () => {
  const response = await api.get("/students/");
  return response.data;
};

// delete a student
export const deleteStudent = async (id: number) => {
  const response = await api.delete(`/students/${id}/`);
  return response.data;
};

// update a student
export const updateStudent = async (id: number, formData: FormData) => {
  const response = await api.put(`/students/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};