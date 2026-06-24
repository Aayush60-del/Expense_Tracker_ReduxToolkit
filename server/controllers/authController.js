import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import UserSettings from "../models/UserSettings.js";
import { seedCategoriesForUser } from "../utils/seedCategories.js";
import asyncHandler from "../utils/asyncHandler.js";
import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";
import { sendWelcomeEmail, sendOtpEmail } from "../services/emailService.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({ name, email, password });

  if (user) {
    // Initialize default settings
    await UserSettings.create({ user: user._id });

    // Seed default categories for the new user
    await seedCategoriesForUser(user._id);

    // Send welcome email asynchronously (don't await)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token or OTP
// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.twoFactorEnabled) {
      // Generate OTP
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpiry = Date.now() + parseInt(process.env.OTP_EXPIRY || 300000); // 5 mins
      user.otpAttempts = 0;
      await user.save();

      // Send OTP
      await sendOtpEmail(user.email, otp);

      res.json({
        requiresOtp: true,
        email: user.email,
        message: "OTP sent to your email",
      });
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Verify OTP for login
// @route   POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otpAttempts >= 5) {
    res.status(400);
    throw new Error("Too many attempts. Please request a new OTP");
  }

  if (!user.otp || !user.otpExpiry || Date.now() > user.otpExpiry) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one");
  }

  if (user.otp !== otp) {
    user.otpAttempts += 1;
    await user.save();
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // OTP is valid
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = 0;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    currency: user.currency,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

// @desc    Resend OTP for login
// @route   POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + parseInt(process.env.OTP_EXPIRY || 300000); // 5 mins
  user.otpAttempts = 0;
  await user.save();

  await sendOtpEmail(user.email, otp);

  res.json({ message: "A new OTP has been sent to your email" });
});

// @desc    Forgot password (request OTP)
// @route   POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal that user doesn't exist for security
    res.json({ message: "If your email is registered, you will receive a reset code" });
    return;
  }

  const otp = generateOtp();
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + parseInt(process.env.OTP_EXPIRY || 300000); // 5 mins
  await user.save();

  await sendOtpEmail(user.email, otp, true);

  res.json({ message: "If your email is registered, you will receive a reset code" });
});

// @desc    Verify reset OTP
// @route   POST /api/auth/verify-reset-otp
export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    res.status(400);
    throw new Error("Invalid request");
  }

  if (Date.now() > user.resetOtpExpiry) {
    res.status(400);
    throw new Error("Reset code has expired");
  }

  if (user.resetOtp !== otp) {
    res.status(400);
    throw new Error("Invalid reset code");
  }

  res.json({ message: "Reset code verified. Please set a new password" });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    res.status(400);
    throw new Error("Invalid request");
  }

  if (Date.now() > user.resetOtpExpiry) {
    res.status(400);
    throw new Error("Reset code has expired");
  }

  if (user.resetOtp !== otp) {
    res.status(400);
    throw new Error("Invalid reset code");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful. You can now login" });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.currency = req.body.currency || user.currency;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    
    // Avatar handled by upload route
    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      currency: updatedUser.currency,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Upload avatar
// @route   POST /api/auth/upload-avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  user.avatar = avatarUrl;
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    currency: updatedUser.currency,
    avatar: updatedUser.avatar,
    avatarUrl: updatedUser.avatar,
    phone: updatedUser.phone,
    token: generateToken(updatedUser._id),
    message: "Profile picture updated successfully",
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete all user data
  await Transaction.deleteMany({ user: userId });
  await Category.deleteMany({ user: userId });
  await UserSettings.deleteOne({ user: userId });
  await User.findByIdAndDelete(userId);

  res.json({ message: "Account deleted successfully" });
});
