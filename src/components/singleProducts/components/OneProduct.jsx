"use client";
import React, { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, SearchIcon } from "lucide-react";
import initialProducts from "@/utils/products";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";

const OneProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = initialProducts.find((item) => item.id == id);

  if (!product) {
    return <h2 className="text-center py-20 text-xl">Product not found</h2>;
  }

  const thumbnails = product.image;
  const [activeImg, setActiveImg] = useState(thumbnails[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainImgRef = useRef();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const decreaseQty = () => qty > 1 && setQty(qty - 1);
  const increaseQty = () => setQty(qty + 1);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      mainImgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const openGallery = () => {
    const index = thumbnails.indexOf(activeImg);
    setCurrentIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => setIsGalleryOpen(false);
  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % thumbnails.length);
  const prevImage = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + thumbnails.length) % thumbnails.length
    );

  const handleColorSelect = (color) => {
    setSelectedColor(color.name);
    if (color.imgIndex !== undefined && thumbnails[color.imgIndex]) {
      setActiveImg(thumbnails[color.imgIndex]);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      heading: product.heading,
      price: product.price,
      image: activeImg,
      quantity: qty,
      color: selectedColor,
      size: selectedSize,
    };
    dispatch(addToCart(cartItem));
    alert("Product added to cart!");
  };

  // Related products (same category, excluding current product)
  const relatedProducts = initialProducts.filter(
    (item) => item.category === product.category && item.id !== product.id
  );

  return (
    <div className="w-full py-20">
      <div className="MyContainer">
        <div className="w-full flex flex-col lg:flex-row items-start gap-15">
          {/* Left Section */}
          <div className="left lg:w-2/3">
            <div
              ref={mainImgRef}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
              className="overflow-hidden h-[700px] w-full relative"
            >
              <img
                src={activeImg}
                alt="Product"
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  zoom ? "scale-150" : "scale-100"
                }`}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  imageRendering: "crisp-edges",
                }}
              />
              <button
                onClick={openGallery}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <SearchIcon className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 mt-4 flex-wrap">
              {thumbnails.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className="relative cursor-pointer"
                >
                  <img
                    src={img}
                    alt="thumb"
                    className={`w-36 h-40 object-cover border ${
                      img === activeImg
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    } transition`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="right w-full lg:w-1/2 flex flex-col justify-center gap-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-gray-500 text-md font-sans">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span className="mx-1">/</span>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="hover:text-black transition-colors capitalize"
              >
                {product.style || product.category}
              </Link>
              <span className="mx-1">/</span>
              <span className="text-black capitalize">{product.heading}</span>
            </div>

            <div className="flex flex-col gap-2 border-b border-black/30">
              <h1 className="text-sm capitalize font-sans">{product.style}</h1>
              <h1 className="text-lg font-medium capitalize font-serif">
                {product.heading}
              </h1>
              <h1 className="text-2xl font-bold text-black/50 font-sans">
                ${product.price}{" "}
                <span className="font-medium text-xl">& Free Shipping</span>
              </h1>
              <p className="font-medium text-black/50 font-sans">
                {product.desc}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-black/70 mb-2">
                    Choose Color:
                  </h3>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        onClick={() => handleColorSelect(color)}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform ${
                          selectedColor === color.name
                            ? "scale-110 border-black/50"
                            : "border-gray-300"
                        } ${color.class}`}
                        title={color.name}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes - Only show if product has sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-black/70 mb-2">
                    Choose Size:
                  </h3>
                  <div className="flex items-center gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 transition-all ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add To Cart */}
              <div className="flex items-center gap-4 mt-5 mb-5">
                <div className="flex border border-gray-300 select-none">
                  <button onClick={decreaseQty} className="px-3 py-2">
                    -
                  </button>
                  <div className="px-4 py-2 border-x border-gray-300 min-w-[30px] text-center">
                    {qty}
                  </div>
                  <button onClick={increaseQty} className="px-3 py-2">
                    +
                  </button>
                </div>
                <div
                  onClick={handleAddToCart}
                  className="border border-black px-6 py-2 cursor-pointer hover:bg-black hover:text-white transition"
                >
                  Add To Cart
                </div>
              </div>
            </div>

            <h1 className="text-sm text-black/40 py-5">
              Category: <span className="text-black">{product.style}</span>
            </h1>

            <div className="border-t border-gray-300"></div>

            <div className="border border-gray-300 rounded-md px-10 py-4 text-center w-fit mx-auto my-5">
              <p className="text-gray-800 text-sm mb-2">
                Guaranteed Safe Checkout
              </p>
              <div className="flex justify-center items-center space-x-2">
                <img src="/visa.png" className="h-8" alt="Visa" />
                <img src="/mastercard.png" className="h-8" alt="Mastercard" />
                <img src="/amex.png" className="h-8" alt="Amex" />
                <img src="/discover.png" className="h-8" alt="Discover" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="Mycontainer py-10">
          <div className="border-t border-gray-300 flex flex-nowrap gap-6 overflow-x-auto no-scrollbar relative z-10">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-2 cursor-pointer font-semibold text-sm md:text-base transition-colors ${
                activeTab === "description"
                  ? "border-t-2 border-[#525252] text-[#6e6d6e]"
                  : "text-gray-600 hover:text-gray-500"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`pb-2 cursor-pointer font-semibold text-sm md:text-base transition-colors ${
                activeTab === "additional"
                  ? "border-t-2 border-[#525252] text-[#6e6d6e]"
                  : "text-gray-600 hover:text-gray-500"
              }`}
            >
              Additional information
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 cursor-pointer font-semibold text-sm md:text-base transition-colors ${
                activeTab === "reviews"
                  ? "border-t-2 border-[#525252] text-[#6e6d6e]"
                  : "text-gray-600 hover:text-gray-500"
              }`}
            >
              Reviews (0)
            </button>
          </div>

          {/* Content Area */}
          <div className="pt-6 text-gray-700 leading-relaxed text-sm md:text-base">
            {activeTab === "description" && <p>{product.maindesc}</p>}

            {activeTab === "additional" && (
              <div className="mt-2 p-1">
                <div className="overflow-x-auto border border-gray-200 rounded-md w-full sm:w-3/4 md:w-2/3">
                  <table className="min-w-full border-collapse">
                    <tbody>
                      {product.sizes && product.sizes.length > 0 && (
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 font-semibold w-1/4">
                            Size
                          </th>
                          <td className="p-3 text-gray-700">
                            {product.sizes.join(", ")}
                          </td>
                        </tr>
                      )}
                      {product.colors && product.colors.length > 0 && (
                        <tr>
                          <th className="text-left p-3 font-semibold">Color</th>
                          <td className="p-3 text-gray-700">
                            {product.colors.map((c) => c.name).join(", ")}
                          </td>
                        </tr>
                      )}
                      {(!product.sizes || product.sizes.length === 0) &&
                        (!product.colors || product.colors.length === 0) && (
                          <tr>
                            <td colSpan="2" className="p-3 text-gray-500 text-center">
                              No additional information available
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="mt-2 border border-gray-300 p-6">
                <p className="text-gray-600 mb-5">There are no reviews yet.</p>
                <h3 className="font-semibold text-xl mb-4">
                  Be the first to review{" "}
                  <span className="italic">"{product.heading}"</span>
                </h3>
                <p className="text-md text-gray-500 mb-4">
                  Your email address will not be published. Required fields are
                  marked <span className="text-red-500">*</span>
                </p>

                {/* Rating */}
                <div className="mb-4">
                  <div className="flex items-end gap-3">
                    <label className="font-semibold text-xl block mb-1">
                      Your rating <span className="text-black text-lg">*</span>
                    </label>
                    <div className="flex space-x-1 text-2xl cursor-pointer translate-y-2px">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => rating === 0 && setHover(star)}
                          onMouseLeave={() => rating === 0 && setHover(0)}
                          className={`transition-colors ${
                            (hover || rating) >= star
                              ? "text-orange-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="font-semibold block mb-2">
                    Your review <span className="text-black text-lg">*</span>
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black/15"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="font-semibold block mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black/15"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black/15"
                    />
                  </div>
                </div>

                <div className="flex items-center mb-5">
                  <input id="save-info" type="checkbox" className="mr-2" />
                  <label htmlFor="save-info" className="text-sm text-gray-600">
                    Save my name, email, and website in this browser for the
                    next time I comment.
                  </label>
                </div>

                <button
                  type="button"
                  className="bg-[#e63946] text-white px-8 py-2 rounded-full font-semibold hover:bg-[#d62828] transition"
                >
                  SUBMIT
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="w-full mt-20">
            <h2 className="text-4xl  text-center mb-10 font-serif">
              Related Products
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((related) => (
                <Link
                  key={related.id}
                  href={`/product/${related.id}`}
                  className="flex flex-col items-center text-center group"
                >
                  <img
                    src={related.image[0]}
                    alt={related.heading}
                    className="w-80 h-96 object-cover group-hover:opacity-90 transition"
                  />
                  <h3 className="text-sm text-gray-500 mt-2">
                    {related.style}
                  </h3>
                  <h3 className="text-md font-medium">{related.heading}</h3>
                  <p className="text-black/70 font-semibold">
                    ${related.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="absolute top-6 left-6 text-white">
            {currentIndex + 1} / {thumbnails.length}
          </div>
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white hover:text-gray-300 p-3"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[90vh] px-20">
            <img
              src={thumbnails[currentIndex]}
              alt="Gallery"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 text-white hover:text-gray-300 p-3"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OneProduct;