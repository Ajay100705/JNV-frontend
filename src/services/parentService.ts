import api from "../api/axios";


// GET all parents (principal view)
export const getParents = async () => {
  const response = await api.get("/parents/parents/");
  return response.data;
};

// DELETE parent (optional)
export const deleteParent = async (id: number) => {
  return await api.delete(`/parents/parents/${id}/`);
};

// GET single parent (optional detail page)
export const getParentById = async (id: number) => {
  const response = await api.get(`/parents/parents/${id}/`);
  return response.data;
};