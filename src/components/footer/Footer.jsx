import Link from "next/link";
import React from "react";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const Footer = () => {
  return (
    <div className="relative py-10 bg-[#f5f5f5]">
      <div className=" flex flex-col items-center border-b border-black/20 pb-10 justify-between">
        <div className="MyContainer ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-between gap-10">
            <div className="flex flex-col items-center gap-3">
              <h1
                className={`text-sm md:text-lg uppercase tracking-widest text-black font-bold mb-2 sm:mb-2 ${playfair.className}`}
              >
                Menu
              </h1>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Home
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/shop"
              >
                Shop
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/aboutus"
              >
                About Us
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3">
              <h1
                className={`text-sm md:text-lg uppercase tracking-widest text-black font-bold mb-2 sm:mb-2 ${playfair.className}`}
              >
                Categories
              </h1>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Casual
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Work & Office
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Active Wear
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/singleproduct"
              >
                Evening Dresses
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3">
              <h1
                className={`text-sm md:text-lg uppercase tracking-widest text-black font-bold mb-2 sm:mb-2 ${playfair.className}`}
              >
                Resourses
              </h1>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Contact Support
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                FAQ
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Live Chat
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Shipping & Returns
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3">
              <h1
                className={`text-sm md:text-lg uppercase tracking-widest text-black font-bold mb-2 sm:mb-2 ${playfair.className}`}
              >
                Social Media
              </h1>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Facebook
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Instagram
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Twitter
              </Link>
              <Link
                className={`text-sm text-black/70 ${montserrat.className}`}
                href="/"
              >
                Pintrest
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="MyContainer flex items-center justify-center">
        <h1 className="text-sm md:text-medium text-black/80 font-semibold text-center mt-10">Copyright © 2025 Clothing Store | Powered by Drobee.</h1>
      </div>
    </div>
  );
};

export default Footer;
