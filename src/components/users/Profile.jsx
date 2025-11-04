"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Lock,
  Mail,
  ShieldAlert,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("information");
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

  // ✨ Luxury Toast Configuration
  const showLuxuryToast = (message, type = "success") => {
    const luxuryStyle = {
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      color: "#000",
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "20px 32px",
      fontSize: "13px",
      letterSpacing: "0.08em",
      fontWeight: "300",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: "2px",
      maxWidth: "400px",
    };

    const iconTheme = {
      success: {
        primary: "#000",
        secondary: "#fff",
      },
      error: {
        primary: "#d4af37",
        secondary: "#fff",
      },
      warning: {
        primary: "#d4af37",
        secondary: "#fff",
      },
    };

    if (type === "success") {
      toast.success(message, {
        duration: 3500,
        style: luxuryStyle,
        iconTheme: iconTheme.success,
        className: "luxury-toast",
      });
    } else if (type === "error") {
      toast.error(message, {
        duration: 4000,
        style: {
          ...luxuryStyle,
          background: "linear-gradient(135deg, #fffbf5 0%, #fff8f0 100%)",
          border: "1px solid rgba(212,175,55,0.15)",
        },
        iconTheme: iconTheme.error,
        className: "luxury-toast",
      });
    } else if (type === "warning") {
      toast(message, {
        duration: 4000,
        icon: "⚠️",
        style: {
          ...luxuryStyle,
          background: "linear-gradient(135deg, #fffbf5 0%, #fff8f0 100%)",
          border: "1px solid rgba(212,175,55,0.15)",
        },
        className: "luxury-toast",
      });
    }
  };

  // ✅ Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    axios
      .get("https://drobee-backend.vercel.app/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data.user);
        setEditData(res.data.user);
      })
      .catch(() => {
        localStorage.clear();
        router.push("/");
      });
  }, []);

  if (!userData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-black">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm tracking-[0.2em] text-black/60">LOADING</p>
        </div>
      </div>
    );
  }

  // ✅ Input change
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // ✅ Save profile
  const handleSave = async () => {
    setLoadingSave(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "https://drobee-backend.vercel.app/api/profile/update",
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data.user);
      setIsEditing(false);
      showLuxuryToast("Profile updated successfully", "success");
    } catch {
      showLuxuryToast("Failed to update profile", "error");
    }
    setLoadingSave(false);
  };

  // ✅ Cancel edit
  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  // ✅ Logout
  const handleLogout = () => {
    setLoadingLogout(true);
    showLuxuryToast("Signing out...", "success");
    setTimeout(() => {
      localStorage.clear();
      localStorage.setItem("showLoginPopup", "true");
      router.push("/");
      window.location.reload();
    }, 700);
  };

  // ✅ Change password
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showLuxuryToast("Passwords do not match", "error");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "https://drobee-backend.vercel.app/api/profile/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showLuxuryToast("Password updated successfully", "success");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      showLuxuryToast("Failed to update password", "error");
    }
  };

  const handleEmailChange = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "https://drobee-backend.vercel.app/api/profile/change-email",
        emailData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showLuxuryToast("Email updated successfully", "success");

      // ✅ Update userData & editData to reflect immediately
      setUserData((prev) => ({ ...prev, email: emailData.newEmail }));
      setEditData((prev) => ({ ...prev, email: emailData.newEmail }));

      setEmailData({ newEmail: "", password: "" });
    } catch {
      showLuxuryToast("Failed to change email", "error");
    }
  };

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        "https://drobee-backend.vercel.app/api/profile/delete",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showLuxuryToast("Account deleted successfully", "success");
      setTimeout(() => {
        localStorage.clear();
        router.push("/");
        window.location.reload();
      }, 1500);
    } catch {
      showLuxuryToast("Failed to delete account", "error");
    }
  };

  return (
    <>
      <style jsx global>{`
        .luxury-toast {
          animation: luxurySlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes luxurySlideIn {
          from {
            transform: translateY(-100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .luxury-toast > div {
          align-items: center !important;
          gap: 16px !important;
        }

        .luxury-toast svg {
          width: 20px !important;
          height: 20px !important;
          stroke-width: 1.5 !important;
        }
      `}</style>

      <div className="w-full min-h-screen bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light tracking-[0.3em] text-black mb-3">
              MY ACCOUNT
            </h1>
            <div className="w-16 h-[1px] bg-black/20 mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white border border-black/10 p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("information")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wider transition-all ${
                      activeTab === "information"
                        ? "bg-black text-white"
                        : "text-black/60 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <User className="w-4 h-4" strokeWidth={1.5} />
                    INFORMATION
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wider transition-all ${
                      activeTab === "settings"
                        ? "bg-black text-white"
                        : "text-black/60 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <Settings className="w-4 h-4" strokeWidth={1.5} />
                    SETTINGS
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={loadingLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wider text-red-500 hover:bg-red-300/5 transition-all mt-8 disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    {loadingLogout ? "LOGGING OUT..." : "LOGOUT"}
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-black/10 p-8 md:p-12"
              >
                {/* 🧾 Information Tab */}
                {activeTab === "information" && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-light tracking-[0.2em]">
                        ACCOUNT INFORMATION
                      </h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 text-sm text-black hover:underline"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={loadingSave}
                            className="flex items-center gap-2 text-sm text-green-600 disabled:opacity-50"
                          >
                            <Save size={16} />{" "}
                            {loadingSave ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 text-sm text-red-600"
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {Object.entries({
                        username: "USERNAME",
                        email: "EMAIL",
                        phone: "PHONE",
                        country: "COUNTRY",
                        address: "ADDRESS",
                        city: "CITY",
                        postalCode: "POSTAL CODE",
                      }).map(([key, label]) => (
                        <div key={key}>
                          <label className="block text-xs tracking-wider text-black/50 mb-2">
                            {label}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name={key}
                              value={editData[key] || ""}
                              onChange={handleInputChange}
                              disabled={key === "email"}
                              className={`w-full px-0 py-2 bg-transparent border-0 border-b outline-none text-sm tracking-wide ${
                                key === "email"
                                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                  : "border-black/20 focus:border-black"
                              }`}
                            />
                          ) : (
                            <p className="text-sm tracking-wide">
                              {userData[key] || "-"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ⚙️ Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-10">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg tracking-wide flex items-center gap-2 mb-4">
                        <Lock size={18} /> CHANGE PASSWORD
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {["oldPassword", "newPassword", "confirmPassword"].map(
                          (key) => (
                            <input
                              key={key}
                              type="password"
                              placeholder={
                                key === "oldPassword"
                                  ? "Old Password"
                                  : key === "newPassword"
                                  ? "New Password"
                                  : "Confirm Password"
                              }
                              value={passwordData[key]}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  [key]: e.target.value,
                                })
                              }
                              className="border-b border-black/20 focus:border-black outline-none py-2 text-sm tracking-wide bg-transparent"
                            />
                          )
                        )}
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        className="mt-4 bg-black text-white py-2 px-6 text-sm tracking-[0.2em] hover:bg-black/80 transition-all"
                      >
                        UPDATE PASSWORD
                      </button>
                    </div>

                    {/* Change Email */}
                    <div>
                      <h3 className="text-lg tracking-wide flex items-center gap-2 mb-4">
                        <Mail size={18} /> CHANGE EMAIL
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="email"
                          placeholder="New Email"
                          value={emailData.newEmail}
                          onChange={(e) =>
                            setEmailData({
                              ...emailData,
                              newEmail: e.target.value,
                            })
                          }
                          className="border-b border-black/20 focus:border-black outline-none py-2 text-sm tracking-wide bg-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={emailData.password}
                          onChange={(e) =>
                            setEmailData({
                              ...emailData,
                              password: e.target.value,
                            })
                          }
                          className="border-b border-black/20 focus:border-black outline-none py-2 text-sm tracking-wide bg-transparent"
                        />
                      </div>
                      <button
                        onClick={handleEmailChange}
                        className="mt-4 bg-black text-white py-2 px-6 text-sm tracking-[0.2em] hover:bg-black/80 transition-all"
                      >
                        UPDATE EMAIL
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="pt-6 border-t border-black/10">
                      <h3 className="text-lg tracking-wide flex items-center gap-2 mb-3 text-black">
                        <Trash2 size={18} /> DELETE ACCOUNT
                      </h3>
                      <p className="text-sm text-black/60 mb-3">
                        This action is irreversible. All your data will be
                        deleted permanently.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-black text-white py-2 px-6 text-sm tracking-[0.2em] hover:bg-black/80 transition-all flex items-center gap-2"
                      >
                        <ShieldAlert size={16} /> DELETE MY ACCOUNT
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
