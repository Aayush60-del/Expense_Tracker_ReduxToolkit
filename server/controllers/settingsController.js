import asyncHandler from "../utils/asyncHandler.js";
import UserSettings from "../models/UserSettings.js";
import User from "../models/User.js";

// @desc    Get user settings
// @route   GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await UserSettings.findOne({ user: req.user._id });

  if (!settings) {
    // Create default settings if not exists
    settings = await UserSettings.create({ user: req.user._id });
  }

  // Also include 2FA status from User model for frontend convenience
  const user = await User.findById(req.user._id).select("twoFactorEnabled phone");
  
  const settingsData = settings.toObject();
  settingsData.twoFactorEnabled = user.twoFactorEnabled;
  settingsData.phone = user.phone;

  res.json(settingsData);
});

// @desc    Update user settings
// @route   PUT /api/settings
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await UserSettings.findOne({ user: req.user._id });

  if (!settings) {
    settings = new UserSettings({ user: req.user._id });
  }

  const {
    emailNotifications,
    transactionAlerts,
    monthlyReports,
    budgetAlerts,
    theme,
    currency,
    language,
    timezone,
    monthlyBudget,
    twoFactorEnabled, // Handled differently
  } = req.body;

  if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
  if (transactionAlerts !== undefined) settings.transactionAlerts = transactionAlerts;
  if (monthlyReports !== undefined) settings.monthlyReports = monthlyReports;
  if (budgetAlerts !== undefined) settings.budgetAlerts = budgetAlerts;
  if (theme !== undefined) settings.theme = theme;
  if (currency !== undefined) settings.currency = currency;
  if (language !== undefined) settings.language = language;
  if (timezone !== undefined) settings.timezone = timezone;
  if (monthlyBudget !== undefined) settings.monthlyBudget = monthlyBudget;

  const updatedSettings = await settings.save();
  const settingsData = updatedSettings.toObject();

  // Handle 2FA update if provided
  if (twoFactorEnabled !== undefined) {
    const user = await User.findById(req.user._id);
    user.twoFactorEnabled = twoFactorEnabled;
    await user.save();
    settingsData.twoFactorEnabled = user.twoFactorEnabled;
  } else {
    const user = await User.findById(req.user._id).select("twoFactorEnabled");
    settingsData.twoFactorEnabled = user.twoFactorEnabled;
  }

  res.json(settingsData);
});
