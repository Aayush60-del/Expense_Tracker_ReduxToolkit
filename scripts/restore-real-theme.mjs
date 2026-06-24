import fs from "fs";

const write = (file, data) => fs.writeFileSync(file, data, "utf8");
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

fs.mkdirSync("src/lib", { recursive: true });

write("src/lib/theme.js", `
export const THEME_KEY = "expense-theme";

export const normalizeTheme = (theme) => {
  return ["light", "dark", "system"].includes(theme) ? theme : "system";
};

export const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyAppTheme = (theme = "system") => {
  if (typeof window === "undefined") return "system";

  const selectedTheme = normalizeTheme(theme);
  const resolvedTheme = selectedTheme === "system" ? getSystemTheme() : selectedTheme;

  localStorage.setItem(THEME_KEY, selectedTheme);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.removeAttribute("data-accent");
  document.body.classList.remove("dark");

  return selectedTheme;
};

export const getStoredTheme = () => {
  if (typeof window === "undefined") return "system";
  return normalizeTheme(localStorage.getItem(THEME_KEY) || "system");
};

export const applyStoredTheme = () => {
  return applyAppTheme(getStoredTheme());
};

export const subscribeToSystemTheme = () => {
  if (typeof window === "undefined") return;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getStoredTheme() === "system") applyAppTheme("system");
  };

  media.addEventListener?.("change", handler);
};
`);

write("src/components/ThemeBootstrap.jsx", `
import { useEffect } from "react";
import { applyStoredTheme, subscribeToSystemTheme } from "../lib/theme";

const ThemeBootstrap = () => {
  useEffect(() => {
    applyStoredTheme();
    subscribeToSystemTheme();
  }, []);

  return null;
};

export default ThemeBootstrap;
`);

let main = read("src/main.jsx");

if (main && !main.includes("applyStoredTheme")) {
  const lines = main.split("\\n");
  let lastImport = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImport = i;
  }

  lines.splice(0, 0, `import { applyStoredTheme, subscribeToSystemTheme } from "./lib/theme";`);
  lastImport++;

  lines.splice(lastImport + 1, 0, `applyStoredTheme();`, `subscribeToSystemTheme();`);

  write("src/main.jsx", lines.join("\\n"));
}

let tailwind = read("tailwind.config.js");

if (tailwind && !tailwind.includes("darkMode")) {
  tailwind = tailwind.replace(
    "export default {",
    `export default {
  darkMode: "class",`
  );
  write("tailwind.config.js", tailwind);
}

