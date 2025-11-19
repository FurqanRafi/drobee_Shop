"use client";

import React, { useContext, useState, useEffect } from "react";
import { Montserrat, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [sortOption, setSortOption] = useState("latest");
  const [activeImages, setActiveImages] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 8;

  // Fetch products with pagination and sorting
  const fetchProducts = async (page = 1, sort = "latest") => {
    try {
      setLoading(true);
      const data = await getProducts(page, itemsPerPage, sort);

      setTotalProducts(data.totalProducts || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);

      const transformedProducts = Array.isArray(data.products)
        ? data.products.map((p) => {
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
              basePrice: Number(p.price) || 0,
              popular: Boolean(p.popular),
              latest: Boolean(p.latest),
              sale: Boolean(p.sale),
              image: firstImage,

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

              colors: Array.isArray(p.colors)
                ? p.colors.map((color) => ({
                    name: color.name || "Color",
                    hex: color.hex || null,
                  }))
                : [],

              sizes: Array.isArray(p.sizes)
                ? p.sizes.map((s) => ({
                    label: typeof s === "object" ? s.label : s,
                    price:
                      typeof s === "object" && s.price
                        ? Number(s.price)
                        : Number(p.price),
                  }))
                : [],
            };
          })
        : [];

      setProducts(transformedProducts);

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

  useEffect(() => {
    fetchProducts(currentPage, sortOption);
  }, [currentPage, sortOption]);

  // Handle sorting
  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleColorClick = (productId, colorIndex) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: colorIndex,
    }));

    const product = products.find((p) => p.id === productId);

    if (product && product.images && product.images.length > 0) {
      const matchingImage = product.images.find(
        (img) => img.colourIndex === colorIndex
      );

      if (matchingImage && matchingImage.url) {
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

  // Calculate items showing
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className="w-full py-12 md:py-20 bg-white">
      <div className="MyContainer">
        {/* Header with sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <p
            className={`text-xs sm:text-sm italic font-medium text-gray-500 ${montserrat.className}`}
          >
            Showing{" "}
            <span className="text-black font-semibold">
              {startItem}-{endItem}
            </span>{" "}
            of{" "}
            <span className="text-black font-semibold">
              {totalProducts} Products
            </span>
          </p>

          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className={`w-full sm:w-auto border border-gray-300 bg-white shadow-sm px-4 py-2.5 text-xs sm:text-sm rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-black ${montserrat.className}`}
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {products.length > 0 ? (
            products.map((product) => {
              const activeImg = activeImages[product.id] || product.image;
              const availableSizes = product.sizes || [];
              const productColors = product.colors || [];

              const selectedSizeIndex = selectedSizes[product.id];
              const displayedPrice =
                selectedSizeIndex != null && availableSizes[selectedSizeIndex]
                  ? availableSizes[selectedSizeIndex].price
                  : product.basePrice;

              return (
                <div key={product.id} className="flex flex-col items-center">
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

                  <p
                    className={`text-sm sm:text-base text-gray-600 font-semibold mb-3 ${montserrat.className}`}
                  >
                    ${displayedPrice.toFixed(2)}
                  </p>

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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white/90 backdrop-blur-xl border border-gray-300 p-3 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={`page-${index}`}>
                  {page === "..." ? (
                    <span className="px-4 py-3 text-[10px] tracking-[0.2em] text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      disabled={currentPage === page}
                      className={`px-4 py-3 text-xs sm:text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-black text-white cursor-default"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      }`}
                      title={`Go to page ${page}`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white/90 backdrop-blur-xl border border-gray-300 p-3 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black "
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Info */}
            <p className={`text-xs text-gray-500 ${montserrat.className}`}>
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
