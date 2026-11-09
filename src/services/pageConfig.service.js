import api from "./api.js";

export async function getPublicPageConfig(signal) {
  const response = await api.get("/page-config/public", {
    signal,
  });

  return response.data?.data ?? response.data;
}
// Update public form headings (admin only)
export async function updatePageConfig({ heading, stageTwoHeading }) {
  const response = await api.put("/page-config", {
    heading,
    stageTwoHeading,
  });

  return response.data;
}
