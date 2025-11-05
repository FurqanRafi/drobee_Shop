"use client";

import { usePathname } from "next/navigation";
import Header2 from "./Header2";
import Header from "./Header";

export default function HeaderController() {
  const pathname = usePathname();

  if (pathname.startsWith("/checkout")) {
    return null;
  }

  if (
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/cartPage")
  ) {
    return <Header2 />;
  } else {
    return <Header />;
  }
  return;
}
