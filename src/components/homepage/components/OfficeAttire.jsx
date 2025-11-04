import { Montserrat, Playfair_Display } from "next/font/google";
import React from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const OfficeAttire = () => {
  return (
    <div className="w-full relative z-50">
      <div
        className="
          w-full 
          
          bg-center 
          bg-cover 
          bg-no-repeat 
          flex 
          flex-col md:flex-row
          items-center
          md:items-stretch
        "
        style={{
          backgroundImage: "url('/bg-05offce.jpg')",
        }}
      >
        <div
          className="
          w-full
          sm:w-full           
          md:w-[50%] 
          bg-white/90 
          min-h-screen
          flex 
          items-center 
          justify-center 
           
          py-12 sm:py-16 md:py-5
        "
        >
          <div className=" MyContainer md:pl-20 w-full md:max-w-lg text-center md:text-left">
            <h2
              className={`text-xs sm:text-sm  uppercase tracking-widest text-gray-600 font-semibold mb-2 sm:mb-2 ${montserrat.className}`}
            >
              Work & Office Attire
            </h2>

            <h1
              className={`text-2xl sm:text-3xl md:text-[40px]  font-bold mb-4 sm:mb-5 text-gray-900 leading-tight ${playfair.className}`}
            >
              Professional Pinstripe Blazers Collection
            </h1>

            <p
              className={`text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 ${montserrat.className}`}
            >
              Elevate your workwear with our Professional Pinstripe Blazers
              Collection, where tailored sophistication meets modern confidence
              for a powerfully polished office look.
            </p>

            <button
              className={`px-6 sm:px-8 py-2.5 sm:py-3  border border-black hover:bg-black hover:text-white transition-all uppercase tracking-wider text-xs sm:text-sm font-medium ${montserrat.className}`}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeAttire;
