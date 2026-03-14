import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

import {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  toggleDoctorActive
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/doctors/pending", getPendingDoctors);

router.patch("/doctors/:id/approve", approveDoctor);

router.patch("/doctors/:id/reject", rejectDoctor);

router.patch("/doctors/:id/toggle-active", toggleDoctorActive);

export default router;