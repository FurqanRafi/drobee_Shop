"use client";

import React, { useState } from "react";
import { Montserrat, Playfair_Display } from "next/font/google";
import Image from "next/image";
import initialProducts from "@/utils/products";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const Products = () => {
  const initial = Array.isArray(initialProducts) ? initialProducts : [];

  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sortOption, setSortOption] = useState("default");
  const [products, setProducts] = useState(initial);
  const [activeImages, setActiveImages] = useState({});

  const handleSortChange = (value) => {
    setSortOption(value);
    let sorted = [...initial];

    switch (value) {
      case "price-low-high":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high-low":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "alphabetical":
        sorted.sort((a, b) => a.heading.localeCompare(b.heading));
        break;
      case "popularity":
        sorted.sort(() => Math.random() - 0.5);
        break;
      case "latest":
        sorted.reverse();
        break;
      default:
        sorted = [...initial];
    }

    setProducts(sorted);
  };

  const handleColorClick = (productId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color.name,
    }));

    const product = initial.find((p) => p.id === productId);
    const newImg =
      color.img ||
      (color.imgIndex !== undefined
        ? product.image[color.imgIndex]
        : product.image[0]);

    setActiveImages((prev) => ({
      ...prev,
      [productId]: newImg,
    }));
  };

  const handleSizeClick = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const SIZES = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="w-full py-12 md:py-20 bg-white">
      <div className="MyContainer">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <p
            className={`text-xs sm:text-sm italic font-medium text-gray-500 ${montserrat.className}`}
          >
            Showing{" "}
            <span className="text-black font-semibold">
              {products?.length ?? 0}
            </span>{" "}
            Products
          </p>

          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className={`w-full sm:w-auto border border-gray-300 bg-white shadow-sm px-4 py-2.5 text-xs sm:text-sm rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black ${montserrat.className}`}
          >
            <option value="default">Default Sorting</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="latest">Sort by Latest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {products?.length > 0 ? (
            products.map((product) => {
              const productColors = product.colors?.length
                ? product.colors
                : [];
              const activeImg = activeImages[product.id] || product.image[0];

              return (
                <div key={product.id} className="flex flex-col items-center">
                  {/* Product Image */}
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full block mb-3"
                  >
                    <Image
                      src={activeImg}
                      alt={product.heading}
                      width={300}
                      height={400}
                      className="object-cover w-full h-[280px] sm:h-[320px] lg:h-[350px] transition-all duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">
                    {product.style}
                  </p>
                  <h3
                    className={`text-sm sm:text-base font-medium text-center mb-2 ${playfair.className}`}
                  >
                    {product.heading}
                  </h3>
                  <p
                    className={`text-sm sm:text-base text-gray-600 font-semibold mb-3 ${montserrat.className}`}
                  >
                    ${product.price}
                  </p>

                  {/* Sizes */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                    {SIZES.map((size) => {
                      const isActive = selectedSizes[product.id] === size;
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeClick(product.id, size)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded border transition-all ${
                            isActive
                              ? "border-black text-black font-semibold"
                              : "border-gray-400 text-gray-700 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-3 min-h-[24px]">
                    {productColors.length > 0 ? (
                      productColors.map((color) => {
                        const isActive =
                          selectedColors[product.id] === color.name;
                        return (
                          <button
                            key={color.name}
                            onClick={() => handleColorClick(product.id, color)}
                            title={color.name}
                            className={`w-5 h-5 rounded-full border border-gray-400 cursor-pointer transition-all ${
                              color.class
                            } ${
                              isActive
                                ? "ring-2 ring-offset-2 ring-black scale-110"
                                : "hover:ring-1 hover:ring-gray-300"
                            }`}
                            aria-label={`Select ${color.name}`}
                          />
                        );
                      })
                    ) : (
                      <div className="w-5 h-5 opacity-0" aria-hidden="true" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;