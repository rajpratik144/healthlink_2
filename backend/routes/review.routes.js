import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { createReview } from "../controllers/review.controller.js";
import { getDoctorReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post(
  "/reviews",
  protect,
  authorize("patient"),
  createReview
);

router.get("/doctors/:doctorId/reviews", getDoctorReviews);
export default router;