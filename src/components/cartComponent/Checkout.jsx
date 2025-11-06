"use client";
import React, { useState } from "react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "United States (US)",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "California",
    zipCode: "",
    phone: "",
    notes: "",
    shipToDifferent: false,
    couponCode: "",
  });

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal; // You can add shipping or tax here

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.streetAddress || !formData.city || !formData.zipCode || !formData.phone) {
      alert("Please fill in all required fields!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Here you would typically send the order to your backend
    console.log("Order Details:", {
      customer: formData,
      items: cartItems,
      total: total,
    });

    // Clear cart after successful order
    dispatch(clearCart());
    alert("Order placed successfully!");
    router.push("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Please add items to your cart before checkout</p>
          <Link href="/shop">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column - Billing Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Contact Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif mb-6">Contact</h2>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Billing Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif mb-6">Billing Details</h2>

                <div className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name *"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name *"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors bg-white text-gray-700"
                      required
                    >
                      <option value="United States (US)">
                        United States (US)
                      </option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Country / Region</p>
                  </div>

                  {/* Street Address */}
                  <div>
                    <input
                      type="text"
                      name="streetAddress"
                      placeholder="House number and street name *"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Apartment */}
                  <div>
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                    />
                  </div>

                  {/* Town/City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder="Town / City *"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors bg-white text-gray-700"
                        required
                      >
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Texas">Texas</option>
                        <option value="Florida">Florida</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">State</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Postcode / ZIP *"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Ship to Different Address */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="shipToDifferent"
                        checked={formData.shipToDifferent}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <span className="text-base text-gray-900">
                        Ship to a different address?
                      </span>
                    </label>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif mb-4">Shipping</h2>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <p className="text-sm text-red-600">
                    Enter your address to view shipping options.
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif mb-4">Payment</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Sorry, it seems that there are no available payment methods
                    for your state.
                  </p>
                  <p className="text-sm text-gray-600">
                    Please contact us if you require assistance or wish to make
                    alternate arrangements.
                  </p>
                </div>
              </div>

              {/* Place Order Button - Mobile */}
              <div className="lg:hidden">
                <button 
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-3 text-base"
                >
                  <Lock size={18} />
                  Place Order ${total.toFixed(2)}
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-6">
                {/* Product Info */}
                <div className="space-y-4 pb-6 border-b border-gray-200 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.heading}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {item.heading}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.color && `Color: ${item.color}`}
                          {item.size && ` | Size: ${item.size}`}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="couponCode"
                      placeholder="Coupon Code"
                      value={formData.couponCode}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                    />
                    <button 
                      type="button"
                      className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-gray-700 font-medium">Shipping</span>
                    <p className="text-sm text-red-500 text-right">
                      Enter your address to view shipping options.
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button - Desktop */}
                <div className="hidden lg:block">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-3 text-base"
                  >
                    <Lock size={18} />
                    Place Order ${total.toFixed(2)}
                  </button>
                </div>

                {/* Customize Button */}
                <button 
                  type="button"
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 mx-auto"
                >
                  <span className="text-lg">⚙️</span>
                  Customize
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;