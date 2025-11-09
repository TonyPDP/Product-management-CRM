import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  CreditCard,
  Download,
  Trash2,
  Check,
  Camera,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "appearance", name: "Appearance", icon: Palette },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Settings ⚙️
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0 animate-in fade-in slide-in-from-left duration-700">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 shadow-lg space-y-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transform scale-105"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-md transform hover:scale-102"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    activeTab === tab.id ? "transform rotate-12" : "group-hover:scale-110"
                  }`}
                />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 animate-in fade-in slide-in-from-right duration-700">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-white font-bold text-3xl">TS</span>
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tony Stark</h3>
                    <p className="text-gray-600 text-sm">Administrator</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      defaultValue="Tony"
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      defaultValue="Stark"
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      defaultValue="tony@starkindustries.com"
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Genius, billionaire, playboy, philanthropist."
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Email Notifications", desc: "Receive notifications via email" },
                    { key: "push", label: "Push Notifications", desc: "Receive push notifications in browser" },
                    { key: "sms", label: "SMS Notifications", desc: "Receive text message alerts" },
                    { key: "marketing", label: "Marketing Emails", desc: "Receive promotional content" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 transform group-hover:scale-110 ${
                          notifications[item.key]
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                            notifications[item.key] ? "translate-x-7" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Quiet Hours
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Mute all notifications during specific hours
                    </p>
                    <div className="flex gap-3">
                      <Input
                        type="time"
                        defaultValue="22:00"
                        className="w-32 border-2 border-blue-200 rounded-xl"
                      />
                      <span className="text-gray-600 flex items-center">to</span>
                      <Input
                        type="time"
                        defaultValue="08:00"
                        className="w-32 border-2 border-blue-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="border-2 border-gray-200 rounded-xl pr-10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Two-Factor Authentication
                </h2>
                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">2FA Enabled</h3>
                      <p className="text-sm text-gray-600">Your account is secure</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
                  >
                    Disable
                  </Button>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Sessions</h2>
                <div className="space-y-3">
                  {[
                    { device: "Chrome on MacBook Pro", location: "New York, USA", active: true },
                    { device: "Safari on iPhone 15", location: "Los Angeles, USA", active: false },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{session.device}</h3>
                          <p className="text-sm text-gray-600">{session.location}</p>
                        </div>
                      </div>
                      {session.active && (
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          Active Now
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  Theme Preferences
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", icon: Sun, label: "Light" },
                    { id: "dark", icon: Moon, label: "Dark" },
                    { id: "system", icon: Monitor, label: "System" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setDarkMode(theme.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        darkMode === theme.id
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <theme.icon
                        className={`w-8 h-8 mx-auto mb-3 ${
                          darkMode === theme.id ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          darkMode === theme.id ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {theme.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Accent Color</h2>
                <div className="grid grid-cols-8 gap-3">
                  {[
                    "bg-blue-600",
                    "bg-purple-600",
                    "bg-pink-600",
                    "bg-red-600",
                    "bg-orange-600",
                    "bg-yellow-600",
                    "bg-green-600",
                    "bg-teal-600",
                  ].map((color, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-xl ${color} hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-xl`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Save Button */}
          <div className="sticky bottom-0 mt-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {isSaving ? "Saving changes..." : "Make sure to save your changes"}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="hover:bg-gray-50 transition-all duration-300"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: in 0.6s ease-out forwards;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Settings;