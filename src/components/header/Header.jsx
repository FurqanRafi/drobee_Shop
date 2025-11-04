"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, Search, ShoppingBagIcon, User, X } from "lucide-react";
import { Montserrat } from "next/font/google";
import Loginpop from "../users/Loginpop";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // ✅ Check login status on load (optional: if user stored in localStorage)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    if (isLoggedIn && !user) {
      // Optionally trigger context restore here if needed
    }
  }, [user]);

  const handleUserClick = () => {
    if (user) {
      // ✅ User logged in → Go to profile
      router.push("/profile");
    } else {
      // ❌ Not logged in → Show login popup only once
      setLoginOpen(true);
    }
  };

  // ✅ Close popup and mark user as logged in
  const handleLoginClose = () => {
    setLoginOpen(false);
    if (user) {
      localStorage.setItem("userLoggedIn", "true"); // save login state
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="w-full absolute z-50 flex flex-col">
        {/* ✅ MOBILE HEADER */}
        <div className="lg:hidden w-full flex items-center justify-between px-4 py-3">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2">
            <Search className="w-5 h-5 text-white" />
          </button>

          <Link href="/" className="flex-1 flex justify-center">
            <img
              src="/drobeelogowhite.png"
              alt="logo"
              className="h-14 object-contain"
            />
          </Link>

          <div
            className="border border-white p-2 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* ✅ Mobile Search Bar Animation */}
        <AnimatePresence>
          {searchOpen && (
            <motion.input
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              type="text"
              placeholder="Search..."
              className="lg:hidden w-full px-4 py-2 bg-black/80 text-white outline-none placeholder-white"
              autoFocus
            />
          )}
        </AnimatePresence>

        {/* ✅ Desktop Header */}
        <div className="MyContainer md:w-[90%] hidden lg:flex items-center justify-between py-3">
          {/* Menu */}
          <div
            className={`hidden lg:flex text-md font-medium items-center gap-6 text-white ${montserrat.className}`}
          >
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/aboutus">About Us</Link>
            <Link href="/contact">Contact Us</Link>
          </div>

          {/* Logo */}
          <div className="flex w-1/3 lg:pr-48 items-center justify-center">
            <Link href="/">
              <img
                src="/drobeelogowhite.png"
                alt="logo"
                className="object-contain w-32 h-16"
              />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-5 text-white">
            <div className="relative flex items-center">
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: searchOpen ? 200 : 0,
                  opacity: searchOpen ? 1 : 0,
                }}
                transition={{ duration: 0.35 }}
                type="text"
                placeholder="Search..."
                className={`border border-white rounded-full pl-10 pr-4 py-1 absolute right-0 bg-transparent text-white placeholder-white ${
                  searchOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
                autoFocus={searchOpen}
              />
              <motion.button
                onClick={() => setSearchOpen(!searchOpen)}
                className="relative z-10 p-2"
                animate={{ rotate: searchOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="w-5 h-5 cursor-pointer" />
              </motion.button>
            </div>

            <ShoppingBagIcon className="w-5 h-5 cursor-pointer" />

            {/* ✅ User icon logic */}
            <User
              className="w-7 h-7 cursor-pointer"
              onClick={handleUserClick}
            />
          </div>
        </div>

        {/* ✅ Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-full h-screen bg-black/40 backdrop-blur-xl text-white flex flex-col items-center justify-center z-50"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-6 text-white"
              >
                <X className="w-8 h-8" />
              </button>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <Image
                  src="/drobeelogowhite.png"
                  alt="logo"
                  width={150}
                  height={150}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`flex flex-col items-center gap-6 text-2xl ${montserrat.className}`}
              >
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/shop" onClick={() => setMenuOpen(false)}>
                  Shop
                </Link>
                <Link href="/aboutus" onClick={() => setMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)}>
                  Contact Us
                </Link>

                <div className="flex items-center gap-5 text-white mt-4">
                  <User
                    className="w-7 h-7 cursor-pointer"
                    onClick={handleUserClick}
                  />
                  <ShoppingBagIcon className="w-7 h-7 cursor-pointer" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Login Popup (only shows if not logged in) */}
      {!user && <Loginpop open={loginOpen} onClose={handleLoginClose} />}
    </>
  );
};

export default Header;
