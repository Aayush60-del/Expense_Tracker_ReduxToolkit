import express from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadAvatar,
} from "../controllers/authController.js";
import protect from "../middleware/auth.js";
import { validateRequest } from "../middleware/validator.js";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for avatar upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `avatar-\${req.user._id}-\${Date.now()}\${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Images only (jpeg, jpg, png, webp)!"));
    }
  },
});

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  validateRequest,
  verifyOtp
);

router.post(
  "/resend-otp",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
  ],
  validateRequest,
  resendOtp
);

router.post(
  "/forgot-password",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
  ],
  validateRequest,
  forgotPassword
);

router.post(
  "/verify-reset-otp",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  validateRequest,
  verifyResetOtp
);

router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validateRequest,
  resetPassword
);

router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  [
    body("email").optional().isEmail().withMessage("Please include a valid email"),
  ],
  validateRequest,
  updateProfile
);

router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

router.put(
  "/password",
  protect,
  [
    body("currentPassword").exists().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validateRequest,
  changePassword
);

router.delete("/account", protect, deleteAccount);

export default router;
