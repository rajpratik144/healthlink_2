import Review from "../models/Review.js";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";

export const createReview = async (req, res) => {
  try {

    const patientId = req.user._id;

    const { appointmentId, rating, comment } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.patient.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed appointments"
      });
    }

    const review = await Review.create({
      doctor: appointment.doctor,
      patient: patientId,
      appointment: appointmentId,
      rating,
      comment
    });

    const profile = await DoctorProfile.findOne({
      user: appointment.doctor
    });

    profile.totalReviews += 1;
    profile.ratingSum += rating;
    profile.averageRating =
      profile.ratingSum / profile.totalReviews;

    await profile.save();

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

    res.status(500).json({
      success: false,
      message: "Failed to submit review"
    });
  }
};

export const getDoctorReviews = async (req, res) => {
  try {

    const doctorId = req.params.doctorId;

    const reviews = await Review.find({ doctor: doctorId })
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};