"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { CheckCircle, Loader, XCircle } from "lucide-react";

const Success = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // ✅ Check if session_id exists
    if (sessionId) {
      console.log("✅ Success page loaded with session:", sessionId);
      dispatch(clearCart());
      setLoading(false);
    } else {
      console.error("❌ No session_id found in URL");
      setError(true);
      setLoading(false);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/checkout");
      }, 3000);
    }
  }, [sessionId, dispatch, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to verify payment. Redirecting to checkout...
          </p>
          <button
            onClick={() => router.push("/checkout")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your order. We've received your payment and will process
          your order shortly.
        </p>
        <p className="text-xs text-gray-400 mb-6 font-mono break-all">
          Session: {sessionId}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/shop")}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;