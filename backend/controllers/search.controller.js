import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";

export const searchDoctors = async (req, res) => {
  try {
    const {
      region,
      specialization,
      minRating,
      maxFee,
      page = 1,
      limit = 10
    } = req.query;

    const filters = {};

    if (region) {
      filters.region = region;
    }

    if (specialization) {
      filters.specialization = new RegExp(specialization, "i");
    }

    if (minRating) {
      filters.averageRating = { $gte: Number(minRating) };
    }

    if (maxFee) {
      filters.consultationFee = { $lte: Number(maxFee) };
    }

    const skip = (page - 1) * limit;

    const profiles = await DoctorProfile.find(filters)
      .populate({
        path: "user",
        match: {
          role: "doctor",
          profileCompleted: true,
          isApproved: true,
          isActive: true,
          isDeleted: false
        },
        select: "name email"
      })
      .sort({ averageRating: -1, experience: -1 })
      .skip(skip)
      .limit(Number(limit));

    const filteredProfiles = profiles.filter(p => p.user !== null);

    res.json({
      success: true,
      count: filteredProfiles.length,
      doctors: filteredProfiles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed"
    });
  }
};