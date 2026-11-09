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
