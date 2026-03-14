import express from "express";
import {
  registerPatient,
  registerDoctor,
  login,
  logout,
} from "../controllers/auth.controller.js";

import validate from "../middleware/validate.middleware.js";

import {
  registerPatientSchema,
  registerDoctorSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

/*
  Patient Registration
*/
router.post(
  "/register/patient",
  validate(registerPatientSchema),
  registerPatient
);

/*
  Doctor Registration (Step 1)
*/
router.post(
  "/register/doctor",
  validate(registerDoctorSchema),
  registerDoctor
);

/*
  Login
*/
router.post(
  "/login",
  validate(loginSchema),
  login
);

/*
  Logout
*/
router.post("/logout", logout);

export default router;