import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

/*
  Complete Doctor Profile (Step 2)
*/
export const completeDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can complete profile",
      });
    }

    if (user.profileCompleted) {
      return res.status(400).json({
        success: false,
        message: "Profile already completed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    /*
      Upload image buffer to Cloudinary
    */
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "healthlink/doctors" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const {
      specialization,
      experience,
      consultationFee,
      bio,
      clinicName,
      region,
      fullAddress,
      workingDays,
      startTime,
      endTime,
      slotDuration,
    } = req.body;

    const profile = await DoctorProfile.create({
      user: userId,
      specialization,
      experience,
      consultationFee,
      bio,
      clinicName,
      region,
      fullAddress,
      profileImage: uploadResult.secure_url,
      workingDays,
      startTime,
      endTime,
      slotDuration,
    });

    user.profileCompleted = true;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Profile completed successfully",
      profile,
    });
  } catch (error) {
  console.error("Profile Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};