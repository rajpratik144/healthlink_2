import API from "./axios";

/* ================= REGISTER ================= */
export const registerUser = async (data) => {
  const res = await API.post("/api/auth/register/patient", data);
  return res.data;
};

/* ================= LOGIN ================= */
export const loginUser = async (data) => {
  const res = await API.post("/api/auth/login", data);
  return res.data;
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  const res = await API.post("/api/auth/logout");
  return res.data;
};

/* ================= CURRENT USER ================= */
export const getCurrentUser = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};