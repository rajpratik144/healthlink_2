import express from "express";
import { searchDoctors } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/doctors/search", searchDoctors);

export default router;