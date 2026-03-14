import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    // Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per doctor
    },

    // Professional Information
    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    bio: {
      type: String,
      required: true,
      minlength: 50,
      trim: true,
    },

    clinicName: {
      type: String,
      trim: true,
    },

    // Address Information
    region: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // Profile Image (Cloudinary secure URL)
    profileImage: {
      type: String,
      required: true,
    },

    // Rating Aggregation Fields (Optimized for search sorting)
    totalReviews: {
      type: Number,
      default: 0,
    },

    ratingSum: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      index: true,
    },

    // Working Schedule
    workingDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],

    startTime: {
      type: String, // Example: "09:00"
      required: true,
    },

    endTime: {
      type: String, // Example: "17:00"
      required: true,
    },

    slotDuration: {
      type: Number, // in minutes (30 or 45)
      enum: [30, 45],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
  Compound index to optimize doctor search
  Region + rating + experience filtering
*/
doctorProfileSchema.index({
  region: 1,
  averageRating: -1,
  experience: -1,
});

const DoctorProfile = mongoose.model(
  "DoctorProfile",
  doctorProfileSchema
);

export default DoctorProfile;