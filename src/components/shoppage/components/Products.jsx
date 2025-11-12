"use client";

import React, { useContext, useState, useEffect } from "react";
import { Montserrat, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

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
  const { getProducts } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sortOption, setSortOption] = useState("default");
  const [activeImages, setActiveImages] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("Raw products data:", data);

        const transformedProducts = Array.isArray(data)
          ? data.map((p) => {
              // Get first image
              let firstImage = "/placeholder.jpg";

              if (p.images && p.images.length > 0) {
                firstImage =
                  typeof p.images[0] === "string"
                    ? p.images[0]
                    : p.images[0].url || "/placeholder.jpg";
              }

              return {
                id: p._id,
                heading: p.heading || "Untitled Product",
                style: p.style || "",
                basePrice: Number(p.price) || 0, // ✅ Store base price
                popular: Boolean(p.popular),
                latest: Boolean(p.latest),
                sale: Boolean(p.sale),
                image: firstImage,

                // ✅ Store images with their color INDEX
                images: Array.isArray(p.images)
                  ? p.images.map((img) => {
                      if (typeof img === "string") {
                        return { url: img, colourIndex: null };
                      }
                      return {
                        url: img.url || img,
                        colourIndex:
                          img.colour !== "" && img.colour != null
                            ? parseInt(img.colour)
                            : null,
                      };
                    })
                  : [],

                // ✅ Colors array
                colors: Array.isArray(p.colors)
                  ? p.colors.map((color) => ({
                      name: color.name || "Color",
                      hex: color.hex || null,
                    }))
                  : [],

                // ✅ Sizes with prices
                sizes: Array.isArray(p.sizes)
                  ? p.sizes.map((s) => ({
                      label: typeof s === "object" ? s.label : s,
                      price: typeof s === "object" && s.price ? Number(s.price) : Number(p.price)
                    }))
                  : [],
              };
            })
          : [];

        console.log("✅ Transformed products:", transformedProducts);

        // Debug first product's color-image mapping
        if (transformedProducts.length > 0) {
          const sample = transformedProducts[0];
          console.log("📋 Sample Product Mapping:");
          console.log("Colors:", sample.colors);
          console.log("Images with color indices:", sample.images);
        }

        setProducts(transformedProducts);

        // Set initial active images
        const initialImages = {};
        transformedProducts.forEach((p) => {
          initialImages[p.id] = p.image;
        });
        setActiveImages(initialImages);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getProducts]);

  const handleSortChange = (value) => {
    setSortOption(value);
    let sorted = [...products];

    switch (value) {
      case "price-low-high":
        sorted.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
        break;
      case "price-high-low":
        sorted.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
        break;
      case "alphabetical":
        sorted.sort((a, b) => a.heading.localeCompare(b.heading));
        break;
      case "popularity":
        sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case "latest":
        sorted.sort((a, b) => (b.latest ? 1 : 0) - (a.latest ? 1 : 0));
        break;
      default:
        break;
    }
    setProducts(sorted);
  };

  const handleColorClick = (productId, colorIndex) => {
    console.log("🎨 Color clicked - Index:", colorIndex);

    setSelectedColors((prev) => ({
      ...prev,
      [productId]: colorIndex,
    }));

    // ✅ Find image matching this color INDEX
    const product = products.find((p) => p.id === productId);

    if (product && product.images && product.images.length > 0) {
      console.log("📦 Product images:", product.images);

      // Find image where colourIndex matches the selected color index
      const matchingImage = product.images.find(
        (img) => img.colourIndex === colorIndex
      );

      console.log("🔍 Looking for color index:", colorIndex);
      console.log("✅ Found matching image:", matchingImage);

      if (matchingImage && matchingImage.url) {
        console.log("🖼️ Switching to image:", matchingImage.url);
        setActiveImages((prev) => ({
          ...prev,
          [productId]: matchingImage.url,
        }));
      } else {
        console.log("❌ No image found for color index:", colorIndex);
        // Fallback to first image
        setActiveImages((prev) => ({
          ...prev,
          [productId]: product.image,
        }));
      }
    }
  };

  // ✅ Handle size click - store size INDEX
  const handleSizeClick = (productId, sizeIndex) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: sizeIndex,
    }));
  };

  const getColorStyle = (colorName, colorHex) => {
    if (colorHex) {
      return { backgroundColor: colorHex };
    }

    const colorMap = {
      red: "bg-red-600",
      blue: "bg-blue-600",
      green: "bg-green-600",
      yellow: "bg-yellow-400",
      black: "bg-black",
      white: "bg-white",
      gray: "bg-gray-500",
      grey: "bg-gray-500",
      pink: "bg-pink-500",
      purple: "bg-purple-600",
      orange: "bg-orange-500",
      brown: "bg-amber-700",
      beige: "bg-amber-200",
      navy: "bg-blue-900",
      maroon: "bg-red-900",
    };

    return colorMap[colorName?.toLowerCase()] || "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="w-full py-12 md:py-20 bg-white">
        <div className="MyContainer">
          <div className="text-center py-16 text-gray-500">
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 md:py-20 bg-white">
      <div className="MyContainer">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <p
            className={`text-xs sm:text-sm italic font-medium text-gray-500 ${montserrat.className}`}
          >
            Showing{" "}
            <span className="text-black font-semibold">{products.length}</span>{" "}
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
          {products.length > 0 ? (
            products.map((product) => {
              const activeImg = activeImages[product.id] || product.image;
              const availableSizes = product.sizes || [];
              const productColors = product.colors || [];

              // ✅ Calculate displayed price based on selected size
              const selectedSizeIndex = selectedSizes[product.id];
              const displayedPrice = selectedSizeIndex != null && availableSizes[selectedSizeIndex]
                ? availableSizes[selectedSizeIndex].price
                : product.basePrice;

              return (
                <div key={product.id} className="flex flex-col items-center">
                  {/* Product Image */}
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full block mb-3 relative group"
                  >
                    <Image
                      src={activeImg}
                      alt={product.heading}
                      width={300}
                      height={400}
                      className="object-cover w-full h-[280px] sm:h-[320px] lg:h-[350px] transition-all duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </Link>

                  {/* Product Info */}
                  {product.style && (
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      {product.style}
                    </p>
                  )}
                  <h3
                    className={`text-sm sm:text-base font-medium text-center mb-2 ${playfair.className}`}
                  >
                    {product.heading}
                  </h3>
                  
                  {/* ✅ Dynamic Price Display */}
                  <p
                    className={`text-sm sm:text-base text-gray-600 font-semibold mb-3 ${montserrat.className}`}
                  >
                    ${displayedPrice.toFixed(2)}
                  </p>

                  {/* ✅ Sizes with INDEX-based selection */}
                  {availableSizes.length > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-3 flex-wrap justify-center">
                      {availableSizes.map((size, idx) => {
                        const isActive = selectedSizes[product.id] === idx;
                        return (
                          <button
                            key={`${size.label}-${idx}`}
                            onClick={() => handleSizeClick(product.id, idx)}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded border transition-all ${
                              isActive
                                ? "border-black bg-black text-white font-semibold"
                                : "border-gray-400 text-gray-700 hover:border-black"
                            }`}
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ✅ Colors - Pass INDEX to handler */}
                  {productColors.length > 0 && (
                    <div className="flex items-center gap-2.5 mt-2 flex-wrap justify-center">
                      {productColors.map((color, colorIndex) => {
                        const isActive =
                          selectedColors[product.id] === colorIndex;
                        const colorStyle = getColorStyle(color.name, color.hex);
                        const isStyleObject = typeof colorStyle === "object";

                        return (
                          <button
                            key={`${color.name}-${colorIndex}`}
                            onClick={() =>
                              handleColorClick(product.id, colorIndex)
                            }
                            title={color.name}
                            className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                              !isStyleObject ? colorStyle : ""
                            } ${
                              isActive
                                ? "ring-2 ring-offset-2 ring-black scale-110"
                                : "hover:ring-1 hover:ring-gray-400"
                            } ${
                              color.name?.toLowerCase() === "white"
                                ? "border-gray-300"
                                : ""
                            }`}
                            style={{
                              ...(isStyleObject ? colorStyle : {}),
                              borderColor: isActive
                                ? "#000"
                                : color.name?.toLowerCase() === "white"
                                ? "#d1d5db"
                                : "#9ca3af",
                            }}
                            aria-label={`Select ${color.name}`}
                          />
                        );
                      })}
                    </div>
                  )}
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