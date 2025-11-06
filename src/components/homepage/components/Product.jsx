"use client";

import React, { useState } from "react";
import { Montserrat, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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

const Product = () => {
  const nonPopularProducts = initialProducts.filter((p) => !p.popular);

  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [activeImages, setActiveImages] = useState({});

  const handleColorClick = (productId, color) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color.name }));
    setActiveImages((prev) => ({
      ...prev,
      [productId]:
        color.img ||
        (color.imgIndex !== undefined
          ? initialProducts.find((p) => p.id === productId).image[color.imgIndex]
          : initialProducts.find((p) => p.id === productId).image[0]),
    }));
  };

  const handleSizeClick = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="relative py-20 bg-white">
      <div className="MyContainer flex flex-col items-center justify-center">
        <h2 className={`text-5xl italic font-medium ${playfair.className}`}>
          Newest Arrivals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 w-full">
          {nonPopularProducts.map((product) => {
            const activeImg = activeImages[product.id] || product.image[0];

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex flex-col items-center justify-start cursor-pointer"
              >
                {/* Image area */}
                <div className="w-full h-[420px] flex items-center justify-center overflow-hidden">
                  <Image
                    src={activeImg}
                    alt={product.heading}
                    width={400}
                    height={420}
                    className="object-cover w-full h-full shadow-md"
                  />
                </div>

                {/* Product Info */}
                <h3 className="text-sm text-black/40 mt-3">{product.style}</h3>
                <h3 className={`text-base font-medium ${playfair.className}`}>
                  {product.heading}
                </h3>
                <p className={`text-md text-black/60 font-semibold ${montserrat.className}`}>
                  ${product.price}
                </p>

                {/* Sizes — only show if product has sizes */}
                {product.sizes && product.sizes.length > 0 ? (
                  <div className="flex items-center gap-2 mt-2">
                    {product.sizes.map((size) => {
                      const isActive = selectedSizes[product.id] === size;
                      return (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSizeClick(product.id, size);
                          }}
                          className={`px-3 py-1.5 text-sm rounded-sm border transition-all duration-200 ${
                            isActive
                              ? "border-black text-black font-semibold"
                              : "border-gray-400 text-gray-800 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-8"></div> // empty space if no sizes
                )}

                {/* Colors — only show if product has colors */}
                {product.colors && product.colors.length > 0 ? (
                  <div className="flex items-center gap-4 mt-3">
                    {product.colors.map((color) => {
                      const isActive = selectedColors[product.id] === color.name;
                      return (
                        <div
                          key={color.name}
                          onClick={(e) => {
                            e.preventDefault();
                            handleColorClick(product.id, color);
                          }}
                          className={`w-5 h-5 rounded-full border border-black/50 cursor-pointer transition-all duration-200 ${color.class} ${
                            isActive
                              ? "ring-2 ring-offset-2 ring-black/70 scale-110"
                              : "hover:ring-1 hover:ring-gray-400"
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-8"></div> // empty space if no colors
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Product;
