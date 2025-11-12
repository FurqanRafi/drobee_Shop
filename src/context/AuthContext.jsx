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

  const API_URL = "https://drobee-backend.vercel.app/api";

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

    getProducts();
  }, []);

  // ✅ Register
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  };

  // ✅ Login
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
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
      const res = await axios.get(`${API_URL}/profile`);
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
      const res = await axios.put(`${API_URL}/profile/update`, updatedData);
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
      await axios.delete(`${API_URL}/profile/delete`);
      logout();
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete profile" };
    }
  };

  // ✅ Change Password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.put(`${API_URL}/profile/change-password`, {
        oldPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Password change failed" };
    }
  };

  // ✅ Change Email
  const changeEmail = async (newEmail, password) => {
    try {
      const res = await axios.put(`${API_URL}/profile/change-email`, {
        newEmail,
        password,
      });
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
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to send reset code" };
    }
  };

  // ✅ Reset Password
  const resetPassword = async (email, code, newPassword) => {
    try {
      const res = await axios.post(`${API_URL}/reset-password`, {
        email,
        code,
        newPassword,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Password reset failed" };
    }
  };

  // ✅ Get Products - Fixed according to schema
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      console.log("Products fetched:", response.data);

      // Backend returns { products: [...] }
      return response.data.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const getProductsById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      console.log("Raw product response:", response.data);

      // Backend se jo bhi structure aaye, handle karo
      let fetchedProduct = null;

      if (response.data.product) {
        fetchedProduct = response.data.product;
      } else if (response.data) {
        fetchedProduct = response.data;
      }

      if (!fetchedProduct) {
        console.error("No product found in response");
        return null;
      }

      // ✅ Product ko same format mein transform karo jaise Products page mein hai
      const transformedProduct = {
        _id: fetchedProduct._id,
        id: fetchedProduct._id, // dono add karo for compatibility
        heading: fetchedProduct.heading || "Untitled Product",
        name: fetchedProduct.name || fetchedProduct.heading,
        style: fetchedProduct.style || "",
        category: fetchedProduct.category || "",
        price: Number(fetchedProduct.price) || 0,
        desc: fetchedProduct.desc || fetchedProduct.description || "",
        description: fetchedProduct.description || fetchedProduct.desc || "",
        maindesc: fetchedProduct.maindesc || fetchedProduct.description || "",
        popular: Boolean(fetchedProduct.popular),
        latest: Boolean(fetchedProduct.latest),
        sale: Boolean(fetchedProduct.sale),

        // First image
        image:
          fetchedProduct.images && fetchedProduct.images.length > 0
            ? typeof fetchedProduct.images[0] === "string"
              ? fetchedProduct.images[0]
              : fetchedProduct.images[0].url || "/placeholder.png"
            : "/placeholder.png",

        // ✅ Images with color index
        images: Array.isArray(fetchedProduct.images)
          ? fetchedProduct.images.map((img) => {
              if (typeof img === "string") {
                return { url: img, colourIndex: null };
              }
              return {
                url: img.url || img,
                colourIndex:
                  img.colour !== "" && img.colour != null
                    ? parseInt(img.colour)
                    : null,
              };
            })
          : [],

        // ✅ Colors array
        colors: Array.isArray(fetchedProduct.colors)
          ? fetchedProduct.colors.map((color) => ({
              name: color.name || "Color",
              hex: color.hex || null,
            }))
          : [],

        // ✅ Sizes array
        sizes: Array.isArray(fetchedProduct.sizes)
          ? fetchedProduct.sizes.map((s) => ({
              label: typeof s === "object" ? s.label : s,
              price:
                typeof s === "object" && s.price
                  ? Number(s.price)
                  : Number(fetchedProduct.price),
            }))
          : [],
      };

      console.log("✅ Transformed product:", transformedProduct);
      return transformedProduct;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      console.log("Categories fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
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

        getProducts,
        getProductsById,
        getAllCategories,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
