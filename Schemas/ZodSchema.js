import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name cannot exceed 50 characters").transform(s => s.trim()),
  email: z.string().email("Provide a valid mail"),
  phoneNo: z.number().int(),
  countryCode: z.string(),
  countryISO : z.string(),
  pass: z.string().min(4, "Password must be at least 4 characters long"),
  confirmPass: z.string().min(4, "Password must be at least 4 characters long"),
  role: z.enum(["admin", "user", "Guide"]).optional().default("user")
}).refine(data => data.pass === data.confirmPass, { message: "Passwords do not match", path: ["confirmPass"] });

export const loginSchema = z.object({
  email: z.string().email("Provide a valid mail"),
  pass: z.string().min(1)
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(4, "Password must be at least 4 characters long"),
  confirmNewPassword: z.string().min(4, "Password must be at least 4 characters long")
}).refine(data => data.newPassword === data.confirmNewPassword, { message: "New passwords do not match", path: ["confirmNewPassword"] });

export const updateMeSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().optional()
});

export const adminUpdateSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "user", "Guide"]).optional()
});

export const bookingSchema = z.object({
  tour: z.string().min(1),
  price: z.number().positive()
});

export const reviewSchema = z.object({
  tour: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(1)
});

export const forgotSchema = z.object({
  email: z.string().email("Provide a valid mail")
});

export const resetSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters long"),
  confirmPassword: z.string().min(4, "Password must be at least 4 characters long")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});


