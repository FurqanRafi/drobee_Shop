"use client";
import React from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/cartSlice";
import Link from "next/link";

const CartDrawer = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  // ✅ Get cart from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  const updateQuantity = (item, change) => {
    if (change > 0) {
      dispatch(addToCart({ ...item, quantity: 1 }));
    } else if (change < 0 && item.quantity > 1) {
      dispatch(addToCart({ ...item, quantity: -1 }));
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(
      removeFromCart({
        id: item.id,
        size: item.size,
        color: item.color,
      })
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <>
      <style jsx global>{`
        @keyframes drawerSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .drawer-enter {
          animation: drawerSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .overlay-enter {
          animation: fadeIn 0.3s ease-out;
        }

        .cart-item-hover {
          transition: all 0.3s ease;
        }

        .cart-item-hover:hover {
          background: rgba(0, 0, 0, 0.02);
        }

        .quantity-btn {
          transition: all 0.2s ease;
        }

        .quantity-btn:hover {
          background: rgba(0, 0, 0, 0.08);
        }

        .quantity-btn:active {
          transform: scale(0.95);
        }

        .checkout-btn-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .checkout-btn-hover:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-998 overlay-enter"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[30%] bg-white/95 backdrop-blur-xl shadow-2xl z-999 drawer-enter flex flex-col">
          {/* Drawer Header */}
          <div className="relative border-b border-black/10 p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors duration-300"
            >
              <X className="w-5 h-5" strokeWidth={1} />
            </button>

            <div className="pr-10">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-black" strokeWidth={1} />
                <h2 className="text-xl font-light tracking-[0.25em] text-black">
                  CART
                </h2>
              </div>
              <div className="w-10 h-px bg-black/20"></div>
              <p className="text-xs tracking-widest text-black/40 mt-2">
                {cartItems.length} {cartItems.length === 1 ? "ITEM" : "ITEMS"}
              </p>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <ShoppingBag
                  className="w-12 h-12 text-black/20 mb-3"
                  strokeWidth={1}
                />
                <p className="text-xs tracking-[0.2em] text-black/40">
                  CART IS EMPTY
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}-${index}`}
                    className="flex gap-3 p-3 border border-black/10 cart-item-hover"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-24 bg-gray-100 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.heading}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-xs tracking-[0.12em] font-light text-black mb-1 truncate">
                          {item.heading}
                        </h3>
                        <div className="space-y-0.5">
                          <p className="text-xs tracking-[0.05em] text-black/40">
                            {item.size && `${item.size}`}
                            {item.size && item.color && " / "}
                            {item.color && `${item.color}`}
                          </p>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-end justify-between mt-2">
                        <div className="flex items-center gap-1 border border-black/10">
                          <button
                            onClick={() => updateQuantity(item, -1)}
                            className="quantity-btn p-1.5 hover:bg-black/5"
                            disabled={item.quantity === 1}
                          >
                            <Minus className="w-3 h-3" strokeWidth={1} />
                          </button>
                          <span className="text-xs tracking-wider w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, 1)}
                            className="quantity-btn p-1.5 hover:bg-black/5"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <p className="text-xs tracking-wider font-light text-black">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="text-black/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-black/10 p-6 space-y-5">
              {/* Shipping Notice */}
              {shipping > 0 && (
                <div className="bg-black/5 p-3 border-l-2 border-black/20">
                  <p className="text-xs tracking-[0.08em] text-black/60 leading-relaxed">
                    Add ${(5000 - subtotal).toFixed(2)} for FREE shipping
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs tracking-[0.12em] text-black/60">
                  <span>SUBTOTAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs tracking-[0.12em] text-black/60">
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                </div>
                <div className="w-full h-px bg-black/10"></div>
                <div className="flex justify-between text-sm tracking-[0.15em] font-light text-black">
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-black text-white py-3.5 text-xs tracking-[0.2em] font-light checkout-btn-hover flex items-center justify-center gap-2"
                >
                  CHECKOUT
                  <ArrowRight className="w-4 h-4" strokeWidth={1} />
                </button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/shop">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 border border-black/20 text-xs tracking-[0.15em] text-black/70 hover:bg-black/5 hover:border-black/40 transition-all duration-300"
                >
                  CONTINUE SHOPPING
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CartDrawer;
