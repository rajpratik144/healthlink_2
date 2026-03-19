import API from "./axios";

/* ================= SEARCH DOCTORS ================= */

export const searchDoctors = async (params = {}) => {
  const res = await API.get("/api/doctors/search", { params });
  return res.data;
};

/* ================= GET DOCTOR REVIEWS ================= */

export const getDoctorReviews = async (doctorId) => {
  const res = await API.get(`/api/doctors/${doctorId}/reviews`);
  return res.data;
};

/* ================= GET DOCTOR APPOINTMENTS ================= */
export const getDoctorAppointments = async () => {
  const res = await API.get("/api/doctor/appointments");
  return res.data;
};

/* ================= ACCEPT ================= */
export const acceptAppointment = async (id) => {
  const res = await API.patch(`/api/appointments/${id}/accept`);
  return res.data;
};

/* ================= REJECT ================= */
export const rejectAppointment = async (id) => {
  const res = await API.patch(`/api/appointments/${id}/reject`);
  return res.data;
};

/* ================= DASHBOARD STATS ================= */
export const getDoctorDashboard = async () => {
  const res = await API.get("/api/doctor/dashboard");
  return res.data;
};

/* ================= PENDING ================= */
export const getPendingAppointments = async () => {
  const res = await API.get("/api/doctor/appointments/pending");
  return res.data;
};

/* ================= UPCOMING ================= */
export const getUpcomingAppointments = async () => {
  const res = await API.get("/api/doctor/appointments/upcoming");
  return res.data;
};

/* ================= COMPLETED ================= */
export const getCompletedAppointments = async () => {
  const res = await API.get("/api/doctor/appointments/completed");
  return res.data;
};

/* ================= COMPLETE ================= */
export const completeAppointment = async (id) => {
  const res = await API.patch(`/api/doctor/appointments/${id}/complete`);
  return res.data;
};

/* ================= SUBMIT REVIEW ================= */
export const submitReview = async (data) => {
  const res = await API.post("/api/reviews", data);
  return res.data;
};