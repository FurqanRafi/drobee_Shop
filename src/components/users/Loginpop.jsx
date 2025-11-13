"use client";
import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import {
  setUserId,
  setCart,
  clearCart,
  initializeCart,
} from "@/redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

const Loginpop = ({ open, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [forgotStep, setForgotStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();
  const { login, register, forgotPassword, resetPassword } =
    useContext(AuthContext);
  const dispatch = useDispatch();

  // ✨ Toast
  const showLuxuryToast = (message, type = "success") => {
    const luxuryStyle = {
      background:
        type === "success"
          ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
          : "linear-gradient(135deg, #fffbf5 0%, #fff8f0 100%)",
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
      success: { primary: "#000", secondary: "#fff" },
      error: { primary: "#d4af37", secondary: "#fff" },
    };

    if (type === "success") {
      toast.success(message, {
        duration: 3500,
        style: luxuryStyle,
        iconTheme: iconTheme.success,
        className: "luxury-toast",
      });
    } else {
      toast.error(message, {
        duration: 4000,
        style: luxuryStyle,
        iconTheme: iconTheme.error,
        className: "luxury-toast",
      });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formData = new FormData(e.target);
  //   const data = Object.fromEntries(formData.entries());

  //   try {
  //     if (isSignup) {
  //       await register(data);
  //       showLuxuryToast("Account created successfully", "success");
  //       setIsSignup(false);
  //     } else {
  //       // ✅ Login user
  //       const response = await login({
  //         identifier: data.identifier,
  //         password: data.password,
  //       });

  //       // ✅ Get userId
  //       const userId =
  //         response?.userId || response?.user?.username || data.identifier;

  //       // ✅ Save userId to localStorage
  //       localStorage.setItem("userId", userId);

  //       // ✅ Initialize cart (this will merge guest cart)
  //       dispatch(initializeCart(userId));

  //       localStorage.removeItem("showLoginPopup");

  //       const guestCart = JSON.parse(
  //         localStorage.getItem("cart_guest") || "[]"
  //       );
  //       if (guestCart.length > 0) {
  //         showLuxuryToast(
  //           "Welcome back! Your cart has been restored.",
  //           "success"
  //         );
  //       } else {
  //         showLuxuryToast("Welcome back!", "success");
  //       }

  //       onClose();
  //       setTimeout(() => router.push("/profile"), 500);
  //     }
  //   } catch (error) {
  //     showLuxuryToast(error?.message || "Authentication failed", "error");
  //   }

  //   setLoading(false);
  // };

  // ✅ Forgot password step 1

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (isSignup) {
        // Signup: backend me account create karo, localStorage me save nahi karna
        await register(data);
        showLuxuryToast("Account created successfully", "success");
        setIsSignup(false);
      } else {
        // Login: backend se poora user object lana
        const response = await login({
          identifier: data.identifier,
          password: data.password,
        });

        const user = response.user; // backend se poora user object aa raha hona chahiye
        if (!user) throw new Error("User data not found from backend");

        // ✅ Full user data localStorage me save
        localStorage.setItem("userData", JSON.stringify(user));

        // ✅ UserId alag save karo cart ke liye
        const userId = user._id || user.username;
        localStorage.setItem("userId", userId);

        // ✅ Initialize cart with userId
        dispatch(initializeCart(userId));

        // ✅ Optional: remove login popup flag
        localStorage.removeItem("showLoginPopup");

        // ✅ Show toast
        const guestCart = JSON.parse(
          localStorage.getItem("cart_guest") || "[]"
        );
        if (guestCart.length > 0) {
          showLuxuryToast(
            "Welcome back! Your cart has been restored.",
            "success"
          );
        } else {
          showLuxuryToast("Welcome back!", "success");
        }

        onClose();
        setTimeout(() => router.push("/profile"), 500);
      }
    } catch (error) {
      showLuxuryToast(error?.message || "Authentication failed", "error");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) return showLuxuryToast("Please enter your email", "error");
    setLoading(true);
    try {
      await forgotPassword(email);
      showLuxuryToast("Reset code sent to your email", "success");
      setForgotStep(2);
    } catch (err) {
      showLuxuryToast(err?.message || "Email not found", "error");
    }
    setLoading(false);
  };

  // ✅ Forgot password step 2
  const handleResetPassword = async () => {
    if (!email || !code || !newPassword)
      return showLuxuryToast("Please fill all fields", "error");
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      showLuxuryToast("Password reset successfully", "success");
      setForgotStep(0);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      showLuxuryToast(err?.message || "Invalid or expired code", "error");
    }
    setLoading(false);
  };

  const resetToLogin = () => {
    setForgotStep(0);
    setEmail("");
    setCode("");
    setNewPassword("");
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-999 p-4"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="relative bg-white/90 backdrop-blur-xl w-full max-w-[520px] rounded-none shadow-2xl border border-white/20"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors duration-300 z-10"
              >
                <X className="w-5 h-5" strokeWidth={1} />
              </button>

              <div className="p-10 sm:p-14">
                {/* Login/Signup */}
                {forgotStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-light tracking-[0.25em] text-black mb-3">
                        {isSignup ? "CREATE ACCOUNT" : "WELCOME BACK"}
                      </h2>
                      <div className="w-16 h-px bg-black/20 mx-auto"></div>
                      <p className="text-xs tracking-[0.15em] text-black/50 mt-3">
                        {isSignup
                          ? "JOIN OUR EXCLUSIVE COMMUNITY"
                          : "SIGN IN TO YOUR ACCOUNT"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 w-full ">
                      {isSignup && (
                        <>
                          <input
                            name="username"
                            placeholder="USERNAME"
                            required
                            className="input px-3 py-2"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              name="phone"
                              placeholder="PHONE"
                              required
                              className="input px-3 py-2"
                            />
                            <input
                              name="country"
                              placeholder="COUNTRY"
                              required
                              className="input px-3 py-2"
                            />
                          </div>
                          <input
                            name="address"
                            placeholder="ADDRESS"
                            required
                            className="input px-3 py-2"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              name="city"
                              placeholder="CITY"
                              required
                              className="input px-3 py-2"
                            />
                            <input
                              name="postalCode"
                              placeholder="POSTAL CODE"
                              required
                              className="input px-3 py-2"
                            />
                          </div>
                          <input
                            name="email"
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            required
                            className="input px-3 py-2"
                          />
                          <input
                            name="password"
                            type="password"
                            placeholder="PASSWORD"
                            required
                            className="input px-3 py-2"
                          />
                        </>
                      )}

                      {!isSignup && (
                        <>
                          <input
                            name="identifier"
                            placeholder="Username or Email"
                            required
                            className="input px-3 py-2"
                          />
                          <input
                            name="password"
                            type="password"
                            placeholder="PASSWORD"
                            required
                            className="input px-3 py-2"
                          />
                        </>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 mt-8 font-light tracking-[0.3em] text-sm hover:bg-black/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? "PROCESSING..."
                          : isSignup
                          ? "CREATE ACCOUNT"
                          : "SIGN IN"}
                      </button>
                    </form>

                    <div className="mt-10 space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-black/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white/90 px-4 text-black/40 tracking-wider">
                            OR
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="w-full text-center py-3 border border-black/20 text-xs tracking-[0.2em] text-black/70 hover:bg-black/5 hover:border-black/40 transition-all duration-300"
                      >
                        {isSignup
                          ? "ALREADY HAVE AN ACCOUNT?"
                          : "CREATE NEW ACCOUNT"}
                      </button>

                      {!isSignup && (
                        <button
                          onClick={() => setForgotStep(1)}
                          className="w-full text-center text-xs tracking-[0.15em] text-black/50 hover:text-black transition-colors duration-300 pt-2"
                        >
                          FORGOT PASSWORD?
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Forgot Password - Step 1: Email */}
                {forgotStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={resetToLogin}
                      className="flex items-center gap-2 text-xs tracking-wider text-black/60 hover:text-black transition-colors mb-8"
                    >
                      <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                      BACK TO LOGIN
                    </button>

                    <div className="text-center mb-10">
                      <h2 className="text-2xl font-light tracking-[0.25em] text-black mb-3">
                        RESET PASSWORD
                      </h2>
                      <div className="w-16 h-px bg-black/20 mx-auto"></div>
                      <p className="text-xs tracking-widest text-black/50 mt-4">
                        Enter your email to receive a reset code
                      </p>
                    </div>

                    <div className="space-y-5">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        className="input w-full px-3 py-2"
                      />
                      <button
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="w-full bg-black text-white py-4 text-sm tracking-[0.3em] hover:bg-black/80 transition-all duration-300 disabled:opacity-50"
                      >
                        {loading ? "SENDING..." : "SEND RESET CODE"}
                      </button>
                      <button
                        onClick={() => setIsSignup(true)}
                        className="w-full text-center py-3 border border-black/20 text-xs tracking-[0.2em] text-black/70 hover:bg-black/5 hover:border-black/40 transition-all duration-300"
                      >
                        CREATE NEW ACCOUNT
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Forgot Password - Step 2: Reset */}
                {forgotStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={resetToLogin}
                      className="flex items-center gap-2 text-xs tracking-wider text-black/60 hover:text-black transition-colors mb-8"
                    >
                      <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                      BACK TO LOGIN
                    </button>

                    <div className="text-center mb-10">
                      <h2 className="text-2xl font-light tracking-[0.25em] text-black mb-3">
                        VERIFY & RESET
                      </h2>
                      <div className="w-16 h-px bg-black/20 mx-auto"></div>
                      <p className="text-xs tracking-widest text-black/50 mt-4">
                        Enter the code sent to your email
                      </p>
                    </div>

                    <div className="space-y-5">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        type="text"
                        placeholder="VERIFICATION CODE"
                        className="input w-full px-3 py-2"
                      />
                      <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        placeholder="NEW PASSWORD"
                        className="input w-full px-3 py-2"
                      />
                      <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full bg-black text-white py-4 text-sm tracking-[0.3em] hover:bg-black/80 transition-all duration-300 disabled:opacity-50"
                      >
                        {loading ? "RESETTING..." : "RESET PASSWORD"}
                      </button>
                      <button
                        onClick={() => setIsSignup(true)}
                        className="w-full text-center py-3 border border-black/20 text-xs tracking-[0.2em] text-black/70 hover:bg-black/5 hover:border-black/40 transition-all duration-300"
                      >
                        CREATE NEW ACCOUNT
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Loginpop;
