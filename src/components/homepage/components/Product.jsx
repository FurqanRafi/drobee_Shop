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

const Product = () => {
  const { getProducts } = useContext(AuthContext);

  const [newestProducts, setNewestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [activeImages, setActiveImages] = useState({});

  // ✅ Fetch newest arrivals (non-popular products) on mount
  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("Newest arrivals raw data:", data);

        // Ensure we get an array
        const productsArray = Array.isArray(data) ? data : [];

        // ✅ Filter non-popular products and transform according to schema
        // ✅ Filter only latest products and show maximum 4
        const newest = productsArray
          .filter((p) => p.latest === true) // Only products marked as latest
          .slice(0, 4) // Show only 4
          .map((p) => {
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
              popular: p.popular || false,
              latest: p.latest || false,
              sale: p.sale || false,
              image: firstImage,

              // ✅ Store images with color INDEX
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

              // ✅ Colors from schema's colors array
              colors: Array.isArray(p.colors)
                ? p.colors.map((color) => ({
                    name: color.name || "Color",
                    hex: color.hex || null,
                  }))
                : [],

              // ✅ Store sizes with their prices
              sizes: Array.isArray(p.sizes)
                ? p.sizes.map((s) => ({
                    label: typeof s === "object" ? s.label : s,
                    price:
                      typeof s === "object" ? Number(s.price) : Number(p.price),
                  }))
                : [],
            };
          });

        console.log("Transformed newest arrivals:", newest);
        setNewestProducts(newest);

        // Set initial active images
        const initialImages = {};
        newest.forEach((p) => {
          initialImages[p.id] = p.image;
        });
        setActiveImages(initialImages);
      } catch (error) {
        console.error("Error loading newest products:", error);
        setNewestProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewestProducts();
  }, [getProducts]);

  // ✅ Handle color click with INDEX
  const handleColorClick = (e, productId, colorIndex) => {
    e.preventDefault();
    console.log("🎨 Color clicked - Index:", colorIndex);

    setSelectedColors((prev) => ({ ...prev, [productId]: colorIndex }));

    const product = newestProducts.find((p) => p.id === productId);

    if (product && product.images && product.images.length > 0) {
      const matchingImage = product.images.find(
        (img) => img.colourIndex === colorIndex
      );

      if (matchingImage && matchingImage.url) {
        console.log("🖼️ Switching to image:", matchingImage.url);
        setActiveImages((prev) => ({
          ...prev,
          [productId]: matchingImage.url,
        }));
      } else {
        setActiveImages((prev) => ({
          ...prev,
          [productId]: product.image,
        }));
      }
    }
  };

  // ✅ Handle size click - store size INDEX
  const handleSizeClick = (e, productId, sizeIndex) => {
    e.preventDefault();
    setSelectedSizes((prev) => ({ ...prev, [productId]: sizeIndex }));
  };

  // ✅ Get color style (Tailwind class or hex)
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
      <div className="relative py-20 bg-white">
        <div className="MyContainer flex flex-col items-center justify-center">
          <h2 className={`text-5xl italic font-medium ${playfair.className}`}>
            Newest Arrivals
          </h2>
          <div className="text-center py-16 text-gray-500 mt-10">
            Loading newest arrivals...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-20 bg-white">
      <div className="MyContainer flex flex-col items-center justify-center">
        <h2 className={`text-5xl italic font-medium ${playfair.className}`}>
          Newest Arrivals
        </h2>

        {newestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 w-full">
            {newestProducts.map((product) => {
              const activeImg = activeImages[product.id] || product.image;

              // ✅ Calculate displayed price based on selected size
              const selectedSizeIndex = selectedSizes[product.id];
              const displayedPrice =
                selectedSizeIndex != null && product.sizes[selectedSizeIndex]
                  ? product.sizes[selectedSizeIndex].price
                  : product.basePrice;

              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center justify-start"
                >
                  {/* ✅ Only Image is Clickable */}
                  <Link href={`/product/${product.id}`}>
                    <div className="w-full h-[360px] flex items-center justify-center overflow-hidden group relative">
                      <Image
                        src={activeImg}
                        alt={product.heading}
                        width={400}
                        height={420}
                        className="object-cover w-full h-full shadow-md transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  {product.style && (
                    <h3 className="text-sm text-black/40 mt-3">
                      {product.style}
                    </h3>
                  )}
                  <h3 className={`text-base font-medium ${playfair.className}`}>
                    {product.heading}
                  </h3>

                  {/* ✅ Dynamic Price Display */}
                  <p
                    className={`text-md text-black/60 font-semibold ${montserrat.className}`}
                  >
                    ${displayedPrice.toFixed(2)}
                  </p>

                  {/* ✅ Sizes with INDEX-based selection */}
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                      {product.sizes.map((size, idx) => {
                        const isActive = selectedSizes[product.id] === idx;
                        return (
                          <button
                            key={`${size.label}-${idx}`}
                            onClick={(e) => handleSizeClick(e, product.id, idx)}
                            className={`px-3 py-1.5 text-sm rounded-sm border transition-all duration-200 ${
                              isActive
                                ? "border-black bg-black text-white font-semibold"
                                : "border-gray-400 text-gray-800 hover:border-black"
                            }`}
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-9"></div>
                  )}

                  {/* ✅ Colors with INDEX-based selection */}
                  {product.colors && product.colors.length > 0 ? (
                    <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
                      {product.colors.map((color, colorIndex) => {
                        const isActive =
                          selectedColors[product.id] === colorIndex;
                        const colorStyle = getColorStyle(color.name, color.hex);
                        const isStyleObject = typeof colorStyle === "object";

                        return (
                          <div
                            key={`${color.name}-${colorIndex}`}
                            onClick={(e) =>
                              handleColorClick(e, product.id, colorIndex)
                            }
                            className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 ${
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
                            title={color.name}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-8"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 mt-10">
            No new arrivals available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
