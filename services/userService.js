import { User } from "../models/usermodel.js";
import { Review } from "../models/riviewmodel.js";
import { Booking } from "../models/booking.js";

export const getAllUsersService = async () => {
  return await User.find();
};

export const deleteUserService = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

export const adminUpdateUserService = async (userId, data) => {
  const allowedFields = ["name", "email", "age", "role"];
  const filteredData = {};

  allowedFields.forEach(field => {
    if (data[field]) filteredData[field] = data[field];
  });

  return await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true
  });
};

export const updateMeService = async (userId, data) => {
  const allowedFields = ["name", "email", "age"];
  const filteredData = {};

  allowedFields.forEach(field => {
    if (data[field]) filteredData[field] = data[field];
  });

  return await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true
  });
};

export const updateMyPasswordService = async (
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  const user = await User.findById(userId).select("+pass");

  if (!user) return null;

  const isMatch = await user.correctpass(currentPassword, user.pass);
  if (!isMatch) return "INVALID_PASSWORD";

  if (newPassword !== confirmNewPassword) return "PASSWORD_MISMATCH";

  user.pass = newPassword;
  user.confirmPass = confirmNewPassword;

  await user.save();
  return true;
};

export const createReviewService = async (data, userId) => {
  return await Review.create({
    ...data,
    user: userId
  });
};

export const createBookingService = async (data, userId) => {
  return await Booking.create({
    ...data,
    user: userId
  });
};
