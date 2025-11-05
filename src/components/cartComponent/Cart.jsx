import React, { useState } from "react";
import { X } from "lucide-react";

const Cart = () => {
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  const price = 145.5;
  const subtotal = price * quantity;

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif mb-8">Cart</h1>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b text-gray-500 text-sm font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Product Row */}
          <div className="grid grid-cols-12 gap-4 p-4 items-center">
            <div className="col-span-6 flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              <img
                src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=150&h=150&fit=crop"
                alt="Bohemian Rhapsody Attire"
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  Bohemian Rhapsody Attire - Black
                </h3>
                <p className="text-sm text-gray-500">Size: M</p>
              </div>
            </div>

            <div className="col-span-2 text-center text-gray-600">
              ${price.toFixed(2)}
            </div>

            <div className="col-span-2 flex justify-center">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center border-x border-gray-300 py-2"
                />
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="col-span-2 text-right font-medium text-gray-900">
              ${subtotal.toFixed(2)}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="p-4 border-t flex items-center gap-4">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
            <button className="px-6 py-2 border border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition">
              APPLY COUPON
            </button>
            <button className="ml-auto px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
              UPDATE CART
            </button>
          </div>
        </div>

        {/* Cart Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-serif mb-8">Cart Totals</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="py-3 border-b">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Enter your address to view shipping options.
                </p>
                <button className="text-sm text-gray-900 underline hover:no-underline">
                  Calculate shipping
                </button>
              </div>

              <div className="flex justify-between py-3 text-lg font-medium">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-white border-2 border-gray-900 text-gray-900 font-medium rounded hover:bg-gray-900 hover:text-white transition">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
