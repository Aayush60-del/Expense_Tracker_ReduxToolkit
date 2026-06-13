import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Bell, Lock, LogOut, Moon, Sun, Monitor, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { updateProfile, changePassword, deleteAccount } from '../features/Auth/AuthSlice';
import { toast } from 'react-toastify';

const Settings = ({ setTheme }) => {
  const [activeMenu, setActiveMenu] = useState('profile');
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = () => {
    if (!name) return toast.error("Name is required");
    dispatch(updateProfile({ name }))
      .unwrap()
      .then(() => toast.success("Profile updated successfully"))
      .catch((err) => toast.error(err));
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) return toast.error("Both passwords are required");
    dispatch(changePassword({ currentPassword, newPassword })).unwrap()
      .then(() => {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch((err) => toast.error(err));
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you SURE you want to permanently delete your account? This action cannot be undone.")) {
      dispatch(deleteAccount()).unwrap()
        .then(() => toast.success("Account deleted"))
        .catch((err) => toast.error(err));
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Menu */}
        <Card className="md:w-64 border-0 shadow-sm ring-1 ring-slate-200/50 h-fit shrink-0">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${activeMenu === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Right Content */}
        <Card className="flex-1 border-0 shadow-sm ring-1 ring-slate-200/50">
          <CardContent className="p-6 md:p-8">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Settings */}
              {activeMenu === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Profile Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Update your personal information.</p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-3xl">
                      {user ? (user.name ? user.name.charAt(0).toUpperCase() : "U") : "G"}
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Upload new avatar</Button>
                      <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Name</Label>
                      <Input id="firstName" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border-slate-200" disabled={!user || user.guestMode} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" defaultValue={user?.email || "guest@local"} className="rounded-xl border-slate-200" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl border-slate-200" disabled={!user || user.guestMode} />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6" onClick={handleUpdateProfile} disabled={!user || user.guestMode}>Save Changes</Button>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeMenu === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Preferences</h2>
                    <p className="text-sm text-slate-500 mt-1">Customize your experience.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Theme Appearance</Label>
                      <p className="text-sm text-slate-500 mb-3 mt-1">Select or customize your UI theme.</p>
                      <div className="grid grid-cols-3 gap-4 max-w-md">
                        <button
                          onClick={() => setTheme?.("light")}
                          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-blue-500 bg-blue-50"
                        >
                          <Sun className="w-6 h-6 text-blue-500" />
                          <span className="text-sm font-medium text-slate-900">Light</span>
                        </button>
                        <button
                          onClick={() => setTheme?.("dark")}
                          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300"
                        >
                          <Moon className="w-6 h-6 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">Dark</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300" onClick={() => setTheme?.("system")}>
                          <Monitor className="w-6 h-6 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">System</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-w-md pt-4">
                      <Label>Currency</Label>
                      <select className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div className="space-y-2 max-w-md">
                      <Label>Language</Label>
                      <select className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">Save Preferences</Button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeMenu === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                    <p className="text-sm text-slate-500 mt-1">Choose what alerts you want to receive.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'email', title: 'Email Notifications', desc: 'Receive daily summaries and updates.' },
                      { id: 'tx', title: 'Transaction Alerts', desc: 'Get notified for every new transaction.' },
                      { id: 'reports', title: 'Monthly Reports', desc: 'Receive your monthly spending report.' },
                      { id: 'budget', title: 'Budget Alerts', desc: 'Get warned when approaching your budget limit.' }
                    ].map((setting, i) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div>
                          <Label htmlFor={setting.id} className="text-base">{setting.title}</Label>
                          <p className="text-sm text-slate-500">{setting.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" id={setting.id} className="sr-only peer" defaultChecked={i < 3} />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeMenu === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Security</h2>
                    <p className="text-sm text-slate-500 mt-1">Protect your account and data.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-100 flex flex-col gap-4">
                      <div>
                        <Label className="text-base font-semibold">Change Password</Label>
                        <p className="text-sm text-slate-500 mt-1">Update your password regularly to keep your account secure.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="rounded-xl border-slate-200"
                            disabled={!user || user.guestMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="rounded-xl border-slate-200"
                            disabled={!user || user.guestMode}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button onClick={handleChangePassword} disabled={!user || user.guestMode}>Update Password</Button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Two-Factor Authentication</Label>
                        <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                      </div>
                      <Button variant="outline" className="rounded-xl" disabled={!user || user.guestMode}>Enable</Button>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-100">
                    <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>
                    <div className="p-4 rounded-xl border border-red-100 bg-red-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold text-red-900">Delete Account</Label>
                        <p className="text-sm text-red-700 mt-1">Permanently delete your account and all data.</p>
                      </div>
                      <Button variant="destructive" className="w-full sm:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={handleDeleteAccount} disabled={!user || user.guestMode}>Delete Account</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeMenu === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Billing</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your subscription and payment methods.</p>
                  </div>
                  <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-2">Free Plan</span>
                        <h3 className="text-xl font-bold text-slate-900">Basic Account</h3>
                        <p className="text-sm text-slate-500 mt-1">You are currently on the free plan.</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Upgrade to Pro</Button>
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
