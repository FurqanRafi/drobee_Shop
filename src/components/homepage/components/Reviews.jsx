import React from "react";
import Image from "next/image";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Star } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const Reviews = () => {
  return (
    <div className="relative w-full min-h-[80vh]  overflow-hidden py-25">
      <div className="absolute inset-0 ">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/bg-04.jpg')" }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="MyContainer w-full  relative z-10 h-full flex items-center justify-center">
        <div className="absolute w-full md:w-[80%] lg:w-[65%] top-60 left-1/2 -translate-x-1/2 -translate-y-1/2    ">
          <div className=" flex flex-col items-center gap-4 text-yellow-500 text-fill ">
            <div className="flex items-center gap-3 text-yellow-500 text-fill md:text-base ">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
            </div>
            <div className="w-full">
              <p
                className={`text-white text-md md:text-2xl lg:text-3xl text-center ${playfair.className}`}
              >
                “Femmie Atelier is my fashion sanctuary! The curated collection
                effortlessly blends chic trends with timeless elegance, making
                every purchase a delightful discovery. The quality of their
                pieces is unmatched, and I appreciate the brand's commitment to
                sustainable fashion. What truly sets Femmie Atelier apart is
                their customer-centric approach.”
              </p>
            </div>
            <div className="w-full">
              <p
                className={`${montserrat.className} uppercase text-white text-xs md:text-sm  text-center tracking-widest font-semibold`}
              >
                Sarah M., Devoted FemmeWardrobe Fan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
