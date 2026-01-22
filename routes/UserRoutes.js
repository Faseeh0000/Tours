import express from "express";
const route = express.Router();
import { validate } from "../middlewares/validate.js";
import { signup, login, verifyOtp, resendOtp  } from "../controllers/authentication.js";
import { protect, forgot, reset, restricTo } from "../middlewares/middle.js";
import {
  Getuser,
  deleteUser,
  adminUpdateUser,
  updateMe,
  updateMyPassword,
  createBooking,
  createReview
} from "../controllers/UserController.js";
import { createUserSchema, loginSchema, updatePasswordSchema,
   updateMeSchema, adminUpdateSchema,forgotSchema,resetSchema, bookingSchema, reviewSchema  } from "../Schemas/ZodSchema.js";
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignupInput'
 *     responses:
 *       201:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: OTP sent to your email. Please verify to complete signup.
 *                 userId:
 *                   type: string
 *       400:
 *         description: Validation error or email already exists
 */
route.post("/signup", validate(createUserSchema),signup);

route.post("/verify-otp", verifyOtp);         
route.post("/resend-otp", resendOtp); 
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials or account not verified
 */
route.post("/login",validate(loginSchema), login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
route.get("/users", protect, restricTo("admin"), Getuser);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 */
route.patch("/users/me", protect, validate(updateMeSchema), updateMe);

/**
 * @swagger
 * /users/update-password:
 *   patch:
 *     summary: Update password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordInput'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Current password is wrong
 *       400:
 *         description: Passwords do not match
 */
route.patch("/users/update-password", protect, validate(updatePasswordSchema), updateMyPassword);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Admin update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
route.patch("/users/:id", protect, restricTo("admin"), validate(adminUpdateSchema),adminUpdateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
route.delete("/users/:id", protect, restricTo("admin"), deleteUser);

/**
 * @swagger
 * /forget:
 *   post:
 *     summary: Forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Reset token sent to email
 */
route.post("/forget", validate(forgotSchema),forgot);
/**
 * @swagger
 * /reset/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
route.post("/reset/:token", validate(resetSchema),reset);


/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 */
route.post("/bookings", protect, validate(bookingSchema), createBooking);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 */
route.post("/reviews", protect, validate(reviewSchema), createReview);

export default route;
