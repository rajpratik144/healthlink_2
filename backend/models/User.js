import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic identity
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Authentication
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password by default
    },

    // Role system
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
      index: true,
    },

    // Doctor Step 1 field
    medicalCertificateNumber: {
  type: String,
  required: function () {
    return this.role === "doctor";
  },
  unique: true,
  sparse: true,
  trim: true,
  index: true,
},

    // Doctor lifecycle flags
    profileCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Controlled by admin after approval
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
  Password hashing middleware.
  Runs only when password is modified.
*/
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
/*
  Password comparison method.
  Used during login.
*/
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/*
  Compound index optimized for doctor search filtering.
  Matches the visibility rules defined in system design.
*/
userSchema.index({
  role: 1,
  isApproved: 1,
  isActive: 1,
  profileCompleted: 1,
  isDeleted: 1,
});

const User = mongoose.model("User", userSchema);

export default User;