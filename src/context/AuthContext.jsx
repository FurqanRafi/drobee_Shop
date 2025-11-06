"use client";
import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // 👈 NEW
  const router = useRouter();

  useEffect(() => {
    // ✅ Load auth data from localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const showPopupFlag = localStorage.getItem("showLoginPopup");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      // ✅ Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    // 👇 Show login popup if flag is set
    if (showPopupFlag === "true") {
      setShowLoginPopup(true);
      localStorage.removeItem("showLoginPopup");
    }
  }, []);

  // ✅ Register
  const register = async (userData) => {
    try {
      const res = await axios.post(
        "https://drobee-backend.vercel.app/api/register",
        userData
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  };

  // ✅ Login
  const login = async (credentials) => {
    try {
      const res = await axios.post(
        "https://drobee-backend.vercel.app/api/login",
        credentials
      );
      const { user, token } = res.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  };

  // ✅ Logout (keep cart intact)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // 👇 trigger popup flag
    localStorage.setItem("showLoginPopup", "true");
    setShowLoginPopup(true); // instantly open popup

    router.push("/");
  };

  // ✅ Get Profile
  const getProfile = async () => {
    try {
      const res = await axios.get(
        "https://drobee-backend.vercel.app/api/profile"
      );
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch profile" };
    }
  };

  // ✅ Update Profile
  const updateProfile = async (updatedData) => {
    try {
      const res = await axios.put(
        "https://drobee-backend.vercel.app/api/profile/update",
        updatedData
      );
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  };

  // ✅ Delete Profile
  const deleteProfile = async () => {
    try {
      await axios.delete(
        "https://drobee-backend.vercel.app/api/profile/delete"
      );
      logout();
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete profile" };
    }
  };

  // ✅ Change Password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.put(
        "https://drobee-backend.vercel.app/api/profile/change-password",
        {
          oldPassword,
          newPassword,
        }
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Password change failed" };
    }
  };

  // ✅ Change Email
  const changeEmail = async (newEmail, password) => {
    try {
      const res = await axios.put(
        "https://drobee-backend.vercel.app/api/profile/change-email",
        {
          newEmail,
          password,
        }
      );
      setUser((prev) => ({ ...prev, email: newEmail }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, email: newEmail })
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Email change failed" };
    }
  };

  // ✅ Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(
        "https://drobee-backend.vercel.app/api/forgot-password",
        { email }
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to send reset code" };
    }
  };

  // ✅ Reset Password
  const resetPassword = async (email, code, newPassword) => {
    try {
      const res = await axios.post(
        "https://drobee-backend.vercel.app/api/reset-password",
        {
          email,
          code,
          newPassword,
        }
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Password reset failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        getProfile,
        updateProfile,
        deleteProfile,
        changePassword,
        changeEmail,
        forgotPassword,
        resetPassword,
        showLoginPopup,
        setShowLoginPopup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
