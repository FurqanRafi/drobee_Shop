"use client";
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

const Orders = () => {
  const { orders, loadingOrders, updateOrderStatus } = useContext(AuthContext);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmModal?.onConfirm) {
      confirmModal.onConfirm();
    }
    setConfirmModal(null);
  };

  const handleCancelModal = () => {
    setConfirmModal(null);
  };

  const handleCancelOrder = async (orderId) => {
    showConfirm(
      "Are you sure you want to cancel this order? This action cannot be undone.",
      async () => {
        const result = await updateOrderStatus(orderId, "cancelled");

        if (result.success) {
          if (selectedOrder?._id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: "cancelled" });
          }
          showToast("Order cancelled successfully", "success");
        } else {
          showToast("Failed to cancel order", "error");
        }
      }
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "shipped":
        return "text-purple-700 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" strokeWidth={1.5} />;
      case "shipped":
        return <Truck className="w-4 h-4" strokeWidth={1.5} />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" strokeWidth={1.5} />;
      case "cancelled":
        return <XCircle className="w-4 h-4" strokeWidth={1.5} />;
      default:
        return <Package className="w-4 h-4" strokeWidth={1.5} />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      case "error":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4" strokeWidth={1.5} />;
      case "error":
        return <XCircle className="w-4 h-4" strokeWidth={1.5} />;
      default:
        return <CheckCircle className="w-4 h-4" strokeWidth={1.5} />;
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status?.toLowerCase() === filterStatus);

  if (loadingOrders) {
    return (
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[10px] tracking-[0.2em] text-black/40">
                LOADING ORDERS...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-3 px-4 py-3 border shadow-lg ${getToastStyles(
                toast.type
              )}`}
            >
              <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
              <p className="text-[11px] tracking-[0.1em] flex-1 leading-relaxed">
                {toast.message}
              </p>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[150] p-4"
            onClick={handleCancelModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-lg w-full shadow-2xl"
            >
              <div className="p-8 border-b border-black/10 bg-gradient-to-b from-black/5 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-black/5 border border-black/10">
                    <XCircle
                      className="w-5 h-5 text-black/60"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-[14px] tracking-[0.15em] text-black font-light">
                    CONFIRM CANCELLATION
                  </h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[12px] tracking-[0.1em] text-black/70 leading-relaxed mb-8">
                  {confirmModal.message}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelModal}
                    className="flex-1 px-6 py-3 text-[11px] tracking-[0.15em] font-light transition-all border border-black/20 hover:border-black/40 bg-white text-black hover:bg-black/5"
                  >
                    KEEP ORDER
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-6 py-3 text-[11px] tracking-[0.15em] font-light transition-all border border-red-600 bg-red-600 text-white hover:bg-red-700"
                  >
                    CANCEL ORDER
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light tracking-[0.3em] text-black mb-3">
              MY ORDERS
            </h1>
            <div className="w-16 h-px bg-black/20 mx-auto"></div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "pending", "shipped", "delivered", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 text-[10px] tracking-[0.15em] font-light transition-all border ${
                    filterStatus === status
                      ? "bg-black text-white border-black"
                      : "bg-white text-black/50 border-black/10 hover:border-black/30"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-black/10 p-12 text-center">
              <ShoppingBag
                className="w-16 h-16 text-black/20 mx-auto mb-4"
                strokeWidth={1}
              />
              <p className="text-[12px] tracking-[0.2em] text-black/40 mb-2">
                NO ORDERS FOUND
              </p>
              <p className="text-[10px] tracking-wider text-black/30">
                {filterStatus === "all"
                  ? "You haven't placed any orders yet"
                  : `No ${filterStatus} orders`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-black/10 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/5 border border-black/10">
                        <Package
                          className="w-5 h-5 text-black/60"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-[11px] tracking-[0.15em] text-black/40 mb-1">
                          ORDER ID
                        </p>
                        <p className="text-[13px] tracking-[0.1em] text-black font-medium">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`px-4 py-2 text-[10px] tracking-[0.15em] border flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-black/5">
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4 text-black/40"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-[9px] tracking-wider text-black/40">
                          ORDER DATE
                        </p>
                        <p className="text-[11px] tracking-[0.1em] text-black">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign
                        className="w-4 h-4 text-black/40"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-[9px] tracking-wider text-black/40">
                          TOTAL AMOUNT
                        </p>
                        <p className="text-[13px] tracking-[0.1em] text-black font-medium">
                          ${order.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package
                        className="w-4 h-4 text-black/40"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-[9px] tracking-wider text-black/40">
                          ITEMS
                        </p>
                        <p className="text-[11px] tracking-[0.1em] text-black">
                          {order.products?.length || 0} Products
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Preview */}
                  <div className="mb-4">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.products?.slice(0, 4).map((product, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-16 h-16 border border-black/10 bg-black/5"
                        >
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                      {order.products?.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 border border-black/10 bg-black/5 flex items-center justify-center">
                          <p className="text-[10px] tracking-wider text-black/40">
                            +{order.products.length - 4}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.15em] border border-black/20 hover:border-black bg-white text-black hover:bg-black/5 transition-all"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      VIEW DETAILS
                    </button>

                    {order.status?.toLowerCase() !== "cancelled" &&
                      order.status?.toLowerCase() !== "delivered" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.15em] border border-red-200 hover:border-red-600 bg-white text-red-600 hover:bg-red-50 transition-all"
                        >
                          <XCircle className="w-4 h-4" strokeWidth={1.5} />
                          CANCEL ORDER
                        </button>
                      )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            {/* Header - Sticky */}
            <div className="sticky top-0 bg-white border-b border-black/10 z-10">
              <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base tracking-[0.2em] text-black">
                    ORDER DETAILS
                  </h3>
                  <p className="text-[9px] tracking-[0.15em] text-black/40 mt-1">
                    #{selectedOrder._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2.5 hover:bg-black/5 transition-colors border border-black/10"
                >
                  <X className="w-5 h-5 text-black/60" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status */}
                  <div className="bg-white border border-black/10 p-6">
                    <h4 className="text-[11px] tracking-[0.2em] text-black/40 mb-4">
                      ORDER STATUS
                    </h4>
                    <div
                      className={`inline-flex items-center gap-2 px-6 py-3 text-[12px] tracking-[0.15em] border ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span>{selectedOrder.status?.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white border border-black/10">
                    <div className="p-6 border-b border-black/10">
                      <h4 className="text-[11px] tracking-[0.2em] text-black/40 flex items-center gap-2">
                        <Package className="w-4 h-4" strokeWidth={1.5} />
                        ORDER ITEMS ({selectedOrder.products?.length || 0})
                      </h4>
                    </div>
                    <div className="divide-y divide-black/5">
                      {selectedOrder.products?.map((item, index) => (
                        <div
                          key={index}
                          className="p-6 hover:bg-black/2 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {item.image && (
                              <div className="flex-shrink-0 w-24 h-24 border border-black/10 overflow-hidden bg-black/5">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] tracking-[0.1em] text-black mb-3 font-medium">
                                {item.productName}
                              </p>
                              <div className="flex flex-wrap gap-3 text-[9px] tracking-wider text-black/40">
                                {item.size && (
                                  <span className="px-2 py-1 bg-black/5 border border-black/10">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.colour && (
                                  <span className="px-2 py-1 bg-black/5 border border-black/10">
                                    Color: {item.colour}
                                  </span>
                                )}
                                <span className="px-2 py-1 bg-black/5 border border-black/10">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[9px] text-black/40 mb-1 tracking-wider">
                                ${item.price?.toFixed(2)} each
                              </p>
                              <p className="text-[14px] text-black font-light tracking-wider">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Shipping Address - FIXED */}
                  <div className="bg-white border border-black/10 p-6">
                    <h4 className="text-[11px] tracking-[0.2em] text-black/40 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                      SHIPPING ADDRESS
                    </h4>
                    <p className="text-[11px] tracking-[0.1em] text-black leading-relaxed">
                      {selectedOrder.billingDetails?.firstname}{" "}
                      {selectedOrder.billingDetails?.lastname}
                      <br />
                      {selectedOrder.billingDetails?.address}
                      <br />
                      {selectedOrder.billingDetails?.city},{" "}
                      {selectedOrder.billingDetails?.state}
                      <br />
                      {selectedOrder.billingDetails?.postalCode}
                      <br />
                      {selectedOrder.billingDetails?.country}
                      <br />
                      <br />
                      <span className="text-black/40">Phone:</span>{" "}
                      {selectedOrder.billingDetails?.phone}
                      <br />
                      <span className="text-black/40">Email:</span>{" "}
                      {selectedOrder.billingDetails?.email}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white border border-black/10 p-6">
                    <h4 className="text-[11px] tracking-[0.2em] text-black/40 mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" strokeWidth={1.5} />
                      ORDER SUMMARY
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <p className="text-[10px] tracking-[0.15em] text-black/60">
                          SUBTOTAL
                        </p>
                        <p className="text-[11px] text-black">
                          $
                          {(
                            selectedOrder.totalAmount -
                            (selectedOrder.shippingCost || 0) +
                            (selectedOrder.discount || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-[10px] tracking-[0.15em] text-black/60">
                          SHIPPING
                        </p>
                        <p className="text-[11px] text-black">
                          ${(selectedOrder.shippingCost || 0).toFixed(2)}
                        </p>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between">
                          <p className="text-[10px] tracking-[0.15em] text-black/60">
                            DISCOUNT
                          </p>
                          <p className="text-[11px] text-green-600">
                            -${selectedOrder.discount?.toFixed(2)}
                          </p>
                        </div>
                      )}
                      <div className="pt-3 border-t border-black/10 flex justify-between items-center">
                        <p className="text-[12px] tracking-[0.15em] text-black font-medium">
                          TOTAL
                        </p>
                        <p className="text-xl tracking-[0.1em] text-black font-light">
                          ${selectedOrder.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {selectedOrder.status?.toLowerCase() !== "cancelled" &&
                    selectedOrder.status?.toLowerCase() !== "delivered" && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[11px] tracking-[0.15em] border border-red-200 hover:border-red-600 bg-white text-red-600 hover:bg-red-50 transition-all"
                      >
                        <XCircle className="w-4 h-4" strokeWidth={1.5} />
                        CANCEL ORDER
                      </button>
                    )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Orders;
