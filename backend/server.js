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
import { sendEmail } from "./utils/email.js";
import reviewRoutes from "./routes/review.routes.js";


const app = express();

/*
  Database connection
*/
connectDB();

/*
  Security middleware
*/
app.use(helmet());


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/*
  CORS configuration
  Replace origin with frontend URL in production
*/
app.use(
  cors({
    origin: ["http://localhost:5173",
    "https://healthlink-frontend.vercel.app/"],
    credentials: true,
  })
);

/*
  Body parsers
*/
app.use(express.json());
app.use(cookieParser());

/*
  Health check route
*/
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

// quick test

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
// till here

// test email
app.get("/api/test/email", async (req, res) => {

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "HealthLink Email Test",
    text: "If you received this email, your email service is working."
  });

  res.json({
    success: true,
    message: "Test email sent"
  });

});
// till here
/*
  Global error fallback
*/
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
