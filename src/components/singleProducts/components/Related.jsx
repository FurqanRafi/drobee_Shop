"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Montserrat, Playfair_Display } from "next/font/google";
import initialProducts from "@/utils/products";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const Related = ({ category, currentId }) => {
  const filtered = initialProducts.filter(
    (item) => item.category === category && item.id !== currentId
  );

  if (filtered.length === 0) return null;

  return (
    <div className="w-full pb-15 mt-20">
      <div className="MyContainer flex flex-col items-center justify-center">
        <h2 className={`text-5xl italic  text-center ${playfair.className}`}>
          Related Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 mt-10 w-full">
          {filtered.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-col gap-3 items-center group"
            >
              <Image
                src={product.image[0]}
                alt={product.heading}
                width={230}
                height={300}
                className="object-contain w-full h-full group-hover:opacity-90 transition"
              />

              <h3 className={`text-sm text-black/40 ${montserrat.className}`}>
                {product.style}
              </h3>
              <h3
                className={`text-xs md:text-sm font-medium ${playfair.className}`}
              >
                {product.heading}
              </h3>
              <p
                className={`text-md text-black/60 font-semibold ${montserrat.className}`}
              >
                ${product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Related;
