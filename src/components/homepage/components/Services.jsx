import { ClockArrowUp, LockIcon, MapPin, Truck } from "lucide-react";
import React from "react";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const Services = () => {
  const services = [
    {
      icon: <LockIcon className="w-8 h-8" />,
      title: "Secure Payment",
      desc: "Shop with confidence knowing that your transactions are safeguarded.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      desc: "Shopping with no extra charges – savor the liberty of complimentary shipping on every order.",
    },
    {
      icon: <ClockArrowUp className="w-8 h-8" />,
      title: "Fast Delivery",
      desc: "Get your favorite pieces faster with our reliable express delivery service.",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Order Tracking",
      desc: "Stay in the loop with our Order Tracking feature – from checkout to your doorstep.",
    },
  ];

  return (
    <div className="relative w-full bg-white">
      <div className="MyContainer">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-25 text-center place-items-center">
          {services.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-start text-center max-w-[280px] mx-auto h-full"
            >
              <div className="text-black mb-4 flex items-center justify-center h-[40px]">
                {item.icon}
              </div>

              <h1
                className={`${playfair.className} text-2xl md:text-3xl lg:text-2xl font-bold tracking-wider italic leading-snug mb-3`}
              >
                {item.title}
              </h1>

              <p
                className={`text-sm md:text-base text-black/50 leading-relaxed ${montserrat.className} min-h-[70px]`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
