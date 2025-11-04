import React from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const Explore = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden py-25">

      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/bg-02.jpg')" }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="MyContainer relative z-10 h-full flex items-center justify-end">
        <div className="w-full md:w-[45%] flex flex-col items-end text-right text-white">
          <div className="w-full max-w-[450px]">
            <Image
              src="/explore.jpg"
              alt="bag"
              width={800}
              height={800}
              className="object-contain w-full h-auto mb-6"
            />
          </div>

          <div className="flex flex-col items-center ">
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl text-center font-medium tracking-wider italic leading-snug ${playfair.className}`}
            >
              Explore our exquisite Bag Collection now!
            </h2>

            <button className="mt-8 px-10 py-4 border border-white uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              View Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
