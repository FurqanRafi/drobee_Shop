import React from "react";
import Image from "next/image";
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
const Experience = () => {
  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden py-25">
      <div className="absolute inset-0">
        <div
          className="w-full h-full  bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/bg-11.jpg')" }}
        ></div>
      </div>

      <div
        className="absolute inset-0 
    bg-linear-to-r from-black/90 via-black/80 to-black/10 
    md:bg-linear-to-r md:from-black/80 md:via-black/80 md:to-black/10 
    lg:bg-black/50 lg:bg-none"
      ></div>

      <div className="MyContainer relative z-10 h-full flex items-center ">
        <div className="w-full md:w-2/1 lg:w-1/2 flex flex-col items-start gap-2 text-left text-white">
          <h3
            className={`text-xs md:text-sm uppercase tracking-widest text-white font-bold  ${montserrat.className}`}
          >
            Customer-Centric Approach
          </h3>
          <h1
            className={`text-3xl md:text-5xl text-start font-bold tracking-wider italic leading-snug ${playfair.className}`}
          >
            Beyond Fashion: Nurturing a Customer-Centric Experience
          </h1>

          <p
            className={`text-xs md:text-medium md:text-left font-light text-white text-[18px] my-2 ${montserrat.className}`}
          >
            We believe that the essence of our success lies in the satisfaction
            of our customers. Our commitment to providing an exceptional
            shopping experience goes beyond trends and styles – it's about
            understanding and meeting the unique needs of every individual who
            chooses FemmeWardrobe. From personalized recommendations to
            hassle-free returns, we've crafted every aspect of our service with
            you in mind. Our dedicated customer support team is here to ensure
            your journey with us is seamless, enjoyable, and exceeds your
            expectations. Join our community of empowered fashion enthusiasts,
            where your satisfaction is not just a priority; it's our passion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Experience;
