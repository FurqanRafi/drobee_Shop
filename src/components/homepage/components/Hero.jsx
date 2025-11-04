import React from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden ">
      <div className="relative z-0 top-0  left-0 w-full h-full">
        <div className="fixed z-10 top-0  left-0 w-full h-full">
          <Image
            src="/main.jpg"
            alt="home"
            fill
            className="object-cover w-full h-full "
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      </div>
      <div className="absolute MyContainer w-[85%] md:w-[70%] lg:w-[60%] top-[60%]  z-30 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <h2
          className={`lg:text-sm text-xs font-semibold tracking-widest text-white uppercase   ${montserrat.className}`}
        >
          Casual & Everyday
        </h2>
        <div className="w-full lg:w-[75%] ">
          <h1
            className={`lg:text-[70px] text-[30px] md:text-[55px] w-full  font-medium text-center text-white ${playfair.className}`}
          >
            Effortlessly blend comfort & style!
          </h1>
        </div>
        <div className="w-full lg:w-[68%]">
          <p
            className={`lg:text-sm md:text-base ${montserrat.className} leading-8  text-xs text-center font-medium text-white`}
          >
            Effortlessly blend comfort and style with our Casual & Everyday
            collection, featuring cozy sweaters, versatile denim, laid-back
            tees, and relaxed-fit joggers for your everyday adventures
          </p>
        </div>
        <button
          className={`text-white text-sm mt-4 lg:mt-10 px-10 py-4 tracking-[2px] hover:bg-white hover:text-black border border-white ${montserrat.className} uppercase font-semibold`}
        >
          View Collection
        </button>
      </div>
    </div>
  );
};

export default Hero;
