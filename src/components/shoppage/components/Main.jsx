import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const main = () => {
  return (
    <div
      className="relative w-full h-[67vh] bg-cover bg-center "
      style={{ backgroundImage: "url('/bg-10.jpg')" }}
    >
      <div className=" absolute inset-0 bg-black/50">
        <div className="MyContainer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
          <div>
            <h1 className={`text-white text-8xl ${playfair.className}`}>
              Shop
            </h1>
          </div>
          <div className="flex items-center gap-1 text-white ">
            <Link  href="/">
              Home
            </Link>
            <ChevronsRight />
            <h1> Shop</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default main;
