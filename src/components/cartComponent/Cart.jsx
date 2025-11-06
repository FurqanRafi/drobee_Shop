"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity, addToCart } from "@/redux/cartSlice";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const handleQuantityChange = (item, type) => {
    if (type === "increment") {
      dispatch(addToCart({ ...item, quantity: 1 }));
    } else if (type === "decrement") {
      if (item.quantity > 1) {
        dispatch(addToCart({ ...item, quantity: -1 }));
      }
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({ 
      id: item.id, 
      size: item.size,
      color: item.color 
    }));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6 sm:mb-8">
          Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/shop">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white border border-black/10 rounded-lg shadow-sm mb-6 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-black/2 border-b border-gray-200 text-gray-600 text-sm font-medium uppercase tracking-wide">
                <div className="col-span-6 ml-10">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Product Rows */}
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                  className="grid grid-cols-12 gap-4 px-6 py-6 items-center border-b border-gray-100"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <img
                      src={item.image}
                      alt={item.heading}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {item.heading}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.color && <span>Color: <span className="font-medium">{item.color}</span></span>}
                        {item.color && item.size && " | "}
                        {item.size && <span>Size: <span className="font-medium">{item.size}</span></span>}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-gray-700 font-medium">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item, "decrement")}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-14 text-center border-x-2 border-gray-300 py-2 font-medium"
                      />
                      <button
                        onClick={() => handleQuantityChange(item, "increment")}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-semibold text-gray-900 text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Coupon Section */}
              <div className="px-6 py-4 flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 min-w-[200px] max-w-xs px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                />
                <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                  APPLY COUPON
                </button>
                <button className="ml-auto px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                  UPDATE CART
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                  className="p-4 sm:p-6 border-b border-gray-100"
                >
                  {/* Product Card */}
                  <div className="relative">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors z-10"
                    >
                      <X size={24} />
                    </button>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <img
                        src={item.image}
                        alt={item.heading}
                        className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg shadow-sm"
                      />

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {item.heading}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.color && <span>Color: <span className="font-medium">{item.color}</span></span>}
                            {item.color && item.size && " | "}
                            {item.size && <span>Size: <span className="font-medium">{item.size}</span></span>}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Quantity:
                          </span>
                          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, "decrement")
                              }
                              className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-12 text-center border-x-2 border-gray-300 py-1.5 font-medium text-sm"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(item, "increment")
                              }
                              className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-600">
                            Subtotal:
                          </span>
                          <span className="font-bold text-gray-900 text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Section - Mobile */}
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                  />
                  <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-all whitespace-nowrap">
                    APPLY COUPON
                  </button>
                </div>
                <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                  UPDATE CART
                </button>
              </div>
            </div>

            {/* Cart Totals */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-serif mb-6 sm:mb-8">
                  Cart Totals
                </h2>

                <div className="space-y-1 mb-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-gray-600 font-medium">
                        Shipping
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                      Enter your address to view shipping options.
                    </p>
                    <button className="text-sm text-gray-900 font-medium underline hover:no-underline transition-all">
                      Calculate shipping
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-4 text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Link href="/checkout">
                  <button className="w-full py-3.5 sm:py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold text-sm sm:text-base rounded-lg hover:bg-gray-900 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    PROCEED TO CHECKOUT
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;