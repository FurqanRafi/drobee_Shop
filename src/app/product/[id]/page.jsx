"use client";

import SingleProducts from "@/components/singleProducts/SingleProducts";
import React from "react";
import { useParams } from "next/navigation";
import initialProducts from "@/utils/products";

const Page = () => {
  const { id } = useParams(); // ✅ hook component ke andar
  const product = initialProducts.find((p) => p.id == id);

  if (!product) return <h2>Product not found</h2>;

  return (
    <div>
      <SingleProducts product={product} />
    </div>
  );
};

export default Page;
