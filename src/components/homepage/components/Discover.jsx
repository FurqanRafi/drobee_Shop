import React from "react";
import Image from "next/image";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const Discover = () => {
  return (
    <div className="relative w-full min-h-screen overflow-visible z-70 ">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/bg-03.jpg')" }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="MyContainer relative z-10 h-full flex items-center justify-start">
        <div className="w-full  relative -top-20 left-0 z-80    md:w-[45%] flex flex-col items-start text-right text-white">
          <div className="w-full  max-w-[600px]">
            <Image
              src="/discover.jpg"
              alt="bag"
              width={800}
              height={800}
              className="object-contain w-full h-auto mb-6"
            />
          </div>

          <div className="flex flex-col items-center md:items-start ">
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl text-center md:text-start font-medium tracking-wider italic leading-snug ${playfair.className}`}
            >
              Discover the allure of fashion reinvented!
            </h2>
            <p
              className={`text-white font-semibold text-sm leading-relaxed mb-10 mt-3 md:pr-25 text-center md:text-start ${montserrat.className}`}
            >
              Dive into a world of style with our latest collection! Shop now
              and redefine your wardrobe narrative!
            </p>

            <button className=" px-7 py-3 text-xs font-bold border border-white uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
