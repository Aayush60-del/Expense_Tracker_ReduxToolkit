import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Bell,
  Camera,
  Lock,
  Moon,
  Monitor,
  Save,
  Shield,
  ShieldCheck,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  uploadAvatar,
} from "../features/Auth/AuthSlice";
import { fetchSettings, saveSettings } from "../features/Settings/SettingsSlice";
import { applyAppTheme, getStoredTheme, normalizeTheme } from "../lib/theme";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const Settings = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { user, guestMode, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const { settings, isLoading: settingsLoading, isSaving } = useSelector((state) => state.settings || {});

  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    currency: "INR",
  });

  const [preferences, setPreferences] = useState({
    theme: getStoredTheme(),
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

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const isGuest = !user || user.guestMode || guestMode;
  const disabled = isGuest || authLoading || isSaving || settingsLoading;

  useEffect(() => {
    if (user && !isGuest) dispatch(fetchSettings());
  }, [dispatch, user, isGuest]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      currency: user?.currency || "INR",
    });
  }, [user]);

  useEffect(() => {
    if (!settings) return;

    const theme = normalizeTheme(settings.theme || getStoredTheme());

    setPreferences({
      theme,
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

    applyAppTheme(theme);
  }, [settings]);

  useEffect(() => {
    applyAppTheme(preferences.theme);
  }, [preferences.theme]);

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("/uploads")
      ? `${API_ORIGIN}${user.avatar}`
      : user.avatar
    : null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Monitor },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  const handleProfileSave = async () => {
    if (isGuest) return toast.info("Login required to update profile.");
    if (!profileForm.name.trim()) return toast.error("Name is required");

    try {
      await dispatch(
        updateProfile({
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim(),
          currency: profileForm.currency,
        })
      ).unwrap();

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update profile");
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
      toast.error("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await dispatch(uploadAvatar(formData)).unwrap();
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error(error || "Avatar upload failed. Login again if token expired.");
    } finally {
      event.target.value = "";
    }
  };

  const handlePreferencesSave = async () => {
    const theme = normalizeTheme(preferences.theme);
    applyAppTheme(theme);

    if (isGuest) return toast.success("Theme saved locally.");

    try {
      await dispatch(
        saveSettings({
          ...preferences,
          theme,
          monthlyBudget: Number(preferences.monthlyBudget || 0),
        })
      ).unwrap();

      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error(error || "Failed to save preferences");
    }
  };

  const handleNotificationSave = async () => {
    if (isGuest) return toast.info("Login required to save notifications.");

    try {
      await dispatch(saveSettings(notifications)).unwrap();
      toast.success("Notifications saved successfully");
    } catch (error) {
      toast.error(error || "Failed to save notifications");
    }
  };

  const handleToggleTwoFactor = async () => {
    if (isGuest) return toast.info("Login required to update 2FA.");

    try {
      const nextValue = !settings?.twoFactorEnabled;
      await dispatch(saveSettings({ twoFactorEnabled: nextValue })).unwrap();
      toast.success(nextValue ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    } catch (error) {
      toast.error(error || "Failed to update 2FA");
    }
  };

  const handlePasswordUpdate = async () => {
    if (isGuest) return toast.info("Login required to change password.");
    if (!security.currentPassword || !security.newPassword) {
      return toast.error("Both password fields are required");
    }

    if (security.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    try {
      await dispatch(
        changePassword({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
        })
      ).unwrap();

      setSecurity({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (isGuest) return toast.info("Guest account cannot be deleted.");

    const confirmed = window.confirm(
      "Are you sure you want to delete your account permanently?"
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteAccount()).unwrap();
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete account");
    }
  };

  return (
    <div className="space-y-7 pb-10">
      <div className="settings-animate">
        <h1 className="app-page-title">Settings</h1>
        <p className="app-page-subtitle">Manage your account, preferences and security.</p>
      </div>

      {isGuest && (
        <div className="settings-animate rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
          You are using guest mode. Login or create an account to save settings permanently.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[255px_1fr]">
        <div className="settings-animate app-card h-fit overflow-x-auto p-2 lg:p-3">
          <div className="flex min-w-max gap-1 lg:block">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mb-1 flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition last:mb-0 lg:w-full ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
          </div>
        </div>

        {activeTab === "profile" && (
          <div className="settings-animate app-card p-6">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Profile</h2>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Update your personal information.
            </p>

            <div className="mt-8 flex flex-col gap-5 border-b border-slate-200 pb-7 dark:border-slate-800 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-blue-700 text-white">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-black">
                    {initials}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-slate-700 shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>

              <div>
                <p className="font-black text-slate-950 dark:text-white">
                  {profileForm.name || "Your name"}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  JPG, PNG or WEBP up to 5MB
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Full name
                </label>
                <input
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="app-input"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Email
                </label>
                <input value={user?.email || ""} className="app-input" disabled readOnly />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Phone
                </label>
                <input
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="app-input"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Currency
                </label>
                <select
                  value={profileForm.currency}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, currency: event.target.value }))
                  }
                  className="app-input"
                  disabled={disabled}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button className="app-btn-secondary" type="button">
                Cancel
              </button>
              <button onClick={handleProfileSave} className="app-btn-primary" disabled={disabled}>
                <Save className="h-4 w-4" />
                Save changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="settings-animate app-card p-6">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Preferences</h2>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Theme and display options.
            </p>

            <div className="mt-7">
              <label className="mb-3 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Theme
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {themeOptions.map((item) => {
                  const Icon = item.icon;
                  const active = preferences.theme === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setPreferences((prev) => ({ ...prev, theme: item.id }))
                      }
                      type="button"
                      className={`flex items-center gap-4 rounded-2xl border p-5 text-left font-black transition ${
                        active
                          ? "border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      }`}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                        <Icon className="h-5 w-5" />
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(event) =>
                    setPreferences((prev) => ({ ...prev, language: event.target.value }))
                  }
                  className="app-input"
                  disabled={disabled}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Timezone
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(event) =>
                    setPreferences((prev) => ({ ...prev, timezone: event.target.value }))
                  }
                  className="app-input"
                  disabled={disabled}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Monthly budget
                </label>
                <input
                  type="number"
                  min="0"
                  value={preferences.monthlyBudget}
                  onChange={(event) =>
                    setPreferences((prev) => ({ ...prev, monthlyBudget: event.target.value }))
                  }
                  className="app-input"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={handlePreferencesSave} className="app-btn-primary" disabled={isSaving}>
                <Save className="h-4 w-4" />
                Save preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="settings-animate app-card p-6">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Notifications</h2>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Choose what you want to be notified about.
            </p>

            <div className="mt-7 divide-y divide-slate-200 dark:divide-slate-800">
              {[
                ["emailNotifications", "Weekly summary email", "A digest every Monday morning."],
                ["budgetAlerts", "Budget alerts", "Notify me when I am close to my budget."],
                ["transactionAlerts", "Large transactions", "Alert on important transaction activity."],
                ["monthlyReports", "Monthly reports", "Receive monthly spending reports."],
              ].map(([key, title, desc]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-black text-slate-950 dark:text-white">{title}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(notifications[key])}
                      onChange={(event) =>
                        setNotifications((prev) => ({ ...prev, [key]: event.target.checked }))
                      }
                      disabled={disabled}
                      className="peer sr-only"
                    />
                    <span className="h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-blue-700 peer-checked:after:translate-x-5 dark:bg-slate-800" />
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={handleNotificationSave} className="app-btn-primary" disabled={disabled}>
                <Save className="h-4 w-4" />
                Save notifications
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-5">
            <div className="settings-animate app-card p-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Password</h2>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Change your password regularly.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={security.currentPassword}
                    onChange={(event) =>
                      setSecurity((prev) => ({ ...prev, currentPassword: event.target.value }))
                    }
                    className="app-input"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    New password
                  </label>
                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(event) =>
                      setSecurity((prev) => ({ ...prev, newPassword: event.target.value }))
                    }
                    className="app-input"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handlePasswordUpdate} className="app-btn-primary" disabled={disabled}>
                  <Lock className="h-4 w-4" />
                  Update password
                </button>
              </div>
            </div>

            <div className="settings-animate app-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    Two-factor authentication
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Add an extra layer of security to your account.
                  </p>
                </div>

                <button onClick={handleToggleTwoFactor} disabled={disabled} className="app-btn-secondary">
                  <ShieldCheck className="h-4 w-4" />
                  {settings?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>

            <div className="settings-animate rounded-[20px] border border-red-200 bg-white p-6 shadow-sm dark:border-red-500/25 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Danger zone</h2>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Permanent actions, proceed with caution.
              </p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-slate-950 dark:text-white">Delete account</p>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    This will permanently remove your data.
                  </p>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  disabled={disabled}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
