import React from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const Elevate = () => {
  return (
    <div className="relative w-full overflow-hidden py-25">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/bg-005.jpg')" }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="MyContainer relative z-10  flex items-center justify-end py-6">
        <div className="w-full md:w-[45%] flex flex-col items-end justify-center text-start text-white">
          <div className="flex flex-col items-center md:items-start  ">
            <h2 className="text-xs md:text-sm uppercase tracking-widest text-white font-semibold mb-2 sm:mb-2">
              Explore
            </h2>
            <h2
              className={`text-2xl md:text-3xl lg:text-[47px] text-center md:text-left font-medium tracking-wider italic leading-snug ${playfair.className}`}
            >
              Elevate your wardrobe, embrace timeless style!
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-white/70 text-center md:text-left">
              Explore our collections today and experience the joy of fashion.
              Shop now for the epitome of chic sophistication
            </p>

            <button className="mt-8 px-8 py-3 border border-white uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elevate;
