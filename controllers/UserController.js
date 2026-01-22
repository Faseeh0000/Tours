import {
  getAllUsersService,
  deleteUserService,
  adminUpdateUserService,
  updateMeService,
  updateMyPasswordService,
  createReviewService,
  createBookingService
} from "../services/userService.js";

export const Getuser = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({
      status: "success",
      data: users
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const updatedUser = await adminUpdateUserService(req.params.id, req.validated);

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { user: updatedUser }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    if (req.validated?.pass || req.validated?.confirmPass) {
      return res.status(400).json({
        status: "fail",
        message: "This route is not for password updates"
      });
    }

    const updatedUser = await updateMeService(req.user._id, req.validated);

    res.status(200).json({
      status: "success",
      data: { user: updatedUser }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.validated;

    const result = await updateMyPasswordService(
      req.user._id,
      currentPassword,
      newPassword,
      confirmNewPassword
    );

    if (result === "INVALID_PASSWORD") {
      return res.status(401).json({
        status: "fail",
        message: "Current password is wrong"
      });
    }

    if (result === "PASSWORD_MISMATCH") {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Password updated successfully"
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


export const createReview = async (req, res) => {
  try {
    const review = await createReviewService(req.validated, req.user._id);

    res.status(201).json({
      status: "success",
      data: { review }
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await createBookingService(req.validated, req.user._id);

    res.status(201).json({
      status: "success",
      data: { booking }
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
