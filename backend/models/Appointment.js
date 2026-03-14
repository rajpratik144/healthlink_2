import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    timeSlot: {
      type: String, // Example: "10:00 - 10:30"
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

/*
  Prevent double booking of same doctor, date, and time slot
*/
appointmentSchema.index(
  {
    doctor: 1,
    appointmentDate: 1,
    timeSlot: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: "cancelled" }
    }
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;