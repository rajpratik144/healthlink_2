import express from "express";
import {
  registerPatient,
  registerDoctor,
  login,
  logout,
} from "../controllers/auth.controller.js";

import validate from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

import {
  registerPatientSchema,
  registerDoctorSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

/*
  ===============================
  PATIENT REGISTRATION
  ===============================
*/
router.post(
  "/register/patient",
  validate(registerPatientSchema),
  registerPatient
);

/*
  ===============================
  DOCTOR REGISTRATION (STEP 1)
  ===============================
*/
router.post(
  "/register/doctor",
  validate(registerDoctorSchema),
  registerDoctor
);

/*
  ===============================
  LOGIN
  ===============================
*/
router.post(
  "/login",
  validate(loginSchema),
  login
);

/*
  ===============================
  LOGOUT
  ===============================
*/
router.post("/logout", logout);

/*
  ===============================
  GET CURRENT USER (🔥 IMPORTANT)
  ===============================
  Used by frontend to persist login state
*/
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profileCompleted: req.user.profileCompleted,
    },
  });
});

export default router;