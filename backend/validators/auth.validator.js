import { z } from "zod";
import User from "../models/User.js";

/*
  Common password rules
*/
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

/*
  Patient Registration
*/
export const registerPatientSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

/*
  Doctor Step 1 Registration
*/
export const registerDoctorSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    medicalCertificateNumber: z.string().min(5),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine(async (data, ctx) => {

    // Check if email already exists
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) {
      ctx.addIssue({
        path: ["email"],
        message: "Email already registered",
        code: z.ZodIssueCode.custom,
      });
    }

    // Check if medical certificate already exists
    const existingCertificate = await User.findOne({
      medicalCertificateNumber: data.medicalCertificateNumber,
    });

    if (existingCertificate) {
      ctx.addIssue({
        path: ["medicalCertificateNumber"],
        message: "Medical certificate already registered",
        code: z.ZodIssueCode.custom,
      });
    }
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
/*
  Login Validation
*/
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});