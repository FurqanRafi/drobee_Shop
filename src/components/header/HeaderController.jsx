"use client";

import { usePathname } from "next/navigation";
import Header2 from "./Header2";
import Header from "./Header";

export default function HeaderController() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/profile")
  ) {
    return <Header2 />;
  }

  return <Header />;
}
