import api from "./api.js";

export async function saveDraft(payload, signal) {
  const response = await api.put("/submissions/draft", payload, { signal });

  return response.data;
}

export async function completeStageOne(payload) {
  const response = await api.post("/verification/stage-one", payload);

  return response.data;
}

export async function completeStageTwo(payload) {
  const response = await api.post("/verification/stage-two", payload);

  return response.data;
}
// Verify Stage 2 mobile number against Stage 1
export async function verifyStageTwoMobile(mobileNumber) {
  const response = await api.post("/submissions/verify-stage-two-mobile", {
    mobileNumber,
  });

  return response.data;
}
// Fetch a publicly shared submission
export async function getPublicSharedSubmission(publicShareId) {
  const response = await api.get(`/submissions/public/${publicShareId}`);

  return response.data;
}

export async function saveToolPin(toolpin) {
  const response = await api.post("/submissions/toolpin", {
    toolpin,
  });

  return response.data;
}
