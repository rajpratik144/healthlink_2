import DoctorProfile from "../models/DoctorProfile.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

/*
  Generate available slots for a doctor on a specific date
*/
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "doctorId and date are required"
      });
    }

    const doctor = await User.findById(doctorId);

    if (
      !doctor ||
      doctor.role !== "doctor" ||
      !doctor.isApproved ||
      !doctor.isActive ||
      doctor.isDeleted
    ) {
      return res.status(404).json({
        success: false,
        message: "Doctor not available"
      });
    }

    const profile = await DoctorProfile.findOne({ user: doctorId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long"
    });

    if (!profile.workingDays.includes(dayName)) {
      return res.json({
        success: true,
        slots: []
      });
    }

    const start = profile.startTime.split(":");
    const end = profile.endTime.split(":");

    let startMinutes = Number(start[0]) * 60 + Number(start[1]);
    const endMinutes = Number(end[0]) * 60 + Number(end[1]);

    const slots = [];

    while (startMinutes + profile.slotDuration <= endMinutes) {
      const startHour = String(Math.floor(startMinutes / 60)).padStart(2, "0");
      const startMin = String(startMinutes % 60).padStart(2, "0");

      const endSlot = startMinutes + profile.slotDuration;

      const endHour = String(Math.floor(endSlot / 60)).padStart(2, "0");
      const endMin = String(endSlot % 60).padStart(2, "0");

      slots.push(`${startHour}:${startMin}-${endHour}:${endMin}`);

      startMinutes += profile.slotDuration;
    }

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: selectedDate,
      status: { $ne: "cancelled" }
    });

    const bookedSlots = bookedAppointments.map(a => a.timeSlot);

    const availableSlots = slots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({
      success: true,
      date,
      slots: availableSlots
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Slot generation failed"
    });
  }
};

/*
  Book appointment
*/
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;

    const {
      doctorId,
      appointmentDate,
      timeSlot
    } = req.body;

    const doctor = await User.findById(doctorId);

    if (
      !doctor ||
      doctor.role !== "doctor" ||
      !doctor.isApproved ||
      !doctor.isActive ||
      doctor.isDeleted
    ) {
      return res.status(404).json({
        success: false,
        message: "Doctor not available"
      });
    }

    const profile = await DoctorProfile.findOne({ user: doctorId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      consultationFee: profile.consultationFee
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    res.status(500).json({
      success: false,
      message: "Booking failed"
    });
  }
};

/*
  Cancel appointment (patient)
*/
export const cancelAppointment = async (req, res) => {
  try {

    const appointmentId = req.params.id;
    const patientId = req.user._id;

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
        message: "You can only cancel your own appointments"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled"
      });
    }

    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cancellation failed"
    });
  }
};

/*
  Doctor accepts appointment
*/
export const acceptAppointment = async (req, res) => {
  try {

    const doctorId = req.user._id;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "name email")
      .populate("doctor", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.doctor._id.toString() !== doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to manage this appointment"
      });
    }

    appointment.status = "accepted";
    await appointment.save();

    await sendEmail({
      to: appointment.patient.email,
      subject: "Appointment Accepted - HealthLink",
      text: `
Hello ${appointment.patient.name},

Your appointment with ${appointment.doctor.name} has been accepted.

Date: ${appointment.appointmentDate.toDateString()}
Time: ${appointment.timeSlot}

Thank you,
HealthLink
`
    });

    res.json({
      success: true,
      message: "Appointment accepted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to accept appointment"
    });
  }
};


/*
  Doctor rejects appointment
*/
export const rejectAppointment = async (req, res) => {
  try {

    const doctorId = req.user._id;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "name email")
      .populate("doctor", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.doctor._id.toString() !== doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    appointment.status = "rejected";
    await appointment.save();

    await sendEmail({
      to: appointment.patient.email,
      subject: "Appointment Rejected - HealthLink",
      text: `
Hello ${appointment.patient.name},

Unfortunately your appointment request with ${appointment.doctor.name} has been rejected.

Date: ${appointment.appointmentDate.toDateString()}
Time: ${appointment.timeSlot}

Please try booking another slot.

HealthLink Team
`
    });

    res.json({
      success: true,
      message: "Appointment rejected"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject appointment"
    });
  }
};

/*
  Get pending appointment requests for doctor
*/
export const getDoctorPendingAppointments = async (req, res) => {
  try {

    const doctorId = req.user._id;

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "pending"
    })
      .populate("patient", "name email")
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending appointments"
    });
  }
};


/*
  Get accepted / upcoming appointments
*/
export const getDoctorUpcomingAppointments = async (req, res) => {
  try {

    const doctorId = req.user._id;

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "accepted"
    })
      .populate("patient", "name email")
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming appointments"
    });
  }
};


/*
  Get completed appointments
*/
export const getDoctorCompletedAppointments = async (req, res) => {
  try {

    const doctorId = req.user._id;

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "completed"
    })
      .populate("patient", "name email")
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed appointments"
    });
  }
};


/*
  Mark appointment as completed
*/
export const markAppointmentCompleted = async (req, res) => {
  try {

    const doctorId = req.user._id;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (appointment.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted appointments can be completed"
      });
    }

    appointment.status = "completed";

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment marked as completed"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment"
    });
  }
};

/*
  Doctor dashboard statistics
*/
export const getDoctorDashboardStats = async (req, res) => {
  try {

    const doctorId = req.user._id;

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId
    });

    const pendingRequests = await Appointment.countDocuments({
      doctor: doctorId,
      status: "pending"
    });

    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "accepted"
    });

    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "completed"
    });

    const profile = await DoctorProfile.findOne({
      user: doctorId
    });

    res.json({
      success: true,
      stats: {
        totalAppointments,
        pendingRequests,
        upcomingAppointments,
        completedAppointments,
        averageRating: profile?.averageRating || 0,
        totalReviews: profile?.totalReviews || 0
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats"
    });
  }
};

/*
  Get all appointments for logged-in patient
*/
export const getPatientAppointments = async (req, res) => {
  try {

    const patientId = req.user._id;

    const appointments = await Appointment.find({
      patient: patientId
    })
      .populate("doctor", "name email")
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments"
    });
  }
};