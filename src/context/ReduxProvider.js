"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeCart } from "../redux/cartSlice";

// ✅ Separate component for cart initialization (INSIDE Provider)
function CartInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Check if user is logged in
    const userId = localStorage.getItem("userId");

    // ✅ Initialize cart (guest or user)
    dispatch(initializeCart(userId));
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CartInitializer /> {/* ✅ Now dispatch is available */}
        {children}
      </PersistGate>
    </Provider>
  );
}
