"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Lock,
  Truck,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/redux/cartSlice";
import { AuthContext } from "@/context/AuthContext";

const COUNTRY_CITIES = {
  "United States (US)": {
    states: [
      "California",
      "New York",
      "Texas",
      "Florida",
      "Illinois",
      "Pennsylvania",
      "Ohio",
      "Georgia",
    ],
    cities: {
      California: [
        "Los Angeles",
        "San Francisco",
        "San Diego",
        "Sacramento",
        "San Jose",
      ],
      "New York": [
        "New York City",
        "Buffalo",
        "Rochester",
        "Albany",
        "Syracuse",
      ],
      Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
      Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
      Illinois: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
      Pennsylvania: [
        "Philadelphia",
        "Pittsburgh",
        "Allentown",
        "Erie",
        "Reading",
      ],
      Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
      Georgia: ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah"],
    },
  },
  Pakistan: {
    states: [
      "Punjab",
      "Sindh",
      "Khyber Pakhtunkhwa",
      "Balochistan",
      "Islamabad Capital Territory",
    ],
    cities: {
      Punjab: [
        "Lahore",
        "Faisalabad",
        "Rawalpindi",
        "Multan",
        "Gujranwala",
        "Sialkot",
      ],
      Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpurkhas"],
      "Khyber Pakhtunkhwa": [
        "Peshawar",
        "Mardan",
        "Abbottabad",
        "Swat",
        "Kohat",
      ],
      Balochistan: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi"],
      "Islamabad Capital Territory": ["Islamabad"],
    },
  },
  India: {
    states: [
      "Maharashtra",
      "Delhi",
      "Karnataka",
      "Tamil Nadu",
      "Gujarat",
      "West Bengal",
    ],
    cities: {
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      Delhi: ["New Delhi", "Delhi"],
      Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
      "Tamil Nadu": [
        "Chennai",
        "Coimbatore",
        "Madurai",
        "Tiruchirappalli",
        "Salem",
      ],
      Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    },
  },
  "United Kingdom": {
    states: ["England", "Scotland", "Wales", "Northern Ireland"],
    cities: {
      England: [
        "London",
        "Manchester",
        "Birmingham",
        "Liverpool",
        "Leeds",
        "Bristol",
      ],
      Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
      Wales: ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
      "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Armagh"],
    },
  },
};

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const { createCheckout, getshipping } = useContext(AuthContext);

  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 5000;

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    country: "United States (US)",
    address: "",
    apartment: "",
    city: "",
    state: "California",
    postalCode: "",
    phone: "",
    notes: "",
    couponCode: "",
  });

  const availableStates = COUNTRY_CITIES[formData.country]?.states || [];
  const availableCities =
    COUNTRY_CITIES[formData.country]?.cities[formData.state] || [];

  const isAddressComplete =
    formData.address.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.phone.trim() !== "";

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping
    ? 0
    : selectedShipping
    ? selectedShipping.price
    : 0;
  const discount = 0;
  const total = subtotal + shippingCost - discount;
  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (isAddressComplete) {
        setLoadingShipping(true);
        try {
          const data = await getshipping();
          console.log("Fetched shipping methods:", data);

          const activeMethods = Array.isArray(data)
            ? data.filter((method) => method.isActive !== false)
            : [];

          setShippingMethods(activeMethods);

          if (activeMethods.length > 0 && !selectedShipping) {
            setSelectedShipping(activeMethods[0]);
          }
        } catch (error) {
          console.error("Error fetching shipping methods:", error);
          setShippingMethods([]);
        } finally {
          setLoadingShipping(false);
        }
      } else {
        setShippingMethods([]);
        setSelectedShipping(null);
      }
    };

    fetchShippingMethods();
  }, [
    isAddressComplete,
    formData.address,
    formData.city,
    formData.postalCode,
    formData.phone,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      const newStates = COUNTRY_CITIES[value]?.states || [];
      const newState = newStates[0] || "";
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: newState,
        city: "",
      }));
    } else if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleShippingSelect = (method) => {
    setSelectedShipping(method);
  };

  const handleIncrement = (item) => {
    dispatch(
      updateCartItemQuantity({
        id: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItemQuantity({
          id: item.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        id: item.id,
        size: item.size,
        color: item.color,
      })
    );
  };

  const handlePlaceOrder = async () => {
    setError("");
    setSuccess(false);

    if (
      !formData.email ||
      !formData.firstname ||
      !formData.lastname ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.phone
    ) {
      setError("Please fill in all required fields!");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    if (!selectedShipping && !isFreeShipping) {
      setError("Please select a shipping method!");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        email: formData.email.trim(),
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        country: formData.country,
        address: formData.apartment
          ? `${formData.address.trim()}, ${formData.apartment.trim()}`
          : formData.address.trim(),
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode.trim(),
        phone: formData.phone.trim(),
        shipping: isFreeShipping
          ? "FREE SHIPPING"
          : selectedShipping?.name || "Standard Shipping",
      };

      const products = cartItems.map((item) => ({
        productName: item.heading || item.name || "Unknown Product",
        image: item.image || "/placeholder.png",
        colour: item.color || "",
        size: item.size || "",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      }));

      const shippingCost = isFreeShipping ? 0 : selectedShipping?.price || 0;

      const response = await createCheckout(
        userData,
        products,
        total,
        discount,
        shippingCost
      );

      if (response) {
        setSuccess(true);
        // ✅ Clear cart after successful checkout
        dispatch(clearCart());
        console.log("✅ Cart cleared successfully after checkout");
      } else {
        setError("Failed to create checkout. Please try again.");
      }
    } catch (error) {
      console.error("❌ Checkout error:", error);

      if (error.response) {
        const errorMsg =
          error.response.data?.message || "Server error. Please try again.";
        setError(errorMsg);
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError(error.message || "Failed to place order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Order Total: ${total.toFixed(2)}
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Please add items to your cart before checkout
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Billing Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-serif mb-6">Contact</h2>
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            {/* Billing Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-serif mb-6">Billing Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First name *"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                    required
                  />
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last name *"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>

                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 bg-white"
                    required
                  >
                    {Object.keys(COUNTRY_CITIES).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Country / Region</p>
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="House number and street name *"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  required
                />

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 bg-white"
                      required
                    >
                      {availableStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      State / Province
                    </p>
                  </div>
                  <div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 bg-white"
                      required
                    >
                      <option value="">Select City *</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">City</p>
                  </div>
                </div>

                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postcode / ZIP *"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  required
                />

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notes about your order (optional)"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 resize-none"
                />
              </div>
            </div>

            {/* Shipping Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-serif mb-4">Shipping</h2>
              {isFreeShipping ? (
                <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      🎉 You've qualified for FREE SHIPPING!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {amountNeededForFreeShipping > 0 && (
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-700">
                        Add{" "}
                        <span className="font-semibold">
                          ${amountNeededForFreeShipping.toFixed(2)}
                        </span>{" "}
                        more for FREE shipping!
                      </p>
                    </div>
                  )}
                  {!isAddressComplete ? (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                      <p className="text-sm text-yellow-700">
                        Enter your address to view shipping options
                      </p>
                    </div>
                  ) : loadingShipping ? (
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                      <p className="text-sm text-blue-600">
                        Loading shipping methods...
                      </p>
                    </div>
                  ) : shippingMethods.length === 0 ? (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                      <p className="text-sm text-red-600">
                        No shipping methods available for your location.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <div
                          key={method._id}
                          onClick={() => handleShippingSelect(method)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedShipping?._id === method._id
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={selectedShipping?._id === method._id}
                                onChange={() => handleShippingSelect(method)}
                                className="w-4 h-4"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-gray-600" />
                                  <span className="font-medium">
                                    {method.name}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold">
                              ${method.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-serif mb-4">Payment</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  Cash on Delivery
                </p>
                <p className="text-sm text-gray-600">
                  Pay with cash upon delivery.
                </p>
              </div>
            </div>

            {/* Mobile Place Order Button */}
            <div className="lg:hidden">
              <button
                onClick={handlePlaceOrder}
                disabled={
                  isSubmitting || (!isFreeShipping && !selectedShipping)
                }
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={18} />
                {isSubmitting
                  ? "Processing..."
                  : `Place Order $${total.toFixed(2)}`}
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-2xl font-serif mb-6">Order Summary</h2>

              <div className="space-y-4 pb-6 border-b border-gray-200 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size || "default"}-${
                      item.color || "default"
                    }`}
                    className="flex items-start gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.heading}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium mb-1">
                        {item.heading}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.color && `Color: ${item.color}`}
                        {item.size && ` | Size: ${item.size}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleDecrement(item)}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrement(item)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="couponCode"
                    placeholder="Coupon Code"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Shipping</span>
                  {isFreeShipping ? (
                    <div className="text-right">
                      <p className="font-semibold text-green-600">FREE</p>
                      <p className="text-xs text-gray-500">
                        Free Shipping Applied
                      </p>
                    </div>
                  ) : selectedShipping ? (
                    <div className="text-right">
                      <p className="font-semibold">
                        ${shippingCost.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedShipping.name}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {isAddressComplete ? "Select method" : "Enter address"}
                    </span>
                  )}
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Desktop Place Order Button */}
              <div className="hidden lg:block">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={
                    isSubmitting || (!isFreeShipping && !selectedShipping)
                  }
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock size={18} />
                  {isSubmitting
                    ? "Processing..."
                    : `Place Order ${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;