import Review from "../models/Review.js";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";

/* ================= CREATE REVIEW ================= */

export const createReview = async (req, res) => {
  try {

    const patientId = req.user._id;
    const { appointmentId, rating, comment } = req.body;

    // ✅ populate doctor
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor"); // IMPORTANT

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // ✅ ownership check
    if (appointment.patient.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // ✅ only completed
    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed appointments"
      });
    }

    // ✅ FIX: use USER ID directly
    const review = await Review.create({
      doctor: appointment.doctor._id, // ✅ FIXED
      patient: patientId,
      appointment: appointmentId,
      rating,
      comment
    });

    // ✅ update doctor profile stats
    const profile = await DoctorProfile.findOne({
      user: appointment.doctor._id // ✅ FIXED
    });

    if (profile) {
      profile.totalReviews += 1;
      profile.ratingSum += rating;
      profile.averageRating =
        profile.ratingSum / profile.totalReviews;

      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this appointment"
      });
    }

    console.error("Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit review"
    });
  }
};


/* ================= GET REVIEWS ================= */

export const getDoctorReviews = async (req, res) => {
  try {

    const doctorId = req.params.doctorId;

    const reviews = await Review.find({ doctor: doctorId })
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating
    });

  } catch (error) {

    console.error("Fetch Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};