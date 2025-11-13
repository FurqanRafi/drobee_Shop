"use client";
import React, { useContext, useEffect, useState } from "react";
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
  ShoppingCart,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
  addToCart,
  initializeCart,
  logoutCart,
} from "@/redux/cartSlice";

import Link from "next/link";

import { AuthContext } from "@/context/AuthContext";

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("information");
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

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

        // ✅ Initialize cart with userId
        if (userId) {
          dispatch(initializeCart(userId));
        }
      })
      .catch(() => {
        localStorage.clear();
        router.push("/");
      });
  }, [dispatch, router]);

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

  // Cart handlers
  const handleQuantityChange = (item, type) => {
    if (type === "increment") {
      dispatch(addToCart({ ...item, quantity: 1 }));
    } else if (type === "decrement") {
      if (item.quantity > 1) {
        dispatch(addToCart({ ...item, quantity: -1 }));
      }
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(
      removeFromCart({
        id: item.id,
        size: item.size,
        color: item.color,
      })
    );
    showLuxuryToast("Item removed from cart", "success");
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
  const handleLogout = () => {
    setLoadingLogout(true);
    showLuxuryToast("Signing out...", "success");

    setTimeout(() => {
      // ✅ 1. Get current state before clearing
      const currentUserId = localStorage.getItem("userId");
      const currentCart = JSON.parse(
        localStorage.getItem(`cart_${currentUserId}`)
      );

      // ✅ 2. Save current user cart safely
      if (currentUserId && currentCart) {
        localStorage.setItem(
          `cart_${currentUserId}`,
          JSON.stringify(currentCart)
        );
      }

      // ✅ 3. Reset Redux to guest mode
      dispatch(logoutCart());

      // ✅ 4. Load guest cart instantly
      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
      dispatch({ type: "cart/setCart", payload: guestCart });

      // ✅ 5. Remove user info (token, id)
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // ✅ 6. Use context logout
      logout();

      // ✅ 7. Optional: reload to refresh cart view
      // window.location.reload();

      setLoadingLogout(false);
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
            <div className="w-16 h-px bg-black/20 mx-auto"></div>
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
                    onClick={() => setActiveTab("cart")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wider transition-all ${
                      activeTab === "cart"
                        ? "bg-black text-white"
                        : "text-black/60 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
                    MY CART
                    {cartItems.length > 0 && (
                      <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
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

                {/* 🛒 Cart Tab */}
                {activeTab === "cart" && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-light tracking-[0.2em]">
                        MY CART
                      </h2>
                      {cartItems.length > 0 && (
                        <Link href="/cartPage">
                          <button className="text-sm text-black hover:underline">
                            View Full Cart →
                          </button>
                        </Link>
                      )}
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="text-center py-16">
                        <ShoppingCart
                          className="w-16 h-16 mx-auto mb-4 text-black/20"
                          strokeWidth={1}
                        />
                        <p className="text-sm tracking-wider text-black/60 mb-6">
                          YOUR CART IS EMPTY
                        </p>
                        <Link href="/shop">
                          <button className="bg-black text-white px-8 py-3 text-sm tracking-[0.2em] hover:bg-black/80 transition-all">
                            CONTINUE SHOPPING
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Cart Items */}
                        <div className="space-y-4">
                          {cartItems.map((item, index) => (
                            <div
                              key={`${item.id}-${item.size}-${item.color}-${index}`}
                              className="flex gap-4 pb-4 border-b border-black/10"
                            >
                              <img
                                src={item.image}
                                alt={item.heading}
                                className="w-20 h-20 object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="text-sm tracking-wide font-medium mb-1">
                                  {item.heading}
                                </h3>
                                <p className="text-xs text-black/50 mb-2">
                                  {item.color && (
                                    <span>Color: {item.color}</span>
                                  )}
                                  {item.color && item.size && " | "}
                                  {item.size && <span>Size: {item.size}</span>}
                                </p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center border border-black/20">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(item, "decrement")
                                      }
                                      className="px-2 py-1 hover:bg-black/5 text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 text-xs border-x border-black/20">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(item, "increment")
                                      }
                                      className="px-2 py-1 hover:bg-black/5 text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-sm font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item)}
                                className="text-black/40 hover:text-red-500 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="pt-6 border-t border-black/10">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm tracking-wider text-black/60">
                              SUBTOTAL
                            </span>
                            <span className="text-lg font-medium">
                              ${cartSubtotal.toFixed(2)}
                            </span>
                          </div>
                          <Link href="/checkout">
                            <button className="w-full bg-black text-white py-3 text-sm tracking-[0.2em] hover:bg-black/80 transition-all">
                              PROCEED TO CHECKOUT
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
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
