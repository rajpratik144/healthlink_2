import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
  Utility: Generate JWT Token
*/
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/*
  Utility: Send Token in HttpOnly Cookie
*/
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted, 
      },
    });
};

/*
  Register Patient
*/
export const registerPatient = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "patient",
  });

  sendTokenResponse(user, 201, res);
};

/*
  Register Doctor (Step 1)
*/
export const registerDoctor = async (req, res) => {
  const { name, email, password, medicalCertificateNumber } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const doctor = await User.create({
    name,
    email,
    password,
    role: "doctor",
    medicalCertificateNumber,
    isApproved: false,
    isActive: false,
    profileCompleted: false,
  });

  res.status(201).json({
    success: true,
    message:
      "Doctor registered successfully. Please complete your profile.",
  });
};

/*
  Login
*/
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (user.isDeleted) {
    return res.status(403).json({
      success: false,
      message: "Account is deactivated",
    });
  }

  sendTokenResponse(user, 200, res);
};

/*
  Logout
*/
export const logout = async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};