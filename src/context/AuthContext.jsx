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
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const showPopupFlag = localStorage.getItem("showLoginPopup");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    if (showPopupFlag === "true") {
      setShowLoginPopup(true);
      localStorage.removeItem("showLoginPopup");
    }

    getProducts();
  }, []);

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  };

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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    localStorage.setItem("showLoginPopup", "true");
    setShowLoginPopup(true);

    router.push("/");
  };

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

  const deleteProfile = async () => {
    try {
      await axios.delete(`${API_URL}/profile/delete`);
      logout();
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete profile" };
    }
  };

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

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to send reset code" };
    }
  };

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

  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const getProductsById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);

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

      const transformedProduct = {
        _id: fetchedProduct._id,
        id: fetchedProduct._id,
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

        image:
          fetchedProduct.images && fetchedProduct.images.length > 0
            ? typeof fetchedProduct.images[0] === "string"
              ? fetchedProduct.images[0]
              : fetchedProduct.images[0].url || "/placeholder.png"
            : "/placeholder.png",

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

        colors: Array.isArray(fetchedProduct.colors)
          ? fetchedProduct.colors.map((color) => ({
              name: color.name || "Color",
              hex: color.hex || null,
            }))
          : [],

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

      return transformedProduct;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const getshipping = async () => {
    try {
      const response = await axios.get(`${API_URL}/shipping`);
      return response.data;
    } catch (error) {
      console.error("Error fetching shipping:", error);
      return [];
    }
  };

  const createCheckout = async (
    userData,
    products,
    totalAmount,
    discount,
    shippingCost
  ) => {
    try {
      const checkoutData = {
        user: userData,
        products: products,
        totalAmount: totalAmount,
        discount: discount || 0,
        shippingCost: shippingCost || 0, // ✅ Add shipping cost
        paymentMethod: "Cash on Delivery",
        status: "pending",
      };

      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create checkout");
      }

      return data;
    } catch (error) {
      console.error("Create checkout error:", error);
      throw error;
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
        getshipping,
        createCheckout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