write("src/components/Settings.jsx", `
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  Moon,
  Sun,
  Monitor,
  Upload,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Save,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  updateProfile,
  changePassword,
  deleteAccount,
  uploadAvatar,
} from "../features/Auth/AuthSlice";
import { fetchSettings, saveSettings } from "../features/Settings/SettingsSlice";
import { applyAppTheme, getStoredTheme, normalizeTheme } from "../lib/theme";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
const API_ORIGIN = API_BASE_URL.replace(/\\/api\\/?$/, "");

const inputClass =
  "rounded-xl border-slate-200 bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:opacity-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900 dark:disabled:text-slate-400";

const selectClass =
  "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900 dark:disabled:text-slate-400";

const Settings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState("profile");
  const { user, guestMode, isLoading: authLoading } = useSelector((state) => state.auth);
  const { settings, isLoading: settingsLoading, isSaving } = useSelector((state) => state.settings);

  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

  const [preferences, setPreferences] = useState({
    theme: getStoredTheme(),
    currency: "INR",
    language: "English",
    timezone: "Asia/Kolkata",
    monthlyBudget: 0,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    monthlyReports: true,
    budgetAlerts: true,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const isGuest = !user || user.guestMode || guestMode;
  const disabled = isGuest || authLoading || isSaving;

  useEffect(() => {
    if (user && !isGuest) dispatch(fetchSettings());
  }, [dispatch, user, isGuest]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  useEffect(() => {
    if (!settings) return;

    const savedTheme = normalizeTheme(settings.theme || getStoredTheme());

    setPreferences({
      theme: savedTheme,
      currency: settings.currency || user?.currency || "INR",
      language: settings.language || "English",
      timezone: settings.timezone || "Asia/Kolkata",
      monthlyBudget: settings.monthlyBudget || 0,
    });

    setNotifications({
      emailNotifications: settings.emailNotifications ?? true,
      transactionAlerts: settings.transactionAlerts ?? true,
      monthlyReports: settings.monthlyReports ?? true,
      budgetAlerts: settings.budgetAlerts ?? true,
    });

    applyAppTheme(savedTheme);
  }, [settings, user]);

  useEffect(() => {
    applyAppTheme(preferences.theme);
  }, [preferences.theme]);

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("/uploads")
      ? \`\${API_ORIGIN}\${user.avatar}\`
      : user.avatar
    : null;

  const handleUpdateProfile = async () => {
    if (isGuest) return toast.info("Login required to update profile.");
    if (!profileForm.name.trim()) return toast.error("Name is required");

    try {
      await dispatch(updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        currency: preferences.currency,
      })).unwrap();

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isGuest) {
      toast.info("Login required to upload avatar.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a PNG, JPG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be under 5MB.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await dispatch(uploadAvatar(formData)).unwrap();
      toast.success("Avatar uploaded successfully");
    } catch (err) {
      toast.error(err || "Avatar upload failed. Please login again if token expired.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSavePreferences = async () => {
    const cleanTheme = normalizeTheme(preferences.theme);
    applyAppTheme(cleanTheme);

    if (isGuest) {
      toast.success("Theme saved locally.");
      return;
    }

    try {
      await dispatch(saveSettings({
        ...preferences,
        theme: cleanTheme,
        monthlyBudget: Number(preferences.monthlyBudget || 0),
      })).unwrap();

      await dispatch(updateProfile({ currency: preferences.currency })).unwrap();

      toast.success("Preferences saved successfully");
    } catch (err) {
      toast.error(err || "Failed to save preferences");
    }
  };

  const handleSaveNotifications = async () => {
    if (isGuest) return toast.info("Login required to save notifications.");

    try {
      await dispatch(saveSettings(notifications)).unwrap();
      toast.success("Notification settings saved");
    } catch (err) {
      toast.error(err || "Failed to save notifications");
    }
  };

  const handleToggleTwoFactor = async () => {
    if (isGuest) return toast.info("Login required to enable 2FA.");

    try {
      const nextValue = !settings?.twoFactorEnabled;
      await dispatch(saveSettings({ twoFactorEnabled: nextValue })).unwrap();
      toast.success(nextValue ? "2FA enabled" : "2FA disabled");
    } catch (err) {
      toast.error(err || "Failed to update 2FA");
    }
  };

  const handleChangePassword = async () => {
    if (isGuest) return toast.info("Login required to change password.");
    if (!currentPassword || !newPassword) return toast.error("Both passwords are required");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (isGuest) return toast.info("Guest account cannot be deleted.");

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account and all data?"
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteAccount()).unwrap();
      toast.success("Account deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete account");
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Monitor },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
  ];

  const themeOptions = [
    { id: "light", label: "Light", desc: "Clean white interface", icon: Sun },
    { id: "dark", label: "Dark", desc: "Premium dark interface", icon: Moon },
    { id: "system", label: "System", desc: "Follow device theme", icon: Monitor },
  ];

  const notificationOptions = [
    { key: "emailNotifications", title: "Email Notifications", desc: "Receive summaries and account updates." },
    { key: "transactionAlerts", title: "Transaction Alerts", desc: "Get notified for transaction activity." },
    { key: "monthlyReports", title: "Monthly Reports", desc: "Receive your monthly spending report." },
    { key: "budgetAlerts", title: "Budget Alerts", desc: "Get warned near your monthly budget." },
  ];

  return (
    <div className="space-y-6 pb-8 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
          Manage your profile, preferences, notifications, and security.
        </p>
      </div>

      {isGuest && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          You are using guest mode. Login or create an account to save settings permanently.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 border-0 shadow-sm ring-1 ring-slate-200/60 h-fit shrink-0 bg-white dark:bg-slate-900 dark:ring-slate-800">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={\`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${
                      active
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }\`}
                  >
                    <Icon className={\`w-5 h-5 \${active ? "text-blue-600 dark:text-blue-300" : "text-slate-400"}\`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        <Card className="flex-1 border-0 shadow-sm ring-1 ring-slate-200/60 bg-white dark:bg-slate-900 dark:ring-slate-800">
          <CardContent className="p-6 md:p-8">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              {settingsLoading && (
                <div className="py-20 text-center text-slate-500 dark:text-slate-400">
                  Loading settings...
                </div>
              )}

              {activeMenu === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">Profile Settings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Update your personal information and avatar.
                    </p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex items-center justify-center text-blue-600 font-bold text-3xl dark:bg-blue-500/15 dark:border-blue-400/30 dark:text-blue-300">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={handleAvatarSelect}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload new avatar
                      </Button>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        PNG, JPG or WEBP. Max size 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                        className={inputClass}
                        disabled={disabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || "guest@local"}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className={inputClass}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6" onClick={handleUpdateProfile} disabled={disabled}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {activeMenu === "preferences" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">Preferences</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Customize your app experience.
                    </p>
                  </div>

                  <div>
                    <Label className="text-base">Theme Appearance</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 mt-1">
                      Choose Light, Dark, or System mode.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
                      {themeOptions.map((item) => {
                        const Icon = item.icon;
                        const active = preferences.theme === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setPreferences((prev) => ({ ...prev, theme: item.id }))}
                            className={\`flex flex-col items-start justify-center gap-2 p-4 rounded-xl border-2 transition-all text-left \${
                              active
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-200"
                                : "border-slate-200 hover:border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
                            }\`}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="text-sm font-semibold">{item.label}</span>
                            <span className="text-xs opacity-75">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl pt-2">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <select
                        className={selectClass}
                        value={preferences.currency}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, currency: e.target.value }))}
                        disabled={disabled}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <select
                        className={selectClass}
                        value={preferences.language}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, language: e.target.value }))}
                        disabled={disabled}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <select
                        className={selectClass}
                        value={preferences.timezone}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, timezone: e.target.value }))}
                        disabled={disabled}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Monthly Budget</Label>
                      <Input
                        type="number"
                        min="0"
                        value={preferences.monthlyBudget}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, monthlyBudget: e.target.value }))}
                        className={inputClass}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6" onClick={handleSavePreferences} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </div>
              )}

              {activeMenu === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">Notifications</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Choose what alerts you want to receive.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {notificationOptions.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/60">
                        <div>
                          <Label htmlFor={setting.key} className="text-base">{setting.title}</Label>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{setting.desc}</p>
                        </div>

                        <input
                          type="checkbox"
                          id={setting.key}
                          checked={Boolean(notifications[setting.key])}
                          onChange={(e) => setNotifications((prev) => ({ ...prev, [setting.key]: e.target.checked }))}
                          disabled={disabled}
                          className="h-5 w-5 accent-blue-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6" onClick={handleSaveNotifications} disabled={disabled}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Notifications"}
                    </Button>
                  </div>
                </div>
              )}

              {activeMenu === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">Security</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Protect your account and data.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Label className="text-base font-semibold">Change Password</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Update your password regularly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={inputClass}
                        disabled={disabled}
                      />

                      <Input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={inputClass}
                        disabled={disabled}
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button onClick={handleChangePassword} disabled={disabled}>
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Add OTP verification during login.
                      </p>
                    </div>

                    <Button variant="outline" className="rounded-xl" onClick={handleToggleTwoFactor} disabled={disabled}>
                      {settings?.twoFactorEnabled ? (
                        <>
                          <ShieldOff className="w-4 h-4 mr-2" />
                          Disable 2FA
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Enable 2FA
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-red-600 dark:text-red-400 font-semibold mb-2">Danger Zone</h3>

                    <div className="p-4 rounded-xl border border-red-100 bg-red-50 flex flex-col sm:flex-row gap-4 items-center justify-between dark:border-red-500/20 dark:bg-red-500/10">
                      <div>
                        <Label className="text-base font-semibold text-red-900 dark:text-red-200">
                          Delete Account
                        </Label>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          Permanently delete your account and all data.
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                        onClick={handleDeleteAccount}
                        disabled={disabled}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
`);

