import Image from "next/image";
import React from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const Main = () => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div>
        <Image
          src="/bg-09.jpg"
          alt="home"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center">
        <h1
          className={`md:text-5xl lg:text-6xl text-5xl font-bold italic tracking-wider text-white ${playfair.className}`}
        >
          Contact Us
        </h1>
      </div>
    </div>
  );
};

export default Main;
