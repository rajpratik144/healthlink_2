import API from "./axios";

/* GET AVAILABLE SLOTS */

export const getAvailableSlots = async (doctorId, date) => {
  const res = await API.get("/api/appointments/slots", {
    params: { doctorId, date }
  });

  return res.data;
};

/* BOOK APPOINTMENT */

export const bookAppointment = async (data) => {
  const res = await API.post("/api/appointments/book", data);
  return res.data;
};