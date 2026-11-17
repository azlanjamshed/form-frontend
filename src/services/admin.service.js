import api from "./api.js";

// Fetch submissions with pagination, search and status filters
export async function getAdminSubmissions({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) {
  const response = await api.get("/submissions", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
}

// Delete a submission
export async function deleteAdminSubmission(id) {
  const response = await api.delete(`/submissions/${id}`);

  return response.data;
}

// Enable or disable public sharing
export async function updateAdminSubmissionSharing(id, enabled) {
  const response = await api.patch(`/submissions/${id}/sharing`, {
    enabled,
  });

  return response.data;
}

// Create a collector
export async function createCollector(payload) {
  const response = await api.post("/collectors", payload);
  return response.data;
}

// Fetch all collectors
export async function getCollectors() {
  const response = await api.get("/collectors");
  return response.data;
}

// Activate or deactivate a collector
export async function updateCollectorStatus(id, isActive) {
  const response = await api.patch(`/collectors/${id}/status`, {
    isActive,
  });

  return response.data;
}

// Fetch collector details
export async function getCollectorById(id) {
  const response = await api.get(`/collectors/${id}`);
  return response.data;
}

export async function resetCollectorPassword(id) {
  const response = await api.post(`/collectors/${id}/reset-password`);

  return response.data;
}
