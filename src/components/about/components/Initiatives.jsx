import React from "react";
import { Montserrat, Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const Initiatives = () => {
  return (
    <div className="relative w-full py-20 flex flex-col items-center gap-15">
      <div className="MyContainer flex flex-col md:flex-row items-start justify-between ">
        <div className="w-full  ">
          <h3 className="text-xs uppercase tracking-[1px] md:tracking-[4px] text-black font-medium">
            Sustainability Initiatives
          </h3>
          <h1
            className={`lg:text-[52px] md:text-[45px] text-[35px] ${playfair.className} font-medium italic leading-tight md:leading-normal`}
          >
            Conscious Fashion for a Better Tomorrow
          </h1>
        </div>
      </div>
      <div className="MyContainer w-full flex flex-col md:flex-row items-start justify-between gap-7 md:gap-3 md:mb-10 ">
        <div className="w-full ">
          <h1 className={`text-lg font-semibold italic ${playfair.className} lg:pr-20`}>
            we recognize the responsibility we hold in shaping a more
            sustainable future for fashion. Our commitment to eco-friendly
            practices and sustainable fashion choices is at the core of what we
            do.
          </h1>
        </div>
        <div className="w-full h-64  rounded-lg flex flex-col gap-10 mb-10 md:mb-35 lg:mb-15 xl:mb-0 ">
          <p className={`md:text-sm text-xs font-medium text-black/50 ${montserrat.className}`}>
            From the careful selection of ethically sourced materials to the
            implementation of environmentally conscious manufacturing processes,
            every step we take is a stride toward a greener and more sustainable
            industry.
          </p>
          <p className={`md:text-sm text-xs font-medium text-black/50 ${montserrat.className}`}>
            We prioritize transparency in our supply chain, partnering with
            suppliers who share our values of fair labor practices and
            environmental stewardship. Our sustainable fashion choices extend to
            packaging as well – we use recyclable materials to minimize our
            environmental footprint. Join us on this journey towards conscious
            fashion, where style meets responsibility, and every purchase
            contributes to a brighter, eco-friendly tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Initiatives;
