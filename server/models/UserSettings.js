import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    transactionAlerts: {
      type: Boolean,
      default: true,
    },
    monthlyReports: {
      type: Boolean,
      default: true,
    },
    budgetAlerts: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    currency: {
      type: String,
      default: "INR",
    },
    language: {
      type: String,
      default: "English",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    monthlyBudget: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export default UserSettings;
