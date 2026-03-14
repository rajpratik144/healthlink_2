import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getAvailableSlots } from "../controllers/appointment.controller.js";
import { bookAppointment } from "../controllers/appointment.controller.js";
import { cancelAppointment } from "../controllers/appointment.controller.js";
import {
  acceptAppointment,
  rejectAppointment
} from "../controllers/appointment.controller.js";
import {
  getDoctorPendingAppointments,
  getDoctorUpcomingAppointments,
  getDoctorCompletedAppointments,
  markAppointmentCompleted
} from "../controllers/appointment.controller.js";

import { getDoctorDashboardStats } from "../controllers/appointment.controller.js";

import { getPatientAppointments } from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/appointments/slots", protect, getAvailableSlots);
router.post("/appointments/book", protect, bookAppointment);
router.patch("/appointments/:id/cancel", protect, cancelAppointment);
router.patch("/appointments/:id/accept", protect, authorize("doctor"), acceptAppointment);
router.patch("/appointments/:id/reject", protect, authorize("doctor"), rejectAppointment);
router.get(
  "/doctor/appointments/pending",
  protect,
  authorize("doctor"),
  getDoctorPendingAppointments
);

router.get(
  "/doctor/appointments/upcoming",
  protect,
  authorize("doctor"),
  getDoctorUpcomingAppointments
);

router.get(
  "/doctor/appointments/completed",
  protect,
  authorize("doctor"),
  getDoctorCompletedAppointments
);

router.patch(
  "/doctor/appointments/:id/complete",
  protect,
  authorize("doctor"),
  markAppointmentCompleted
);

router.get(
  "/doctor/dashboard",
  protect,
  authorize("doctor"),
  getDoctorDashboardStats
);

router.get(
  "/patient/appointments",
  protect,
  authorize("patient"),
  getPatientAppointments
);

export default router;