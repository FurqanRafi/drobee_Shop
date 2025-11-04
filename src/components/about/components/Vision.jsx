import React from "react";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const Vision = () => {
  return (
    <div className="relative w-full  bg-white py-20">
      <div className="MyContainer sm:px-5 flex flex-col md:flex-col lg:flex-row items-start justify-between border-b border-black/40 gap-10 ">
        <div className="w-full lg:mb-25 ">
          <h1
            className={`lg:text-[52px] md:text-[50px] text-[35px]  lg:pr-13 ${playfair.className} font-[500] italic leading-tight md:leading-normal`}
          >
            From Vision to Vogue: The Birth of FemmeWardrobe
          </h1>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-3 mb-10 ">
          <h3
            className={`md:mb-5 mb-2 text-xs uppercase tracking-[4px] text-black font-medium ${montserrat.className}`}
          >
            Our Story
          </h3>
          <h1
            className={`lg:text-xl md:text-lg text-base font-medium tracking-wider italic leading-snug ${playfair.className}`}
          >
            Our journey began with a simple yet powerful vision - to redefine
            the way women experience fashion.
          </h1>
          <p
            className={`text-sm md:text-base lg:text-sm text-black/70 ${montserrat.className}`}
          >
            Fueled by a passion for style and a commitment to individuality, we
            embarked on a mission to curate a collection that speaks to the
            diverse tastes and personalities of our cherished customers. From
            our humble beginnings to the vibrant online space we inhabit today,
            each milestone represents a chapter in our story. Join us on this
            fashion-forward adventure, where every piece tells a tale of
            inspiration, dedication, and sartorial elegance.
          </p>
        </div>
      </div>
      <div className="MyContainer sm:px-5 flex items-center py-10 ">
        <div className="w-full flex flex-col items-start justify-center gap-6 mt-20">
          <h3
            className={`text-xs uppercase tracking-[1px] md:tracking-[4px] text-black font-medium ${montserrat.className}`}
          >
            Quality Assurance
          </h3>
          <h1
            className={`lg:text-[45px] md:text-[40px] text-[20px] font-semibold capitalize italic  ${playfair.className}`}
          >
            We understand that fashion is an expression of identity, and we take
            pride in delivering products that embody the highest standards of
            quality.
          </h1>
          <p
            className={`text-sm md:text-base lg:text-sm font-semibold text-black/40 ${montserrat.className}`}
          >
            Our journey to excellence begins with meticulous sourcing, where we
            carefully select materials that meet our stringent criteria for
            durability, comfort, and style. Every garment is crafted with
            precision in our state-of-the-art manufacturing facilities, ensuring
            attention to detail at every stitch. Our commitment to quality
            doesn't end there – rigorous quality control processes guarantee
            that each piece meets our exacting standards before it finds its way
            to your wardrobe. Trust in FemmeWardrobe for fashion that not only
            captures attention but withstands the test of time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vision;
