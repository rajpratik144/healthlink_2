import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { completeDoctorProfile } from "../controllers/doctor.controller.js";

const router = express.Router();

/*
  Doctor Profile Completion (Step 2)

  - Must be logged in
  - Must have role = doctor
  - Must upload profileImage (multipart/form-data)
*/
router.post(
  "/profile/complete",
  protect,
  authorize("doctor"),
  upload.single("profileImage"),
  completeDoctorProfile
);

export default router;