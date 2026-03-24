import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { protect } from "./middleware/auth.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import searchRoutes from "./routes/search.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

/* ================= DB ================= */
connectDB();

/* ================= SECURITY ================= */
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* ================= CORS (FIXED) ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://healthlink-frontend.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false); // ✅ DO NOT THROW ERROR
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* ✅ VERY IMPORTANT */
app.options("/*", cors(corsOptions));

/* ================= PARSERS ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HealthLink API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", searchRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", reviewRoutes);

/* ================= TEST ================= */

app.get("/api/test/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: {
      id: req.user._id,
      role: req.user.role,
    },
  });
});

/* ================= ERROR HANDLER (FIXED) ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});