let settingsSlice = read("src/features/Settings/SettingsSlice.js");
if (settingsSlice) {
  settingsSlice = settingsSlice.replace(/theme: "blue"/g, `theme: "system"`);
  settingsSlice = settingsSlice.replace(/theme: "light"/g, `theme: "system"`);
  write("src/features/Settings/SettingsSlice.js", settingsSlice);
}

let userSettings = read("server/models/UserSettings.js");
if (userSettings) {
  userSettings = userSettings.replace(/enum:\s*\[[^\]]*blue[^\]]*\]/g, `enum: ["light", "dark", "system"]`);
  userSettings = userSettings.replace(/enum:\s*\[[^\]]*light[^\]]*dark[^\]]*system[^\]]*\]/g, `enum: ["light", "dark", "system"]`);
  userSettings = userSettings.replace(/default:\s*"blue"/g, `default: "system"`);
  userSettings = userSettings.replace(/default:\s*"light"/g, `default: "system"`);
  write("server/models/UserSettings.js", userSettings);
}

let indexCss = read("src/index.css");
if (indexCss && !indexCss.includes("/* Proper app dark mode base */")) {
  indexCss += `

/* Proper app dark mode base */
html {
  background: #f8fafc;
}

html.dark {
  background: #020617;
  color-scheme: dark;
}

html.dark body {
  background: #020617;
  color: #f8fafc;
}

html.dark #root {
  background: #020617;
  min-height: 100vh;
}
`;
  write("src/index.css", indexCss);
}

console.log("✅ Proper Light / Dark / System theme restored.");
