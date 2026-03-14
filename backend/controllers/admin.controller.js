import User from "../models/User.js";

/*
  Get all doctors waiting for approval
*/
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      profileCompleted: true,
      isApproved: false,
      isDeleted: false
    }).select("-password");

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending doctors"
    });
  }
};

/*
  Approve doctor
*/
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.isApproved = true;
    doctor.isActive = true;

    await doctor.save();

    res.json({
      success: true,
      message: "Doctor approved successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Approval failed"
    });
  }
};

/*
  Reject doctor
*/
export const rejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.isApproved = false;
    doctor.isActive = false;

    await doctor.save();

    res.json({
      success: true,
      message: "Doctor rejected"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Rejection failed"
    });
  }
};

/*
  Activate / deactivate doctor
*/
export const toggleDoctorActive = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.isActive = !doctor.isActive;

    await doctor.save();

    res.json({
      success: true,
      message: `Doctor is now ${doctor.isActive ? "active" : "inactive"}`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Status update failed"
    });
  }
};