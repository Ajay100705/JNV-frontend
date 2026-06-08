const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "";

export const getMediaUrl = (path?: string | null) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};